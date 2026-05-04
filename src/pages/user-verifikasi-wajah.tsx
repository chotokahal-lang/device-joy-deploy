import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanFace,
  CheckCircle2,
  AlertTriangle,
  Camera,
  RefreshCw,
} from "lucide-react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { LiveText } from "@/components/ui/live-text";

type Stage =
  | "loading"    // kamera sedang dimuat
  | "ready"      // kamera aktif, menunggu pengguna
  | "scanning"   // sedang scan wajah
  | "processing" // analisis setelah capture
  | "success"    // verifikasi berhasil
  | "denied"     // izin kamera ditolak
  | "error";     // error lainnya

export default function UserVerifikasiWajah() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stage, setStage] = useState<Stage>("loading");
  const [scanProgress, setScanProgress] = useState(0);
  const [dots, setDots] = useState(0);

  /* ── Animasi titik loading ─────────────────── */
  useEffect(() => {
    if (stage !== "scanning") return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, [stage]);

  /* ── Mulai kamera ──────────────────────────── */
  const startCamera = useCallback(async () => {
    setStage("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setStage("ready");
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStage("denied");
      } else {
        setStage("error");
      }
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [startCamera]);

  /* ── Mulai scan ─────────────────────────────── */
  const handleScan = () => {
    setStage("scanning");
    setScanProgress(0);

    const start = performance.now();
    const DURATION = 3200;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(elapsed / DURATION, 1);
      setScanProgress(Math.round(pct * 100));
      if (pct < 1) {
        requestAnimationFrame(tick);
      } else {
        setStage("processing");
        setTimeout(() => {
          streamRef.current?.getTracks().forEach((t) => t.stop());
          sessionStorage.setItem("kuboyako_face_verified", "1");
          localStorage.setItem("kuboyako_role", "umum");
          setStage("success");
          setTimeout(() => navigate("/user"), 1800);
        }, 900);
      }
    };
    requestAnimationFrame(tick);
  };

  /* ── STAGE: SUCCESS ─────────────────────────── */
  if (stage === "success") {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8 text-center gap-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-24 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="display-font text-2xl text-foreground mb-2"><LiveText as="span" id="verify-success-title" defaultText="Identitas Terverifikasi" /></h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[28ch] mx-auto">
            <LiveText as="span" id="verify-success-desc" defaultText="Wajah Anda berhasil dicocokkan. Mengalihkan ke halaman utama…" />
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 eyebrow text-emerald-500/70"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Akses diberikan
        </motion.div>
      </div>
    );
  }

  /* ── STAGE: DENIED ─────────────────────────── */
  if (stage === "denied") {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
          <Camera className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h2 className="display-font text-xl text-foreground mb-2"><LiveText as="span" id="verify-denied-title" defaultText="Izin Kamera Ditolak" /></h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[30ch] mx-auto">
            <LiveText as="span" id="verify-denied-desc" defaultText="Akses kamera wajib untuk verifikasi wajah. Izinkan kamera di pengaturan browser Anda, lalu coba lagi." />
          </p>
        </div>
        <button
          onClick={startCamera}
          className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center gap-2 shadow-glow"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
        <button
          onClick={() => navigate("/role-select")}
          className="text-xs text-muted-foreground underline underline-offset-4"
        >
          Kembali ke Pemilihan Peran
        </button>
      </div>
    );
  }

  /* ── STAGE: ERROR ──────────────────────────── */
  if (stage === "error") {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8 text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h2 className="display-font text-xl text-foreground mb-2"><LiveText as="span" id="verify-error-title" defaultText="Kamera Tidak Tersedia" /></h2>
          <p className="text-sm text-muted-foreground max-w-[28ch] mx-auto leading-relaxed">
            <LiveText as="span" id="verify-error-desc" defaultText="Pastikan perangkat Anda memiliki kamera aktif dan tidak sedang digunakan aplikasi lain." />
          </p>
        </div>
        <button
          onClick={startCamera}
          className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center gap-2 shadow-glow"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    );
  }

  /* ── MAIN VIEW: loading / ready / scanning / processing ─── */
  const isScanning = stage === "scanning" || stage === "processing";

  return (
    <div className="flex flex-col min-h-full relative overflow-hidden">
      {/* Header */}
      <header
        className="px-6 pb-4 relative z-10 flex items-center justify-between"
        style={{ paddingTop: "max(3rem, calc(env(safe-area-inset-top, 0px) + 1rem))" }}
      >
        <Logo3DImg size="xs" intensity="low" />
        <div className="text-center">
          <p className="eyebrow text-muted-foreground"><LiveText as="span" id="verify-header-eyebrow" defaultText="Verifikasi Wajah" /></p>
          <p className="text-xs font-bold tracking-[0.2em] text-primary mt-0.5 uppercase">
            {stage === "loading" ? <LiveText as="span" id="verify-stage-loading" defaultText="Memuat Kamera…" /> :
             stage === "processing" ? <LiveText as="span" id="verify-stage-analysing" defaultText="Menganalisis…" /> :
             stage === "scanning" ? <LiveText as="span" id="verify-stage-scanning" defaultText="Sedang Memindai…" /> :
             <LiveText as="span" id="verify-stage-ready" defaultText="Arahkan Wajah Anda" />}
          </p>
        </div>
        <span className="w-10 h-10" />
      </header>

      {/* Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 gap-5">
        <div className="relative">
          {/* Glow background */}
          <div className={`absolute -inset-6 rounded-full blur-[60px] opacity-40 transition-all duration-700 ${
            isScanning ? "bg-primary scale-110" : "bg-primary/50"
          }`} />

          {/* Camera frame */}
          <div className="relative w-64 h-80 rounded-3xl overflow-hidden border-2 border-primary/40 bg-black/60">
            {/* Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${
                stage === "loading" ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Loading overlay */}
            {stage === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Face oval guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="160" height="200" viewBox="0 0 160 200" fill="none">
                <ellipse
                  cx="80" cy="100" rx="70" ry="90"
                  stroke={isScanning ? "#f97316" : "rgba(255,255,255,0.5)"}
                  strokeWidth="2"
                  strokeDasharray={isScanning ? "0" : "8 4"}
                  className="transition-all duration-500"
                />
                {/* Corner accents */}
                {[
                  [10, 10, 10, 30, 30, 10],
                  [150, 10, 150, 30, 130, 10],
                  [10, 190, 10, 170, 30, 190],
                  [150, 190, 150, 170, 130, 190],
                ].map(([x1, y1, x2, y2, x3, y3], i) => (
                  <polyline
                    key={i}
                    points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
              </svg>
            </div>

            {/* Scanning line animation */}
            {stage === "scanning" && (
              <motion.div
                initial={{ top: "10%" }}
                animate={{ top: ["10%", "85%", "10%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-8 right-8 h-0.5 bg-primary/80 shadow-[0_0_8px_rgba(249,115,22,0.8)] rounded-full"
                style={{ position: "absolute" }}
              />
            )}

            {/* Processing overlay */}
            {stage === "processing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ScanFace className="w-16 h-16 text-primary" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Corner dots */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
            <span
              key={pos}
              className={`absolute w-2.5 h-2.5 rounded-full ${pos} -translate-x-0.5 -translate-y-0.5 transition-all duration-500 ${
                isScanning ? "bg-primary scale-125 shadow-[0_0_6px_rgba(249,115,22,0.8)]" : "bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Progress bar — saat scanning */}
        {stage === "scanning" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-64 space-y-2"
          >
            <div className="w-full h-2 surface rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                style={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-center eyebrow text-primary/80 text-[10px]">
              Memindai wajah{".".repeat(dots)}  {scanProgress}%
            </p>
          </motion.div>
        )}

        {/* Instruksi */}
        {(stage === "ready" || stage === "loading") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="surface rounded-2xl px-5 py-3.5 max-w-[20rem] text-center space-y-1"
          >
            <p className="text-sm font-bold text-foreground"><LiveText as="span" id="verify-inst-title" defaultText="Posisikan Wajah Anda" /></p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <LiveText as="span" id="verify-inst-desc" defaultText="Pastikan wajah berada di dalam bingkai oval, pencahayaan cukup, dan kamera tidak terhalang." />
            </p>
          </motion.div>
        )}

        {/* Tombol scan */}
        {stage === "ready" && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleScan}
            className="w-64 h-14 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow"
          >
            <ScanFace className="w-5 h-5" />
            <LiveText as="span" id="verify-btn-text" defaultText="Mulai Verifikasi Wajah" />
          </motion.button>
        )}

        {/* Processing state */}
        {stage === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 eyebrow text-primary/80"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Menganalisis data biometrik…
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 eyebrow text-muted-foreground/50">
          <ShieldCheck className="w-3 h-3" />
          <LiveText as="span" id="verify-footer-text" defaultText="Data biometrik tidak disimpan di server · KUBOYAKO" />
        </div>
      </div>
    </div>
  );
}
