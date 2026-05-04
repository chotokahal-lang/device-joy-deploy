import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { ShieldCheck, Lock, Eye, Gavel } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="privacy-eyebrow" defaultText="Dokumen Hukum" />}
        title={<LiveText as="span" id="privacy-title" defaultText="Kebijakan Privasi" />}
        subtitle={<LiveText as="span" id="privacy-subtitle" defaultText="Komitmen kami dalam menjaga keamanan data Anda." />}
        back="/about"
      />

      <div className="px-6 space-y-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-elevated rounded-3xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="display-font text-lg text-foreground"><LiveText id="priv-1-title" defaultText="Keamanan Data Prioritas" /></h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <LiveText id="priv-1-desc" defaultText="KUBOYAKO (Aplikasi RESMOB POLDA SULSEL) berkomitmen penuh untuk melindungi setiap data yang diinput ke dalam sistem. Data barang bukti, identitas pelapor, dan log aktivitas admin dikelola dengan standar keamanan enkripsi militer." />
          </p>
        </motion.div>

        <section className="space-y-4">
          <PolicyItem 
            icon={<Lock className="w-4 h-4" />}
            title="Akses Terbatas"
            content="Hanya personel kepolisian yang memiliki NRP terdaftar dan admin sistem yang memiliki akses ke database internal barang bukti."
          />
          <PolicyItem 
            icon={<Eye className="w-4 h-4" />}
            title="Pengumpulan Informasi"
            content="Kami mengumpulkan data teknis unit (No. Polisi, IMEI, dsb) semata-mata untuk keperluan penegakan hukum dan pelacakan barang hilang."
          />
          <PolicyItem 
            icon={<Gavel className="w-4 h-4" />}
            title="Kepatuhan Hukum"
            content="Setiap penggunaan data tunduk pada UU ITE dan peraturan internal kepolisian Republik Indonesia."
          />
        </section>

        <div className="surface rounded-2xl p-5 border border-dashed border-white/10">
          <p className="text-[10px] text-center text-muted-foreground leading-relaxed italic">
            "Sesuai dengan amanat Pasal 480 KUHP dan regulasi perlindungan data digital nasional."
          </p>
        </div>
      </div>
    </div>
  );
}

function PolicyItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="surface rounded-2xl p-5 flex gap-4 items-start"
    >
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold text-foreground mb-1 uppercase tracking-wider">{title}</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}
