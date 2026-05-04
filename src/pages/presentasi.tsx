import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Home,
  Volume2,
  VolumeX,
  Music2,
  Maximize,
  Minimize,
  Monitor,
  Settings,
  Info,
  Command,
  Keyboard,
  HelpCircle,
  Zap,
  X,
  Loader2,
  Grid,
  LayoutGrid,
  Sparkles,
  Terminal,
  Activity,
  Search,
  MousePointer2,
  Mic,
  MicOff,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react";
import { ALL_SLIDES } from "./presentasi-slides";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { LiveText } from "@/components/ui/live-text";

// Import cinematic loading video
import loadingVideo from "../assets/video.mp4";

const SLIDE_DURATION = 12000;

interface Slide {
  id: number;
  kategori: string;
  judul: string;
  subjudul?: string;
  konten: React.ReactNode;
}

/* ── Category Theme Mapping ─────────────────────────── */
const CATEGORY_THEMES: Record<string, string> = {
  PEMBUKA: "hsl(22 100% 52%)",
  POLDA: "hsl(210 100% 52%)",
  CEK: "hsl(180 100% 45%)",
  ADMIN: "hsl(270 100% 60%)",
  DATA: "hsl(42 100% 58%)",
  PENUTUP: "hsl(22 100% 52%)",
  DANGER: "hsl(0 82% 58%)",
};

function getCategoryColor(cat: string) {
  const upper = cat.toUpperCase();
  for (const k in CATEGORY_THEMES) {
    if (upper.includes(k)) return CATEGORY_THEMES[k];
  }
  return CATEGORY_THEMES["PEMBUKA"];
}

