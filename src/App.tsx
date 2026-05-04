import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileFrame } from "@/components/layout/mobile-frame";
import { ResponsiveProvider } from "@/hooks/use-responsive";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward, Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

// Lazy-loaded pages
const Splash = lazy(() => import("@/pages/splash"));
const RoleSelect = lazy(() => import("@/pages/role-select"));
const Login = lazy(() => import("@/pages/login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AdminInput = lazy(() => import("@/pages/admin-input"));
const AdminScan = lazy(() => import("@/pages/admin-scan"));
const AdminRiwayat = lazy(() => import("@/pages/admin-riwayat"));
const AdminDetail = lazy(() => import("@/pages/admin-detail"));
const AdminAccounts = lazy(() => import("@/pages/admin-accounts"));
const AdminLogs = lazy(() => import("@/pages/admin-logs"));
const AdminTracking = lazy(() => import("@/pages/admin-tracking"));
const UserDashboard = lazy(() => import("@/pages/user-dashboard"));
const UserCek = lazy(() => import("@/pages/user-cek"));
const UserHasil = lazy(() => import("@/pages/user-hasil"));
const UserLapor = lazy(() => import("@/pages/user-lapor"));
const UserDaftar = lazy(() => import("@/pages/user-daftar"));
const UserVerifikasiWajah = lazy(() => import("@/pages/user-verifikasi-wajah"));
const Profile = lazy(() => import("@/pages/profile"));
const Notifications = lazy(() => import("@/pages/notifications"));
const HelpFaq = lazy(() => import("@/pages/help-faq"));
const About = lazy(() => import("@/pages/about"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Presentasi = lazy(() => import("@/pages/presentasi"));
const TestimoniPage = lazy(() => import("@/pages/testimoni"));
const AgentManager = lazy(() => import("@/pages/agent-manager"));
const AgentAutoFixPage = lazy(() => import("@/pages/agent-autofix"));
const FileManager = lazy(() => import("@/pages/file-manager"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy"));
const TermsConditions = lazy(() => import("@/pages/terms"));

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LiveEditToggle } from "@/components/ui/live-edit-toggle";
import { LiveToolbar } from "@/components/ui/live-toolbar";
import { LiveText } from "@/components/ui/live-text";
import openingVideo from "@/assets/video.mp4";
import loaderLogo from "@/assets/kuboyako-loader.png";

const queryClient = new QueryClient();

// High-performance loading fallback — BOYAKO logo fills with color as progress grows
const LoadingFallback = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : Math.min(100, p + 2)));
    }, 40);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#02050A] text-primary overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50" />
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full bg-primary/20 blur-[80px] transition-opacity duration-300"
          style={{ opacity: progress / 100 }}
        />
        {/* Grayscale base */}
        <img
          src={loaderLogo}
          alt="BOYAKO"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ filter: "grayscale(1) brightness(0.45) contrast(1.1) invert(0.85)" }}
        />
        {/* Colored overlay revealed by progress (bottom → top) */}
        <img
          src={loaderLogo}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain transition-[clip-path] duration-150 ease-out"
          style={{
            clipPath: `inset(${100 - progress}% 0 0 0)`,
            filter:
              "invert(56%) sepia(89%) saturate(1850%) hue-rotate(360deg) brightness(101%) contrast(101%) drop-shadow(0 0 18px hsl(var(--primary)/0.55))",
          }}
        />
      </div>
      <div className="mt-8 flex flex-col items-center gap-2 relative z-10">
        <p className="eyebrow tracking-[0.4em] text-primary/80">MEMUAT BOYAKO</p>
        <div className="w-48 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
          {Math.round(progress)}% — Sistem Sedang Dipersiapkan
        </p>
      </div>
    </div>
  );
};

