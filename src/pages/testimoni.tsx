import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ShieldCheck, Zap, Globe, Rocket, Users, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LiveText } from "@/components/ui/live-text";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { useLiveEditStore } from "@/store/useLiveEditStore";

const testimonials = [
  {
    name: "Aiptu Muh. Rizal, S.H.",
    role: "Ba Ur Barbuk Unit V Subdit Jatanras",
    content: "Sebelum ada ᨀᨘᨄᨚᨐᨀᨚ, kami harus buka catatan manual satu per satu di gudang barbuk. Sekarang cukup ketik nomor LP, semua data langsung keluar. Hemat waktu berjam-jam setiap hari.",
    avatar: "MR",
    accent: "from-blue-600 to-indigo-700"
  },
  {
    name: "Bripka Andi Saputra",
    role: "Anggota Opsnal Unit V Subdit Jatanras",
    content: "Waktu operasi di lapangan, kami bisa langsung cek IMEI HP curian lewat aplikasi ini. Hasilnya instan, jadi tersangka tidak bisa mengelak lagi. Sangat membantu penyidikan.",
    avatar: "AS",
    accent: "from-orange-500 to-red-600"
  },
  {
    name: "Iptu Hasan Basri, S.I.K.",
    role: "Kanit V Subdit Jatanras Ditkrimum",
    content: "Sebagai Kanit, saya butuh data yang cepat dan akurat untuk laporan ke pimpinan. ᨀᨘᨄᨚᨐᨀᨚ mempermudah monitoring status barbuk di unit kami secara real-time.",
    avatar: "HB",
    accent: "from-emerald-500 to-teal-700"
  },
  {
    name: "H. Syamsul Bahri",
    role: "Ketua RT 05 Kel. Rappocini, Makassar",
    content: "Saya pernah kehilangan motor dan langsung lapor lewat aplikasi ini. Prosesnya mudah dan transparan. Warga di lingkungan kami jadi lebih percaya sama kepolisian.",
    avatar: "SB",
    accent: "from-purple-500 to-pink-600"
  },
  {
    name: "Muh. Ardiansyah",
    role: "Mahasiswa, Warga Kota Makassar",
    content: "Mau beli HP bekas di pasar, saya cek dulu IMEI-nya di ᨀᨘᨄᨚᨐᨀᨚ. Ternyata statusnya bersih. Jadi saya beli dengan tenang tanpa takut tertipu barang curian.",
    avatar: "MA",
    accent: "from-cyan-500 to-blue-600"
  },
  {
    name: "Brigpol Fadli Rahman",
    role: "Operator DORS Ditkrimum Polda Sulsel",
    content: "Sinkronisasi data antara ᨀᨘᨄᨚᨐᨀᨚ dan sistem DORS berjalan lancar. Tidak ada lagi data ganda atau nomor LP yang tertukar. Administrasi jadi jauh lebih tertib.",
    avatar: "FR",
    accent: "from-slate-600 to-slate-800"
  }
];