/* ─────────────────── VOICE NARRATION DATA ──────────────────── */
const SLIDE_NARRATIONS: string[] = [
  /* 1 */ "Selamat datang di Aplikasi ᨀᨘᨅᨚᨐᨀᨚ. Sistem Pencarian dan Arsip Barang Bukti Digital milik Subdit Jatanras, Direktorat Kriminal Umum, Polda Sulawesi Selatan. Dirancang oleh Irzal Makkarawah S.H., Panit Katim ANGGOTA POLRI, tahun 2026.",
  /* 2 */ "Ini adalah Menu Utama aplikasi. Terdapat dua mode akses. Mode A untuk Admin dan Internal Polri, yang dapat menginput data barang bukti, melakukan scan Laporan Polisi, dan mengelola arsip. Mode B untuk User Umum, yang dapat mengecek status kendaraan dan HP secara mandiri serta melaporkan temuan barang bukti.",
  /* 3 */ "Halaman Login Admin, atau Mode A. Petugas SPKT dan anggota Polri memasukkan NRP dan password untuk verifikasi. Akses ini khusus untuk operator internal Subdit Jatanras, Direktorat Kriminal Umum, Polda Sulawesi Selatan.",
  /* 4 */ "Setelah login, Admin masuk ke Dashboard. Di sini terlihat statistik barang bukti: 4 mobil, 3 motor, dan 5 HP yang telah diarsipkan. Tersedia tiga fitur utama: A.1 Input Manual dengan formulir digital, A.2 Scan LP Otomatis menggunakan AI Vision dan OCR, serta A.3 Status Penginputan untuk riwayat dan arsip lengkap.",
  /* 5 */ "Fitur A.1, Input Manual. Admin memilih jenis barang bukti yang akan diarsipkan. Ada tiga pilihan: Mobil untuk kendaraan roda empat, Motor untuk kendaraan roda dua, dan HP atau Elektronik untuk telepon seluler dengan data IMEI.",
  /* 6 */ "Proses input data mobil. Admin mengisi informasi Laporan Polisi termasuk Nomor LP, nama pelapor, dan lokasi TKP. Kemudian mengisi spesifikasi kendaraan seperti nomor polisi, merk, warna, dan nomor rangka. Setelah diverifikasi, data berhasil diarsipkan dan tersinkronisasi ke sistem APLIKASI DORS MILIK POLRI",
  /* 7 */ "Proses input data motor. Sama seperti mobil, admin mengisi data LP dan spesifikasi motor. Contoh yang ditampilkan adalah motor Honda Beat FI dengan plat DD 5678 CD, yang berhasil diarsipkan dan tersinkronisasi ke DORS.",
  /* 8 */ "Halaman Login Mode B untuk User. Terdapat dua sub-mode. B.1 untuk Anggota Polri yang login dengan NRP dan mendapat akses penuh untuk cek mobil, motor, HP, dan DATA LP. B.2 untuk User Umum yang bisa mengecek status  serta melaporkan temuan ke kepolisian.",
  /* 9 */ "Dashboard B.1 untuk Anggota Polri. Setelah login, anggota Polri dapat mengakses empat fitur: Cek Mobil, Cek Motor, Cek HP atau IMEI, dan melihat Data Asal Laporan Polisi. Contoh yang ditampilkan adalah Ipda Ahmad Fauzi S.I.K. dari ANGGOTA POLRI.",
  /* 10 */ "Form Cek Data Mobil untuk Anggota Polri. Masukkan Nomor Polisi atau Nomor Rangka kendaraan. Fitur ini cocok untuk cek cepat saat patroli atau penangkapan di lapangan. Sistem akan mencari dalam database ᨀᨘᨅᨚᨐᨀᨚ.",
  /* 11 */ "Hasil pencarian menampilkan dua kemungkinan. Status Aman berwarna hijau, artinya kendaraan tidak tercatat sebagai barang bukti. Status Merah atau Terdeteksi, artinya kendaraan terdaftar sebagai barang bukti dan sistem otomatis menampilkan detail data Laporan Polisi sumber.",
  /* 12 */ "Detail informasi admin dan kantor penerbit Laporan Polisi. Menampilkan data kendaraan yang terdeteksi, sumber LP dengan nomor LP, nama pelapor, satker penerbit, dan lokasi TKP. Termasuk informasi kantor penerbit LP yaitu SPKT POLDA SULSEL  di Jalan Ahmad Yani Nomor 9 dengan layanan SPKT 24 Jam.",
  /* 13 */ "Form Cek Data Motor untuk Anggota Polri. Input Nomor Polisi atau Nomor Rangka untuk verifikasi status motor dalam database ᨀᨘᨅᨚᨐᨀᨚ. Contoh yang ditampilkan adalah plat DD 5678 CD.",
  /* 14 */ "Hasil pencarian motor. Motor dengan plat DD 5678 CD terdeteksi sebagai barang bukti. Honda Beat FI warna merah putih, terkait dengan LP Nomor 456 tahun 2026 dari SPKT Polres Gowa.",
  /* 15 */ "Detail LP motor. Menampilkan data lengkap motor dan sumber Laporan Polisi. Pelapor Andi Rahmat, satker penerbit Polres Gowa, lokasi TKP di Jalan Poros Malino Gowa. Kantor penerbit LP berada di Polres Gowa, Jalan Malino KM 3 Sungguminasa.",
  /* 16 */ "Form Cek Data HP atau IMEI untuk Anggota Polri. Masukkan 15 digit nomor IMEI perangkat. Cara menemukan IMEI: dial bintang pagar 06 pagar, cek kotak HP, atau buka Pengaturan kemudian Tentang Perangkat.",
  /* 17 */ "Hasil pencarian HP. IMEI 358912345678901 terdeteksi sebagai barang bukti. Samsung Galaxy S23 warna Phantom Black, terkait LP Nomor 789 tahun 2026 dari SPKT POLDA SULSEL .",
  /* 18 */ "Detail LP HP. Menampilkan data lengkap HP termasuk IMEI 1 dan IMEI 2, merk, tipe, dan warna. Sumber LP dari Sri Wahyuni, lokasi TKP di Jalan Urip Sumoharjo Makassar. Kantor penerbit LP SPKT POLDA SULSEL .",
  /* 19 */ "Dashboard B.2 untuk User Umum. Layanan mandiri 24 jam . User dapat Cek Mobil, Cek Motor, Cek HP atau IMEI, dan Lapor jika menemukan barang bukti. Temuan dapat dilaporkan ke ANGGOTA POLRI atau Polsek terdekat.",
  /* 20 */ "Proses cek mobil oleh User Umum. Masukkan NO. POLISI / NO. RANGKA / NO. MESIN. Penting untuk cek sebelum membeli kendaraan bekas agar terhindar dari jerat hukum Pasal 591 UU 1/2023 KUHP tentang penadahan. Sistem tersinkronisasi dengan database aktif.",
  /* 21 */ "Hasil cek mobil oleh User Umum. Mobil DD 1234 AB terdeteksi sebagai Barang Bukti. User diarahkan untuk segera melapor: hubungi 110 hotline Kepolisian RI 24 jam, datangi Polsek atau Polres terdekat, atau hubungi ANGGOTA POLRI Unit penanganan kasus pencurian.",
  /* 22 */ "Proses cek motor oleh User Umum. Pastikan nomor plat sesuai STNK sebelum membeli motor bekas untuk meminimalisir tindak pidana penadahan.",
  /* 23 */ "Hasil cek motor oleh User Umum. Motor DD 5678 CD terdeteksi sebagai Barang Bukti terkait LP Nomor 456 tahun 2026 dari Polres Gowa. User diarahkan untuk segera melapor ke kepolisian terdekat.",
  /* 24 */ "Proses cek HP atau IMEI oleh User Umum. Cek IMEI sebelum membeli HP bekas. User bisa berpartisipasi melaporkan HP curian kepada pihak kepolisian.",
  /* 25 */ "Hasil cek HP oleh User Umum. Samsung Galaxy S23 terdeteksi sebagai Barang Bukti. User diarahkan untuk menghubungi 110, mendatangi Polsek terdekat, atau menghubungi ANGGOTA POLRI.",
  /* 26 */ "Tampilan Profil Pengguna. Menampilkan informasi lengkap admin yang sedang login: Irzal Makkarawah S.H., NRP 71040012345678, Pangkat Ipda Penyidik, Satker ANGGOTA POLRI, menggunakan ᨀᨘᨅᨚᨐᨀᨚ versi 2026.1.",
  /* 27 */ "Tampilan Notifikasi Sistem. Menampilkan tiga jenis notifikasi: peringatan motor terdeteksi sebagai barang bukti, konfirmasi data berhasil diarsipkan dan sinkron DORS, serta informasi laporan user baru yang masuk.",
  /* 28 */ "Halaman Bantuan dan FAQ. Berisi lima pertanyaan umum: penjelasan ᨀᨘᨅᨚᨐᨀᨚ berasal dari bahasa Makassar Boya yang berarti Cari, siapa yang bisa menggunakan aplikasi, arti jika IMEI tidak ditemukan, langkah jika terdeteksi, dan konfirmasi bahwa data bersifat realtime tersinkronisasi dengan APLIKASI DORS MILIK POLRI",
  /* 29 */ "Halaman penutup. Tentang Aplikasi dan Kredit. ᨀᨘᨅᨚᨐᨀᨚ versi 2026, Sistem Pencarian dan Arsip Barang Bukti. Dibuat oleh Irzal Makkarawah S.H., Subdit Jatanras Direktorat Kriminal Umum ANGGOTA POLRI. Terintegrasi sistem DORS, rencana integrasi E-MP Bareskrim Polri, berbasis Android, user-friendly, dan real-time. Terima kasih telah menyaksikan presentasi ini.",
];

