import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, CheckCircle2, Wand2, Lock, Key } from "lucide-react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { useToast } from "@/hooks/use-toast";
import { LiveText } from "@/components/ui/live-text";

export function LiveEditToggle() {
  const { isEditMode, setEditMode, unlocked, setUnlocked } = useLiveEditStore();
  const { toast } = useToast();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  const handleToggle = () => {
    if (isEditMode) {
      setEditMode(false);
      return;
    }
    if (unlocked) {
      setEditMode(true);
      toast({ title: "Live Edit Aktif", description: "Mode edit diaktifkan kembali." });
      return;
    }
    setShowPasswordModal(true);
  };

  const verifyPassword = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordInput === "8686resmob") {
      setUnlocked(true);
      setEditMode(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      toast({
        title: "Live Edit Aktif",
        description: "Otorisasi tersimpan. Tidak perlu password lagi di sesi berikutnya.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Password Salah",
        description: "Kode otorisasi tidak valid.",
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
        className="live-edit-toggle-wrap fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none"
      >
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="surface-elevated rounded-2xl p-3 border border-primary/30 shadow-[0_10px_40px_hsl(var(--primary)/0.2)] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse text-primary">
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold text-primary">
                  <LiveText as="span" id="live-toggle-banner-title" defaultText="Live Edit ON" />
                </p>
                <p className="text-[10px] text-muted-foreground">
                  <LiveText as="span" id="live-toggle-banner-hint" defaultText="Click text to modify" />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleToggle}
          className={`live-toolbar-btn w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-auto shadow-2xl ${
            isEditMode
              ? "bg-primary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.5)] ring-4 ring-primary/20"
              : "bg-black/50 text-white/70 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle Live Edit Mode"
        >
          <AnimatePresence mode="wait">
            {isEditMode ? (
              <motion.div
                key="active"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="inactive"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
              >
                <Edit3 className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-sm surface-elevated rounded-3xl p-6 border border-white/10 shadow-2xl pointer-events-auto"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="display-font text-lg text-foreground text-center mb-1">Otorisasi Live Edit</h3>
              <p className="text-[10px] text-muted-foreground text-center mb-6 uppercase tracking-widest font-bold">Admin Only Access</p>
              
              <form onSubmit={verifyPassword} className="space-y-4">
                <div className="relative surface rounded-xl focus-within:ring-2 focus-within:ring-primary/40 transition-all border border-white/5">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    autoFocus
                    type="password"
                    placeholder="Masukkan Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 bg-transparent outline-none text-sm font-medium text-foreground"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setPasswordInput(""); }}
                    className="flex-1 h-12 rounded-xl surface text-foreground font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20"
                  >
                    Aktifkan
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
