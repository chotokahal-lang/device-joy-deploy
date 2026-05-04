import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  FileText,
  Scan,
  Archive,
  Car,
  Smartphone,
  Zap,
  Users,
  LogIn,
  Bell,
  HelpCircle,
  Info,
  User,
  MapPin,
  ChevronRight,
  Star,
  Award,
  BookOpen,
  Phone,
  Building2,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { LiveText } from "@/components/ui/live-text";

/* ── Helpers ─────────────────────────────────────────────────── */
function W({ ch }: { ch: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 py-8 md:py-12 relative z-10 text-center w-full h-full overflow-y-auto overflow-x-hidden presentasi-slide-content">
      <div className="w-full max-w-full flex flex-col items-center">
        {ch}
      </div>
    </div>
  );
}

function H2({ left, right }: { left: string; right: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="display-font text-lg sm:text-xl md:text-4xl lg:text-6xl text-foreground mb-2 sm:mb-3 md:mb-6 lg:mb-12"
    >
      <LiveText id={`h2-${left}`} defaultText={left} /> <LiveText id={`h2-${right}`} defaultText={right} className="text-gradient" />
    </motion.h2>
  );
}

function Card({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="surface-elevated rounded-2xl p-3 sm:p-4 md:p-6 lg:p-14 w-full"
    >
      {children}
    </motion.div>
  );
}

function Row({ label, val }: { label: string; val: string }) {
  return (
    <div className="surface rounded-xl px-3 py-2 md:px-4 md:py-3 lg:px-14 lg:py-10 flex justify-between items-center gap-2 md:gap-4 lg:gap-20">
      <LiveText as="span" id={`row-label-${label}`} defaultText={label} className="text-[10px] lg:text-2xl text-muted-foreground eyebrow whitespace-nowrap shrink-0" />
      <LiveText as="span" id={`row-val-${label}-${val}`} defaultText={val} className="text-[11px] sm:text-xs md:text-sm lg:text-3xl font-black text-foreground uppercase text-right max-w-[65%] lg:max-w-none truncate lg:overflow-visible lg:whitespace-normal" />
    </div>
  );
}

function MenuBtn({
  icon,
  label,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="surface rounded-xl px-3 py-2 md:px-4 md:py-3 lg:px-10 lg:py-8 flex items-center gap-2 md:gap-3 lg:gap-8"
    >
      <span className="shrink-0 scale-75 md:scale-90 lg:scale-100">{icon}</span>
      <LiveText as="span" id={`menubtn-${label}`} defaultText={label} className="text-xs lg:text-3xl font-black text-foreground flex-1 text-left" />
      <ChevronRight className="w-4 h-4 lg:w-10 lg:h-10 text-muted-foreground/50 shrink-0" />
    </motion.div>
  );
}

function RedCard({
  plat,
  sub,
  lp,
  rangka,
  mesin,
}: {
  plat: string;
  sub: string;
  lp: string;
  rangka?: string;
  mesin?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="surface-elevated rounded-2xl overflow-hidden w-full"
    >
      <div className="bg-destructive/10 p-4 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield className="w-12 h-12 md:w-20 md:h-20 text-destructive" />
        </div>
        <AlertTriangle className="w-7 h-7 text-destructive mx-auto mb-1.5 animate-pulse" />
        <p className="display-font text-base text-foreground">
          <LiveText id={`redcard-plat-${plat}`} defaultText={plat} />
        </p>
        <p className="eyebrow text-destructive text-[10px] flex items-center justify-center gap-3">
          <LiveText id={`redcard-sub-${plat}`} defaultText={sub} />
          <span className="text-[7px] font-black px-1 py-0.5 rounded bg-destructive text-white uppercase tracking-widest">
            <LiveText id={`redcard-dors-${plat}`} defaultText="DORS SYNC" />
          </span>
        </p>
      </div>
      <div className="p-3 space-y-1.5">
        <Row label="Nomor LP" val={lp} />
        {rangka && <Row label="No. Rangka" val={rangka} />}
        {mesin && <Row label="No. Mesin" val={mesin} />}
      </div>
      <div className="bg-destructive/5 p-2.5 flex items-center gap-4 border-t border-white/5">
        <ShieldCheck className="w-3.5 h-3.5 text-destructive shrink-0" />
        <p className="text-[9px] text-destructive/80">
          <LiveText id={`redcard-footer-${plat}`} defaultText="Hubungi 110 atau Polsek terdekat segera." />
        </p>
      </div>
    </motion.div>
  );
}