/* ── TTS Voice Narration Engine ─────────────────────── */
function getPreferredVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  // Priority: Indonesian female > Indonesian any > any female > default
  const idFemale = voices.find(
    (v) => v.lang.startsWith("id") && v.name.toLowerCase().includes("female"),
  );
  if (idFemale) return idFemale;
  const idAny = voices.find((v) => v.lang.startsWith("id"));
  if (idAny) return idAny;
  const anyFemale = voices.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("zira") ||
      v.name.toLowerCase().includes("samantha") ||
      (v.name.toLowerCase().includes("google") && v.lang.startsWith("id")),
  );
  if (anyFemale) return anyFemale;
  // Fallback to first available
  return voices[0] || null;
}

function speakNarration(
  text: string,
  onEnd?: () => void,
): SpeechSynthesisUtterance {
  speechSynthesis.cancel(); // stop any current speech
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  utter.rate = 0.92;
  utter.pitch = 1.15; // slightly higher for feminine tone
  utter.volume = 1;
  const voice = getPreferredVoice();
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  speechSynthesis.speak(utter);
  return utter;
}

function getAudioCtx(ref: React.MutableRefObject<AudioContext | null>) {
  if (!ref.current) {
    ref.current = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }
  if (ref.current.state === "suspended") ref.current.resume();
  return ref.current;
}

function playSlideSound(ctx: AudioContext, dir: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "triangle";
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(dir > 0 ? 520 : 420, t);
  osc.frequency.exponentialRampToValueAtTime(dir > 0 ? 780 : 310, t + 0.15);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.start(t);
  osc.stop(t + 0.4);
}

function startAmbient(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 3);

  const freqs = [55, 82.41, 110, 130.81, 164.81];
  const oscs: OscillatorNode[] = [];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.value = 0.15 / (i + 1);

    lfo.frequency.value = 0.05 + i * 0.02;
    lfoG.gain.value = 0.03;
    lfo.connect(lfoG);
    lfoG.connect(g.gain);
    lfo.start();

    osc.connect(g);
    g.connect(master);
    osc.start();
    oscs.push(osc, lfo);
  });

  return () => {
    try {
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      setTimeout(
        () =>
          oscs.forEach((o) => {
            try {
              o.stop();
            } catch { }
          }),
        2500,
      );
    } catch { }
  };
}

