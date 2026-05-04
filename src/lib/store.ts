// KUBOYAKO data layer — hybrid cache (Supabase as source of truth, localStorage as offline cache)
// Sync API preserved so existing pages don't need refactoring.
import { supabase } from "@/integrations/supabase/client";

export type ItemType = "mobil" | "motor" | "hp";
export type SearchType = ItemType | "admin-lp";
export type CaseStatus = "baru" | "proses" | "selesai";

export interface BaseItem {
  id: string;
  type: ItemType;
  noLp: string;
  tglLp: string;
  pelapor: string;
  lokasiTkp: string;
  satker: string;
  asalLp: string;
  foto?: string;
  status: CaseStatus;
  statusNote?: string;
  createdAt: number;
}
export interface VehicleItem extends BaseItem {
  type: "mobil" | "motor";
  noPolisi: string;
  noRangka: string;
  noMesin: string;
  merk: string;
  tipe?: string;
  jenis?: string;
  warna: string;
  tahun: string;
}
export interface HpItem extends BaseItem {
  type: "hp";
  merk: string;
  model: string;
  imei1: string;
  imei2?: string;
  warna: string;
}
export type EvidenceItem = VehicleItem | HpItem;

export interface UserAccount {
  id: string;
  nrp: string;
  name: string;
  unit: string;
  role: "admin" | "polri";
  password: string; // legacy display only — never stored
  createdAt: number;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface UserLocation {
  id: string;
  timestamp: number;
  user: string;
  role: string;
  lat: number;
  lng: number;
  action: string;
  area?: string;
  speed?: string;
  device?: string;
}

// ── helpers: row mapping ────────────────────────────────────────
function rowToEvidence(r: any): EvidenceItem {
  const base = {
    id: r.id,
    type: r.type as ItemType,
    noLp: r.no_lp ?? "",
    tglLp: r.tgl_lp ?? "",
    pelapor: r.pelapor ?? "",
    lokasiTkp: r.lokasi_tkp ?? "",
    satker: r.satker ?? "",
    asalLp: r.asal_lp ?? "",
    foto: r.foto ?? undefined,
    status: (r.status ?? "baru") as CaseStatus,
    statusNote: r.status_note ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
  if (r.type === "hp") {
    return {
      ...base,
      type: "hp",
      merk: r.merk ?? "",
      model: r.model ?? "",
      imei1: r.imei1 ?? "",
      imei2: r.imei2 ?? undefined,
      warna: r.warna ?? "",
    } as HpItem;
  }
  return {
    ...base,
    type: r.type,
    noPolisi: r.no_polisi ?? "",
    noRangka: r.no_rangka ?? "",
    noMesin: r.no_mesin ?? "",
    merk: r.merk ?? "",
    tipe: r.tipe ?? undefined,
    jenis: r.jenis ?? undefined,
    warna: r.warna ?? "",
    tahun: r.tahun ?? "",
  } as VehicleItem;
}

function evidenceToRow(item: EvidenceItem): any {
  const common: any = {
    type: item.type,
    no_lp: item.noLp,
    tgl_lp: item.tglLp || null,
    pelapor: item.pelapor || null,
    lokasi_tkp: item.lokasiTkp || null,
    satker: item.satker || null,
    asal_lp: item.asalLp || null,
    foto: item.foto || null,
    status: item.status,
    status_note: item.statusNote || null,
  };
  if (item.type === "hp") {
    return { ...common, merk: item.merk, model: item.model, imei1: item.imei1, imei2: item.imei2 || null, warna: item.warna };
  }
  const v = item as VehicleItem;
  return {
    ...common,
    no_polisi: v.noPolisi,
    no_rangka: v.noRangka,
    no_mesin: v.noMesin,
    merk: v.merk,
    tipe: v.tipe || null,
    jenis: v.jenis || null,
    warna: v.warna,
    tahun: v.tahun,
  };
}

// ── in-memory cache ─────────────────────────────────────────────
let _evidence: EvidenceItem[] = [];
let _logs: SystemLog[] = [];
let _locations: UserLocation[] = [];
let _accounts: UserAccount[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
export function subscribeStore(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// hydrate from localStorage immediately (fast first paint), then from Supabase
try {
  const e = localStorage.getItem("kuboyako_evidence");
  if (e) _evidence = JSON.parse(e);
  const l = localStorage.getItem("kuboyako_logs");
  if (l) _logs = JSON.parse(l);
  const lo = localStorage.getItem("kuboyako_locations");
  if (lo) _locations = JSON.parse(lo);
} catch {}

let _hydrated = false;
export async function hydrateFromCloud() {
  if (_hydrated) return;
  _hydrated = true;
  try {
    const [{ data: evRows }, { data: logRows }, { data: locRows }] = await Promise.all([
      supabase.from("evidence").select("*").order("created_at", { ascending: false }),
      supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("user_locations").select("*").order("recorded_at", { ascending: false }).limit(100),
    ]);
    if (evRows) {
      _evidence = evRows.map(rowToEvidence);
      localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
    }
    if (logRows) {
      _logs = logRows.map((r: any) => ({
        id: r.id,
        timestamp: new Date(r.created_at).getTime(),
        user: r.user_name ?? "",
        role: r.user_role ?? "",
        action: r.action,
        details: r.details ?? "",
      }));
      localStorage.setItem("kuboyako_logs", JSON.stringify(_logs));
    }
    if (locRows) {
      _locations = locRows.map((r: any) => ({
        id: r.id,
        timestamp: new Date(r.recorded_at).getTime(),
        user: "",
        role: "",
        lat: r.latitude,
        lng: r.longitude,
        action: "",
      }));
    }
    notify();
  } catch (err) {
    console.warn("[store] hydrate failed", err);
  }
}

// realtime sync for evidence
try {
  supabase
    .channel("evidence-sync")
    .on("postgres_changes", { event: "*", schema: "public", table: "evidence" }, async () => {
      const { data } = await supabase.from("evidence").select("*").order("created_at", { ascending: false });
      if (data) {
        _evidence = data.map(rowToEvidence);
        localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
        notify();
      }
    })
    .subscribe();
} catch {}

// ── EVIDENCE API ────────────────────────────────────────────────
export function getEvidenceData(): EvidenceItem[] {
  if (!_hydrated) void hydrateFromCloud();
  return _evidence;
}

export function saveEvidenceItem(item: EvidenceItem) {
  _evidence = [item, ..._evidence];
  localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
  notify();
  void supabase.from("evidence").insert(evidenceToRow(item)).then(({ error }) => {
    if (error) console.error("[evidence insert]", error);
  });
}

export function updateEvidenceItem(item: EvidenceItem) {
  const idx = _evidence.findIndex((i) => i.id === item.id);
  if (idx !== -1) _evidence[idx] = item;
  localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
  notify();
  void supabase.from("evidence").update(evidenceToRow(item)).eq("id", item.id).then(({ error }) => {
    if (error) console.error("[evidence update]", error);
  });
}

export function deleteEvidenceItem(id: string) {
  _evidence = _evidence.filter((i) => i.id !== id);
  localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
  notify();
  void supabase.from("evidence").delete().eq("id", id).then(({ error }) => {
    if (error) console.error("[evidence delete]", error);
  });
}

export function updateEvidenceStatus(id: string, status: CaseStatus, note?: string) {
  const idx = _evidence.findIndex((i) => i.id === id);
  if (idx !== -1) {
    _evidence[idx].status = status;
    if (note) _evidence[idx].statusNote = note;
    localStorage.setItem("kuboyako_evidence", JSON.stringify(_evidence));
    notify();
    void supabase
      .from("evidence")
      .update({ status, status_note: note ?? _evidence[idx].statusNote ?? null })
      .eq("id", id);
  }
}

export function searchEvidence(type: SearchType, query: string): EvidenceItem | undefined {
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  if (!q) return undefined;
  if (type === "admin-lp") {
    return _evidence.find((it) => it.noLp.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q));
  }
  return _evidence.find((it) => {
    if (it.type !== type) return false;
    if (it.type === "mobil" || it.type === "motor") {
      const v = it as VehicleItem;
      return (
        v.noPolisi.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q) ||
        v.noRangka.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q) ||
        v.noMesin.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q)
      );
    }
    if (it.type === "hp") {
      const h = it as HpItem;
      return h.imei1.replace(/[^0-9]/g, "").includes(q) || (h.imei2 ?? "").replace(/[^0-9]/g, "").includes(q);
    }
    return false;
  });
}

