import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Upload, Loader2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveEvidenceItem, VehicleItem, HpItem, addLog } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

type Tab = "mobil" | "motor" | "hp";

export default function AdminInput() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("mobil");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ocrData, setOcrData] = useState<Record<string, string | undefined> | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("kuboyako_ocr_result");
    if (!saved) return;
    try {
      setOcrData(JSON.parse(saved) as Record<string, string | undefined>);
    } catch {
      setOcrData(null);
    }
    sessionStorage.removeItem("kuboyako_ocr_result");
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "mobil", label: "Mobil", icon: icons3d.car },
    { id: "motor", label: "Motor", icon: icons3d.motor },
    { id: "hp", label: "HP", icon: icons3d.phone },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    setTimeout(() => {
      const baseData = {
        id: Math.random().toString(36).slice(2, 11),
        noLp: formData.get("noLp") as string,
        tglLp: formData.get("tglLp") as string,
        pelapor: formData.get("pelapor") as string,
        lokasiTkp: formData.get("lokasiTkp") as string,
        asalLp: formData.get("asalLp") as string,
        satker: "POLRESTABES MAKASSAR",
        createdAt: Date.now(),
      };

      if (tab === "mobil" || tab === "motor") {
        const vehicle: VehicleItem = {
          ...baseData,
          type: tab,
          noPolisi: formData.get("noPolisi") as string,
          noRangka: formData.get("noRangka") as string,
          noMesin: formData.get("noMesin") as string,
          merk: formData.get("merk") as string,
          warna: formData.get("warna") as string,
          tahun: formData.get("tahun") as string,
          ...(tab === "mobil" ? { tipe: formData.get("tipe") as string } : {}),
          ...(tab === "motor" ? { jenis: formData.get("jenis") as string } : {}),
        };
        saveEvidenceItem(vehicle);
      } else {
        const hp: HpItem = {
          ...baseData,
          type: "hp",
          merk: formData.get("merk") as string,
          model: formData.get("model") as string,
          imei1: formData.get("imei1") as string,
          imei2: formData.get("imei2") as string,
          warna: formData.get("warna") as string,
        };
        saveEvidenceItem(hp);
      }

      const adminNrp = localStorage.getItem("kuboyako_user_nrp") || "admin";
      const itemDesc = tab === "hp" ? formData.get("imei1") : formData.get("noPolisi");
      addLog(adminNrp, "admin", "SAVE_EVIDENCE", `Mengarsipkan BB ${tab}: ${itemDesc}`);

      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/admin/riwayat"), 1100);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="input-eyebrow" defaultText="Arsip Baru" />}
        title={<LiveText as="span" id="input-title" defaultText="Input Manual" />}
        subtitle={<LiveText as="span" id="input-subtitle" defaultText="Catat detail laporan polisi dan spesifikasi unit dengan lengkap." />}
        back="/admin"
      />

      {/* Segmented tabs with 3D icons */}
      <div className="px-6 mb-6">
        <div className="surface rounded-2xl p-1.5 flex gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                tab === t.id
                  ? "gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <img src={t.icon} alt="" className="w-6 h-6 object-contain drop-shadow" />
              <LiveText as="span" id={`admin-input-tab-${t.id}`} defaultText={t.label} />
            </button>
          ))}
        </div>
      </div>

      <form
        key={ocrData ? "prefilled" : "empty"}
        onSubmit={handleSubmit}
        className="px-6 pb-6 flex-1 space-y-4 relative z-10"
      >
        {/* LP card */}
        <Section sectionId="admin-input-lp" title="Informasi Laporan Polisi" iconSrc={icons3d.form}>
          <FieldGroup>
            <Field label="Nomor Laporan Polisi" name="noLp" required placeholder="LP/123/IV/2026/SPKT…" defaultValue={ocrData?.noLp} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Tanggal LP" name="tglLp" type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
              <Field label="Pelapor" name="pelapor" required placeholder="Nama lengkap" defaultValue={ocrData?.pelapor} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Lokasi TKP" name="lokasiTkp" required placeholder="Jl. Pettarani No. 10" />
              <Field label="Asal LP (Kesatuan)" name="asalLp" required placeholder="Polsek Panakkukang" />
            </div>
          </FieldGroup>
        </Section>

        {/* Specs card */}
        <Section
          sectionId={`admin-input-spec-${tab}`}
          title={`Spesifikasi ${tab === "hp" ? "Perangkat" : "Unit"}`}
          iconSrc={tab === "hp" ? icons3d.phone : tab === "mobil" ? icons3d.car : icons3d.motor}
        >
          <FieldGroup>
            {(tab === "mobil" || tab === "motor") && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field scope={tab} label="Nomor Polisi" name="noPolisi" required placeholder="DD 1234 AB" uppercase defaultValue={ocrData?.noPolisi} />
                  <Field scope={tab} label="Tahun" name="tahun" type="number" required placeholder="2024" defaultValue={ocrData?.tahun} />
                </div>
                <Field scope={tab} label="Nomor Rangka" name="noRangka" required placeholder="Cek pada STNK/BPKB" uppercase defaultValue={ocrData?.noRangka} />
                <Field scope={tab} label="Nomor Mesin" name="noMesin" required placeholder="Cek pada blok mesin" uppercase defaultValue={ocrData?.noMesin} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field scope={tab} label="Merk" name="merk" required placeholder={tab === "mobil" ? "Toyota" : "Honda"} defaultValue={ocrData?.merk} />
                  <Field
                    scope={tab}
                    label={tab === "mobil" ? "Tipe" : "Jenis"}
                    name={tab === "mobil" ? "tipe" : "jenis"}
                    required
                    placeholder={tab === "mobil" ? "Avanza" : "Beat"}
                  />
                </div>
                <Field scope={tab} label="Warna" name="warna" required placeholder="Hitam metalik" defaultValue={ocrData?.warna} />
              </>
            )}

            {tab === "hp" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field scope={tab} label="Merk" name="merk" required placeholder="Apple" />
                  <Field scope={tab} label="Model" name="model" required placeholder="iPhone 15 Pro" />
                </div>
                <Field scope={tab} label="IMEI 1" name="imei1" required placeholder="15 digit" />
                <Field scope={tab} label="IMEI 2 (opsional)" name="imei2" placeholder="Untuk dual SIM" />
                <Field scope={tab} label="Warna" name="warna" required placeholder="Phantom Black" />
              </>
            )}

            <div>
              <span className="eyebrow ml-1"><LiveText as="span" id="admin-input-upload-label" defaultText="Dokumentasi Visual" /></span>
              <label className="mt-2 flex flex-col items-center justify-center surface rounded-2xl p-8 border-dashed border border-white/10 cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="w-7 h-7 text-muted-foreground mb-2" />
                <span className="text-xs font-medium text-foreground">
                  <LiveText as="span" id="admin-input-upload-cta" defaultText="Unggah foto unit" />
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  <LiveText as="span" id="admin-input-upload-hint" defaultText="JPG / PNG · maks 5MB" />
                </span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </FieldGroup>
        </Section>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span><LiveText as="span" id="admin-input-save-btn" defaultText="Arsipkan Data" /></span>
            </>
          )}
        </motion.button>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center text-center bg-background/95 backdrop-blur-xl p-8"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-6 shadow-glow"
            >
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <h2 className="display-font text-2xl text-foreground mb-2"><LiveText as="span" id="admin-input-success-title" defaultText="Tersimpan!" /></h2>
            <p className="text-sm text-muted-foreground max-w-[28ch]">
              <LiveText as="span" id="admin-input-success-desc" defaultText="Data barang bukti telah diarsipkan ke database Jatanras." />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  sectionId,
  title,
  iconSrc,
  children,
}: {
  sectionId: string;
  title: string;
  iconSrc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-elevated rounded-3xl p-5"
    >
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
        <Icon3D src={iconSrc} alt="" size="sm" glow={false} tone="primary" />
        <h3 className="display-font text-sm text-foreground">
          <LiveText as="span" id={`${sectionId}-title`} defaultText={title} />
        </h3>
      </div>
      {children}
    </motion.section>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  uppercase,
  defaultValue,
  scope = "",
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  uppercase?: boolean;
  defaultValue?: string;
  /** Hindari bentrok id LiveText antar tab (mobil/motor/hp) */
  scope?: string;
}) {
  const liveId = scope ? `admin-input-field-${scope}-${name}` : `admin-input-field-${name}`;
  return (
    <label className="block">
      <span className="eyebrow ml-1">
        <LiveText as="span" id={liveId} defaultText={label} />
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`mt-2 w-full h-12 surface rounded-xl px-4 bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/40 transition-all ${
          uppercase ? "uppercase tracking-wider" : ""
        }`}
      />
    </label>
  );
}