/* ─────────────────── PARTICLE SYSTEM ─────────────────── */
const ParticleBackground = ({ color }: { color: string }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * -20,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 md:opacity-30">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: color,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */

const slides: Slide[] = ALL_SLIDES;

export default function Presentasi() {
  const [searchParams] = useSearchParams();
  const isHpMode = searchParams.get("mode") === "hp";
  const { isEditMode, toggleEditMode, setEditMode } = useLiveEditStore();

  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const [muted, setMuted] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(!isHpMode);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [simQuery, setSimQuery] = useState("");
  const [simResult, setSimResult] = useState<"none" | "found" | "notfound">(
    "none",
  );
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [narrationOn, setNarrationOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Admin password protection states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_PASSWORD = "8686resmob";

  const audioCtxRef = useRef<AudioContext | null>(null);
  const stopAmbientRef = useRef<(() => void) | null>(null);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Auto Scale Mobile Frame ─────────────────────── */
  useEffect(() => {
    if (!isTheaterMode) {
      const handleResize = () => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        // Fixed frame dimensions (iPhone 14 Pro)
        const FRAME_WIDTH = 390;
        const FRAME_HEIGHT = 844;

        // Do NOT scale on real mobile devices
        if (vw < 768) {
          setScale(1);
          return;
        }

        // Calculate available space with padding
        const paddingX = 60;
        const paddingY = 40;
        const availableWidth = vw - paddingX * 2;
        const availableHeight = vh - paddingY * 2;

        // Calculate scale to fit frame in available space
        const scaleX = availableWidth / FRAME_WIDTH;
        const scaleY = availableHeight / FRAME_HEIGHT;

        // Use the smaller scale to ensure frame fits entirely
        let newScale = Math.min(scaleX, scaleY, 1);

        // Clamp to reasonable bounds - allow smaller scale for very small viewports
        newScale = Math.max(0.3, Math.min(newScale, 1));

        setScale(newScale);
      };

      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    } else {
      setScale(1);
    }
  }, [isTheaterMode]);

  /* ── Audio Control ───────────────────────────────── */
  const initAudio = useCallback(() => {
    if (soundReady) return;
    const ctx = getAudioCtx(audioCtxRef);
    setSoundReady(true);
    if (!muted) {
      stopAmbientRef.current = startAmbient(ctx);
    }
  }, [soundReady, muted]);

  const handleToggleMute = useCallback(() => {
    const ctx = getAudioCtx(audioCtxRef);
    if (!soundReady) {
      setSoundReady(true);
      if (muted) stopAmbientRef.current = startAmbient(ctx);
      setMuted(false);
      return;
    }

    setMuted((prev) => {
      const next = !prev;
      if (next) {
        stopAmbientRef.current?.();
        stopAmbientRef.current = null;
      } else {
        stopAmbientRef.current = startAmbient(ctx);
      }
      return next;
    });
  }, [muted, soundReady]);

  /* ── Navigation ──────────────────────────────────── */
  const goTo = useCallback(
    (index: number, dir: number) => {
      initAudio();
      if (!muted && audioCtxRef.current) {
        playSlideSound(audioCtxRef.current, dir);
      }
      setDirection(dir);
      setCurrent(index);
      setSlideProgress(0);
      setShowGrid(false);
      setSimQuery("");
      setSimResult("none");
    },
    [muted, initAudio],
  );

  const goNext = useCallback(() => {
    if (current < slides.length - 1) {
      goTo(current + 1, 1);
    } else {
      setAutoPlay(false);
    }
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1, -1);
  }, [current, goTo]);

  /* ── Keyboard Support ────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((showHelp || showGrid) && e.key !== "Escape") return;

      // If typing in simulation input, don't trigger shortcuts
      if (document.activeElement?.tagName === "INPUT") {
        if (e.key === "Escape")
          (document.activeElement as HTMLInputElement).blur();
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          goPrev();
          break;
        case " ":
          e.preventDefault();
          setAutoPlay((prev) => !prev);
          break;
        case "f":
        case "F":
          setIsTheaterMode((prev) => !prev);
          break;
        case "m":
        case "M":
          handleToggleMute();
          break;
        case "h":
        case "H":
        case "?":
          setShowHelp((prev) => !prev);
          break;
        case "g":
        case "G":
          setShowGrid((prev) => !prev);
          break;
        case "n":
        case "N":
          setNarrationOn((prev) => {
            if (!prev) {
              // turning on — speak current slide immediately
              const text = SLIDE_NARRATIONS[current];
              if (text) {
                setIsSpeaking(true);
                speakNarration(text, () => setIsSpeaking(false));
              }
            } else {
              speechSynthesis.cancel();
              setIsSpeaking(false);
            }
            return !prev;
          });
          break;
        case "Escape":
          if (showHelp) setShowHelp(false);
          else if (showGrid) setShowGrid(false);
          else if (showPasswordModal) setShowPasswordModal(false);
          else setIsTheaterMode(false);
          break;
        case "l":
        case "L":
          if (!isAdminAuthenticated) {
            setShowPasswordModal(true);
            setPasswordInput("");
            setPasswordError(false);
          } else {
            toggleEditMode();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, handleToggleMute, showHelp, showGrid, showPasswordModal, isAdminAuthenticated, toggleEditMode]);

  const autoPlayRef = useRef(autoPlay);
  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  // Estimate narration duration for the progress bar
  const estimatedDurationRef = useRef(SLIDE_DURATION);
  useEffect(() => {
    if (narrationOn && soundReady) {
      const text = SLIDE_NARRATIONS[current] || "";
      const wordCount = text.split(/\s+/).length;
      // ~150 wpm -> ~400ms per word + 2000ms buffer for pauses
      estimatedDurationRef.current = Math.max(
        SLIDE_DURATION,
        wordCount * 400 + 2000,
      );
    } else {
      estimatedDurationRef.current = SLIDE_DURATION;
    }
  }, [current, narrationOn, soundReady]);

  /* ── AutoPlay ────────────────────────────────────── */
  const isGlobalEditMode = useLiveEditStore(s => s.isEditMode);

  useEffect(() => {
    if (!autoPlay || isGlobalEditMode) {
      setSlideProgress(0);
      return;
    }
    const start = Date.now();
    const interval = 100;
    let nextTriggered = false;

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const duration = estimatedDurationRef.current;
      const p = Math.min((elapsed / duration) * 100, 100);

      setSlideProgress(p);

      if (p >= 100 && !nextTriggered) {
        // Jika narasi mati atau tidak ada teks, gunakan durasi standar
        if (!narrationOn || !soundReady || !SLIDE_NARRATIONS[current]) {
          nextTriggered = true;
          goNext();
        }
        // Jika narasi aktif, biarkan callback onEnd dari speakNarration yang memanggil goNext()
      }
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, current, goNext, narrationOn, soundReady, isGlobalEditMode]);

  /* ── HUD Logic ────────────────────────────── */
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    setShowControls(true);
    if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
    controlTimeoutRef.current = setTimeout(() => {
      if (autoPlay && !showHelp && !showGrid) setShowControls(false);
    }, 3000);
  };

  /* ── Auto-Narrate on Slide Change ──────────────── */
  useEffect(() => {
    if (!narrationOn || !soundReady || isGlobalEditMode) {
      if (isGlobalEditMode) speechSynthesis.cancel();
      return;
    }
    const text = SLIDE_NARRATIONS[current];
    if (!text) return;

    let isFinished = false;
    // Delay kecil agar transisi visual selesai sebelum suara mulai
    const timer = setTimeout(() => {
      setIsSpeaking(true);
      speakNarration(text, () => {
        setIsSpeaking(false);
        isFinished = true;
        if (autoPlayRef.current && !isGlobalEditMode) {
          // Jeda sebentar setelah bicara selesai sebelum lanjut ke slide berikutnya
          setTimeout(() => {
            goNext();
          }, 800);
        }
      });
    }, 600);

    return () => {
      clearTimeout(timer);
      if (!isFinished) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [current, narrationOn, soundReady, goNext, isGlobalEditMode]);

  // Preload voices
  useEffect(() => {
    speechSynthesis.getVoices();
    const onVoicesChanged = () => speechSynthesis.getVoices();
    speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
  }, []);

  useEffect(() => {
    return () => {
      if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
      stopAmbientRef.current?.();
      speechSynthesis.cancel();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        try {
          audioCtxRef.current.close();
        } catch (e) {
          console.warn("Error closing AudioContext:", e);
        }
      }
    };
  }, []);

  const slide = slides[current];
  const overallProgress = ((current + 1) / slides.length) * 100;
  const themeColor = getCategoryColor(slide.kategori);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.9,
      filter: "blur(20px)",
    }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.9,
      filter: "blur(20px)",
    }),
  };

  /* ── Simulation Logic ─────────────────────────────── */
  const isSearchSlide = slide.id === 18 || slide.id === 22;
  const handleSimSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simQuery) return;
    setSimResult("none");
    setTimeout(() => {
      // Simulation: Found if query contains '123', otherwise not found
      setSimResult(simQuery.includes("123") ? "found" : "notfound");
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 bg-neutral-950 flex items-center justify-center overflow-hidden font-sans selection:bg-primary/30"
      onMouseMove={handleMouseMove}
      style={{
        cursor: (isEditMode || showControls || showHelp || showGrid) ? "default" : "none",
      }}
    >
      <ParticleBackground color={themeColor} />

      {/* Adaptive Mouse Glow */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.15,
              x: mousePos.x - 200,
              y: mousePos.y - 200,
            }}
            exit={{ opacity: 0 }}
            className="fixed w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none z-0"
            style={{ backgroundColor: themeColor }}
          />
        )}
      </AnimatePresence>

      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ backgroundColor: themeColor }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] opacity-10 blur-[140px] rounded-full animate-pulse"
        />
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-accent/5 blur-[120px] rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Cinematic Container Wrapper with Scale */}
      <div
        className={`relative z-10 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isTheaterMode ? "w-full h-full overflow-hidden" : "w-full h-full overflow-visible"}`}
        style={{ transform: isTheaterMode ? "none" : `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`relative bg-background transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden ${isTheaterMode
              ? "w-full h-full rounded-none shadow-[0_0_120px_rgba(0,0,0,0.9)]"
              : "presentation-phone-mode w-[390px] h-[844px] max-w-[100vw] max-h-[100vh] rounded-[3rem] border-[14px] border-[hsl(24_30%_8%)] shadow-[0_60px_140px_-30px_hsl(20_100%_4%/0.9),0_0_0_1px_hsl(30_20%_96%/0.07),inset_0_0_20px_rgba(255,255,255,0.05)]"
            }`}
        >
          {!isTheaterMode && (
            <>
              {/* Status Bar - iPhone Style */}
              <div className="absolute top-0 left-0 right-0 h-12 items-center justify-between px-7 z-[60] text-[11px] font-semibold text-white/90 pointer-events-none">
                <span className="tracking-wide">
                  <LiveText as="span" id="pres-frame-clock" defaultText="9:41" />
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-[2px] items-end h-3">
                    <div className="w-[3px] h-[4px] bg-white/50 rounded-[1px]" />
                    <div className="w-[3px] h-[6px] bg-white/70 rounded-[1px]" />
                    <div className="w-[3px] h-[8px] bg-white rounded-[1px]" />
                    <div className="w-[3px] h-[10px] bg-white rounded-[1px]" />
                  </div>
                  <span className="ml-1 text-[10px]">
                    <LiveText as="span" id="pres-frame-network" defaultText="5G" />
                  </span>
                  <div className="w-6 h-[11px] border border-white/50 rounded-[3px] relative ml-1 flex items-center px-[2px]">
                    <div className="h-[7px] bg-white rounded-[1px] w-[75%]" />
                    <div className="absolute -right-[3px] w-[2px] h-[4px] bg-white/60 rounded-r-[1px]" />
                  </div>
                </div>
              </div>

              {/* Dynamic Island */}
              <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[85px] h-[26px] bg-black rounded-full z-[60] items-center justify-center overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="w-[9px] h-[9px] rounded-full bg-[#1a1a1a] ml-auto mr-3 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#0a0a0a]" />
                  <div className="absolute top-[2px] left-[2px] w-[3px] h-[3px] rounded-full bg-[#1a3a5c]/60" />
                </div>
              </div>

              {/* Physical Buttons */}
              <div className="absolute top-[100px] -left-[15px] w-[3px] h-[26px] bg-[hsl(24_25%_12%)] rounded-r-[2px] z-[60]" />
              <div className="absolute top-[140px] -left-[15px] w-[3px] h-[45px] bg-[hsl(24_25%_12%)] rounded-r-[2px] z-[60]" />
              <div className="absolute top-[200px] -left-[15px] w-[3px] h-[45px] bg-[hsl(24_25%_12%)] rounded-r-[2px] z-[60]" />
              <div className="absolute top-[130px] -right-[15px] w-[3px] h-[65px] bg-[hsl(24_25%_12%)] rounded-l-[2px] z-[60]" />

              {/* Home Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/30 rounded-full z-[60]" />

              {/* Screen Reflection */}
              <div className="absolute inset-0 z-[55] pointer-events-none overflow-hidden rounded-[2.4rem]">
                <div className="absolute -top-[100%] -left-[50%] w-[200%] h-[100%] bg-gradient-to-br from-white/[0.03] via-transparent to-transparent rotate-12" />
              </div>
            </>
          )}
          {/* Reflection Effect */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-20">
            <div className="absolute -top-[50%] -left-[20%] w-[140%] h-[50%] bg-gradient-to-b from-white/10 to-transparent rotate-12" />
          </div>

          {/* Slide Content */}
          <div
            className={`flex-1 relative overflow-hidden bg-black/20 ${isTheaterMode ? "presentasi-wide" : "presentasi-mobile"}`}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={slide.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 120, damping: 22 },
                  opacity: { duration: 0.8 },
                  scale: { duration: 0.8 },
                  filter: { duration: 0.8 },
                }}
                className={`absolute inset-0 flex flex-col presentasi-content ${isTheaterMode ? "presentasi-wide" : ""}`}
                style={{ height: '100%', width: '100%' }}
              >
                {slide.konten}

                {/* Simulation Overlay for Search Slides */}
                {isSearchSlide && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center p-12 bg-black/40 backdrop-blur-sm"
                  >
                    <div className="w-full max-w-md surface-elevated rounded-[3rem] p-10 border border-white/10 shadow-2xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                          <Search className="w-6 h-6" />
                        </div>
                        <h4 className="display-font text-2xl">
                          <LiveText id="pres-sim-title" defaultText="Live Simulation" />
                        </h4>
                      </div>

                      <form onSubmit={handleSimSearch} className="space-y-6">
                        <div className="relative group">
                          <input
                            type="text"
                            placeholder={
                              slide.id === 18
                                ? "Masukkan Plat Nomor..."
                                : "Masukkan IMEI HP..."
                            }
                            value={simQuery}
                            onChange={(e) => setSimQuery(e.target.value)}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-primary transition-colors">
                            <Activity className="w-6 h-6 animate-pulse" />
                          </div>
                        </div>
                        <button className="w-full h-16 gradient-primary rounded-2xl text-primary-foreground font-black text-lg shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all">
                          <LiveText id="pres-sim-btn" defaultText="CEK DATA SEKARANG" />
                        </button>
                      </form>

                      <AnimatePresence mode="wait">
                        {simResult === "found" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center gap-4"
                          >
                            <Zap className="w-8 h-8 text-destructive animate-bounce" />
                            <div className="text-left">
                              <p className="font-bold text-destructive">
                                <LiveText id="pres-sim-found-title" defaultText="DATA TERDETEKSI!" />
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <LiveText id="pres-sim-found-desc" defaultText="Barang bukti terdaftar di arsip DORS." />
                              </p>
                            </div>
                          </motion.div>
                        )}
                        {simResult === "notfound" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-4"
                          >
                            <Sparkles className="w-8 h-8 text-emerald-500" />
                            <div className="text-left">
                              <p className="font-bold text-emerald-500">
                                <LiveText id="pres-sim-safe-title" defaultText="STATUS AMAN" />
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <LiveText id="pres-sim-safe-desc" defaultText="Data tidak ditemukan dalam arsip." />
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cinematic Header Overlay removed for clean desktop look */}

          {/* Floating Control Bar */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 40, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 40, x: "-50%" }}
                className="absolute bottom-12 left-1/2 z-40 w-fit px-10 h-24 surface-glass rounded-[3rem] border border-white/10 flex items-center gap-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
              >
                <div className="flex items-center gap-2">
                  <Link to="/">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      title="Home (Esc)"
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-foreground/40 hover:text-foreground/80 transition-colors"
                    >
                      <Home className="w-6 h-6" />
                    </motion.button>
                  </Link>
                  <div className="w-px h-10 bg-white/5 mx-2" />

                  <motion.button
                    onClick={goPrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={current === 0}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-foreground/70 hover:text-primary transition-colors disabled:opacity-10"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>

                  <div className="relative group">
                    {/* Progress Ring */}
                    <svg className="absolute -inset-2.5 w-20 h-20 rotate-[-90deg] pointer-events-none">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke={themeColor}
                        strokeWidth="2.5"
                        fill="transparent"
                        strokeDasharray={213.6}
                        animate={{
                          strokeDashoffset:
                            213.6 - (213.6 * slideProgress) / 100,
                        }}
                        className="drop-shadow-[0_0_8px_currentColor]"
                      />
                    </svg>

                    <motion.button
                      onClick={() => setAutoPlay(!autoPlay)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ backgroundColor: themeColor }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl z-10 relative"
                    >
                      {autoPlay ? (
                        <Pause className="w-7 h-7 fill-current" />
                      ) : (
                        <Play className="w-7 h-7 fill-current ml-1" />
                      )}
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={goNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={current === slides.length - 1}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-foreground/70 hover:text-primary transition-colors disabled:opacity-10"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>
                </div>

                <div className="w-px h-10 bg-white/5" />

                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowGrid(true)}
                    whileHover={{ scale: 1.1 }}
                    title="Slide Grid (G)"
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-foreground/30 hover:text-foreground/80 hover:bg-white/5 transition-all"
                  >
                    <LayoutGrid className="w-6 h-6" />
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setNarrationOn((prev) => {
                        if (!prev) {
                          const text = SLIDE_NARRATIONS[current];
                          if (text) {
                            setIsSpeaking(true);
                            speakNarration(text, () => setIsSpeaking(false));
                          }
                        } else {
                          speechSynthesis.cancel();
                          setIsSpeaking(false);
                        }
                        return !prev;
                      });
                    }}
                    whileHover={{ scale: 1.1 }}
                    title="Voice Narration (N)"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${narrationOn ? "bg-white/5" : "text-foreground/30 hover:bg-white/5"}`}
                    style={{ color: narrationOn ? themeColor : undefined }}
                  >
                    {narrationOn ? (
                      <Mic
                        className={`w-6 h-6 ${isSpeaking ? "animate-pulse" : ""}`}
                      />
                    ) : (
                      <MicOff className="w-6 h-6" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleToggleMute}
                    whileHover={{ scale: 1.1 }}
                    title="Toggle Mute (M)"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${!muted && soundReady ? "bg-white/5" : "text-foreground/30 hover:bg-white/5"}`}
                    style={{
                      color: !muted && soundReady ? themeColor : undefined,
                    }}
                  >
                    {muted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : soundReady ? (
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    ) : (
                      <Music2 className="w-6 h-6" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                    whileHover={{ scale: 1.1 }}
                    title="Theater Mode (F)"
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isTheaterMode ? "bg-white/5" : "text-foreground/30 hover:bg-white/5"}`}
                    style={{ color: isTheaterMode ? themeColor : undefined }}
                  >
                    {isTheaterMode ? (
                      <Minimize className="w-6 h-6" />
                    ) : (
                      <Monitor className="w-6 h-6" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => setShowHelp(true)}
                    whileHover={{ scale: 1.1 }}
                    title="Shortcuts (H)"
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-foreground/30 hover:text-foreground/80 hover:bg-white/5 transition-all"
                  >
                    <HelpCircle className="w-6 h-6" />
                  </motion.button>

                  {/* Admin Live Edit Button */}
                  <motion.button
                    onClick={() => {
                      if (isAdminAuthenticated) {
                        toggleEditMode();
                      } else {
                        setShowPasswordModal(true);
                        setPasswordInput("");
                        setPasswordError(false);
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    title={isAdminAuthenticated ? (isEditMode ? "Exit Live Edit" : "Enter Live Edit") : "Admin Login (L)"}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isEditMode ? "bg-primary/20 text-primary" : isAdminAuthenticated ? "text-emerald-400 hover:bg-emerald-500/10" : "text-foreground/30 hover:text-foreground/80 hover:bg-white/5"}`}
                  >
                    {isAdminAuthenticated ? (
                      isEditMode ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />
                    ) : (
                      <Settings className="w-6 h-6" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full-width Bottom Progress Bar with Slide Counter */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/5 z-50 group flex items-end">
            <motion.div
              className="h-full background-animate"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 25px ${themeColor}`,
              }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ type: "spring", stiffness: 35, damping: 20 }}
            />
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-6 bottom-4 flex items-center gap-2 pointer-events-none"
                >
                  <span className="font-mono text-xs text-white/40 tracking-tighter">
                    <LiveText id="pres-footer-node" defaultText="NODE" />
                  </span>
                  <span className="display-font text-xl text-white/80">
                    <LiveText
                      as="span"
                      id="pres-footer-current"
                      defaultText={String(current + 1).padStart(2, "0")}
                    />
                  </span>
                  <span className="text-white/20 text-xs">
                    <LiveText as="span" id="pres-footer-slash" defaultText="/" />
                  </span>
                  <span className="text-white/30 text-sm font-bold">
                    <LiveText
                      as="span"
                      id="pres-footer-total"
                      defaultText={String(slides.length)}
                    />
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Immersive Audio/Video Initialization Prompt */}
          <AnimatePresence>
            {!soundReady && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.15, filter: "blur(30px)" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-[100] bg-neutral-950 flex flex-col items-center justify-center text-center overflow-hidden"
              >
                {/* Background Loading Video */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: videoLoaded ? 0.35 : 0 }}
                  className="absolute inset-0 z-0"
                >
                  <video
                    ref={videoRef}
                    src={loadingVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => setVideoLoaded(true)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
                </motion.div>

                <div className="relative z-10 p-8 flex flex-col items-center max-w-4xl">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, ease: "backOut" }}
                    className="w-40 h-40 md:w-64 md:h-64 rounded-[3.5rem] md:rounded-[5rem] gradient-primary flex items-center justify-center mb-12 md:mb-20 shadow-[0_0_80px_hsl(var(--primary)/0.5)] relative group"
                  >
                    <Zap className="w-16 h-16 md:w-32 md:h-32 text-primary-foreground fill-current z-10" />
                    <motion.div
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 rounded-[3.5rem] bg-primary"
                    />
                    <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                  </motion.div>

                  {!videoLoaded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 text-primary mb-8 px-6 py-2 rounded-full bg-primary/5 border border-primary/10"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="eyebrow text-[10px] tracking-[0.3em] font-black">
                        <LiveText id="pres-sync-loading" defaultText="Syncing 29 Presentation Nodes..." />
                      </span>
                    </motion.div>
                  )}

                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="display-font text-6xl md:text-9xl lg:text-[12rem] text-white mb-8 md:mb-12 tracking-tighter leading-[0.85]"
                  >
                    <LiveText as="span" id="pres-hero-brand" className="text-gradient italic" defaultText="ᨀᨘᨅᨚᨐᨀᨚ" />
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-white/40 text-2xl md:text-4xl max-w-[35ch] mb-16 md:mb-24 leading-relaxed font-extralight italic"
                  >
                    <LiveText
                      as="span"
                      id="pres-hero-tagline"
                      defaultText='"Satu Sentuhan untuk Keamanan yang Luar Biasa."'
                    />
                  </motion.p>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -8,
                      boxShadow: "0 40px 80px rgba(255,255,255,0.4)",
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={initAudio}
                    className="px-20 md:px-32 h-24 md:h-32 rounded-[2.5rem] md:rounded-[4rem] bg-white text-black font-black text-2xl md:text-4xl shadow-[0_20px_50px_rgba(255,255,255,0.15)] transition-all flex items-center gap-6 md:gap-10 group"
                  >
                    <LiveText as="span" id="pres-hero-cta" defaultText="Mulai Pengalaman" />
                    <ChevronRight className="w-8 h-8 md:w-12 md:h-12 group-hover:translate-x-3 transition-transform" />
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-24 md:mt-32 flex flex-wrap justify-center gap-12 md:gap-20 text-white/20 eyebrow text-[10px] md:text-sm tracking-[0.4em] font-bold"
                  >
                    <div className="flex items-center gap-3 md:gap-5 hover:text-primary transition-colors cursor-default">
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6" />{" "}
                      <span>
                        <LiveText as="span" id="pres-hero-badge-1" defaultText="ULTRA FIDELITY" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5 hover:text-primary transition-colors cursor-default">
                      <Music2 className="w-4 h-4 md:w-6 md:h-6" />{" "}
                      <span>
                        <LiveText as="span" id="pres-hero-badge-2" defaultText="DOLBY AMBIENT" />
                      </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5 hover:text-primary transition-colors cursor-default">
                      <Monitor className="w-4 h-4 md:w-6 md:h-6" />{" "}
                      <span>
                        <LiveText as="span" id="pres-hero-badge-3" defaultText="4K THEATER READY" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide Grid Overview Modal */}
          <AnimatePresence>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[120] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-12"
                onClick={() => setShowGrid(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 30 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 30 }}
                  className="w-full h-full max-w-7xl flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                        <Grid className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="display-font text-4xl">
                          <LiveText as="span" id="pres-grid-title" defaultText="Slide Navigator" />
                        </h3>
                        <p className="eyebrow text-xs tracking-[0.3em] mt-1 opacity-40">
                          <LiveText as="span" id="pres-grid-subtitle" defaultText="29 NODES DETECTED · SELECT TO JUMP" />
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowGrid(false)}
                      className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-12">
                    {slides.map((s, idx) => (
                      <motion.button
                        key={s.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goTo(idx, idx > current ? 1 : -1)}
                        className={`relative aspect-video rounded-3xl overflow-hidden border-2 transition-all duration-300 group ${idx === current
                            ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.3)] ring-4 ring-primary/10"
                            : "border-white/5 hover:border-white/20 bg-white/5"
                          }`}
                      >
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center p-4">
                          <div className="scale-[0.25] origin-center opacity-30 group-hover:opacity-60 transition-opacity">
                            {s.konten}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-5 text-left">
                          <p
                            className="text-[10px] font-black tracking-tighter"
                            style={{ color: getCategoryColor(s.kategori) }}
                          >
                            <LiveText as="span" id={`pres-grid-cat-${s.id}`} defaultText={s.kategori} />
                          </p>
                          <p className="text-[11px] font-bold text-white/80 line-clamp-1">
                            <LiveText as="span" id={`pres-grid-judul-${s.id}`} defaultText={s.judul} />
                          </p>
                        </div>
                        <div className="absolute top-4 right-5 font-mono text-xl text-white/10 font-black">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>



          {/* Shortcuts Modal */}
          <AnimatePresence>
            {showHelp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[110] bg-black/70 backdrop-blur-2xl flex items-center justify-center p-6"
                onClick={() => setShowHelp(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-xl surface-elevated rounded-[3.5rem] p-12 border border-white/10 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-[1.25rem] bg-primary/20 flex items-center justify-center text-primary">
                        <Keyboard className="w-7 h-7" />
                      </div>
                      <h3 className="display-font text-3xl">
                        <LiveText as="span" id="pres-help-title" defaultText="Professional Controls" />
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowHelp(false)}
                      className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors"
                    >
                      <X className="w-7 h-7" />
                    </button>
                  </div>

                  <div className="grid gap-7">
                    {[
                      { key: "← / →", label: "Navigasi Slide" },
                      { key: "Space", label: "Play / Pause Presentation" },
                      { key: "G Key", label: "Open Slide Navigator (Grid)" },
                      { key: "F Key", label: "Toggle Full-screen Theater" },
                      { key: "M Key", label: "Ambient Audio Control" },
                      { key: "N Key", label: "Voice Narration (Suara Wanita)" },
                      { key: "L Key", label: "Admin Login / Live Edit" },
                      { key: "H Key", label: "Help & Shortcuts Dashboard" },
                      { key: "Esc", label: "Close Modal / Exit Theater" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between group"
                      >
                        <span className="text-foreground/70 font-semibold text-lg">
                          <LiveText as="span" id={`pres-help-row-${i}-label`} defaultText={item.label} />
                        </span>
                        <kbd className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 font-mono text-base text-primary group-hover:border-primary/40 transition-colors shadow-inner">
                          <LiveText as="span" id={`pres-help-row-${i}-key`} defaultText={item.key} />
                        </kbd>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowHelp(false)}
                    className="w-full h-20 rounded-[1.5rem] bg-white text-black font-black text-xl mt-12 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all"
                  >
                    <LiveText as="span" id="pres-help-dismiss" defaultText="Got it, Cap!" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Admin Password Modal */}
          <AnimatePresence>
            {showPasswordModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[120] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
                onClick={() => setShowPasswordModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-md surface-elevated rounded-[2.5rem] p-10 border border-white/10 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="display-font text-xl">
                          <LiveText as="span" id="pres-admin-title" defaultText="Admin Access" />
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          <LiveText as="span" id="pres-admin-subtitle" defaultText="Enter password to enable live edit" />
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          setPasswordError(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (passwordInput === ADMIN_PASSWORD) {
                              setIsAdminAuthenticated(true);
                              setShowPasswordModal(false);
                              toggleEditMode();
                            } else {
                              setPasswordError(true);
                            }
                          }
                        }}
                        placeholder="Enter admin password..."
                        className={`w-full h-14 px-5 pr-12 rounded-2xl bg-white/5 border ${passwordError ? "border-destructive" : "border-white/10"} text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors font-mono text-lg tracking-wider`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {passwordError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive text-center"
                      >
                        <LiveText as="span" id="pres-admin-error" defaultText="Incorrect password. Please try again." />
                      </motion.p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (passwordInput === ADMIN_PASSWORD) {
                          setIsAdminAuthenticated(true);
                          setShowPasswordModal(false);
                          toggleEditMode();
                        } else {
                          setPasswordError(true);
                        }
                      }}
                      className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg shadow-glow"
                    >
                      <LiveText as="span" id="pres-admin-login" defaultText="Unlock Live Edit" />
                    </motion.button>

                    <p className="text-xs text-muted-foreground text-center">
                      <LiveText as="span" id="pres-admin-hint" defaultText="Press Enter to submit" />
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Edit Active Indicator */}
          <AnimatePresence>
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-6 left-6 z-[100] surface-elevated rounded-2xl px-5 py-3 border border-primary/30 bg-primary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold text-primary">
                    <LiveText as="span" id="pres-live-edit-indicator" defaultText="LIVE EDIT MODE" />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
