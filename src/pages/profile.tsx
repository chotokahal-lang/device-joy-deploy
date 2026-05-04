import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Shield, User, Star, ChevronRight, Bell, HelpCircle, Info, Scale } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { getUnreadCount } from "./notifications";
import { LiveText } from "@/components/ui/live-text";

export default function Profile() {
  const navigate = useNavigate();
  const role = localStorage.getItem("kuboyako_role") || "umum";
  const isAdmin = role === "admin";
  const isPolri = role === "polri";
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setUnread(getUnreadCount(role));
    const interval = setInterval(() => setUnread(getUnreadCount(role)), 3000);
    return () => clearInterval(interval);
  }, [role]);

  const name = isAdmin
    ? "IRZAL MAKKARAWAH, S.H."
    : isPolri
    ? "IPDA AHMAD FAUZI, S.I.K."
    : "User Umum";

  const nrp = isAdmin ? "71040012345678" : isPolri ? "71040087654321" : "-";
  const pangkat = isAdmin ? "IPDA / Penyidik" : isPolri ? "IPDA / Penyidik" : "-";
  const satker = isAdmin ? "Subdit Jatanras · Ditkrimum" : isPolri ? "RESMOB POLDA SULSEL" : "User Umum";
  const fitur = isAdmin ? "Admin" : isPolri ? "Anggota Polri" : "User Umum";

  const handleLogout = () => {
    localStorage.removeItem("kuboyako_role");
    navigate("/role-select");
  };

  const menus = [
    { label: "Notifikasi", icon: <Bell className="w-4 h-4 text-primary" />, to: "/notifications" },
    { label: "Bantuan & FAQ", icon: <HelpCircle className="w-4 h-4 text-accent" />, to: "/help-faq" },
    { label: "Kebijakan Privasi", icon: <Shield className="w-4 h-4 text-primary" />, to: "/privacy" },
    { label: "Syarat & Ketentuan", icon: <Scale className="w-4 h-4 text-accent" />, to: "/terms" },
    { label: "Tentang Aplikasi", icon: <Info className="w-4 h-4 text-muted-foreground" />, to: "/about" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="profile-eyebrow" defaultText="Profil Pengguna" />}
        title={<LiveText as="span" id="profile-title" defaultText="Akun Saya" />}
        subtitle={<LiveText as="span" id="profile-subtitle" defaultText="Informasi profil & pengaturan akses." />}
        back={isAdmin ? "/admin" : "/user"}
        right={
          <button
            onClick={handleLogout}
            aria-label="Keluar"
            className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-foreground/70 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-6 space-y-5">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-elevated rounded-3xl p-5 flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
            {isPolri || isAdmin ? (
              <Shield className="w-8 h-8 text-primary" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="display-font text-base text-foreground truncate"><LiveText as="span" id={`profile-name-${role}`} defaultText={name} /></p>
            <p className="eyebrow text-primary/80 mt-0.5 text-[10px]"><LiveText as="span" id={`profile-role-${role}`} defaultText={fitur} /></p>
            <p className="text-xs text-muted-foreground mt-1"><LiveText as="span" id={`profile-satker-${role}`} defaultText={satker} /></p>
          </div>
        </motion.div>

        {/* Detail info */}
        {(isAdmin || isPolri) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="surface rounded-2xl overflow-hidden"
          >
            {[
              { label: "NRP", value: nrp },
              { label: "Pangkat / Jabatan", value: pangkat },
              { label: "Satker", value: satker },
              { label: "Versi Aplikasi", value: "ᨀᨘᨄᨚᨐᨀᨚ v2026.1" },
            ].map((item, i) => (
              <div key={item.label} className={`px-4 py-3 flex items-center justify-between ${i > 0 ? "border-t border-white/5" : ""}`}>
                <p className="eyebrow text-[10px]">{item.label}</p>
                <p className="text-xs font-bold text-foreground font-mono">{item.value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="surface rounded-2xl p-3 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-muted-foreground flex-1"><LiveText as="span" id="profile-footer-desc" defaultText="ᨀᨘᨄᨚᨐᨀᨚ · RESMOB POLDA SULSEL · 2026" /></p>
          <span className="eyebrow text-primary/70 text-[9px]"><LiveText as="span" id="profile-footer-status" defaultText="AKTIF" /></span>
        </motion.div>

        {/* Navigation menus */}
        <div className="space-y-2.5">
          {menus.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.25 }}
              onClick={() => navigate(m.to)}
              className="surface-elevated rounded-2xl p-4 flex items-center gap-4 cursor-pointer group"
            >
              <span className="w-10 h-10 rounded-xl surface-glass flex items-center justify-center shrink-0">
                {m.icon}
              </span>
              <p className="flex-1 text-sm font-bold text-foreground">
                <LiveText as="span" id={`profile-menu-label-${i}`} defaultText={m.label} />
              </p>
              {m.label === "Notifikasi" && unread > 0 && (
                <span className="h-5 px-2 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center shadow-lg">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full h-12 rounded-2xl surface border border-destructive/20 text-destructive font-bold flex items-center justify-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          <LiveText as="span" id="profile-logout" defaultText="Keluar dari Akun" />
        </motion.button>
      </div>
    </div>
  );
}
