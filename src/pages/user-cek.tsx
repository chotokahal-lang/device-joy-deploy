import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

export default function UserCek() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const details = (() => {
    switch (type) {
      case "mobil":
        return {
          title: "Cek Mobil",
          desc: "Verifikasi plat nomor kendaraan roda empat.",
          placeholder: "DD 1234 AB",
          icon: icons3d.car,
          hint: "Masukkan plat nomor lengkap dengan spasi.",
          tone: "primary" as const,
        };
      case "motor":
        return {
          title: "Cek Motor",
          desc: "Verifikasi plat nomor kendaraan roda dua.",
          placeholder: "DD 5678 CD",
          icon: icons3d.motor,
          hint: "Pastikan kombinasi huruf dan angka sudah benar.",
          tone: "primary" as const,
        };
      case "hp":
        return {
          title: "Cek HP",
          desc: "Identifikasi status IMEI perangkat seluler.",
          placeholder: "15 DIGIT IMEI",
          icon: icons3d.phone,
          hint: "Tekan *#06# untuk melihat IMEI.",
          tone: "accent" as const,
        };
      default:
        return {
          title: "Cari LP",
          desc: "Pencarian berdasarkan nomor laporan polisi.",
          placeholder: "LP/123/IV…",
          icon: icons3d.form,
          hint: "Format LP harus sesuai arsip kepolisian.",
          tone: "primary" as const,
        };
    }
  })();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const recent = JSON.parse(localStorage.getItem("kuboyako_recent") || "[]");
    const updated = [query, ...recent.filter((q: string) => q !== query)].slice(0, 5);
    localStorage.setItem("kuboyako_recent", JSON.stringify(updated));
    setTimeout(() => navigate(`/user/hasil/${type}/${encodeURIComponent(query)}`), 900);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="user-cek-eyebrow" defaultText="Pemeriksaan Sistem" />}
        title={<LiveText as="span" id={`user-cek-title-${type}`} defaultText={details.title} />}
        subtitle={<LiveText as="span" id={`user-cek-desc-${type}`} defaultText={details.desc} />}
        back="/user"
      />

      <div className="px-6 flex-1 flex flex-col">
        <div className="flex justify-center mt-4 mb-10">
          <Icon3D src={details.icon} alt={details.title} size="hero" tone={details.tone} float />
        </div>

        <form onSubmit={handleSearch} className="space-y-5">
          <div className="surface-elevated rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition-all">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder={details.placeholder}
              required
              className="w-full h-20 bg-transparent outline-none text-center text-lg xs:text-xl sm:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.18em] text-foreground placeholder:text-muted-foreground/40 placeholder:font-medium placeholder:tracking-wider uppercase px-4"
            />
          </div>

          <div className="surface rounded-2xl p-4 flex gap-3 items-start">
            <span className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-accent" />
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed"><LiveText as="span" id={`cek-hint-${type}`} defaultText={details.hint} /></p>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || !query.trim()}
            className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span><LiveText as="span" id="cek-search-btn" defaultText="Mulai Pencarian" /></span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-auto py-6 text-center">
          <div className="inline-flex items-center gap-2 eyebrow text-muted-foreground/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <LiveText as="span" id="cek-sync-status" defaultText="Sinkronisasi Database · Aktif" />
          </div>
        </div>
      </div>
    </div>
  );
}
