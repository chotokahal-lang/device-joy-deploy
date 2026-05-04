import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LiveText } from "@/components/ui/live-text";

const FAQS = [
  {
    q: "Apa itu KUBOYAKO?",
    a: "KUBOYAKO adalah sistem arsip digital barang bukti kendaraan & HP dari RESMOB POLDA SULSEL. Nama berasal dari bahasa Makassar — \"Boya\" berarti Cari.",
  },
  {
    q: "Siapa yang bisa menggunakan?",
    a: "Administrator (input & arsip data barang bukti), Anggota Polri (cek kendaraan, HP & detail LP), dan User Umum (cek mandiri & lapor temuan).",
  },
  {
    q: "Bagaimana cara cek kendaraan?",
    a: "Pilih menu Cek Mobil atau Motor, masukkan nomor polisi atau nomor rangka, lalu tekan Mulai Pencarian.",
  },
  {
    q: "Bagaimana cara cek HP / IMEI?",
    a: "Pilih menu Cek HP, masukkan 15 digit IMEI. Untuk mengetahui IMEI: tekan *#06# pada HP, atau cek kotak/stiker HP.",
  },
  {
    q: "Apa arti Status Aman (Hijau)?",
    a: "Kendaraan atau HP tidak tercatat sebagai barang bukti dalam sistem DORS RESMOB POLDA SULSEL. Aman untuk transaksi.",
  },
  {
    q: "Apa arti Status Terdeteksi (Merah)?",
    a: "Kendaraan atau HP tercatat sebagai barang bukti dari Laporan Polisi yang aktif. Jangan beli atau gunakan — segera laporkan.",
  },
  {
    q: "Apa yang harus dilakukan jika terdeteksi?",
    a: "Segera hubungi RESMOB POLDA SULSEL, Hotline Polri 110, atau datangi Polsek terdekat. Gunakan Fitur Lapor di aplikasi.",
  },
  {
    q: "Apakah data tersinkronisasi secara realtime?",
    a: "Ya, sistem terhubung langsung dengan database DORS (Digital Operations Recording System) RESMOB POLDA SULSEL.",
  },
  {
    q: "Bagaimana jika data tidak ditemukan?",
    a: "Jika hasil pencarian tidak ada dalam sistem, status dianggap aman. Namun tetap periksa dokumen fisik kendaraan (STNK/BPKB).",
  },
];

export default function HelpFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="faq-eyebrow" defaultText="Bantuan" />}
        title={<LiveText as="span" id="faq-title" defaultText="FAQ" />}
        subtitle={<LiveText as="span" id="faq-subtitle" defaultText="Pertanyaan yang sering diajukan tentang KUBOYAKO." />}
        back="/profile"
        right={
          <span className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-muted-foreground">
            <HelpCircle className="w-4 h-4" />
          </span>
        }
      />

      <div className="px-6 space-y-2.5">
        {FAQS.map((faq, i) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i + 0.1 }}
            className="surface-elevated rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
            >
              <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-primary" />
              </span>
              <p className="flex-1 text-sm font-bold text-foreground leading-snug">
                <LiveText as="span" id={`faq-q-${i}`} defaultText={faq.q} />
              </p>
              <motion.span
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <p className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                    <LiveText as="span" id={`faq-a-${i}`} defaultText={faq.a} />
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Contact CTA */}
        <motion.a
          href="tel:110"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="surface rounded-2xl p-4 flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 block mt-4"
        >
          <span className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-emerald-500" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground"><LiveText as="span" id="faq-cta-title" defaultText="Butuh Bantuan Lebih?" /></p>
            <p className="text-xs text-muted-foreground mt-0.5"><LiveText as="span" id="faq-cta-desc" defaultText="Hubungi Hotline Polri · 110 · 24 Jam" /></p>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
