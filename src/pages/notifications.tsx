import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, ShieldAlert, CheckCircle2, Info, RefreshCw, 
  Check, Trash2, Volume2, VolumeX 
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LiveText } from "@/components/ui/live-text";
import { useToast } from "@/hooks/use-toast";

type NotifType = "alert" | "success" | "info";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  roles: string[];
  timestamp?: number;
}

const role = () => localStorage.getItem("kuboyako_role") || "umum";

const generateTimeString = (minutesAgo: number): string => {
  if (minutesAgo < 1) return "Baru saja";
  if (minutesAgo < 60) return `${minutesAgo} menit yang lalu`;
  if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)} jam yang lalu`;
  return `${Math.floor(minutesAgo / 1440)} hari yang lalu`;
};

export const ALL_NOTIFS: Notification[] = [
  /* ── ADMIN ─────────────────────────────────────────────── */
  { id: 1, type: "alert", title: "🚨 HP Terdeteksi Barang Bukti", desc: "IMEI 358912345678901 · Samsung Galaxy S23 · LP/789/VI/2026", time: "10:32", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 5 },
  { id: 2, type: "alert", title: "🚨 Motor Terdeteksi Barang Bukti", desc: "DD 5678 CD · Honda Beat · LP/456/V/2026/POLRES GOWA", time: "10:18", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 20 },
  { id: 3, type: "success", title: "✅ Data Mobil Berhasil Diarsipkan", desc: "DD 1234 AB · Toyota Avanza · LP/123/IV/2026", time: "09:58", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 60 },
  { id: 4, type: "success", title: "✅ Scan LP Berhasil Diekstraksi", desc: "2 dokumen LP diproses · OCR akurasi 98%", time: "09:30", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 90 },
  { id: 5, type: "info", title: "📋 3 Laporan User Masuk", desc: "Menunggu tindak lanjut dari Unit RESMOB POLDA SULSEL", time: "09:00", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 120 },
  { id: 6, type: "info", title: "🔄 Sinkronisasi DORS Selesai", desc: "12 data berhasil disinkronkan ke sistem RESMOB POLDA SULSEL", time: "08:45", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 150 },
  { id: 7, type: "info", title: "🔐 Sesi Admin Aktif Tercatat", desc: "Login dari perangkat terotorisasi · RESMOB POLDA SULSEL", time: "08:00", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 200 },
  { id: 8, type: "info", title: "📱 Pembaruan Sistem KUBOYAKO", desc: "v2026.1 · LP Search & Arsip Digital diperbarui", time: "Kemarin", roles: ["admin"], timestamp: Date.now() - 1000 * 60 * 60 * 24 },

  /* ── POLRI ─────────────────────────────────────────────── */
  { id: 9, type: "alert", title: "🚨 HP Terdeteksi Barang Bukti", desc: "IMEI 358912345678901 · Samsung Galaxy S23 · Waspadai", time: "10:32", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 10 },
  { id: 10, type: "alert", title: "🚨 Motor Terdeteksi Barang Bukti", desc: "DD 5678 CD · Honda Beat · Laporan aktif Polres Gowa", time: "10:18", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 35 },
  { id: 11, type: "alert", title: "🚨 Mobil Terdaftar BB", desc: "DD 9999 ZZ · Toyota Innova · LP/321/III/2026/POLRESTABES", time: "Kemarin", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 60 * 20 },
  { id: 12, type: "info", title: "🔄 Sinkronisasi DORS Selesai", desc: "12 data BB terbaru tersedia untuk pencarian", time: "09:00", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 180 },
  { id: 13, type: "info", title: "👮 Status Operasi RESMOB POLDA SULSEL", desc: "Operasi Jatanras aktif · RESMOB POLDA SULSEL · Siaga penuh", time: "08:30", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 220 },
  { id: 14, type: "info", title: "📱 Pembaruan Sistem KUBOYAKO", desc: "v2026.1 · Fitur cek LP & detail BB diperbarui", time: "Kemarin", roles: ["polri"], timestamp: Date.now() - 1000 * 60 * 60 * 18 },

  /* ── UMUM ──────────────────────────────────────────────── */
  { id: 15, type: "success", title: "✅ Identitas Berhasil Diverifikasi", desc: "Wajah & data NIK Anda telah terverifikasi dengan aman", time: "Baru saja", roles: ["umum"], timestamp: Date.now() },
  { id: 16, type: "success", title: "✅ Laporan Temuan Diterima", desc: "Tim RESMOB POLDA SULSEL akan segera menindaklanjuti", time: "Hari ini", roles: ["umum"], timestamp: Date.now() - 1000 * 60 * 45 },
  { id: 17, type: "info", title: "⏰ Layanan KUBOYAKO Aktif 24 Jam", desc: "Cek kendaraan & HP kapan saja · RESMOB POLDA SULSEL", time: "Kemarin", roles: ["umum"], timestamp: Date.now() - 1000 * 60 * 60 * 22 },
  { id: 18, type: "info", title: "💡 Tips Keamanan Transaksi", desc: "Selalu cek status kendaraan & HP sebelum bertransaksi", time: "Kemarin", roles: ["umum"], timestamp: Date.now() - 1000 * 60 * 60 * 26 },
  { id: 19, type: "info", title: "📱 Pembaruan Layanan", desc: "KUBOYAKO v2026.1 · Verifikasi wajah & identitas lebih aman", time: "2 hari lalu", roles: ["umum"], timestamp: Date.now() - 1000 * 60 * 60 * 48 },
];

export function getUnreadCount(roleKey: string): number {
  const notifs = ALL_NOTIFS.filter((n) => n.roles.includes(roleKey));
  const readIdsStr = localStorage.getItem(`kuboyako_read_notifs_${roleKey}`);
  const deletedIdsStr = localStorage.getItem(`kuboyako_deleted_notifs_${roleKey}`);
  const readIds: number[] = readIdsStr ? JSON.parse(readIdsStr) : [];
  const deletedIds: number[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
  const active = notifs.filter((n) => !deletedIds.includes(n.id));
  return active.filter((n) => !readIds.includes(n.id)).length;
}

const iconFor = (type: NotifType, read: boolean) => {
  const opacity = read ? "opacity-60" : "opacity-100";
  if (type === "alert") return <ShieldAlert className={`w-5 h-5 text-destructive ${opacity}`} />;
  if (type === "success") return <CheckCircle2 className={`w-5 h-5 text-emerald-500 ${opacity}`} />;
  return <Info className={`w-5 h-5 text-primary ${opacity}`} />;
};

const bgFor = (type: NotifType) => {
  if (type === "alert") return "bg-destructive/10 border-destructive/20";
  if (type === "success") return "bg-emerald-500/10 border-emerald-500/20";
  return "bg-primary/10 border-primary/20";
};

export default function Notifications() {
  const r = role();
  const { toast } = useToast();
  const [readIds, setReadIds] = useState<number[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load read notifications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`kuboyako_read_notifs_${r}`);
    if (saved) {
      setReadIds(JSON.parse(saved));
    }
    const deleted = localStorage.getItem(`kuboyako_deleted_notifs_${r}`);
    if (deleted) {
      setDeletedIds(JSON.parse(deleted));
    }
  }, [r]);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(`kuboyako_read_notifs_${r}`, JSON.stringify(readIds));
  }, [readIds, r]);

  useEffect(() => {
    localStorage.setItem(`kuboyako_deleted_notifs_${r}`, JSON.stringify(deletedIds));
  }, [deletedIds, r]);

  // Filter notifications for current role
  const allNotifs = ALL_NOTIFS.filter((n) => n.roles.includes(r) && !deletedIds.includes(n.id));
  const notifs = allNotifs;
  const unreadCount = notifs.filter((n) => !readIds.includes(n.id)).length;
  const readCount = notifs.filter((n) => readIds.includes(n.id)).length;

  const markAsRead = useCallback((id: number) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
      if (soundEnabled) {
        playNotificationSound();
      }
    }
  }, [readIds, soundEnabled]);

  const markAllAsRead = useCallback(() => {
    const allIds = notifs.map((n) => n.id);
    setReadIds(allIds);
    toast({
      title: "Semua notifikasi ditandai dibaca",
      description: `${unreadCount} notifikasi telah ditandai`,
    });
  }, [notifs, unreadCount, toast]);

  const deleteNotification = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletedIds((prev) => [...prev, id]);
    toast({
      title: "Notifikasi dihapus",
      description: "Notifikasi telah dihapus dari daftar",
    });
  }, [toast]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
      toast({
        title: "Notifikasi diperbarui",
        description: "Daftar notifikasi telah disinkronkan",
      });
    }, 1500);
  }, [toast]);

  const clearAll = useCallback(() => {
    if (confirm("Hapus semua notifikasi?")) {
      setDeletedIds(notifs.map((n) => n.id));
      toast({
        title: "Semua notifikasi dihapus",
        description: "Daftar notifikasi telah dikosongkan",
      });
    }
  }, [notifs, toast]);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    return generateTimeString(minutes);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="notif-eyebrow" defaultText="Sistem" />}
        title={<LiveText as="span" id="notif-title" defaultText={`Notifikasi ${unreadCount > 0 ? `(${unreadCount})` : ""}`} />}
        subtitle={<LiveText as="span" id="notif-subtitle" defaultText="Pembaruan dan peringatan sistem KUBOYAKO." />}
        back={true}
        right={
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-10 h-10 surface-glass rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label={soundEnabled ? "Matikan suara" : "Aktifkan suara"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <span className="w-10 h-10 surface-glass rounded-2xl flex items-center justify-center text-muted-foreground">
              <Bell className="w-4 h-4" />
            </span>
          </div>
        }
      />

      <div className="px-6 space-y-3">
        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface rounded-2xl p-3 flex items-center gap-3"
        >
          <span className={`w-2 h-2 rounded-full animate-pulse ${unreadCount > 0 ? "bg-primary" : "bg-emerald-500"}`} />
          <p className="text-xs text-muted-foreground flex-1">
            <LiveText
              as="span"
              id="notif-status-summary"
              defaultText={
                unreadCount > 0
                  ? `${unreadCount} belum dibaca · ${readCount} sudah dibaca`
                  : "Semua notifikasi telah dibaca"
              }
            />
          </p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">
              {refreshing ? (
                <LiveText as="span" id="notif-refresh-loading" defaultText="Memuat..." />
              ) : (
                <LiveText as="span" id="notif-refresh-idle" defaultText="Refresh" />
              )}
            </span>
          </button>
        </motion.div>

        {/* Action buttons */}
        {notifs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex-1 h-10 surface rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <LiveText as="span" id="notif-read-all-btn" defaultText="Tandai semua dibaca" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="flex-1 h-10 surface rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <LiveText as="span" id="notif-clear-btn" defaultText="Hapus semua" />
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {notifs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="surface rounded-3xl border-dashed border border-white/10 p-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-primary/50" />
              </div>
              <p className="eyebrow text-muted-foreground/60 mb-1"><LiveText as="span" id="notif-empty-title" defaultText="Tidak ada notifikasi" /></p>
              <p className="text-xs text-muted-foreground/40">
                <LiveText
                  as="span"
                  id="notif-empty-updated"
                  defaultText={`Diperbarui: ${lastRefresh.toLocaleTimeString("id-ID")}`}
                />
              </p>
            </motion.div>
          ) : (
            notifs.map((n, i) => {
              const isRead = readIds.includes(n.id);
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => markAsRead(n.id)}
                  className={`group surface-elevated rounded-2xl px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-all hover:scale-[1.02] ${
                    isRead ? "opacity-70" : "opacity-100 border border-primary/20"
                  }`}
                >
                  {/* Icon */}
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bgFor(n.type)}`}>
                    {iconFor(n.type, isRead)}
                  </span>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold truncate ${isRead ? "text-muted-foreground" : "text-foreground"}`}>
                        <LiveText as="span" id={`notif-card-${n.id}-title`} defaultText={n.title} />
                      </p>
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      <LiveText as="span" id={`notif-card-${n.id}-desc`} defaultText={n.desc} />
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1.5 flex items-center gap-1">
                      <span>{formatTime(n.timestamp)}</span>
                      <span>·</span>
                      <span>{n.time}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20"
                        title="Tandai dibaca"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => deleteNotification(n.id, e)}
                      className="w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Footer info */}
        {notifs.length > 0 && (
          <p className="text-center text-[10px] text-muted-foreground/40 pt-4">
            <LiveText
              as="span"
              id="notif-footer-meta"
              defaultText={`Diperbarui: ${lastRefresh.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}${
                soundEnabled ? " · Suara aktif" : " · Suara nonaktif"
              }`}
            />
          </p>
        )}
      </div>
    </div>
  );
}
