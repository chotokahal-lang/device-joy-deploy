import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileText,
  MapPin,
  Calendar,
  Loader2,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchEvidence, EvidenceItem, addLog, trackLocation } from "@/lib/store";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

export default function UserHasil() {
  const { type, query } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<EvidenceItem | null>(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("kuboyako_role") || "umum";
  const isUmum = role === "umum";

  useEffect(() => {
    const timer = setTimeout(() => {
      const decoded = decodeURIComponent(query || "");
      const found = searchEvidence(type as any, decoded) || null;
      setResult(found);
      setLoading(false);

      const userNrp = localStorage.getItem("kuboyako_user_nrp") || "guest";
      const userRole = localStorage.getItem("kuboyako_role") || "umum";
      addLog(userNrp, userRole, "SEARCH", `Mencari ${type}: ${decoded} (${found ? "Ditemukan" : "Tidak Ditemukan"})`);
      
      // Simulate random location tracking around Makassar
      const makassarLat = -5.147665;
      const makassarLng = 119.432731;
      const randLat = makassarLat + (Math.random() - 0.5) * 0.1;
      const randLng = makassarLng + (Math.random() - 0.5) * 0.1;
      trackLocation(userNrp === "guest" ? "Anonim (Masyarakat)" : userNrp, userRole, randLat, randLng, `Pencarian ${type}`);

    }, 1600);
    return () => clearTimeout(timer);
  }, [type, query]);

  const decoded = decodeURIComponent(query || "");
  const isSafe = !result;

  if (loading) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/25 blur-[60px] rounded-full animate-pulse" />
          <div className="w-24 h-24 surface-elevated rounded-3xl flex items-center justify-center relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </div>
        <h2 className="display-font text-2xl text-foreground mb-2"><LiveText as="span" id="hasil-loading-title" defaultText="Memverifikasi…" /></h2>
        <p className="text-xs text-muted-foreground max-w-[28ch] leading-relaxed">
          <LiveText as="span" id="hasil-loading-desc" defaultText="Menghubungkan ke pusat data RESMOB POLDA SULSEL." />
        </p>
        <div className="mt-10 w-48 h-1.5 surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-10 relative overflow-hidden">
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[40%] blur-[120px] rounded-full opacity-30 pointer-events-none ${
          isSafe ? "bg-emerald-500" : "bg-destructive"
        }`}
      />

      <header
        className="px-6 pb-4 relative z-10 flex items-center justify-between"
        style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top, 0px) + 1rem))" }}
      >
        <Link to={`/user/cek/${type}`} aria-label="Kembali">
          <span className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-foreground/80">
            <ArrowLeft className="w-5 h-5" />
          </span>
        </Link>
        <div className="text-center flex-1 min-w-0 px-2">
          <p className="eyebrow text-muted-foreground truncate"><LiveText as="span" id="hasil-header-label" defaultText="Hasil Verifikasi" /></p>
          <p
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-0.5 truncate ${
              isSafe ? "text-emerald-500" : "text-destructive"
            }`}
          >
            {isSafe ? <LiveText as="span" id="hasil-status-safe" defaultText="Status Aman" /> : <LiveText as="span" id="hasil-status-danger" defaultText="Terdeteksi BB" />}
          </p>
        </div>
        <span className="w-11 h-11" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-4">
        <AnimatePresence mode="wait">
          {isSafe ? (
            /* ── STATUS AMAN ─────────────────────────────── */
            <motion.div
              key="safe"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm surface-elevated rounded-3xl p-8 text-center"
            >
              <div className="relative mx-auto mb-8 w-24 h-24">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                <div className="w-24 h-24 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center relative">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
              </div>
              <h1 className="display-font text-3xl text-foreground mb-1"><LiveText as="span" id="hasil-safe-title" defaultText="Status Aman" /></h1>
              <p className="eyebrow text-emerald-500/80 mb-6"><LiveText as="span" id="hasil-safe-desc" defaultText="Tidak ditemukan dalam arsip barang bukti" /></p>

              <div className="surface rounded-2xl p-4 mb-6">
                <p className="eyebrow mb-2">Data yang Diperiksa</p>
                <p className="text-base font-bold text-foreground tracking-wider uppercase break-all">
                  {decoded}
                </p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Unit ini <b className="text-foreground">tidak tercatat</b> sebagai barang bukti
                tindak pidana dalam sistem RESMOB POLDA SULSEL.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="danger"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md surface-elevated rounded-[2.5rem] overflow-hidden border border-destructive/20 shadow-[0_0_80px_rgba(239,68,68,0.1)]"
            >
              <div className="bg-destructive/10 p-8 text-center border-b border-white/5 relative">
                <div className="absolute inset-0 bg-destructive/5 blur-3xl pointer-events-none" />
                <div className="w-20 h-20 rounded-3xl border border-destructive/30 bg-destructive/15 flex items-center justify-center mx-auto mb-5 relative animate-pulse-glow">
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="display-font text-3xl text-foreground"><LiveText id="hasil-danger-title" defaultText="TERDETEKSI!" /></h1>
                <p className="eyebrow text-destructive mt-1 tracking-[0.2em]"><LiveText id="hasil-danger-subtitle" defaultText="BARANG BUKTI KEJAHATAN" /></p>
              </div>

              <div className="p-8 space-y-6">
                <div className="surface-glass rounded-3xl p-5 border border-white/5 flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <Icon3D
                      src={
                        result!.type === "hp"
                          ? icons3d.phone
                          : result!.type === "mobil"
                          ? icons3d.car
                          : icons3d.motor
                      }
                      alt={result!.type}
                      size="lg"
                      tone="primary"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Identitas Unit</p>
                    <h2 className="text-xl font-bold text-foreground tracking-tight uppercase truncate">
                      {result!.type === "hp" ? result!.imei1 : (result as any).noPolisi}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result!.merk} {(result as any).tipe || (result as any).jenis || (result as any).model} · {result!.warna}
                    </p>
                  </div>
                </div>

                <div className={`rounded-3xl border p-6 relative overflow-hidden ${
                  result!.status === 'selesai' ? 'bg-emerald-500/10 border-emerald-500/30' :
                  result!.status === 'proses' ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full animate-ping ${
                      result!.status === 'selesai' ? 'bg-emerald-500' : 
                      result!.status === 'proses' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                      result!.status === 'selesai' ? 'text-emerald-400' : 
                      result!.status === 'proses' ? 'text-orange-400' : 'text-blue-400'
                    }`}>
                      {result!.status === 'selesai' ? 'Status: Kasus Selesai' : 
                       result!.status === 'proses' ? 'Status: Penyidikan Aktif' : 'Status: Laporan Baru'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {result!.status === 'selesai' ? 'Barang Berhasil Ditemukan' : 'Unit Dalam Pencarian Polisi'}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{result!.statusNote || "Petugas sedang melakukan pendalaman data dan koordinasi di lapangan."}"
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Nomor LP</span>
                    <span className="text-xs font-mono font-bold text-foreground">{result!.noLp}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Pelapor</span>
                    <span className="text-xs font-bold text-foreground uppercase">{result!.pelapor}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex gap-4 items-start">
                    <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Peringatan Keras</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Unit ini tercatat dalam sistem kriminalitas. Melakukan transaksi pada unit ini dapat dikategorikan sebagai <b className="text-foreground">Tindak Pidana Penadahan (Pasal 480 KUHP)</b>.
                      </p>
                    </div>
                  </div>

                  <a 
                    href="tel:110"
                    className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-destructive text-white font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(239,68,68,0.25)]"
                  >
                    <Phone className="w-4 h-4 animate-bounce" /> Hubungi Call Center 110
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="px-6 pt-6 text-center relative z-10">
        <p className="eyebrow text-muted-foreground/50">
          <LiveText as="span" id="hasil-footer" defaultText="Terverifikasi Digital · ᨀᨘᨅᨚᨐᨀᨚ · RESMOB POLDA SULSEL" />
        </p>
      </footer>
    </div>
  );
}
