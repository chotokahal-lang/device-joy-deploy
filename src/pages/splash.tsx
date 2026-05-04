import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  BookOpen,
  Monitor,
  Smartphone,
  Star,
} from "lucide-react";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { LiveText } from "@/components/ui/live-text";

export default function Splash() {
  return (
    <div
      className="flex flex-col relative overflow-hidden"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Ambient top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[45%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Hero block — flex-1 pushes CTA to bottom ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-10 pb-4 relative z-10 gap-5">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Logo3DImg size="hero" float intensity="high" />
        </motion.div>

        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="display-font text-[clamp(2rem,8vw,2.5rem)] leading-[1.05]">
            <LiveText as="span" id="splash-title" defaultText="KUBOYAKO" className="text-gradient" />
          </h1>
          <LiveText as="p" id="splash-subtitle" defaultText="Aplikasi Pencarian & Arsip Barang Bukti" className="text-sm text-muted-foreground max-w-[28ch] leading-relaxed" />
        </motion.div>

        {/* Asal nama card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="surface rounded-2xl px-4 py-3 flex items-start gap-3 w-full max-w-[320px] text-left"
        >
          <BookOpen className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <LiveText as="span" id="splash-desc-1" defaultText="KUBOYAKO" className="font-bold text-foreground" /> — <LiveText as="span" id="splash-desc-2" defaultText="bahasa Makassar." />{" "}
            <LiveText as="span" id="splash-desc-3" defaultText="Boya" className="font-bold text-primary" /> = <LiveText as="i" id="splash-desc-4" defaultText="Cari" />. <LiveText as="span" id="splash-desc-5" defaultText="Sistem pencarian dan Arsip barang bukti tindak pidana pencurian wilayah hukum RESMOB POLDA SULSEL." />
          </p>
        </motion.div>

        {/* Featured Testimonial Card - High Visibility */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-[320px] relative"
        >
          <Link to="/testimoni" className="block">
            <div className="surface-elevated rounded-2xl p-4 border border-primary/30 shadow-glow bg-gradient-to-br from-primary/5 to-transparent relative group overflow-hidden">
               <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-16 h-16 text-primary fill-primary" />
               </div>
               <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 fill-primary text-primary" />)}
                  </div>
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Ulasan Terbaru</span>
               </div>
               <p className="text-[10px] text-foreground font-bold italic leading-relaxed mb-2">
                 "Dulu cari berkas BB makan waktu seharian, sekarang tinggal klik di HP. Kerja jadi lebih cerdas!"
               </p>
               <div className="flex items-center justify-between">
                  <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">— Aiptu Rizal, Bagian Administrasi</span>
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                     <ArrowRight className="w-3 h-3" />
                  </div>
               </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* ── CTA block — sticks to bottom ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="px-6 pb-10 relative z-10 flex flex-col gap-3"
        style={{
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom, 2.5rem))",
        }}
      >
        <Link to="/role-select" className="block">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group w-full h-[58px] rounded-2xl gradient-primary text-primary-foreground
                       font-bold flex items-center justify-center gap-3 shadow-glow overflow-hidden"
          >
            <LiveText as="span" id="splash-btn-start" defaultText="Mulai Verifikasi" className="text-[15px] tracking-tight" />
            <span className="w-9 h-9 rounded-xl bg-black/15 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-5 h-5" />
            </span>
          </motion.button>
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/presentasi" className="block">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-12 rounded-2xl surface text-foreground/70 font-semibold flex items-center justify-center gap-2 text-[11px] sm:text-xs"
            >
              <Monitor className="w-4 h-4 text-primary shrink-0" />
              <LiveText as="span" id="splash-btn-desktop" defaultText="Presentasi Desktop" />
            </motion.button>
          </Link>

          <Link to="/presentasi?mode=hp" className="block">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="w-full h-12 rounded-2xl surface text-foreground/70 font-semibold flex items-center justify-center gap-2 text-[11px] sm:text-xs"
            >
              <Smartphone className="w-4 h-4 text-primary shrink-0" />
              <LiveText as="span" id="splash-btn-mobile" defaultText="Presentasi Mobile" />
            </motion.button>
          </Link>
        </div>

        {/* Page indicator dots */}
        <div className="flex justify-center gap-2 pt-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === 0 ? "w-8 bg-primary" : "w-2 bg-white/15"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
