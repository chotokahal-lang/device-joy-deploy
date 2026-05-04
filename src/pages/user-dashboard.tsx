import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Clock, ChevronRight, Search, Phone, AlertTriangle, Bell, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { getUnreadCount } from "./notifications";
import { LiveText } from "@/components/ui/live-text";
import { trackLocation } from "@/lib/store";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const role = localStorage.getItem("kuboyako_role") || "umum";
  const isPolri = role === "polri";
  const userNrp = localStorage.getItem("kuboyako_user_nrp") || (isPolri ? "Anggota Polri" : "Anonim (Masyarakat)");

  useEffect(() => {
    const r = localStorage.getItem("kuboyako_recent");
    if (r) setRecent(JSON.parse(r));
    setUnread(getUnreadCount(role));
  }, [role]);

  // Live Location Tracking
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const speed = position.coords.speed ? `${(position.coords.speed * 3.6).toFixed(1)} km/h` : "Mendeteksi...";
          const deviceName = /Android/i.test(navigator.userAgent) ? "Android Device" : /iPhone/i.test(navigator.userAgent) ? "iPhone" : "Desktop/Web";
          
          trackLocation(
            userNrp,
            role,
            position.coords.latitude,
            position.coords.longitude,
            "Sedang Aktif (Berpindah)",
            "Area Terdeteksi",
            speed,
            deviceName
          );
        },
        (error) => {
          console.warn("Geolocation tracking failed or denied:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [userNrp, role]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUnread(getUnreadCount(role));
    }, 3000);
    return () => clearInterval(interval);
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem("kuboyako_role");
    navigate("/role-select");
  };

  const menus = isPolri
    ? [
        { label: "Mobil", icon: icons3d.car, href: "/user/cek/mobil", tone: "primary" as const },
        { label: "Motor", icon: icons3d.motor, href: "/user/cek/motor", tone: "primary" as const },
        { label: "HP", icon: icons3d.phone, href: "/user/cek/hp", tone: "accent" as const },
        { label: "Data LP", icon: icons3d.form, href: "/user/cek/admin-lp", tone: "neutral" as const },
      ]
    : [
        { label: "Mobil", icon: icons3d.car, href: "/user/cek/mobil", tone: "primary" as const },
        { label: "Motor", icon: icons3d.motor, href: "/user/cek/motor", tone: "primary" as const },
        { label: "HP", icon: icons3d.phone, href: "/user/cek/hp", tone: "accent" as const },
      ];

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="user-dashboard-eyebrow" defaultText="Akses Publik" />}
        title={<LiveText as="span" id="user-dashboard-title" defaultText="Cek Status Unit" />}
        subtitle={<LiveText as="span" id="user-dashboard-subtitle" defaultText="Verifikasi keabsahan kendaraan & HP secara real-time." />}
        right={
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-foreground/70 hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center shadow-lg animate-pulse">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Keluar"
              className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-6 -mt-1 mb-6">
        <div className="surface rounded-2xl p-3 flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Logo3DImg size="xs" intensity="low" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-primary/80"><LiveText as="span" id={`user-role-${role}`} defaultText={isPolri ? "Anggota Polri" : "User Umum"} /></p>
            <p className="text-xs text-foreground mt-0.5 truncate">
              <LiveText as="span" id={`user-desc-${role}`} defaultText={isPolri ? "Akses penuh: Cek + Data LP" : "Layanan mandiri · RESMOB POLDA SULSEL"} />
            </p>
            <p className="text-[8px] text-primary/60 mt-1 uppercase tracking-widest font-bold">
              <LiveText as="span" id="user-integration" defaultText="Terintegrasi SI SDM POLRI" />
            </p>
          </div>
        </div>
      </div>

      {/* Menu grid */}
      <section className={`px-6 grid gap-4 mb-6 ${isPolri ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {menus.map((m, i) => (
          <motion.div
            key={m.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i + 0.15 }}
          >
            <Link to={m.href}>
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="surface-elevated rounded-3xl p-5 aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer"
              >
                <Icon3D src={m.icon} alt={m.label} size="lg" tone={m.tone} />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  <LiveText as="span" id={`menu-label-${m.label.toLowerCase()}`} defaultText={m.label} />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/*  Lapor — khusus umum */}
      {!isPolri && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <Link to="/user/lapor">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="surface-elevated rounded-2xl p-4 flex items-center gap-4 border border-emerald-500/20"
            >
              <span className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-emerald-500" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground"><LiveText as="span" id="lapor-card-title" defaultText="Lapor" /></p>
                <p className="text-xs text-muted-foreground mt-0.5"><LiveText as="span" id="lapor-card-desc" defaultText="Temukan BB? Laporkan ke Kepolisian" /></p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
            </motion.div>
          </Link>
        </motion.div>
      )}

      {/* Testimonials Quick Link */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="px-6 mb-6"
      >
        <Link to="/testimoni">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="surface-elevated rounded-2xl p-4 flex items-center gap-4 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-glow"
          >
            <span className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0 border border-primary/20">
              <Star className="w-6 h-6 text-primary fill-primary animate-pulse" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-foreground uppercase tracking-tight"><LiveText as="span" id="testi-real-card-title" defaultText="Ulasan Tentang Aplikasi" /></p>
              <p className="text-xs text-primary/70 mt-0.5 font-bold"><LiveText as="span" id="testi-real-card-desc" defaultText="Kesaksian Nyata Pengguna BOYAKO" /></p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="eyebrow flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            <LiveText as="span" id="recent-title" defaultText="Riwayat Pencarian" />
          </h3>
          <span className="text-[10px] text-muted-foreground/60">{recent.length} item</span>
        </div>

        {recent.length > 0 ? (
          <div className="space-y-2.5">
            {recent.slice(0, 4).map((q, i) => (
              <motion.div
                key={q + i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="surface rounded-2xl p-4 flex items-center gap-3 group cursor-pointer"
              >
                <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Search className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate uppercase tracking-wide">
                    {q}
                  </p>
                  <p className="eyebrow text-emerald-500/80 mt-0.5">Terverifikasi</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="surface rounded-3xl border-dashed border border-white/10 p-10 text-center">
            <Search className="w-9 h-9 text-muted-foreground/50 mx-auto mb-3" />
            <p className="eyebrow text-muted-foreground/70"><LiveText as="span" id="no-recent-text" defaultText="Belum ada pencarian" /></p>
          </div>
        )}
      </section>
    </div>
  );
}
