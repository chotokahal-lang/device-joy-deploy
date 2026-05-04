import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, SearchX } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 text-center pb-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-destructive/20 blur-[60px] rounded-full animate-pulse" />
        <div className="w-28 h-28 surface-elevated rounded-3xl flex items-center justify-center relative">
          <span className="display-font text-5xl text-primary">404</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <SearchX className="w-5 h-5 text-destructive" />
          <span className="eyebrow text-destructive"><LiveText as="span" id="404-eyebrow" defaultText="Halaman Tidak Ditemukan" /></span>
        </div>
        <h1 className="display-font text-3xl text-foreground mb-3">
          <LiveText as="span" id="404-title" defaultText='Halaman <span class="text-gradient">Tidak Ada</span>' />
        </h1>
        <p className="text-sm text-muted-foreground max-w-[30ch] leading-relaxed mx-auto">
          <LiveText as="span" id="404-desc" defaultText="Alamat yang Anda tuju tidak tersedia dalam sistem ᨀᨘᨅᨚᨐᨀᨚ." />
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 w-full max-w-xs space-y-3"
      >
        <Link to="/">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold
                       flex items-center justify-center gap-3 shadow-glow"
          >
            <ArrowLeft className="w-5 h-5" />
            <span><LiveText as="span" id="404-home-btn" defaultText="Kembali ke Beranda" /></span>
          </motion.button>
        </Link>

        <Link to="/role-select">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-2xl surface text-foreground/80 font-bold text-sm
                       flex items-center justify-center gap-2 mt-3"
          >
            <LiveText as="span" id="404-role-btn" defaultText="Pilih Mode Akses" />
          </motion.button>
        </Link>
      </motion.div>

      <p className="mt-10 eyebrow text-muted-foreground/50">
        <LiveText as="span" id="404-footer" defaultText="ᨀᨘᨅᨚᨐᨀᨚ · RESMOB POLDA SULSEL" />
      </p>
    </div>
  );
}