// Opening Video Component
function OpeningVideo({ onComplete }: { onComplete: () => void }) {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const prog = (video.currentTime / video.duration) * 100;
      setProgress(prog);
    };

    const handleEnded = () => {
      setShowVideo(false);
      onComplete();
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", handleEnded);

    // Auto-play failsafe
    const playTimeout = setTimeout(() => {
      if (video.paused) {
        console.warn("Video failed to play in time, skipping...");
        handleSkip();
      }
    }, 4500);

    video.play().catch(() => {
      // If autoplay fails, skip video
      handleSkip();
    });

    return () => {
      clearTimeout(playTimeout);
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setShowVideo(false);
    onComplete();
  };

  return (
    <AnimatePresence>
      {showVideo && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Video container — fullscreen fluid (tanpa frame HP simulasi) */}
          <div className="relative w-full h-full overflow-hidden bg-black">
            {/* Status Bar (subtle, untuk semua ukuran) */}
            <div className="absolute top-0 left-0 right-0 h-10 hidden sm:flex items-center justify-between px-8 z-[60] text-[10px] font-bold text-white/80 pointer-events-none">
              <span>
                <LiveText as="span" id="app-opening-clock" defaultText="9:41" />
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5 items-end h-2">
                  <div className="w-0.5 h-[3px] bg-white/40" />
                  <div className="w-0.5 h-[5px] bg-white/40" />
                  <div className="w-0.5 h-[7px] bg-white" />
                  <div className="w-0.5 h-[9px] bg-white" />
                </div>
                <span>
                  <LiveText as="span" id="app-opening-network" defaultText="5G" />
                </span>
                <div className="w-5 h-2.5 border border-white/40 rounded-sm relative px-0.5 flex items-center">
                  <div className="h-full bg-white w-[80%]" />
                  <div className="absolute -right-1 w-0.5 h-1 bg-white/40 rounded-r-sm" />
                </div>
              </div>
            </div>

            <video
              ref={videoRef}
              src={openingVideo}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
              autoPlay
            />
          </div>

          {/* Gradient overlay for better visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={handleSkip}
            className="absolute bottom-12 right-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            <LiveText as="span" id="app-opening-skip" defaultText="Lewati" />
          </motion.button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Logo overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-12 left-6 z-10"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                <LiveText as="span" id="app-opening-brand-letter" className="text-primary font-bold text-lg" defaultText="K" />
              </div>
              <LiveText as="span" id="app-opening-brand-name" className="text-white font-semibold text-sm" defaultText="BOYAKO" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const isPresentasi = pathname.includes("presentasi");
  
  const [showOpening, setShowOpening] = useState(() => {
    return !sessionStorage.getItem("openingVideoShown");
  });

  const handleVideoComplete = () => {
    sessionStorage.setItem("openingVideoShown", "true");
    setShowOpening(false);
  };

  return (
    <>
      {!isPresentasi && (
        <>
          <Toaster />
          <Sonner />
        </>
      )}
      {showOpening && <OpeningVideo onComplete={handleVideoComplete} />}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Full-screen pages (Bypass MobileFrame) */}
          <Route path="/presentasi" element={<Presentasi />} />
          <Route
            path="/testimoni"
            element={
              <ErrorBoundary name="TestimoniPage">
                <TestimoniPage />
              </ErrorBoundary>
            }
          />
          <Route path="/agent-manager" element={<AgentManager />} />
          <Route path="/agent-autofix" element={<AgentAutoFixPage />} />
          <Route path="/file-manager" element={<FileManager />} />

          {/* Mobile-framed pages */}
          <Route
            path="*"
            element={
              <MobileFrame>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/role-select" element={<RoleSelect />} />
                    <Route path="/login/:type" element={<Login />} />

                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/input" element={<AdminInput />} />
                    <Route path="/admin/scan" element={<AdminScan />} />
                    <Route path="/admin/riwayat" element={<AdminRiwayat />} />
                    <Route path="/admin/detail/:id" element={<AdminDetail />} />
                    <Route path="/admin/accounts" element={<AdminAccounts />} />
                    <Route path="/admin/logs" element={<AdminLogs />} />
                    <Route path="/admin/tracking" element={<AdminTracking />} />

                    <Route path="/user" element={<UserDashboard />} />
                    <Route path="/user/cek/:type" element={<UserCek />} />
                    <Route path="/user/hasil/:type/:query" element={<UserHasil />} />
                    <Route path="/user/lapor" element={<UserLapor />} />
                    <Route path="/user/daftar" element={<UserDaftar />} />
                    <Route path="/user/verifikasi-wajah" element={<UserVerifikasiWajah />} />

                    <Route path="/profile" element={<Profile />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/help-faq" element={<HelpFaq />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </MobileFrame>
            }
          />
        </Routes>
      </Suspense>
      <LiveEditToggle />
      <LiveToolbar />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ResponsiveProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ResponsiveProvider>
  </QueryClientProvider>
);

export default App;
