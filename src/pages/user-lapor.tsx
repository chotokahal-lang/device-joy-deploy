import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, MapPin, AlertTriangle, CheckCircle2, Loader2, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LiveText } from "@/components/ui/live-text";

const CONTACTS = [
  { name: "RESMOB POLDA SULSEL", number: "0411-XXXXXXX", desc: "Subdit Jatanras · Ditkrimum", primary: true },
  { name: "Hotline Polri", number: "110", desc: "24 jam · Nasional", primary: false },
  { name: "Polrestabes Makassar", number: "0411-3616111", desc: "Jl. Ahmad Yani No.9 Makassar", primary: false },
  { name: "Polres Gowa", number: "0411-860110", desc: "Jl. Malino KM 3, Sungguminasa", primary: false },
];

export default function UserLapor() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ lokasi: "", keterangan: "", kontak: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  if (sent) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8 text-center gap-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="display-font text-2xl text-foreground mb-2"><LiveText as="span" id="lapor-success-title" defaultText="Laporan Terkirim" /></h2>
          <p className="text-sm text-muted-foreground max-w-[28ch] mx-auto leading-relaxed">
            <LiveText as="span" id="lapor-success-desc" defaultText="Tim RESMOB POLDA SULSEL akan segera menindaklanjuti laporan Anda." />
          </p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={() => navigate("/user")}
          className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground font-bold shadow-glow"
        >
          <LiveText as="span" id="lapor-back-btn" defaultText="Kembali ke Beranda" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="lapor-eyebrow" defaultText="Laporan Temuan" />}
        title={<LiveText as="span" id="lapor-title" defaultText="Laporkan Temuan" />}
        subtitle={<LiveText as="span" id="lapor-subtitle" defaultText="Temukan barang bukti? Laporkan segera ke Kepolisian." />}
        back="/user"
      />

      <div className="px-6 flex-1 flex flex-col gap-5">
        {/* Warning banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface rounded-2xl p-4 flex gap-3 items-start border border-destructive/20 bg-destructive/5"
        >
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-destructive"><LiveText as="span" id="lapor-warn-title" defaultText="Jangan Beli atau Gunakan!" /></p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              <LiveText as="span" id="lapor-warn-desc" defaultText='Memiliki/menggunakan barang bukti dapat dijerat <b class="text-foreground">Pasal 480 KUHP</b> tentang Penadahan.' />
            </p>
          </div>
        </motion.div>

        {/* Quick contacts */}
        <div>
          <p className="eyebrow px-1 mb-3"><LiveText as="span" id="lapor-contact-title" defaultText="Hubungi Langsung" /></p>
          <div className="space-y-2.5">
            {CONTACTS.map((c, i) => (
              <motion.a
                key={c.name}
                href={`tel:${c.number}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.1 }}
                className={`surface-elevated rounded-2xl p-4 flex items-center gap-4 group block ${c.primary ? "border border-primary/20" : ""}`}
              >
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${c.primary ? "bg-primary/15" : "bg-white/5"}`}>
                  <Phone className={`w-5 h-5 ${c.primary ? "text-primary" : "text-muted-foreground"}`} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                  <p className="eyebrow text-primary/80 mt-0.5">{c.number}</p>
                  <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Report form */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="eyebrow px-1 mb-3"><LiveText as="span" id="lapor-form-title" defaultText="Kirim Laporan Digital" /></p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="eyebrow ml-1 text-[10px]"><LiveText as="span" id="lapor-form-loc-label" defaultText="Lokasi Temuan" /></span>
              <div className="mt-1.5 surface rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition-all flex items-center gap-2 px-4">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={form.lokasi}
                  onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
                  required
                  placeholder="Jl. contoh, Kelurahan, Kota"
                  className="flex-1 h-12 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/50"
                />
              </div>
            </label>
            <label className="block">
              <span className="eyebrow ml-1 text-[10px]"><LiveText as="span" id="lapor-form-desc-label" defaultText="Keterangan" /></span>
              <textarea
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                required
                rows={3}
                placeholder="Jelaskan kondisi dan ciri-ciri barang temuan..."
                className="mt-1.5 w-full surface rounded-2xl p-4 text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
              />
            </label>
            <label className="block">
              <span className="eyebrow ml-1 text-[10px]"><LiveText as="span" id="lapor-form-contact-label" defaultText="Nomor Kontak (opsional)" /></span>
              <input
                value={form.kontak}
                onChange={(e) => setForm({ ...form, kontak: e.target.value })}
                placeholder="08XXXXXXXXXX"
                className="mt-1.5 w-full surface rounded-2xl px-4 h-12 text-sm text-foreground placeholder:text-muted-foreground/50 bg-transparent outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </label>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Phone className="w-5 h-5" /><span><LiveText as="span" id="lapor-submit-btn" defaultText="Kirim Laporan" /></span></>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
