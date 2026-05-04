import { useState, useEffect } from "react";
import { Clock, User, Shield, Info, AlertTriangle, Search } from "lucide-react";
import { motion } from "framer-motion";
import { getLogs, SystemLog } from "@/lib/store";
import { exportToCsv } from "@/lib/export";
import { PageHeader } from "@/components/layout/page-header";
import { Icon3D } from "@/components/ui/icon-3d";
import { icons3d } from "@/assets/icons";
import { LiveText } from "@/components/ui/live-text";

export default function AdminLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(filter.toLowerCase()) ||
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.details.toLowerCase().includes(filter.toLowerCase())
  );

  const getLogIcon = (action: string) => {
    if (action.includes("FAILED")) return <AlertTriangle className="w-4 h-4 text-destructive" />;
    if (action.includes("CREATE") || action.includes("SAVE")) return <Info className="w-4 h-4 text-primary" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const handleExport = () => {
    const dataToExport = filteredLogs.map(log => ({
      ID: log.id,
      Timestamp: new Date(log.timestamp).toLocaleString("id-ID"),
      User: log.user,
      Role: log.role,
      Action: log.action,
      Details: log.details
    }));
    exportToCsv(`Log_Aktivitas_${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      <PageHeader
        eyebrow={<LiveText as="span" id="logs-eyebrow" defaultText="Security" />}
        title={<LiveText as="span" id="logs-title" defaultText="Log Aktivitas" />}
        subtitle={<LiveText as="span" id="logs-subtitle" defaultText="Pantau riwayat penggunaan sistem dan audit keamanan." />}
        back="/admin"
        right={
          <button
            onClick={handleExport}
            className="w-11 h-11 surface-glass rounded-2xl flex items-center justify-center text-primary"
          >
            <Info className="w-5 h-5" />
          </button>
        }
      />

      <div className="px-6 mb-6">
        <div className="surface rounded-2xl p-1.5 flex gap-2 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
          <div className="w-10 h-10 flex items-center justify-center text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari log..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground"
          />
        </div>
      </div>

      <div className="px-6 space-y-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="eyebrow">Aktivitas Terbaru</h2>
          <span className="text-[10px] text-muted-foreground/60">{filteredLogs.length} Entri</span>
        </div>

        {filteredLogs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="surface rounded-2xl p-4 border border-white/5"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg surface-glass flex items-center justify-center shrink-0 mt-1">
                {getLogIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{log.action}</p>
                  <p className="text-[9px] text-muted-foreground font-mono">
                    {new Date(log.timestamp).toLocaleTimeString("id-ID")}
                  </p>
                </div>
                <p className="text-[11px] text-foreground font-medium mt-0.5 leading-relaxed">
                  {log.details}
                </p>
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${log.role === "admin" ? "bg-primary" : "bg-accent"}`} />
                  <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">
                    {log.user} · {log.role}
                  </p>
                  <p className="text-[9px] text-muted-foreground/40 ml-auto">
                    {new Date(log.timestamp).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="py-20 text-center">
            <p className="eyebrow text-muted-foreground/50">Tidak ada log ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