// ── ACCOUNTS (managed via Supabase Auth elsewhere) ──────────────
export async function fetchAccounts(): Promise<UserAccount[]> {
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*"),
    supabase.from("user_roles").select("*"),
  ]);
  const roleByUser = new Map<string, "admin" | "polri">();
  (roles ?? []).forEach((r: any) => {
    if (r.role === "admin" || r.role === "polri") roleByUser.set(r.user_id, r.role);
  });
  _accounts = (profiles ?? []).map((p: any) => ({
    id: p.user_id,
    nrp: p.nrp ?? "",
    name: p.name ?? "",
    unit: p.unit ?? "",
    role: roleByUser.get(p.user_id) ?? "polri",
    password: "",
    createdAt: p.created_at ? new Date(p.created_at).getTime() : Date.now(),
  }));
  return _accounts;
}

export function getUserAccounts(): UserAccount[] {
  void fetchAccounts().then(notify);
  return _accounts;
}

// legacy stubs (kept so old imports compile — real flow is in admin-accounts page)
export function saveUserAccount(_a: UserAccount) {}
export function deleteUserAccount(id: string) {
  _accounts = _accounts.filter((a) => a.id !== id);
  notify();
}
export function validateLogin(_n: string, _p: string): UserAccount | undefined {
  return undefined;
}