export default function TestimoniPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isEditMode = useLiveEditStore(s => s.isEditMode);

  useEffect(() => {
    // PAUSE the auto-slider completely if Live Edit mode is active
    if (isEditMode) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [isEditMode]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden font-outfit">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Mesh Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-orange-500/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Auto-Rotating Hero Testimonial */}
        <div className="max-w-5xl mx-auto mb-24">
          <div className="relative h-[400px] md:h-[350px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="h-full surface-elevated rounded-[3.5rem] p-8 md:p-12 border border-primary/20 shadow-glow flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                  
                  {/* Big Avatar */}
                  <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-gradient-to-br ${testimonials[activeIndex].accent} flex items-center justify-center text-4xl md:text-6xl font-black text-white shadow-2xl shrink-0`}>
                    {testimonials[activeIndex].avatar}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 fill-primary text-primary animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                       ))}
                    </div>
                    
                    <h2 className="text-xl md:text-3xl font-bold text-foreground mb-4 leading-relaxed">
                      <LiveText id={`testi-real-hero-content-${activeIndex}`} defaultText={`"${testimonials[activeIndex].content}"`} />
                    </h2>
                    
                    <div>
                      <h3 className="text-lg font-black text-primary uppercase tracking-wider">
                        <LiveText id={`testi-real-hero-name-${activeIndex}`} defaultText={testimonials[activeIndex].name} />
                      </h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1">
                        <LiveText id={`testi-real-hero-role-${activeIndex}`} defaultText={testimonials[activeIndex].role} />
                      </p>
                    </div>
                  </div>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-8 left-1/2 md:left-auto md:right-12 -translate-x-1/2 md:translate-x-0 flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "w-8 bg-primary" : "w-2 bg-white/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="h-[1px] w-12 bg-primary/40" />
            <span className="eyebrow text-primary text-sm">Ulasan Pengguna</span>
            <div className="h-[1px] w-12 bg-primary/40" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-tight"
          >
            <LiveText id="testi-v3-page-title-1" defaultText="Ulasan Tentang" /> <span className="text-gradient"><LiveText id="testi-v3-page-title-2" defaultText="Aplikasi ᨀᨘᨄᨚᨐᨀᨚ" /></span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            <LiveText id="testi-v3-page-desc" defaultText="Pengalaman langsung dari anggota Polri di jajaran Ditkrimum Polda Sulsel dan masyarakat Kota Makassar yang telah menggunakan sistem ᨀᨘᨄᨚᨐᨀᨚ." />
          </motion.p>
        </div>

        {/* Hero Badge Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-5xl mx-auto mb-24 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="surface-elevated rounded-3xl p-6 text-center border border-white/5">
            <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Data Terenkripsi</div>
          </div>
          <div className="surface-elevated rounded-3xl p-6 text-center border border-white/5">
            <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold">Instan</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pencarian Cepat</div>
          </div>
          <div className="surface-elevated rounded-3xl p-6 text-center border border-white/5">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold">Online</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Akses Kapan Saja</div>
          </div>
          <div className="surface-elevated rounded-3xl p-6 text-center border border-white/5">
            <Rocket className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
            <div className="text-2xl font-bold">Gratis</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Untuk Masyarakat</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid"
            >
              <div className="surface p-8 rounded-[2.5rem] relative group hover:border-primary/40 transition-all border border-white/5 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary backdrop-blur-xl border border-primary/20 shadow-glow rotate-12 group-hover:rotate-0 transition-transform">
                  <Quote className="w-6 h-6 fill-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.accent} flex items-center justify-center text-xl font-black text-white shadow-lg`}>
                    {t.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-base leading-tight">
                      <LiveText id={`testi-real-grid-name-${i}`} defaultText={t.name} />
                    </h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                      <LiveText id={`testi-real-grid-role-${i}`} defaultText={t.role} />
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <p className="text-base leading-relaxed text-foreground/90 italic">
                    <LiveText id={`testi-real-grid-content-${i}`} defaultText={`"${t.content}"`} />
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Pengguna Terverifikasi</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-5xl mx-auto surface-elevated rounded-[3rem] p-12 text-center border border-primary/20 relative overflow-hidden group shadow-[0_0_100px_rgba(249,115,22,0.15)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Punya Saran atau <span className="text-gradient">Pengalaman?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Bantu kami meningkatkan ᨀᨘᨄᨚᨐᨀᨚ dengan membagikan pengalaman Anda.
            Masukan dari pengguna adalah kunci pengembangan sistem yang lebih baik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/presentasi" className="h-16 px-10 rounded-2xl gradient-primary text-primary-foreground font-black text-sm flex items-center gap-3 shadow-glow hover:scale-105 transition-transform">
              LIHAT PRESENTASI PENUH <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/" className="h-16 px-10 rounded-2xl surface-glass border border-white/10 text-foreground font-bold text-sm flex items-center gap-3 hover:bg-white/5 transition-colors">
              KEMBALI KE BERANDA
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
             <Users className="w-8 h-8" />
             <div className="text-xs font-bold uppercase tracking-[0.3em]">Unit V Subdit Jatanras Ditkrimum Polda Sulsel</div>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <footer className="py-12 text-center">
         <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-bold">
           ᨀᨘᨄᨚᨐᨀᨚ — RESMOB POLDA SULSEL — 2026
         </p>
      </footer>
    </div>
  );
}