function GreenCard({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="surface-elevated rounded-2xl p-6 text-center w-full relative overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]"
    >
      <div className="absolute inset-0 bg-emerald-500/5" />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <p className="display-font text-xl text-foreground">
          <LiveText id={`greencard-title-${query}`} defaultText="Status Aman" />
        </p>
        <p className="eyebrow text-emerald-500 mt-0.5">
          <LiveText id={`greencard-sub-${query}`} defaultText="Arsip Digital Terverifikasi" />
        </p>
        <div className="surface rounded-xl p-3 mt-4 border border-white/5 bg-black/20">
          <p className="text-[10px] eyebrow text-emerald-500/60 mb-1">
            <LiveText id={`greencard-label-${query}`} defaultText="Target Pencarian" />
          </p>
          <p className="text-xs font-bold text-foreground uppercase tracking-[0.2em]">
            <LiveText id={`greencard-query-${query}`} defaultText={query} />
          </p>
          <p className="text-[9px] md:text-base text-muted-foreground mt-1.5 pt-1.5 border-t border-white/5">
            <LiveText id={`greencard-desc-${query}`} defaultText="Tidak tercatat sebagai barang bukti tindak pidana di database ᨀᨘᨄᨚᨐᨀᨚ & DORS." />
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function LaporBox() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="w-full space-y-2 mt-2"
    >
      {[{
          icon: <Phone className="w-4 h-4 text-primary" />, l: "Hubungi 110", d: "Hotline Kepolisian RI · 24 jam",
        },
        {
          icon: <MapPin className="w-4 h-4 text-accent" />, l: "Polsek / Polres Terdekat", d: "Datang langsung bawa barang temuan",
        },
        {
          icon: <Shield className="w-4 h-4 text-primary" />, l: "ANGGOTA POLRI", d: "Unit penanganan kasus pencurian",
        }].map((item) => (
        <div
          key={item.l}
          className="surface rounded-xl px-3 py-2 flex items-center gap-4.5"
        >
          <span className="w-7 h-7 rounded-lg surface-glass flex items-center justify-center shrink-0">
            {item.icon}
          </span>
          <div className="text-left">
            <p className="text-xs font-bold text-foreground">
              <LiveText id={`laporbox-label-${item.l}`} defaultText={item.l} />
            </p>
            <p className="text-[9px] md:text-base text-muted-foreground">
              <LiveText id={`laporbox-desc-${item.l}`} defaultText={item.d} />
              {item.l === "ANGGOTA POLRI" && (
                <LiveText as="span" id="laporbox-extra" defaultText=" · Terintegrasi SI SDM POLRI" />
              )}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ── Slides 1–15 ─────────────────────────────────────────────── */
export const SLIDES_1_15 = [
  /* 1 — Splash */
  {
    id: 1,
    kategori: "PEMBUKA",
    judul: "Splash Screen — Logo Aplikasi",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5 flex justify-center"
            >
              <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full animate-pulse" />
              <Logo3DImg
                size="hero"
                float
                intensity="high"
                className="relative drop-shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="surface-glass rounded-full px-4 py-1.5 eyebrow text-primary inline-block mb-3"></span>
              <h1 className="display-font text-3xl text-foreground leading-tight mb-2">
                <LiveText id="pres-hero-title" defaultText="RESMOB POLDA SULSEL" className="text-gradient" />
              </h1>
              <p className="text-xs text-muted-foreground max-w-[30ch] mx-auto leading-relaxed mb-1">
                <LiveText id="pres-hero-subtitle" defaultText="UNIT V SUBDIT JATANRAS DIREKTORAT KRIMINAL UMUM POLDA SULSEL" />
              </p>
              <p className="text-[10px] text-muted-foreground">
                <LiveText id="pres-hero-integration" defaultText="Terintegrasi SI SDM POLRI" />
              </p>
              <p className="eyebrow text-muted-foreground/50 mt-4">
                <LiveText id="pres-hero-author" defaultText="Irzal Makkarawa, S.H." />
              </p>
            </motion.div>
          </>
        }
      />
    ),
  },

  /* 2 — Menu Utama */
  {
    id: 2,
    kategori: "MENU UTAMA",
    judul: "Pilih Mode Akses",
    konten: (
      <W
        ch={
          <>
            <H2 left="Menu" right="Utama" />
            <p className="text-xs text-muted-foreground mb-4">
              <LiveText id="pres-menu-subtitle" defaultText="Pilih jenis akses sesuai peran Anda" />
            </p>
            <div className="w-full space-y-3">
              {[
                {
                  f: " A",
                  sub: "Admin / Internal Polri",
                  desc: "Input data BB, scan LP, Kelola arsip data barang bukti.",
                  bg: "bg-primary/10",
                  ic: <Shield className="w-6 h-6 text-primary" />,
                },
                {
                  f: " B",
                  sub: "User Umum",
                  desc: "Cek status kendaraan & HP secara mandiri, laporkan temuan BB",
                  bg: "bg-accent/10",
                  ic: <Users className="w-6 h-6 text-accent" />,
                },
              ].map((m, i) => (
                <motion.div
                  key={m.f}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="surface-elevated rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5"
                >
                  <span
                    className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl ${m.bg} flex items-center justify-center shrink-0 shadow-lg`}
                  >
                    {m.ic}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm md:text-2xl font-black text-foreground leading-tight">
                      <LiveText id={`pres-mode-title-${i}`} defaultText={`${m.f} — ${m.sub}`} />
                    </p>
                    <p className="text-[10px] md:text-lg text-muted-foreground mt-1.5 leading-relaxed opacity-80">
                      <LiveText id={`pres-mode-desc-${i}`} defaultText={m.desc} />
                    </p>
                  </div>
                  <ChevronRight className="hidden md:block w-5 h-5 text-muted-foreground/30 shrink-0" />
                </motion.div>
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 3 — Login Admin */
  {
    id: 3,
    kategori: "DEMO ADMIN",
    judul: "Login  A — Admin / Polri",
    konten: (
      <W
        ch={
          <>
            <H2 left="Login" right="Admin" />
            <Card delay={0.1}>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="eyebrow text-primary/80 text-[10px]">
                    <LiveText id="pres-login-tag" defaultText="Operator · A" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-login-unit" defaultText="ANGGOTA POLRI" />
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    <LiveText id="pres-login-integration" defaultText="Terintegrasi SI SDM POLRI" />
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="surface rounded-xl px-4 h-11 flex items-center gap-4.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    <LiveText id="pres-login-user-placeholder" defaultText="NRP / Username Admin" />
                  </span>
                </div>
                <div className="surface rounded-xl px-4 h-11 flex items-center gap-4.5">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground tracking-widest">
                    ••••••••••
                  </span>
                </div>
                <div className="h-11 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow">
                  <LogIn className="w-4 h-4 text-primary-foreground" />
                  <span className="text-sm font-bold text-primary-foreground">
                    <LiveText id="pres-login-submit-btn" defaultText="Verifikasi & Masuk" />
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
                <LiveText id="pres-login-footer" defaultText="KHUSUS PETUGAS OPERATOR SPKT/ANGGOTA POLRI" />
              </p>
            </Card>
          </>
        }
      />
    ),
  },

  /* 4 — Dashboard Admin */
  {
    id: 4,
    kategori: "DEMO ADMIN",
    judul: "Dashboard Admin — A.1 · A.2 · A.3",
    konten: (
      <W
        ch={
          <>
            <H2 left="Dashboard" right="Admin" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="display-font text-sm text-foreground">
                      <LiveText id="pres-dash-name" defaultText="IRZAL MAKKARAWA, S.H." />
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      <LiveText id="pres-dash-unit" defaultText="ANGGOTA POLRI" />
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      <LiveText id="pres-dash-integration" defaultText="Terintegrasi SI SDM POLRI" />
                    </p>
                  </div>
                </div>
              </Card>
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                {[
                  { l: "Mobil", v: "4", ic: <Car className="w-4 h-4" /> },
                  { l: "Motor", v: "3", ic: <Zap className="w-4 h-4" /> },
                  { l: "HP", v: "5", ic: <Smartphone className="w-4 h-4" /> },
                ].map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="surface rounded-2xl p-3 text-center"
                  >
                    <span className="text-primary">{s.ic}</span>
                    <p className="display-font text-xl text-foreground mt-1">
                      <LiveText id={`pres-stat-val-${i}`} defaultText={s.v} />
                    </p>
                    <p className="eyebrow mt-0.5 text-[8px] tracking-[0.15em]">
                      <LiveText id={`pres-stat-label-${i}`} defaultText={s.l} />
                    </p>
                  </motion.div>
                ))}
              </div>
              {[
                {
                  l: "A.1 — Input Manual",
                  ic: <FileText className="w-4 h-4 text-primary" />,
                  d: "Formulir digital terstruktur",
                },
                {
                  l: "A.2 — Scan LP Otomatis",
                  ic: <Scan className="w-4 h-4 text-accent" />,
                  d: "AI Vision + OCR ekstrak data LP",
                },
                {
                  l: "A.3 — Status Penginputan",
                  ic: <Archive className="w-4 h-4 text-primary" />,
                  d: "Riwayat & arsip lengkap",
                },
              ].map((a, i) => (
                <MenuBtn
                  key={a.l}
                  icon={a.ic}
                  label={a.l}
                  delay={0.25 + i * 0.07}
                />
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 5 — Input Manual - pilihan */
  {
    id: 5,
    kategori: "DEMO ADMIN",
    judul: "A.1 — Input Manual: Pilih Jenis BB",
    konten: (
      <W
        ch={
          <>
            <H2 left="Input" right="Manual" />
            <p className="text-xs text-muted-foreground mb-4">
              Pilih jenis barang bukti yang akan diarsipkan
            </p>
            <div className="w-full space-y-2.5">
              {[
                {
                  ic: <Car className="w-6 h-6 text-primary" />,
                  l: "Mobil",
                  d: "LP / NO.POL / NO.RANGKA / NO.MESIN",
                },
                {
                  ic: <Zap className="w-6 h-6 text-primary" />,
                  l: "Motor",
                  d: "LP / NO.POL / NO.RANGKA / NO.MESIN",
                },
                {
                  ic: <Smartphone className="w-6 h-6 text-accent" />,
                  l: "HP / Elektronik",
                  d: "Telepon seluler — IMEI 1 & IMEI 2, merk, tipe",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.l}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="surface-elevated rounded-2xl p-4 flex items-center gap-4"
                >
                  <span className="w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    {item.ic}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">
                      <LiveText id={`pres-manual-type-title-${i}`} defaultText={item.l} />
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      <LiveText id={`pres-manual-type-desc-${i}`} defaultText={item.d} />
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 ml-auto" />
                </motion.div>
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 6 — Input Mobil + Berhasil */
  {
    id: 6,
    kategori: "DEMO ADMIN",
    judul: "Input Data Mobil & Verifikasi Berhasil",
    konten: (
      <W
        ch={
          <>
            <H2 left="Input" right="Mobil" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <p className="eyebrow mb-2 text-left text-[10px]">
                  <LiveText id="pres-mobil-info-tag" defaultText="Informasi Laporan Polisi" />
                </p>
                <div className="space-y-1.5">
                  <Row
                    label="Nomor LP"
                    val="LP/123/IV/2026/SPKT/POLRESTABES MKS"
                  />
                  <Row label="Pelapor" val="Budi Santoso" />
                  <Row label="Lokasi TKP" val="Jl. AP Pettarani, Makassar" />
                </div>
              </Card>
              <Card delay={0.15}>
                <p className="eyebrow mb-2 text-left text-[10px]">
                  <LiveText id="pres-mobil-spec-tag" defaultText="Spesifikasi Kendaraan" />
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    ["No. Polisi", "DD 1234 AB"],
                    ["Merk/Tipe", "Toyota Avanza"],
                    ["Warna", "Hitam Metalik"],
                    ["No. Rangka", "MHKG3452293847"],
                    ["No. Mesin", "1NZFE-9384756"],
                  ].map(([l, v]) => (
                    <div key={l} className="surface rounded-xl px-2.5 py-1.5">
                      <p className="text-[9px] md:text-base text-muted-foreground">{l}</p>
                      <p className="text-[10px] md:text-xl font-bold text-foreground uppercase md:overflow-visible md:whitespace-normal">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="surface rounded-2xl p-3 flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5"
              >
                <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-500">
                    <LiveText id="pres-mobil-success-title" defaultText="Data Berhasil Diarsipkan!" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-mobil-success-desc" defaultText="Tersinkronisasi ke DORS" />
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 7 — Input Motor + Berhasil */
  {
    id: 7,
    kategori: "DEMO ADMIN",
    judul: "Input Data Motor & Verifikasi Berhasil",
    konten: (
      <W
        ch={
          <>
            <H2 left="Input" right="Motor" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <p className="eyebrow mb-2 text-left text-[10px]">
                  Informasi LP
                </p>
                <div className="space-y-1.5">
                  <Row label="Nomor LP" val="LP/456/V/2026/SPKT/POLRES GOWA" />
                  <Row label="Pelapor" val="Andi Rahmat" />
                  <Row label="Lokasi TKP" val="Jl. Poros Malino, Gowa" />
                </div>
              </Card>
              <Card delay={0.15}>
                <p className="eyebrow mb-2 text-left text-[10px]">
                  Spesifikasi Motor
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    ["No. Polisi", "DD 5678 CD"],
                    ["Merk/Tipe", "Honda Beat FI"],
                    ["Warna", "Merah Putih"],
                    ["No. Rangka", "MH1JFZ1XNPK00123"],
                    ["No. Mesin", "JFE1E-100234"],
                  ].map(([l, v]) => (
                    <div key={l} className="surface rounded-xl px-2.5 py-1.5">
                      <p className="text-[9px] md:text-base text-muted-foreground">{l}</p>
                      <p className="text-[10px] md:text-xl font-bold text-foreground uppercase md:overflow-visible md:whitespace-normal">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                className="surface rounded-2xl p-3 flex items-center gap-3 border border-emerald-500/30 bg-emerald-500/5"
              >
                <Award className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-left">
                  <p className="text-xs font-bold text-emerald-500">
                    <LiveText id="pres-motor-success-title" defaultText="Data Berhasil Diarsipkan!" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-motor-success-desc" defaultText="Tersinkronisasi ke DORS" />
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 8 — Login User: Polri vs Umum */
  {
    id: 8,
    kategori: "DEMO USER",
    judul: "Login  B — Pilih Jenis Akses",
    konten: (
      <W
        ch={
          <>
            <H2 left=" B" right="— User" />
            <p className="text-xs text-muted-foreground mb-4">
              <LiveText id="pres-user-subtitle" defaultText="Pilih jenis akses sesuai status Anda" />
            </p>
            <div className="w-full space-y-3">
              {[
                {
                  l: "B.1 — Anggota Polri",
                  sub: "Login dengan NRP",
                  d: "Akses penuh: Cek Mobil, Motor, HP & DATA LP",
                  ic: <Shield className="w-6 h-6 text-primary" />,
                  bg: "bg-primary/10",
                },
                {
                  l: "B.2 — User Umum",
                  sub: "LOGIN",
                  d: "Cek status & Lapor ke Kepolisian terdekat",
                  ic: <Users className="w-6 h-6 text-accent" />,
                  bg: "bg-accent/10",
                },
              ].map((m, i) => (
                <motion.div
                  key={m.l}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.12 }}
                  className="surface-elevated rounded-2xl p-4 flex items-center gap-4"
                >
                  <span
                    className={`w-12 h-12 md:w-20 md:h-20 rounded-2xl ${m.bg} flex items-center justify-center shrink-0`}
                  >
                    {m.ic}
                  </span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">
                      <LiveText id={`pres-user-mode-title-${i}`} defaultText={m.l} />
                    </p>
                    <p className="eyebrow text-primary/70 text-[9px]">
                      <LiveText id={`pres-user-mode-sub-${i}`} defaultText={m.sub} />
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      <LiveText id={`pres-user-mode-desc-${i}`} defaultText={m.d} />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 9 — Dashboard Polri */
  {
    id: 9,
    kategori: "DEMO POLRI (B.1)",
    judul: "Dashboard  B.1 — Anggota Polri",
    konten: (
      <W
        ch={
          <>
            <H2 left="Dashboard" right="Polri" />
            <div className="w-full space-y-2.5">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="surface-elevated rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="display-font text-sm text-foreground">
                    <LiveText id="pres-polri-dash-name" defaultText="IPDA AHMAD FAUZI, S.I.K." />
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-polri-dash-role" defaultText="ANGGOTA POLRI" />
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    <LiveText id="pres-polri-dash-sync" defaultText="Terintegrasi SI SDM POLRI" />
                  </p>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    ic: <Car className="w-5 h-5 text-primary" />,
                    l: "Cek Mobil",
                    bg: "bg-primary/10",
                  },
                  {
                    ic: <Zap className="w-5 h-5 text-primary" />,
                    l: "Cek Motor",
                    bg: "bg-primary/10",
                  },
                  {
                    ic: <Smartphone className="w-5 h-5 text-accent" />,
                    l: "Cek HP/IMEI",
                    bg: "bg-accent/10",
                  },
                  {
                    ic: <FileText className="w-5 h-5 text-foreground/70" />,
                    l: "DATA LP",
                    bg: "bg-white/5",
                  },
                ].map((m, i) => (
                  <motion.div
                    key={m.l}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 + i * 0.07 }}
                    className="surface-elevated rounded-2xl p-3.5 flex flex-col items-center gap-4 aspect-square justify-center"
                  >
                    <span
                      className={`w-11 h-11 md:w-20 md:h-20 rounded-2xl ${m.bg} flex items-center justify-center`}
                    >
                      {m.ic}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      <LiveText id={`pres-polri-menu-${i}`} defaultText={m.l} />
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        }
      />
    ),
  },

  /* 10 — Form Cek Mobil (Polri) */
  {
    id: 10,
    kategori: "DEMO POLRI (B.1)",
    judul: "Form Cek Data Mobil — Anggota Polri",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <Car className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Cek" right="Mobil" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]">
                  <LiveText id="pres-cek-mobil-tag" defaultText="NO. POLISI / NO. RANGKA / NO. MESIN" />
                </p>
                <p className="display-font text-[22px] text-foreground tracking-[0.12em] uppercase">
                  <LiveText id="pres-cek-mobil-query" defaultText="DD 1234 AB" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-cek-mobil-hint" defaultText="Masukkan Nomor Polisi atau Nomor Rangka. Cocok untuk cek cepat saat patroli atau penangkapan di lapangan." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-cek-mobil-btn" defaultText="Cari di Database ᨀᨘᨄᨚᨐᨀᨚ" />
                </span>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 11 — Hasil: Aman & Merah */
  {
    id: 11,
    kategori: "DEMO POLRI (B.1)",
    judul: "Hasil Pencarian — Status Aman / Barang Bukti",
    konten: (
      <W
        ch={
          <>
            <H2 left="Hasil" right="Verifikasi" />
            <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4.5 mb-2">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="surface-elevated rounded-2xl p-3.5 text-center"
              >
                <div className="w-11 h-11 md:w-20 md:h-20 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="display-font text-sm text-foreground">
                  <LiveText id="pres-res-aman-title" defaultText="Status Aman" />
                </p>
                <p className="eyebrow text-emerald-500/80 text-[9px] mt-0.5">
                  <LiveText id="pres-res-aman-sub" defaultText="Tidak ditemukan" />
                </p>
                <p className="text-[9px] md:text-base text-muted-foreground mt-1.5 leading-relaxed">
                  <LiveText id="pres-res-aman-desc" defaultText="Tidak tercatat sebagai BB tindak pidana." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="surface-elevated rounded-2xl overflow-hidden"
              >
                <div className="bg-destructive/10 p-3 text-center border-b border-white/5">
                  <div className="w-11 h-11 md:w-20 md:h-20 rounded-2xl border border-destructive/30 bg-destructive/15 flex items-center justify-center mx-auto mb-1.5 animate-pulse">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="display-font text-sm text-foreground">
                    <LiveText id="pres-res-warn-title" defaultText="Terdeteksi" />
                  </p>
                  <p className="eyebrow text-destructive text-[9px]">
                    <LiveText id="pres-res-warn-sub" defaultText="Barang Bukti" />
                  </p>
                </div>
                <p className="text-[9px] md:text-base text-muted-foreground text-center p-2 leading-relaxed">
                  <LiveText id="pres-res-warn-footer" defaultText="Otomatis diarahkan ke Detail DATA LP ↓" />
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="surface rounded-xl p-2.5 flex items-center gap-4 w-full"
            >
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[10px] text-muted-foreground text-left">
                <LiveText id="pres-res-hint-status" defaultText="Status" /> <b className="text-destructive"><LiveText id="pres-res-hint-red" defaultText="Merah" /></b>: <LiveText id="pres-res-hint-desc" defaultText="sistem otomatis tampilkan data LP sumber barang bukti." />
              </p>
            </motion.div>
          </>
        }
      />
    ),
  },

  /* 12 — Detail LP (Admin/Kantor) */
  {
    id: 12,
    kategori: "DEMO POLRI (B.1)",
    judul: "Detail Informasi Admin / Kantor Penerbit LP",
    konten: (
      <W
        ch={
          <>
            <H2 left="Detail" right="Arsip LP" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <p className="eyebrow mb-2 text-left text-[11px]">
                  <LiveText id="pres-lp-detail-car-label" defaultText="Data Kendaraan" />
                </p>
                <div className="space-y-1.5">
                  <Row label="No. Polisi" val="DD 1234 AB" />
                  <Row label="Merk / Tipe" val="Toyota Avanza · Hitam" />
                  <Row label="No. Rangka" val="MHKG3452293847" />
                  <Row label="No. Mesin" val="1NZFE-9384756" />
                </div>
              </Card>
              <Card delay={0.15}>
                <p className="eyebrow mb-2 text-left text-[11px]">
                  <LiveText id="pres-lp-source-label" defaultText="Sumber Laporan Polisi" />
                </p>
                <div className="space-y-1.5">
                  <Row label="Nomor LP" val="LP/123/IV/2026/SPKT" />
                  <Row label="Pelapor" val="Budi Santoso" />
                  <Row label="Satker Penerbit" val="SPKT POLDA SULSEL " />
                  <Row label="Lokasi TKP" val="Jl. AP Pettarani, Makassar" />
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="surface rounded-xl p-3 flex items-center gap-4.5 border border-accent/20 bg-accent/5"
              >
                <Building2 className="w-4 h-4 text-accent shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-accent flex items-center gap-4">
                    <LiveText id="pres-lp-office-label" defaultText="Kantor Penerbit LP" />
                    <span className="text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md bg-accent/20">
                      <LiveText id="pres-lp-office-sync" defaultText="DORS SYNC" />
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-lp-office-address" defaultText="SPKT POLDA SULSEL · Jl. Perintis Kemerdekaan No.78 KM.16" />
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 13 — Form Cek Motor (Polri) */
  {
    id: 13,
    kategori: "DEMO POLRI (B.1)",
    judul: "Form Cek Data Motor — Anggota Polri",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <Zap className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Cek" right="Motor" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]">
                  <LiveText id="pres-cek-motor-tag" defaultText="NO. POLISI / NO. RANGKA / NO. MESIN" />
                </p>
                <p className="display-font text-[22px] text-foreground tracking-[0.12em] uppercase">
                  <LiveText id="pres-cek-motor-val" defaultText="DD 5678 CD" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-cek-motor-hint" defaultText="Input Nomor Polisi, Nomor Rangka, atau Nomor Mesin untuk verifikasi status motor dalam database ᨀᨘᨄᨚᨐᨀᨚ." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-cek-motor-btn" defaultText="Cari di Database ᨀᨘᨄᨚᨐᨀᨚ" />
                </span>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 14 — Hasil Cek Motor */
  {
    id: 14,
    kategori: "DEMO POLRI (B.1)",
    judul: "Hasil Pencarian Motor",
    konten: (
      <W
        ch={
          <>
            <H2 left="Hasil Cek" right="Motor" />
            <RedCard
              plat="DD 5678 CD"
              sub="Motor tercatat sebagai barang bukti"
              lp="LP/456/V/2026/SPKT/POLRES GOWA"
              rangka="MH1JFZ1XNPK00123"
              mesin="JFE1E-100234"
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 w-full space-y-1.5"
            >
              <Row label="Merk / Tipe" val="Honda Beat FI" />
              <Row label="Warna" val="Merah Putih" />
              <Row label="No. Rangka" val="MH1JFZ1XNPK00123" />
              <Row label="No. Mesin" val="JFE1E-100234" />
              <Row label="SATKER PENERBIT LP" val="Polres Gowa" />
            </motion.div>
          </>
        }
      />
    ),
  },

  /* 15 — Detail LP Motor */
  {
    id: 15,
    kategori: "DEMO POLRI (B.1)",
    judul: "Informasi Detail LP Motor",
    konten: (
      <W
        ch={
          <>
            <H2 left="Detail LP" right="Motor" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <p className="eyebrow mb-2 text-left text-[11px]">
                  <LiveText id="pres-motor-detail-tag" defaultText="Data Kendaraan" />
                </p>
                <div className="space-y-1.5">
                  <Row label="No. Polisi" val="DD 5678 CD" />
                  <Row label="Merk / Tipe" val="Honda Beat FI · Merah Putih" />
                  <Row label="No. Rangka" val="MH1JFZ1XNPK00123" />
                  <Row label="No. Mesin" val="JFE1E-100234" />
                </div>
              </Card>
              <Card delay={0.15}>
                <p className="eyebrow mb-2 text-left text-[10px]"><LiveText id="pres-motor-source-tag" defaultText="Sumber LP" /></p>
                <div className="space-y-1.5">
                  <Row label="Nomor LP" val="LP/456/V/2026/SPKT/POLRES GOWA" />
                  <Row label="Pelapor" val="Andi Rahmat" />
                  <Row label="Satker Penerbit" val="Polres Gowa" />
                  <Row label="Lokasi TKP" val="Jl. Poros Malino, Gowa" />
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="surface rounded-xl p-3 flex items-center gap-4.5 border border-accent/20 bg-accent/5"
              >
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-accent flex items-center gap-4">
                    <LiveText id="pres-motor-office-tag" defaultText="Kantor Penerbit LP" />
                    <span className="text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md bg-accent/20">
                      <LiveText id="pres-motor-office-sync" defaultText="DORS SYNC" />
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-kantor-address" defaultText="Polres Gowa · Jl. Malino KM 3, Sungguminasa · SPKT 24 Jam" />
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },
];

/* ── Slides 16–29 ────────────────────────────────────────────── */
export const SLIDES_16_29 = [
  /* 16 — Form Cek HP (Polri) */
  {
    id: 16,
    kategori: "DEMO POLRI (B.1)",
    judul: "Form Cek Data HP / IMEI — Anggota Polri",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-accent/15 flex items-center justify-center relative">
                <Smartphone className="w-7 h-7 text-accent" />
              </div>
            </motion.div>
            <H2 left="Cek" right="HP / IMEI" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]">
                  <LiveText id="pres-imei-label" defaultText="Nomor IMEI Perangkat" />
                </p>
                <p className="display-font text-lg text-foreground tracking-[0.1em] font-mono">
                  <LiveText id="pres-imei-val" defaultText="358912345678901" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  <LiveText id="pres-imei-sub" defaultText="15 digit · IMEI 1 atau IMEI 2" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-imei-hint-text" defaultText="Temukan IMEI: Dial" /> <b className="text-foreground"><LiveText id="pres-imei-code" defaultText="*#06#" /></b> <LiveText id="pres-imei-hint-loc" defaultText="· Kotak HP · Pengaturan > Tentang Perangkat" />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-imei-db-btn" defaultText="Cari di Database ᨀᨘᨄᨚᨐᨀᨚ" />
                </span>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 17 — Hasil Cek HP */
  {
    id: 17,
    kategori: "DEMO POLRI (B.1)",
    judul: "Hasil Pencarian HP / IMEI",
    konten: (
      <W
        ch={
          <>
            <H2 left="Hasil Cek" right="HP" />
            <RedCard
              plat="358912345678901"
              sub="Samsung Galaxy S23 · Barang Bukti"
              lp="LP/789/VI/2026/SPKT/POLRESTABES MKS"
            />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-2 w-full space-y-1.5"
            >
              <Row label="IMEI 2" val="358912345678902" />
              <Row label="Warna" val="Phantom Black" />
              <Row label="SATKER PENERBIT LP" val="SPKT POLDA SULSEL " />
            </motion.div>
          </>
        }
      />
    ),
  },

  /* 18 — Detail LP HP */
  {
    id: 18,
    kategori: "DEMO POLRI (B.1)",
    judul: "Informasi Detail LP — HP",
    konten: (
      <W
        ch={
          <>
            <H2 left="Detail LP" right="HP" />
            <div className="w-full space-y-2">
              <Card delay={0.05}>
                <p className="eyebrow mb-2 text-left text-[10px]"><LiveText id="pres-hp-detail-label" defaultText="Data HP" /></p>
                <div className="space-y-1.5">
                  <Row label="IMEI 1" val="358912345678901" />
                  <Row label="IMEI 2" val="358912345678902" />
                  <Row label="Merk / Tipe" val="Samsung Galaxy S23" />
                  <Row label="Warna" val="Phantom Black" />
                </div>
              </Card>
              <Card delay={0.15}>
                <p className="eyebrow mb-2 text-left text-[10px]"><LiveText id="pres-lp-hp-label" defaultText="Sumber LP" /></p>
                <div className="space-y-1.5">
                  <Row
                    label="Nomor LP"
                    val="LP/789/VI/2026/SPKT/POLRESTABES MKS"
                  />
                  <Row label="Pelapor" val="Sri Wahyuni" />
                  <Row label="Satker Penerbit" val="SPKT POLDA SULSEL " />
                  <Row label="Lokasi TKP" val="Jl. Urip Sumoharjo, Makassar" />
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="surface rounded-xl p-3 flex items-center gap-4.5 border border-accent/20 bg-accent/5"
              >
                <Building2 className="w-4 h-4 text-accent shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-accent flex items-center gap-4">
                    <LiveText id="pres-hp-office-tag" defaultText="Kantor Penerbit LP" />
                    <span className="text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-md bg-accent/20">
                      <LiveText id="pres-hp-office-sync" defaultText="DORS SYNC" />
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-hp-office-address" defaultText="SPKT POLDA SULSEL · Jl. Perintis Kemerdekaan No.78 KM.16" />
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 19 — Dashboard Umum B.2 */
  {
    id: 19,
    kategori: "DEMO UMUM (B.2)",
    judul: "Dashboard B.2 — User Umum",
    konten: (
      <W
        ch={
          <>
            <H2 left="Dashboard" right="Umum" />
            <div className="w-full space-y-2.5">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="surface rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 surface-glass rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="eyebrow text-primary/80 text-[10px]">
                    <LiveText id="pres-umum-tag" defaultText="B.2 · User Umum" />
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    <LiveText id="pres-umum-subtitle" defaultText="Layanan Mandiri 24 Jam · ᨀᨘᨄᨚᨐᨀᨚ" />
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    <LiveText id="pres-umum-integration" defaultText="Terintegrasi SI SDM POLRI" />
                  </p>
                </div>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    ic: <Car className="w-5 h-5 text-primary" />,
                    l: "Cek Mobil",
                    bg: "bg-primary/10",
                  },
                  {
                    ic: <Zap className="w-5 h-5 text-primary" />,
                    l: "Cek Motor",
                    bg: "bg-primary/10",
                  },
                  {
                    ic: <Smartphone className="w-5 h-5 text-accent" />,
                    l: "Cek HP/IMEI",
                    bg: "bg-accent/10",
                  },
                  {
                    ic: <Phone className="w-5 h-5 text-emerald-500" />,
                    l: " Lapor",
                    bg: "bg-emerald-500/10",
                  },
                ].map((m, i) => (
                  <motion.div
                    key={m.l}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className="surface-elevated rounded-2xl p-3.5 flex flex-col items-center gap-4 aspect-square justify-center"
                  >
                    <span
                      className={`w-11 h-11 md:w-20 md:h-20 rounded-2xl ${m.bg} flex items-center justify-center`}
                    >
                      {m.ic}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      <LiveText id={`pres-umum-menu-${i}`} defaultText={m.l} />
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="surface rounded-xl p-2.5 flex items-center gap-4.5 border border-emerald-500/20 bg-emerald-500/5"
              >
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground text-left">
                  {" "}
                  <LiveText id="pres-umum-lapor-hint" defaultText="Lapor: Temukan BB? Laporkan ke ANGGOTA POLRI atau Polsek terdekat." />
                </p>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 20 — Cek Mobil Umum */
  {
    id: 20,
    kategori: "DEMO UMUM (B.2)",
    judul: "Proses Cek Mobil oleh User Umum",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <Car className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Cek Mobil" right="— Umum" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]">
                  <LiveText id="pres-umum-mobil-tag" defaultText="Masukkan Nomor Plat" />
                </p>
                <p className="display-font text-[22px] text-foreground tracking-[0.12em] uppercase">
                  <LiveText id="pres-umum-mobil-val" defaultText="DD 1234 AB" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-legal-hint" defaultText="Cek Status Kendaraan. Lindungi diri dari jerat hukum" />{" "}
                  <b className="text-foreground"><LiveText id="pres-legal-article" defaultText="Pasal 591 UU 1/2023 KUHP" /></b>{" "}
                  <LiveText id="pres-legal-desc" defaultText="tentang penadahan." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-start-search-btn" defaultText="Mulai Pencarian" />
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4 eyebrow text-muted-foreground/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <LiveText id="pres-umum-sync-text" defaultText="Sinkronisasi Database · Aktif" />
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 21 — Arahan Lapor Mobil */
  {
    id: 21,
    kategori: "DEMO UMUM (B.2)",
    judul: "Arahan Lapor ke Kepolisian — Mobil",
    konten: (
      <W
        ch={
          <>
            <H2 left="Terdeteksi!" right="Segera Lapor" />
            <RedCard
              plat="DD 1234 AB"
              sub="Mobil tercatat sebagai Barang Bukti"
              lp="LP/123/IV/2026/SPKT/POLRESTABES MKS"
              rangka="MHKG3452293847"
              mesin="1NZFE-9384756"
            />
            <LaporBox />
          </>
        }
      />
    ),
  },

  /* 22 — Cek Motor Umum */
  {
    id: 22,
    kategori: "DEMO UMUM (B.2)",
    judul: "Proses Cek Motor oleh User Umum",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <Zap className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Cek Motor" right="— Umum" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]">
                  <LiveText id="pres-umum-motor-tag" defaultText="Masukkan Nomor Plat Motor" />
                </p>
                <p className="display-font text-[22px] text-foreground tracking-[0.12em] uppercase">
                  <LiveText id="pres-umum-motor-val" defaultText="DD 5678 CD" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-umum-motor-hint" defaultText="Pastikan nomor plat sesuai STNK sebelum membeli motor bekas. Minimalisir tindak pidana penadahan." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-umum-motor-search-btn" defaultText="Mulai Pencarian" />
                </span>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 23 — Arahan Lapor Motor */
  {
    id: 23,
    kategori: "DEMO UMUM (B.2)",
    judul: "Arahan Lapor ke Kepolisian — Motor",
    konten: (
      <W
        ch={
          <>
            <H2 left="Terdeteksi!" right="Segera Lapor" />
            <RedCard
              plat="DD 5678 CD"
              sub="Motor · Barang Bukti LP/456/V/2026"
              lp="LP/456/V/2026/SPKT/POLRES GOWA"
              rangka="MH1JFZ1XNPK00123"
              mesin="JFE1E-100234"
            />
            <LaporBox />
          </>
        }
      />
    ),
  },

  /* 24 — Cek HP Umum */
  {
    id: 24,
    kategori: "DEMO UMUM (B.2)",
    judul: "Proses Cek HP / IMEI oleh User Umum",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-accent/15 flex items-center justify-center relative">
                <Smartphone className="w-7 h-7 text-accent" />
              </div>
            </motion.div>
            <H2 left="Cek HP" right="— Umum" />
            <div className="w-full space-y-3">
              <Card delay={0.1}>
                <p className="eyebrow mb-1.5 text-[10px]"><LiveText id="pres-imei-tag" defaultText="Nomor IMEI HP" /></p>
                <p className="display-font text-lg text-foreground tracking-widest font-mono">
                  <LiveText id="pres-imei-query" defaultText="358912345678901" />
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  <LiveText id="pres-imei-hint" defaultText="Cara cek IMEI: Dial *#06#" />
                </p>
              </Card>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="surface rounded-xl p-3 flex gap-4.5 items-start"
              >
                <BookOpen className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground text-left">
                  <LiveText id="pres-umum-hp-hint" defaultText="Cek Status IMEI HP, Bisa berpartisipasi melaporkan kepihak kepolisian apabila menemukan barang bukti tindak pidana pencurian." />
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="h-12 rounded-2xl gradient-primary flex items-center justify-center gap-4 shadow-glow"
              >
                <Search className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  <LiveText id="pres-imei-search-btn" defaultText="Mulai Pencarian IMEI" />
                </span>
              </motion.div>
            </div>
          </>
        }
      />
    ),
  },

  /* 25 — Arahan Lapor HP */
  {
    id: 25,
    kategori: "DEMO UMUM (B.2)",
    judul: "Arahan Lapor ke Kepolisian — HP",
    konten: (
      <W
        ch={
          <>
            <H2 left="Terdeteksi!" right="Segera Lapor" />
            <RedCard
              plat="358912345678901"
              sub="Samsung Galaxy S23 · Barang Bukti"
              lp="LP/789/VI/2026/SPKT/POLRESTABES MKS"
            />
            <LaporBox />
          </>
        }
      />
    ),
  },

  /* 26 — Profil Pengguna */
  {
    id: 26,
    kategori: " LANJUTAN",
    judul: "Tampilan Profil Pengguna",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <User className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Profil" right="Pengguna" />
            <Card delay={0.1}>
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="display-font text-sm text-foreground">
                    <LiveText id="pres-profile-name" defaultText="IRZAL MAKKARAWA, S.H." />
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    <LiveText id="pres-profile-unit" defaultText="ANGGOTA POLRI" />
                  </p>
                  <p className="text-[10px] text-muted-foreground/60">
                    <LiveText id="pres-profile-integration" defaultText="Terintegrasi SI SDM POLRI" />
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Row label="NRP" val="71040012345678" />
                <Row label="Pangkat" val="IPDA / Penyidik" />
                <Row label="Satker" val="ANGGOTA POLRI" />
                <Row label="Versi App" val="ᨀᨘᨄᨚᨐᨀᨚ v2026.1" />
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3 border-t border-white/5 pt-2">
                <LiveText id="pres-profile-footer" defaultText="Terintegrasi SI SDM POLRI" />
              </p>
            </Card>
          </>
        }
      />
    ),
  },

  /* 27 — Notifikasi Sistem */
  {
    id: 27,
    kategori: " LANJUTAN",
    judul: "Tampilan Notifikasi Sistem",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-accent/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-accent/15 flex items-center justify-center relative">
                <Bell className="w-7 h-7 text-accent" />
              </div>
            </motion.div>
            <H2 left="Notifikasi" right="Sistem" />
            <p className="text-[10px] text-muted-foreground/60 mb-3 -mt-2">
              <LiveText id="pres-notif-integration" defaultText="Terintegrasi SI SDM POLRI" />
            </p>
            <div className="w-full space-y-2">
              {[
                {
                  ic: <AlertTriangle className="w-4 h-4 text-destructive" />,
                  t: "Motor Terdeteksi BB",
                  st: "10:32",
                  d: "DD 5678 CD · Honda Beat",
                },
                {
                  ic: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
                  t: "Data Berhasil Diarsipkan",
                  st: "09:58",
                  d: "Sinkron DORS",
                },
                {
                  ic: <Info className="w-4 h-4 text-primary" />,
                  t: "Laporan User Masuk",
                  st: "09:00",
                  d: "3 laporan baru",
                },
              ].map((n, i) => (
                <motion.div
                  key={n.t}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="surface rounded-xl p-3 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-xl surface-glass flex items-center justify-center">
                    {n.ic}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      <LiveText id={`pres-notif-title-${i}`} defaultText={n.t} />
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      <LiveText id={`pres-notif-desc-${i}`} defaultText={n.d} />
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/60">
                    {n.st}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 28 — Bantuan & FAQ */
  {
    id: 28,
    kategori: " LANJUTAN",
    judul: "Halaman Bantuan & FAQ",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative mb-4"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl bg-primary/15 flex items-center justify-center relative">
                <HelpCircle className="w-7 h-7 text-primary" />
              </div>
            </motion.div>
            <H2 left="Bantuan" right="& FAQ" />
            <div className="w-full space-y-2">
              {[
                {
                  q: "Apa itu ᨀᨘᨄᨚᨐᨀᨚ?",
                  a: "Sistem arsip digital BB kendaraan & HP dari bahasa Makassar: Boya = Cari.",
                },
                {
                  q: "Siapa yang bisa menggunakan?",
                  a: "Admin: Petugas SPKT & anggota Polri. User: Seluruh User umum.",
                },
                {
                  q: "Bagaimana jika IMEI tidak ditemukan?",
                  a: "Berarti HP tidak tercatat sebagai BB — status aman untuk transaksi.",
                },
                {
                  q: "Apa yang harus dilakukan jika terdeteksi?",
                  a: "Jangan beli/gunakan. Hubungi 110 atau datangi Polsek terdekat.",
                },
                {
                  q: "Apakah data realtime?",
                  a: "Ya, tersinkronisasi langsung dengan sistem APLIKASI DORS MILIK POLRI",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                  className="surface rounded-xl p-3 text-left"
                >
                  <p className="text-[10px] font-bold text-foreground">
                    <LiveText id={`pres-faq-q-${i}`} defaultText={item.q} />
                  </p>
                  <p className="text-[9px] md:text-base text-muted-foreground mt-1 leading-relaxed">
                    <LiveText id={`pres-faq-a-${i}`} defaultText={item.a} />
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        }
      />
    ),
  },

  /* 29 — Tentang & Kredit */
  {
    id: 29,
    kategori: "PENUTUP",
    judul: "Tentang Aplikasi & Kredit",
    konten: (
      <W
        ch={
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mb-3 flex justify-center"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <Logo3DImg
                size="lg"
                float
                intensity="high"
                className="relative drop-shadow-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="display-font text-2xl text-foreground mb-1">
                <LiveText id="pres-final-title" defaultText="ᨀᨘᨄᨚᨐᨀᨚ" /> <span className="text-gradient">v2026</span>
              </h2>
              <p className="eyebrow text-muted-foreground/70 mb-4">
                <LiveText id="pres-final-tag" defaultText="Sistem pencarian DAN Arsip barang bukti tindak pidana" />
              </p>
            </motion.div>
            <div className="w-full space-y-2">
              <Card delay={0.2}>
                <p className="eyebrow mb-2 text-left text-[10px]">
                  <LiveText id="pres-credits-title" defaultText="Profil Pembuat Aplikasi" />
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">
                      <LiveText id="pres-credits-name" defaultText="IRZAL MAKKARAWA, S.H." />
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      <LiveText id="pres-credits-unit" defaultText="ANGGOTA POLRI" />
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      <LiveText id="pres-credits-integration" defaultText="Terintegrasi SI SDM POLRI" />
                    </p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Row label="Instansi" val="Ditkrimum ANGGOTA POLRI" />
                  <Row label="Jabatan" val="Panit/Katim" />
                  <Row label="Versi" val="ᨀᨘᨄᨚᨐᨀᨚ 2026.1" />
                  <Row label="Platform" val="Android · Web · Progressive App" />
                </div>
              </Card>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="surface rounded-xl p-3 space-y-1"
              >
                {[
                  "Terintegrasi sistem DORS",
                  "Rencana integrasi E-MP Bareskrim Polri",
                  "Berbasis Android · user-friendly · real-time",
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                      <LiveText id={`pres-credits-feature-${i}`} defaultText={t} />
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
            <Link to="/">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 w-full max-w-[220px] h-11 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-4 shadow-glow mx-auto"
              >
                <Home className="w-4 h-4" /> <LiveText id="pres-final-home-btn" defaultText="Buka Aplikasi" />
              </motion.button>
            </Link>
            <p className="mt-3 eyebrow text-muted-foreground/40">
              <LiveText id="pres-final-copyright" defaultText="ᨀᨘᨄᨚᨐᨀᨚ · 2026" />
            </p>
          </>
        }
      />
    ),
  },
];

/* ── Gabungan semua 29 slide ─────────────────────────────────── */
export const ALL_SLIDES = [...SLIDES_1_15, ...SLIDES_16_29];