// ── LOGS ────────────────────────────────────────────────────────
export function getLogs(): SystemLog[] {
  if (!_hydrated) void hydrateFromCloud();
  return _logs;
}

export async function addLog(user: string, role: string, action: string, details: string) {
  const entry: SystemLog = {
    id: Math.random().toString(36).slice(2, 11),
    timestamp: Date.now(),
    user,
    role,
    action,
    details,
  };
  _logs = [entry, ..._logs].slice(0, 500);
  localStorage.setItem("kuboyako_logs", JSON.stringify(_logs));
  notify();
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("system_logs").insert({
        user_id: data.user.id,
        user_name: user,
        user_role: role,
        action,
        details,
      });
    }
  } catch (err) {
    console.warn("[log] insert failed", err);
  }
}

// ── LOCATIONS ───────────────────────────────────────────────────
export function getUserLocations(): UserLocation[] {
  if (_locations.length === 0) {
    // seed sample so dashboard isn't blank on first run
    _locations = [
      {
        id: "loc-seed-1",
        timestamp: Date.now() - 60000,
        user: "Tim Alpha (Resmob)",
        role: "polri",
        lat: -5.147665,
        lng: 119.432731,
        action: "Patroli Rutin",
        area: "Jl. AP Pettarani",
        speed: "45 km/h",
        device: "MDT",
      },
    ];
  }
  return _locations;
}

export async function trackLocation(
  user: string,
  role: string,
  lat: number,
  lng: number,
  action: string,
  area?: string,
  speed?: string,
  device?: string
) {
  const idx = _locations.findIndex((l) => l.user === user && Date.now() - l.timestamp < 1000 * 60 * 30);
  if (idx >= 0) {
    _locations[idx] = { ..._locations[idx], lat, lng, action, area, speed, device, timestamp: Date.now() };
  } else {
    _locations = [
      {
        id: Math.random().toString(36).slice(2, 11),
        timestamp: Date.now(),
        user,
        role,
        lat,
        lng,
        action,
        area,
        speed,
        device,
      },
      ..._locations,
    ].slice(0, 100);
  }
  notify();
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("user_locations").insert({
        user_id: data.user.id,
        latitude: lat,
        longitude: lng,
      });
    }
  } catch {}
}

export function clearLocations() {
  _locations = [];
  notify();
}
