import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, FileText, MapPin, Calendar, User, ShieldCheck, Printer, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { getEvidenceData, EvidenceItem } from "@/lib/store";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

export default function AdminDetail() {
  const { id } = useParams();
  const [result, setResult] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    const item = getEvidenceData().find((d) => d.id === id);
    if (item) setResult(item);
  }, [id]);

  if (!result) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader
          eyebrow={<LiveText as="span" id="admin-detail-404-eyebrow" defaultText="Tidak ditemukan" />}
          title={<LiveText as="span" id="admin-detail-404-title" defaultText="Data Hilang" />}
          subtitle={<LiveText as="span" id="admin-detail-404-subtitle" defaultText="ID arsip ini tidak terdaftar dalam basis data." />}
          back="/admin/riwayat"
        />
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="w-24 h-24 rounded-3xl surface flex items-center justify-center mb-8 ring-glow">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <Link to="/admin/riwayat" className="w-full max-w-xs">
            <button className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold shadow-glow">
              <LiveText as="span" id="admin-detail-404-btn" defaultText="Kembali ke Arsip" />
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const iconSrc =
    result.type === "hp"
      ? icons3d.phone
      : result.type === "mobil"
      ? icons3d.car
      : icons3d.motor;

  const primary = result.type === "hp" ? result.imei1 : (result as any).noPolisi;
  const subtitle =
    result.merk +
    " " +
    ((result as any).tipe || (result as any).jenis || (result as any).model || "");

  const meta = [
    { icon: <FileText className="w-4 h-4" />, label: "Laporan Polisi", val: result.noLp, sub: result.satker },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Tanggal Pelaporan",
      val: new Date(result.tglLp).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      sub: "Sistem terverifikasi",
    },
    { icon: <User className="w-4 h-4" />, label: "Pelapor", val: result.pelapor, sub: "BAP digital" },
    { icon: <MapPin className="w-4 h-4" />, label: "Lokasi TKP", val: result.lokasiTkp, sub: "Validasi geospasial" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="admin-detail-eyebrow" defaultText="Detail Arsip" />}
        title={<LiveText as="span" id="admin-detail-title" defaultText="Barang Bukti" />}
        subtitle={<LiveText as="span" id="admin-detail-subtitle" defaultText="Terverifikasi · Catatan BAP Digital." />}
        back="/admin/riwayat"
        right={
          <button
            onClick={() => window.print()}
            className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-primary print:hidden"
          >
            <Printer className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-6 relative z-10 space-y-5">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="surface-elevated rounded-3xl p-6 flex items-center gap-5"
        >
          <Icon3D src={iconSrc} alt={result.type} size="xl" tone="primary" />
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-primary/80 mb-1.5"><LiveText as="span" id="admin-detail-id-label" defaultText="Identifier" /> · {result.type}</p>
            <h2 className="display-font text-2xl text-foreground leading-tight uppercase truncate">
              {primary}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 truncate">{subtitle}</p>
            <p className="text-xs text-muted-foreground/70 mt-1"><LiveText as="span" id="admin-detail-color-label" defaultText="Warna" />: {result.warna}</p>
          </div>
        </motion.div>

        {/* Vehicle extras */}
        {(result as any).noRangka && (
          <div className="surface rounded-2xl p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="eyebrow mb-1">No. Rangka</p>
              <p className="text-sm font-bold uppercase text-foreground tracking-wider truncate">
                {(result as any).noRangka}
              </p>
            </div>
            <div>
              <p className="eyebrow mb-1">No. Mesin</p>
              <p className="text-sm font-bold uppercase text-foreground tracking-wider truncate">
                {(result as any).noMesin}
              </p>
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="surface-elevated rounded-3xl p-5 divide-y divide-white/5">
          {meta.map((m, i) => (
            <div key={i} className="flex items-start gap-4 py-4 first:pt-1 last:pb-1">
              <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {m.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="eyebrow mb-1">{m.label}</p>
                <p className="text-sm font-semibold text-foreground leading-snug uppercase">
                  {m.val}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verified badge */}
          <div className="surface rounded-2xl p-4 flex items-center gap-3 border-accent/20 bg-accent/5">
          <span className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </span>
          <div>
            <p className="eyebrow text-accent"><LiveText as="span" id="admin-detail-verified-title" defaultText="Data Terverifikasi" /></p>
            <p className="text-xs text-foreground mt-0.5"><LiveText as="span" id="admin-detail-verified-desc" defaultText="Terenkripsi ujung-ke-ujung · Jatanras" /></p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; color: black !important; }
          .surface, .surface-elevated, .surface-glass { 
            border: 1px solid #eee !important; 
            background: white !important; 
            box-shadow: none !important;
            color: black !important;
          }
          .text-muted-foreground { color: #666 !important; }
          .text-foreground { color: black !important; }
          .eyebrow { color: #888 !important; }
          .ring-glow, .ring-1 { display: none !important; }
          .display-font { color: black !important; }
          .gradient-primary { background: black !important; color: white !important; }
        }
      `}} />
    </div>
  );
}
