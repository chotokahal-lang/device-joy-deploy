import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";
import { validateLogin, addLog } from "@/lib/store";

export default function Login() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const isAdmin = type === "admin";
  const isPolri = type === "polri";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user = validateLogin(credentials.username, credentials.password);
      
      if (user) {
        const role = user.role;
        localStorage.setItem("kuboyako_role", role);
        localStorage.setItem("kuboyako_user_name", user.name);
        localStorage.setItem("kuboyako_user_nrp", user.nrp);
        
        addLog(user.nrp, role, "LOGIN", "Berhasil masuk ke sistem");
        
        toast({
          title: "Akses Diterima",
          description: `Selamat datang, ${user.name}.`,
        });
        navigate(role === "admin" ? "/admin" : "/user");
      } else {
        addLog(credentials.username, "unknown", "LOGIN_FAILED", "Percobaan login gagal");
        toast({
          variant: "destructive",
          title: "Akses Ditolak",
          description: "NRP atau password salah.",
        });
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow={<LiveText as="span" id={`login-eyebrow-${type}`} defaultText={isAdmin ? "Admin · RESMOB POLDA SULSEL" : "Anggota Polri"} />}
        title={<LiveText as="span" id={`login-title-${type}`} defaultText={isAdmin ? "Login Admin" : "Login Anggota Polri"} />}
        subtitle={<LiveText as="span" id={`login-subtitle-${type}`} defaultText={isAdmin ? "Akses penuh: input, scan & arsip BB." : "Akses cek + detail data asal LP."} />}
        back="/role-select"
      />

      <div className="px-6 flex-1 flex flex-col">
        <div className="flex justify-center mt-4 mb-8">
          <Icon3D src={icons3d.shield} alt="Login" size="xl" tone="primary" float />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Field
            icon={<User className="w-4 h-4" />}
            label={isAdmin ? "NRP / Username Admin" : "NRP (Nomor Registrasi Pokok)"}
            type="text"
            value={credentials.username}
            onChange={(v) => setCredentials({ ...credentials, username: v })}
            placeholder={isAdmin ? "admin" : "71040XXXXXXXX"}
          />
          <Field
            icon={<Lock className="w-4 h-4" />}
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(v) => setCredentials({ ...credentials, password: v })}
            placeholder="••••••••"
          />

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 mt-2 rounded-2xl gradient-primary text-primary-foreground font-bold
                       flex items-center justify-center gap-3 shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LiveText as="span" id="login-btn" defaultText="Verifikasi & Masuk" />
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <h1 className="display-font text-3xl text-foreground tracking-tight leading-tight text-center">
            <LiveText as="span" id="login-brand" defaultText="KUBOYAKO" />
          </h1>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-medium text-center">
            <LiveText as="span" id="login-tagline" defaultText="Terintegrasi SI SDM POLRI" />
          </p>
        </form>
      </div>

      <footer className="px-6 py-6 text-center">
        <p className="eyebrow text-muted-foreground/60">
          <LiveText as="span" id={`login-footer-${type}`} defaultText={isAdmin ? "Operator · KUBOYAKO" : "Anggota Polri · KUBOYAKO"} />
        </p>
      </footer>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow ml-1"><LiveText as="span" id={`login-label-${label.toLowerCase().replace(/\s+/g, '-')}`} defaultText={label} /></span>
      <div className="mt-2 relative surface rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition-all">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 pl-11 pr-4 bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/50"
        />
      </div>
    </label>
  );
}
