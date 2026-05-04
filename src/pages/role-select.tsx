import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Shield, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

const roles = [
  {
    to: "/login/admin",
    icon: icons3d.shield,
    title: "Administrator",
    desc: "Input data BB, scan LP, kelola arsip. KHUSUS PETUGAS OPERATOR SPKT/ANGGOTA POLRI.",
    tag: "Operator",
    color: "primary" as const,
    badge: "Login NRP",
    icon2: <Lock className="w-3 h-3" />,
  },
  {
    to: "/login/polri",
    icon: icons3d.shield,
    title: "Anggota Polri",
    desc: "Cek kendaraan, HP, dan akses detail data asal LP barang bukti.",
    tag: "Polri",
    color: "primary" as const,
    badge: "Login NRP",
    icon2: <Shield className="w-3 h-3" />,
  },
  {
    to: "umum",
    icon: icons3d.user,
    title: "User Umum",
    desc: "Cek status kendaraan & HP secara mandiri, laporkan temuan BB.",
    tag: "Publik",
    color: "accent" as const,
    badge: "Daftar & Verifikasi",
    icon2: <Users className="w-3 h-3" />,
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleUmum = () => {
    const identity = localStorage.getItem("kuboyako_identity");
    const faceVerified = sessionStorage.getItem("kuboyako_face_verified");
    if (identity && faceVerified) {
      localStorage.setItem("kuboyako_role", "umum");
      navigate("/user");
    } else if (identity) {
      navigate("/user/verifikasi-wajah");
    } else {
      navigate("/user/daftar");
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow={<LiveText as="span" id="role-eyebrow" defaultText="Pilih Akses" />}
        title={<LiveText as="span" id="role-title" defaultText="Mode Pengguna" />}
        subtitle={<LiveText as="span" id="role-subtitle" defaultText="Silakan pilih jenis akses sesuai kewenangan Anda." />}
        back="/"
        showLogo
      />

      <div className="px-6 mt-2 space-y-4 flex-1">
        {roles.map((r, i) => {
          const inner = (
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="surface-elevated rounded-3xl p-5 flex items-center gap-4 group cursor-pointer"
            >
              <Icon3D src={r.icon} alt={r.title} size="lg" tone={r.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="eyebrow text-primary/80 text-[10px]"><LiveText as="span" id={`role-tag-${i}`} defaultText={r.tag} /></p>
                  <span className="flex items-center gap-1 surface-glass rounded-full px-2 py-0.5 text-[9px] eyebrow text-muted-foreground">
                    {r.icon2}<LiveText as="span" id={`role-badge-${i}`} defaultText={r.badge} />
                  </span>
                </div>
                <h3 className="display-font text-base text-foreground leading-tight">
                  <LiveText as="span" id={`role-title-${i}`} defaultText={r.title} />
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  <LiveText as="span" id={`role-desc-${i}`} defaultText={r.desc} />
                </p>
              </div>
              <span className="shrink-0 w-9 h-9 rounded-full surface-glass flex items-center justify-center text-foreground/70 group-hover:text-primary transition-all">
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          );

          return (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.2, duration: 0.5 }}
            >
              {r.to === "umum" ? (
                <div onClick={handleUmum}>{inner}</div>
              ) : (
                <Link to={r.to} className="block">{inner}</Link>
              )}
            </motion.div>
          );
        })}
      </div>

      <footer className="px-6 py-6 text-center">
        <p className="eyebrow text-muted-foreground/60">
          <LiveText as="span" id="role-select-footer" defaultText="Subdit Jatanras · Ditkrimum · RESMOB POLDA SULSEL" />
        </p>
      </footer>
    </div>
  );
}
