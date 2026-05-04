import { useState, useEffect } from "react";
import { Plus, User, Shield, Briefcase, Key, Save, Trash2, X, Search, Edit2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAccounts, UserAccount, addLog } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { nrpToEmail } from "./login";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";
import { useToast } from "@/hooks/use-toast";

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nrp: "",
    name: "",
    unit: "",
    password: "",
    role: "polri" as "admin" | "polri"
  });

  const refresh = () => fetchAccounts().then(setAccounts);
  useEffect(() => { void refresh(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: nrpToEmail(formData.nrp),
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { name: formData.name, nrp: formData.nrp, unit: formData.unit },
        },
      });
      if (error) throw error;
      if (data.user && formData.role === "admin") {
        await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
      }
      const adminNrp = localStorage.getItem("kuboyako_user_nrp") || "admin";
      void addLog(adminNrp, "admin", "CREATE_ACCOUNT", `Membuat akun: ${formData.nrp} (${formData.name})`);
      toast({ title: "Akun Dibuat", description: `Akun ${formData.name} aktif.` });
      setShowAdd(false);
      setFormData({ nrp: "", name: "", unit: "", password: "", role: "polri" });
      await refresh();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal Membuat Akun", description: err?.message ?? "Terjadi kesalahan" });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    const accToDelete = accounts.find(a => a.id === id);
    if (!accToDelete) return;
    await supabase.from("user_roles").delete().eq("user_id", id);
    await supabase.from("profiles").delete().eq("user_id", id);
    setDeletingId(null);
    const adminNrp = localStorage.getItem("kuboyako_user_nrp") || "admin";
    void addLog(adminNrp, "admin", "DELETE_ACCOUNT", `Menghapus akun: ${accToDelete.name}`);
    toast({ title: "Akun Dihapus", description: `Profil & peran ${accToDelete.name} dicabut.` });
    await refresh();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    setBusy(true);
    try {
      await supabase.from("profiles").update({
        name: formData.name, nrp: formData.nrp, unit: formData.unit,
      }).eq("user_id", editingAccount.id);
      if (editingAccount.role !== formData.role) {
        await supabase.from("user_roles").delete().eq("user_id", editingAccount.id);
        await supabase.from("user_roles").insert({ user_id: editingAccount.id, role: formData.role });
      }
      setEditingAccount(null);
      setShowAdd(false);
      toast({ title: "Akun Diperbarui", description: `Data ${formData.name} disimpan.` });
      await refresh();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err?.message });
    } finally {
      setBusy(false);
    }
  };

  const openEdit = (acc: UserAccount) => {
    setEditingAccount(acc);
    setFormData({ nrp: acc.nrp, name: acc.name, unit: acc.unit, password: "", role: acc.role });
    setShowAdd(true);
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.nrp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.unit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="accounts-eyebrow" defaultText="Personel" />}
        title={<LiveText as="span" id="accounts-title" defaultText="Manajemen Akun" />}
        subtitle={<LiveText as="span" id="accounts-subtitle" defaultText="Kelola hak akses Anggota Polri dan Operator sistem." />}
        back="/admin"
      />

      <div className="px-6 mb-4 space-y-4">
        <button
          onClick={() => { setEditingAccount(null); setFormData({ nrp: "", name: "", unit: "", password: "", role: "polri" }); setShowAdd(true); }}
          className="w-full h-14 rounded-2xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Personel Baru</span>
        </button>

        <div className="surface rounded-2xl flex items-center px-4 h-12 focus-within:ring-2 focus-within:ring-primary/40 transition-all border border-white/5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NRP…"
            className="flex-1 h-12 bg-transparent outline-none px-3 text-sm font-medium text-foreground"
          />
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h2 className="eyebrow">Daftar Personel Terdaftar</h2>
          <span className="text-[10px] text-muted-foreground/60">{accounts.length} Akun</span>
        </div>

        {filteredAccounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-elevated rounded-2xl p-4 flex items-center gap-4 border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-2xl surface-glass flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
              {acc.role === "admin" ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate uppercase">{acc.name}</h3>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${acc.role === "admin" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                  {acc.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{acc.nrp} · {acc.unit}</p>
            </div>
            
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(acc)}
                className="w-9 h-9 rounded-xl surface-glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {acc.nrp !== "admin" && (
                <button
                  onClick={() => setDeletingId(acc.id)}
                  className="w-9 h-9 rounded-xl surface-glass flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {filteredAccounts.length === 0 && (
          <div className="py-20 text-center">
            <User className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="eyebrow text-muted-foreground/50">Personel tidak ditemukan</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md sm:max-w-lg lg:max-w-2xl surface-elevated rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAdd(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full surface-glass flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="display-font text-xl text-foreground mb-6">
                {editingAccount ? "Edit Akun Personel" : "Tambah Akun Polri"}
              </h2>
              
              <form onSubmit={editingAccount ? handleEdit : handleAdd} className="space-y-4">
                <Field icon={<User className="w-4 h-4" />} label="NRP / Username" value={formData.nrp} onChange={v => setFormData({...formData, nrp: v})} placeholder="7104XXXX" />
                <Field icon={<User className="w-4 h-4" />} label="Nama Lengkap" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="Nama Sesuai KTP/KTA" />
                <Field icon={<Briefcase className="w-4 h-4" />} label="Kesatuan / Unit" value={formData.unit} onChange={v => setFormData({...formData, unit: v})} placeholder="RESMOB POLDA SULSEL" />
                <Field icon={<Key className="w-4 h-4" />} label="Password" value={formData.password} onChange={v => setFormData({...formData, password: v})} type="text" placeholder="••••••••" />
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'polri'})}
                    className={`flex-1 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${formData.role === 'polri' ? 'bg-accent/20 text-accent border-accent/30' : 'surface text-muted-foreground border-white/5'}`}
                  >
                    Anggota Polri
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'admin'})}
                    className={`flex-1 h-10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${formData.role === 'admin' ? 'bg-primary/20 text-primary border-primary/30' : 'surface text-muted-foreground border-white/5'}`}
                  >
                    Administrator
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingAccount ? "Perbarui Akun" : "Simpan Akun"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm sm:max-w-md lg:max-w-xl surface-elevated rounded-3xl p-6 text-center border border-white/10"
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="display-font text-lg text-foreground mb-2">Hapus Personel?</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Tindakan ini tidak dapat dibatalkan. Seluruh akses untuk akun ini akan segera dicabut.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 h-12 rounded-xl surface text-foreground font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 h-12 rounded-xl bg-destructive text-white font-bold shadow-lg shadow-destructive/20"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ icon, label, value, onChange, placeholder, type = "text" }: { icon: any, label: string, value: string, onChange: (v: string) => void, placeholder: string, type?: string }) {
  return (
    <div>
      <label className="eyebrow ml-1">{label}</label>
      <div className="mt-1.5 relative surface rounded-xl focus-within:ring-2 focus-within:ring-primary/40 transition-all">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <input
          type={type}
          required
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-4 bg-transparent outline-none text-sm font-medium text-foreground"
        />
      </div>
    </div>
  );
}
