import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Scale, FileText, AlertTriangle, ShieldAlert } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

export default function TermsConditions() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="terms-eyebrow" defaultText="Dokumen Hukum" />}
        title={<LiveText as="span" id="terms-title" defaultText="Syarat & Ketentuan" />}
        subtitle={<LiveText as="span" id="terms-subtitle" defaultText="Peraturan penggunaan sistem BOYAKO." />}
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
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="display-font text-lg text-foreground"><LiveText id="terms-1-title" defaultText="Legalitas Penggunaan" /></h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <LiveText id="terms-1-desc" defaultText="Penggunaan aplikasi BOYAKO diatur oleh hukum yang berlaku di wilayah hukum Republik Indonesia. Setiap penyalahgunaan data akan diproses sesuai hukum yang berlaku." />
          </p>
        </motion.div>

        <section className="space-y-4">
          <TermItem 
            icon={<FileText className="w-4 h-4" />}
            title="Akurasi Data"
            content="Setiap data yang dimasukkan (LP, Identitas Unit) harus sesuai dengan dokumen asli dari kepolisian. Pemalsuan data adalah tindak pidana."
          />
          <TermItem 
            icon={<ShieldAlert className="w-4 h-4" />}
            title="Kerahasiaan Akun"
            content="Admin dan Anggota Polri wajib menjaga kerahasiaan kredensial login. Segala aktivitas yang dilakukan menggunakan akun terdaftar adalah tanggung jawab pemilik akun."
          />
          <TermItem 
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Batasan Tanggung Jawab"
            content="Sistem ini merupakan alat bantu verifikasi. Keputusan final tetap merujuk pada verifikasi fisik oleh petugas berwenang di kantor kepolisian terdekat."
          />
        </section>

        <div className="surface rounded-2xl p-6 border border-destructive/20 bg-destructive/5 flex gap-4 items-start">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <b className="text-foreground">PELANGGARAN:</b> Setiap upaya akses ilegal atau perusakan data (Hacking) akan dilacak dan diserahkan kepada unit <b className="text-foreground">Cyber Crime Polda Sulsel</b>.
          </p>
        </div>
      </div>
    </div>
  );
}

function TermItem({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
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
