import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronRight, Trash2, Download, Edit2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEvidenceData, EvidenceItem, deleteEvidenceItem, updateEvidenceItem, updateEvidenceStatus, addLog, CaseStatus } from "@/lib/store";
import { exportToCsv } from "@/lib/export";
import { PageHeader } from "@/components/layout/page-header";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

const filters = [
  { id: "semua", label: "Semua", icon: null },
  { id: "mobil", label: "Mobil", icon: icons3d.car },
  { id: "motor", label: "Motor", icon: icons3d.motor },
  { id: "hp", label: "HP", icon: icons3d.phone },
] as const;

export default function AdminRiwayat() {
  const [data, setData] = useState<EvidenceItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("semua");
  const [editingItem, setEditingItem] = useState<EvidenceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string, noLp: string } | null>(null);

  useEffect(() => {
    setData(getEvidenceData().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const filtered = data.filter((item) => {
    if (filter !== "semua" && item.type !== filter) return false;
    if (!search) return true;
    
    const q = search.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!q) return true;

    if (item.type === "hp") {
      const imei1 = item.imei1.replace(/[^0-9]/g, "");
      const imei2 = item.imei2?.replace(/[^0-9]/g, "") || "";
      const merk = item.merk.toLowerCase().replace(/[^a-z0-9]/g, "");
      const lp = item.noLp.toLowerCase().replace(/[^a-z0-9]/g, "");
      
      return imei1.includes(q) || imei2.includes(q) || merk.includes(q) || lp.includes(q);
    }

    const nopol = (item as any).noPolisi?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    const rangka = (item as any).noRangka?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    const mesin = (item as any).noMesin?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    const merk = item.merk.toLowerCase().replace(/[^a-z0-9]/g, "");
    const lp = item.noLp.toLowerCase().replace(/[^a-z0-9]/g, "");

    return nopol.includes(q) || rangka.includes(q) || mesin.includes(q) || merk.includes(q) || lp.includes(q);
  });

  const confirmDelete = () => {
    if (!deletingItem) return;
    deleteEvidenceItem(deletingItem.id);
    setData(data.filter(it => it.id !== deletingItem.id));
    
    const adminNrp = localStorage.getItem("kuboyako_user_nrp") || "admin";
    addLog(adminNrp, "admin", "DELETE_EVIDENCE", `Menghapus data BB: ${deletingItem.noLp}`);
    setDeletingItem(null);
  };

  const handleExport = () => {
    const dataToExport = filtered.map(it => ({
      ID: it.id,
      Tipe: it.type,
      No_LP: it.noLp,
      Tgl_LP: it.tglLp,
      Pelapor: it.pelapor,
      TKP: it.lokasiTkp,
      Satker: it.satker,
      Asal_LP: it.asalLp,
      ...(it.type === 'hp' 
        ? { Merk: it.merk, Model: (it as any).model, IMEI: (it as any).imei1 }
        : { No_Pol: (it as any).noPolisi, Merk: (it as any).merk, No_Mesin: (it as any).noMesin })
    }));
    exportToCsv(`Daftar_BB_${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedItem = {
      ...editingItem,
      noLp: formData.get("noLp") as string,
      pelapor: formData.get("pelapor") as string,
      lokasiTkp: formData.get("lokasiTkp") as string,
      asalLp: formData.get("asalLp") as string,
      merk: formData.get("merk") as string,
      warna: formData.get("warna") as string,
      status: (formData.get("status") as CaseStatus) || editingItem.status || 'baru',
      statusNote: (formData.get("statusNote") as string) || editingItem.statusNote || '',
      ...(editingItem.type === "hp" 
        ? { imei1: formData.get("imei1") as string }
        : { noPolisi: formData.get("noPolisi") as string })
    } as EvidenceItem;
    updateEvidenceItem(updatedItem);
    setData(data.map(it => it.id === updatedItem.id ? updatedItem : it));
    
    const adminNrp = localStorage.getItem("kuboyako_user_nrp") || "admin";
    addLog(adminNrp, "admin", "UPDATE_EVIDENCE", `Mengubah data BB: ${updatedItem.noLp}`);

    if (updatedItem.status === 'selesai' && editingItem.status !== 'selesai') {
      toast.success("KASUS SELESAI!", {
        description: `Barang bukti ${updatedItem.noLp} telah berhasil dituntaskan.`,
        duration: 5000,
      });
    } else {
      toast.success("Data berhasil diperbarui");
    }
    
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={`${data.length} Arsip Tersimpan`}
        title="Riwayat Arsip"
        subtitle="Cari dan telusuri seluruh arsip barang bukti."
        back="/admin"
        right={
          <button
            onClick={handleExport}
            className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-primary"
          >
            <Download className="w-5 h-5" />
          </button>
        }
      />

      {/* Search */}
      <div className="px-6 mb-4 relative z-10">
        <div className="surface rounded-2xl flex items-center px-4 h-12 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Plat, IMEI, atau No. LP…"
            className="flex-1 h-12 bg-transparent outline-none px-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-6 flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-4 relative z-10">
        {filters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 h-11 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                active
                  ? "gradient-primary text-primary-foreground border-transparent shadow-soft"
                  : "surface text-muted-foreground hover:text-foreground border-white/5"
              }`}
            >
              {f.icon && <img src={f.icon} alt="" className="w-5 h-5 object-contain" />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="px-6 flex-1 space-y-3 relative z-10">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => {
            const iconSrc =
              item.type === "hp" ? icons3d.phone : item.type === "mobil" ? icons3d.car : icons3d.motor;
            const primary =
              item.type === "hp" ? item.imei1 : (item as any).noPolisi;
            const sub =
              item.merk +
              " " +
              ((item as any).tipe || (item as any).jenis || (item as any).model || "") +
              " · " +
              item.warna;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link to={`/admin/detail/${item.id}`}>
                  <div className="surface-elevated rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:border-primary/30 transition-colors">
                    <img
                      src={iconSrc}
                      alt={item.type}
                      className="w-14 h-14 object-contain shrink-0 drop-shadow-[0_8px_14px_rgba(0,0,0,0.5)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-base tracking-tight uppercase truncate group-hover:text-primary transition-colors">
                          {primary}
                        </h3>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter shrink-0 ${
                          item.status === 'selesai' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'proses' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {item.status === 'selesai' ? '✓ Selesai' : item.status === 'proses' ? '◎ Proses' : '● Baru'}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="px-2 py-0.5 rounded-md surface-glass border border-white/5 text-[9px] font-bold text-muted-foreground uppercase truncate max-w-[100px]">
                          {item.asalLp || "Resmob Polda"}
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-mono">
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      {item.statusNote && (
                        <p className="text-[9px] text-muted-foreground/80 mt-1 italic truncate">{item.statusNote}</p>
                      )}
                    </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditingItem(item);
                          }}
                          className="w-8 h-8 rounded-xl surface-glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeletingItem({ id: item.id, noLp: item.noLp });
                          }}
                          className="w-8 h-8 rounded-xl surface-glass flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 h-8 rounded-full surface-glass flex items-center justify-center text-foreground/60 group-hover:text-primary transition-colors hidden xs:flex">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="surface rounded-3xl border-dashed border border-white/10 p-12 text-center mt-4">
            <Filter className="w-10 h-10 text-muted-foreground/60 mx-auto mb-4" />
            <h3 className="display-font text-base text-foreground"><LiveText as="span" id="admin-riwayat-empty-title" defaultText="Arsip tidak ditemukan" /></h3>
            <p className="text-xs text-muted-foreground mt-1">
              <LiveText as="span" id="admin-riwayat-empty-desc" defaultText="Coba kata kunci atau filter berbeda." />
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md sm:max-w-lg lg:max-w-2xl surface-elevated rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-white/10 shadow-2xl relative"
            >
              <button
                onClick={() => setEditingItem(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full surface-glass flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mb-6">
                 <Edit2 className="w-8 h-8" />
              </div>

              <h2 className="display-font text-2xl text-foreground mb-2">Perbarui Data</h2>
              <p className="text-xs text-muted-foreground mb-8">Ubah informasi barang bukti secara akurat.</p>
              
              <form onSubmit={handleUpdate} className="space-y-4 max-h-[50vh] overflow-y-auto px-1 pb-4 custom-scrollbar">
                <EditField label="Nomor LP" name="noLp" defaultValue={editingItem.noLp} />
                <EditField label="Pelapor" name="pelapor" defaultValue={editingItem.pelapor} />
                <EditField label="Lokasi TKP" name="lokasiTkp" defaultValue={editingItem.lokasiTkp} />
                <EditField label="Asal LP (Kesatuan)" name="asalLp" defaultValue={editingItem.asalLp} />
                
                <div className="grid grid-cols-2 gap-3">
                  <EditField 
                    label={editingItem.type === "hp" ? "IMEI" : "No. Polisi"} 
                    name={editingItem.type === "hp" ? "imei1" : "noPolisi"} 
                    defaultValue={editingItem.type === "hp" ? editingItem.imei1 : (editingItem as any).noPolisi} 
                  />
                  <EditField label="Merk" name="merk" defaultValue={editingItem.merk} />
                </div>
                
                <EditField label="Warna" name="warna" defaultValue={editingItem.warna} />

                <div>
                  <label className="eyebrow ml-1">Status Kasus</label>
                  <select
                    name="status"
                    defaultValue={editingItem.status || 'baru'}
                    className="mt-1.5 w-full h-11 px-4 surface rounded-xl bg-transparent outline-none text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/40 transition-all"
                  >
                    <option value="baru" className="bg-background">● Baru — Laporan Diterima</option>
                    <option value="proses" className="bg-background">◎ Proses — Sedang Ditangani</option>
                    <option value="selesai" className="bg-background">✓ Selesai — Kasus Tuntas</option>
                  </select>
                </div>

                <div>
                  <label className="eyebrow ml-1">Catatan Status</label>
                  <textarea
                    name="statusNote"
                    defaultValue={editingItem.statusNote || ''}
                    rows={2}
                    placeholder="Tambahkan keterangan status..."
                    className="mt-1.5 w-full px-4 py-3 surface rounded-xl bg-transparent outline-none text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/40 transition-all resize-none"
                  />
                </div>
              </form>

              <div className="grid grid-cols-2 gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="h-14 rounded-2xl surface-glass border border-white/5 font-bold text-sm text-foreground hover:bg-white/5"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => (document.querySelector('form') as any)?.requestSubmit()}
                    className="h-14 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm shadow-glow"
                  >
                    Simpan
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-lg flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-sm sm:max-w-md lg:max-w-xl surface-elevated rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] text-center"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive mx-auto mb-6">
                <Trash2 className="w-10 h-10" />
              </div>
              
              <h3 className="display-font text-2xl text-foreground mb-2">Hapus Arsip?</h3>
              <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                Anda akan menghapus data LP: <br/>
                <span className="text-foreground font-bold mt-1 inline-block">{deletingItem.noLp}</span>
                <br/><br/>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="h-14 rounded-2xl surface-glass border border-white/5 font-bold text-sm text-foreground"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="h-14 rounded-2xl bg-destructive text-white font-black text-sm shadow-[0_10px_20px_rgba(239,68,68,0.3)]"
                >
                  HAPUS
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditField({ label, name, defaultValue }: { label: string, name: string, defaultValue: string }) {
  return (
    <div>
      <label className="eyebrow ml-1">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        required
        className="mt-1.5 w-full h-11 px-4 surface rounded-xl bg-transparent outline-none text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/40 transition-all"
      />
    </div>
  );
}
