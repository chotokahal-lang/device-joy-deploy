import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CreditCard, Phone, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

import { Logo3DImg } from "@/components/ui/logo-3d-img";
import { LiveText } from "@/components/ui/live-text";

interface IdentityForm {
  nama: string;
  nik: string;
  noHp: string;
}

function Field({
  icon,
  label,
  hint,
  type,
  value,
  maxLength,
  pattern,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  type: string;
  value: string;
  maxLength?: number;
  pattern?: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow ml-1 text-[10px]"><LiveText as="span" id={`field-label-${label.toLowerCase().replace(/\s+/g, '-')}`} defaultText={label} /></span>
      {hint && <span className="eyebrow text-muted-foreground/60 text-[9px] ml-2"><LiveText as="span" id={`field-hint-${label.toLowerCase().replace(/\s+/g, '-')}`} defaultText={hint} /></span>}
      <div className="mt-1.5 surface rounded-2xl focus-within:ring-2 focus-within:ring-primary/40 transition-all flex items-center gap-3 px-4">
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <input
          type={type}
          required
          value={value}
          maxLength={maxLength}
          pattern={pattern}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-14 bg-transparent outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/40"
        />
        {maxLength && (
          <span className="text-[10px] text-muted-foreground/50 shrink-0">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </label>
  );
}

export default function UserDaftar() {
  const navigate = useNavigate();
  const [form, setForm] = useState<IdentityForm>({ nama: "", nik: "", noHp: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.nama.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }
    if (form.nik.length !== 16 || !/^\d{16}$/.test(form.nik)) {
      setError("NIK harus 16 digit angka.");
      return;
    }
    if (form.noHp.length < 10 || !/^0\d{9,12}$/.test(form.noHp)) {
      setError("Nomor HP tidak valid. Contoh: 081234567890");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const identity = {
        nama: form.nama.trim(),
        nik: form.nik,
        noHp: form.noHp,
        terdaftar: new Date().toISOString(),
      };
      localStorage.setItem("kuboyako_identity", JSON.stringify(identity));
      setLoading(false);
      navigate("/user/verifikasi-wajah");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="daftar-eyebrow" defaultText="User Umum" />}
        title={<LiveText as="span" id="daftar-title" defaultText="Verifikasi Identitas" />}
        subtitle={<LiveText as="span" id="daftar-subtitle" defaultText="Diperlukan untuk menggunakan layanan pengecekan." />}
        back="/role-select"
      />

      <div className="px-6 flex-1 flex flex-col gap-5">
        {/* Logo & penjelasan */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface rounded-2xl p-4 flex gap-3 items-start"
        >
          <Logo3DImg size="xs" intensity="low" className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground"><LiveText as="span" id="daftar-why-title" defaultText="Mengapa diperlukan?" /></p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
              <LiveText as="span" id="daftar-why-desc" defaultText="Verifikasi identitas diperlukan untuk memastikan layanan ini digunakan secara bertanggung jawab dan mencegah penyalahgunaan sistem arsip digital RESMOB POLDA SULSEL" />
            </p>
          </div>
        </motion.div>

        {/* Jaminan privasi */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface rounded-xl p-3 flex items-center gap-2.5 border border-primary/20 bg-primary/5"
        >
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <LiveText as="span" id="daftar-privacy" defaultText='Data identitas Anda <b class="text-foreground">hanya disimpan di perangkat</b> dan tidak dikirim ke server mana pun.' />
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Field
            icon={<User className="w-4 h-4" />}
            label="Nama Lengkap"
            hint="Sesuai KTP"
            type="text"
            value={form.nama}
            onChange={(v) => setForm({ ...form, nama: v })}
            placeholder="Masukkan nama lengkap Anda"
          />
          <Field
            icon={<CreditCard className="w-4 h-4" />}
            label="NIK (Nomor Induk Kependudukan)"
            hint="16 digit"
            type="tel"
            value={form.nik}
            maxLength={16}
            onChange={(v) => setForm({ ...form, nik: v.replace(/\D/g, "") })}
            placeholder="1234567890123456"
          />
          <Field
            icon={<Phone className="w-4 h-4" />}
            label="Nomor Telepon Aktif"
            hint="Diawali 0"
            type="tel"
            value={form.noHp}
            maxLength={13}
            onChange={(v) => setForm({ ...form, noHp: v.replace(/\D/g, "") })}
            placeholder="081234567890"
          />

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface rounded-xl p-3 flex items-center gap-2.5 border border-destructive/30 bg-destructive/5"
            >
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-[11px] text-destructive font-medium">{error}</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 mt-2 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span><LiveText as="span" id="daftar-submit-btn" defaultText="Lanjut ke Verifikasi Wajah" /></span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Ketentuan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[10px] text-muted-foreground/60 leading-relaxed px-4"
        >
          <LiveText as="span" id="daftar-terms" defaultText="Dengan mendaftar, Anda menyetujui ketentuan penggunaan layanan ᨀᨘᨅᨚᨐᨀᨚ dan menjamin kebenaran data yang dimasukkan. Penyalahgunaan layanan dapat dikenai sanksi sesuai hukum yang berlaku." />
        </motion.p>
      </div>
    </div>
  );
}
