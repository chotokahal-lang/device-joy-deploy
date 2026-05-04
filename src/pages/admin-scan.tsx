import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImagePlus, Loader2, Scan, RefreshCw, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

type ScanStage = "select" | "camera" | "preview" | "scanning" | "error" | "denied";

export default function AdminScan() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stage, setStage] = useState<ScanStage>("select");
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dots, setDots] = useState(0);

  /* ── Animasi titik loading ─────────────────── */
  useEffect(() => {
    if (stage !== "scanning") return;
    const t = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, [stage]);

  /* ── Mulai kamera ──────────────────────────── */
  const startCamera = useCallback(async () => {
    setStage("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Kamera belakang untuk dokumen
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setStage("denied");
      } else {
        setStage("error");
      }
    }
  }, []);

  /* ── Stop kamera ──────────────────────────── */
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  /* ── Capture foto ──────────────────────────── */
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);
    stopCamera();
    setStage("preview");
  };

  /* ── Pilih dari galeri ──────────────────────── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
      setStage("preview");
    };
    reader.readAsDataURL(file);
  };

  /* ── Mulai OCR scanning ────────────────────── */
  const startOCR = () => {
    setStage("scanning");
    setProgress(0);
    
    const start = performance.now();
    const DURATION = 3200;

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(Math.round(pct * 100));
      if (pct < 1) {
        requestAnimationFrame(tick);
      } else {
        // Mock OCR result injection
        const mockData = {
          noLp: `LP/B/10${Math.floor(Math.random() * 90) + 10}/V/2026/RES-MKS`,
          pelapor: "Budi Satrio",
          noPolisi: "DD 1234 XY",
          noRangka: "MHK1234567890",
          noMesin: "KAB1234567",
          merk: "Toyota",
          warna: "Hitam Metalik",
          tahun: "2024"
        };
        sessionStorage.setItem("kuboyako_ocr_result", JSON.stringify(mockData));
        
        setTimeout(() => navigate("/admin/input"), 700);
      }
    };
    requestAnimationFrame(tick);
  };

  /* ── Retry dari error ──────────────────────── */
  const handleRetry = () => {
    setStage("select");
    setCapturedImage(null);
  };

  /* ── Cleanup on unmount ───────────────────── */
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow={<LiveText as="span" id="scan-eyebrow" defaultText="AI Vision" />}
        title={<LiveText as="span" id="scan-title" defaultText="Scan Foto LP" />}
        subtitle={<LiveText as="span" id="scan-subtitle" defaultText="Ekstraksi otomatis data dari foto Laporan Polisi." />}
        back="/admin"
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative z-10">
        <AnimatePresence mode="wait">
          {/* STAGE: SELECT */}
          {stage === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center text-center w-full"
            >
              <Icon3D src={icons3d.scan} alt="Scanner" size="hero" tone="primary" float />

              <h2 className="display-font text-2xl text-foreground mt-10">
                <LiveText as="span" id="scan-select-title" defaultText="Pilih Sumber" />
              </h2>
              <p className="text-xs text-muted-foreground mt-2 max-w-[28ch]">
                <LiveText as="span" id="scan-select-desc" defaultText="Ambil foto langsung dengan kamera atau pilih dari galeri." />
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-[320px] mt-10">
                <SourceButton
                  onClick={startCamera}
                  icon={<Camera className="w-6 h-6" />}
                  label={<LiveText as="span" id="scan-btn-cam" defaultText="Kamera" />}
                  tone="primary"
                />
                <SourceButton
                  onClick={() => fileInputRef.current?.click()}
                  icon={<ImagePlus className="w-6 h-6" />}
                  label={<LiveText as="span" id="scan-btn-gal" defaultText="Galeri" />}
                  tone="accent"
                />
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </motion.div>
          )}

          {/* STAGE: CAMERA */}
          {stage === "camera" && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Camera Viewfinder */}
              <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-3xl overflow-hidden bg-black mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Document guide overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner guides */}
                  {[
                    { pos: "top-4 left-4", border: "border-t-4 border-l-4" },
                    { pos: "top-4 right-4", border: "border-t-4 border-r-4" },
                    { pos: "bottom-4 left-4", border: "border-b-4 border-l-4" },
                    { pos: "bottom-4 right-4", border: "border-b-4 border-r-4" },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`absolute w-12 h-12 ${c.pos} ${c.border} border-primary rounded-2xl`}
                    />
                  ))}
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/60 text-xs font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                      <LiveText as="span" id="admin-scan-guide-hint" defaultText="Posisikan dokumen di dalam bingkai" />
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    stopCamera();
                    setStage("select");
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Capture button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-primary/30 flex items-center justify-center bg-white shadow-lg"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </motion.button>
              <p className="text-xs text-muted-foreground mt-3"><LiveText as="span" id="scan-cam-hint" defaultText="Tap untuk memotret" /></p>
            </motion.div>
          )}

          {/* STAGE: PREVIEW */}
          {stage === "preview" && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center"
            >
              <h3 className="display-font text-xl text-foreground mb-4"><LiveText as="span" id="scan-preview-title" defaultText="Pratinjau Dokumen" /></h3>
              
              <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden surface-elevated mb-6">
                <img 
                  src={capturedImage} 
                  alt="Captured document" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-3 w-full max-w-[320px]">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setCapturedImage(null);
                    setStage("select");
                  }}
                  className="flex-1 h-12 rounded-2xl surface text-foreground font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <LiveText as="span" id="scan-preview-retry" defaultText="Ulangi" />
                </motion.button>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startOCR}
                  className="flex-1 h-12 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-glow"
                >
                  <Scan className="w-4 h-4" />
                  <LiveText as="span" id="scan-preview-process" defaultText="Proses OCR" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STAGE: SCANNING */}
          {stage === "scanning" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full flex flex-col items-center"
            >
              {/* Document preview with scan beam */}
              <div className="relative w-full max-w-[280px] aspect-[3/4] surface-elevated rounded-3xl overflow-hidden mb-8">
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Scanning document" 
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                
                {/* Scanning beam */}
                <motion.div
                  animate={{ top: ["4%", "92%", "4%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-3 right-3 h-[3px] bg-primary shadow-[0_0_20px_hsl(var(--primary))] z-20"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-primary/30 blur-2xl" />
                </motion.div>
                
                {/* Corner marks */}
                {[
                  "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
                  "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
                ].map((c) => (
                  <div key={c} className={`absolute w-6 h-6 border-accent/60 ${c}`} />
                ))}
              </div>

              <h3 className="display-font text-xl text-foreground"><LiveText as="span" id="scan-proc-title" defaultText={`Menganalisis dokumen${".".repeat(dots)}`} /></h3>
              <p className="text-xs text-muted-foreground mt-1.5 mb-6">
                <LiveText as="span" id="scan-proc-desc" defaultText="Neural OCR mengenali field LP" />
              </p>

              <div className="w-full max-w-[260px] space-y-2">
                <div className="flex justify-between eyebrow text-primary">
                  <span><LiveText as="span" id="scan-proc-prog" defaultText="Progress" /></span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE: ERROR */}
          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center px-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="display-font text-xl text-foreground mb-2">
                <LiveText as="span" id="scan-error-title" defaultText="Kamera Error" />
              </h2>
              <p className="text-sm text-muted-foreground max-w-[28ch] mb-6">
                <LiveText
                  as="span"
                  id="scan-error-desc"
                  defaultText="Tidak dapat mengakses kamera. Pastikan perangkat memiliki kamera aktif."
                />
              </p>
              <button
                onClick={handleRetry}
                className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center gap-2 shadow-glow"
              >
                <RefreshCw className="w-4 h-4" />
                <LiveText as="span" id="scan-error-retry" defaultText="Coba Lagi" />
              </button>
            </motion.div>
          )}

          {/* STAGE: DENIED */}
          {stage === "denied" && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center px-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-6">
                <Camera className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="display-font text-xl text-foreground mb-2">
                <LiveText as="span" id="scan-denied-title" defaultText="Izin Ditolak" />
              </h2>
              <p className="text-sm text-muted-foreground max-w-[28ch] mb-6">
                <LiveText
                  as="span"
                  id="scan-denied-desc"
                  defaultText="Izin kamera ditolak. Izinkan akses kamera di pengaturan browser."
                />
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => startCamera()}
                  className="h-12 px-8 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center gap-2 shadow-glow"
                >
                  <RefreshCw className="w-4 h-4" />
                  <LiveText as="span" id="scan-denied-retry" defaultText="Coba Lagi" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-8 rounded-2xl surface text-foreground font-semibold"
                >
                  <LiveText as="span" id="scan-denied-gallery" defaultText="Pilih dari Galeri" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      <footer className="px-6 pb-8 text-center">
        <div className="inline-flex items-center gap-2 eyebrow text-muted-foreground/60">
          {stage === "scanning" ? (
            <Loader2 className="w-3 h-3 animate-spin text-accent" />
          ) : (
            <Scan className="w-3 h-3 text-accent" />
          )}
          {stage === "scanning" ? (
            <>
              <LiveText as="span" id="scan-footer-scanning-base" defaultText="OCR Sedang Memindai" />
              <span className="tabular-nums">{".".repeat(dots)}</span>
            </>
          ) : stage === "camera" ? (
            <LiveText as="span" id="scan-footer-camera" defaultText="Kamera Aktif" />
          ) : (
            <LiveText as="span" id="scan-footer-ready" defaultText="Mesin OCR Siap" />
          )}
        </div>
      </footer>
    </div>
  );
}

function SourceButton({
  icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  tone: "primary" | "accent";
  onClick: () => void;
}) {
  const colors =
    tone === "primary"
      ? "bg-primary/15 text-primary border-primary/25"
      : "bg-accent/15 text-accent border-accent/30";
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="surface-elevated rounded-2xl p-5 flex flex-col items-center gap-3"
    >
      <span className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colors}`}>
        {icon}
      </span>
      <span className="text-xs font-bold uppercase tracking-wider text-foreground [&_*]:text-inherit">{label}</span>
    </motion.button>
  );
}
