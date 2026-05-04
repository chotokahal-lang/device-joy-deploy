import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import ContentEditable from "react-contenteditable";
import { Bold, Italic, Underline, AArrowUp, AArrowDown, ImagePlus, Check, X, Type, ZoomIn, ZoomOut, RotateCw, RotateCcw, RefreshCw, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { LiveText } from "@/components/ui/live-text";

export function LiveToolbar() {
  const { isEditMode, activeElementId, setActiveElementId, setImage, setText, scales, rotations, setScale, setRotation, resetElement } = useLiveEditStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  /** Draft lokal = tidak memaksa re-render dari store tiap ketukan → kursor stabil & mirror realtime ke store */
  const [draftHtml, setDraftHtml] = React.useState("");

  // 1. Declare derived state first
  const isVisible = !!(isEditMode && activeElementId);
  
  // Safe check for image type
  const getIsImage = () => {
    if (!activeElementId) return false;
    if (activeElementId.startsWith("icon-") || activeElementId === "main-logo") return true;
    const el = document.getElementById(activeElementId);
    if (!el) return false;
    if (el.tagName === "IMG") return true;
    // Check if contains an image child (LiveImage pattern)
    return !!el.querySelector("img");
  };
  
  const isImage = getIsImage();

  // 2. Define callback functions
  const dismiss = React.useCallback(() => {
    setActiveElementId(null);
  }, [setActiveElementId]);

  const handleChange = (evt: { target: { value: string } }) => {
    const v = evt.target.value;
    setDraftHtml(v);
    if (activeElementId) setText(activeElementId, v);
  };

  const handleCommand = (command: string, value?: string) => {
    const el = document.getElementById("central-editor");
    if (el) el.focus();
    setTimeout(() => {
      document.execCommand(command, false, value);
    }, 10);
  };

  // 3. Effects
  React.useEffect(() => {
    dismiss();
  }, [pathname, dismiss]);

  React.useEffect(() => {
    if (!activeElementId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeElementId, dismiss]);

  React.useEffect(() => {
    if (!activeElementId || isImage) {
      if (!activeElementId) setDraftHtml("");
      return;
    }
    const s = useLiveEditStore.getState();
    let html = s.texts[activeElementId];
    if (html === undefined && typeof document !== "undefined") {
      html = document.getElementById(activeElementId)?.innerHTML ?? "";
    }
    setDraftHtml(html ?? "");
  }, [activeElementId, isImage]);

  React.useEffect(() => {
    if (!activeElementId || isImage) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById("central-editor");
      if (!el) return;
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }, 80);
    return () => clearTimeout(t);
  }, [activeElementId, isImage]);

  React.useEffect(() => {
    if (isEditMode && activeElementId) {
      document.body.classList.add("live-edit-focus");
    } else {
      document.body.classList.remove("live-edit-focus");
    }
    return () => document.body.classList.remove("live-edit-focus");
  }, [isEditMode, activeElementId]);

  // 4. Handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeElementId) return;
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Directly set the base64 as the image source in the store
        setImage(activeElementId, base64);
        
        if (!isImage) {
           const el = document.getElementById("central-editor");
           if (el) el.focus();
           setTimeout(() => document.execCommand("insertImage", false, base64), 50);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image upload error:", err);
    }
    e.target.value = "";
  };

  const colors = ["#ffffff", "#f97316", "#3b82f6", "#10b981", "#ef4444", "#a855f7", "#ec4899"];

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="absolute w-0 h-0 opacity-0 pointer-events-none live-toolbar-btn"
        aria-hidden="true"
      />

      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[10001] bg-black/80 backdrop-blur-md pointer-events-auto"
              onClick={dismiss}
            />

            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="live-toolbar-editor-title"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="live-toolbar-panel relative z-[10002] w-full max-w-xl surface-elevated rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
            >
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-2 text-primary">
                      <Type className="w-4 h-4" />
                      <span id="live-toolbar-editor-title" className="eyebrow text-[10px] tracking-widest uppercase">
                        <LiveText as="span" id="live-toolbar-title" defaultText="Edit Content" />
                      </span>
                   </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); dismiss(); }} 
                        className="live-toolbar-btn w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all active:scale-90"
                      >
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                {!isImage && (
                  <div className="flex items-center gap-1 p-1 surface-glass rounded-2xl border border-white/5 flex-wrap">
                    <ToolBtn onClick={() => handleCommand("bold")} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
                    <ToolBtn onClick={() => handleCommand("italic")} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
                    <ToolBtn onClick={() => handleCommand("underline")} title="Underline"><Underline className="w-4 h-4" /></ToolBtn>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <ToolBtn onClick={() => handleCommand("fontSize", "5")} title="Bigger"><AArrowUp className="w-4 h-4" /></ToolBtn>
                    <ToolBtn onClick={() => handleCommand("fontSize", "2")} title="Smaller"><AArrowDown className="w-4 h-4" /></ToolBtn>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <ToolBtn onClick={() => handleCommand("justifyLeft")} title="Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
                    <ToolBtn onClick={() => handleCommand("justifyCenter")} title="Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
                    <ToolBtn onClick={() => handleCommand("justifyRight")} title="Right"><AlignRight className="w-4 h-4" /></ToolBtn>
                    <div className="w-px h-5 bg-white/10 mx-1" />
                    <div className="flex items-center gap-1 px-1">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onMouseDown={(e) => { e.preventDefault(); handleCommand("foreColor", c); }}
                          className="live-toolbar-btn w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {isImage && activeElementId && (
                  <ImageControls
                    scale={scales[activeElementId] ?? 1}
                    rotation={rotations[activeElementId] ?? 0}
                    onScale={(v) => setScale(activeElementId, v)}
                    onRotate={(v) => setRotation(activeElementId, v)}
                    onReset={() => resetElement(activeElementId)}
                  />
                )}
              </div>

              <div className="p-8 min-h-[12rem] max-h-[60vh] overflow-y-auto custom-scrollbar live-toolbar-editor-scroll">
                {isImage ? (
                  <div className="flex flex-col items-center justify-center gap-6 py-10">
                     <div className="w-48 h-48 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group bg-black/30 flex items-center justify-center">
                        <img 
                          src={useLiveEditStore.getState().images[activeElementId!] || document.getElementById(activeElementId!)?.getAttribute("src") || document.getElementById(activeElementId!)?.querySelector("img")?.getAttribute("src") || ""} 
                          className="max-w-full max-h-full object-contain transition-transform"
                          style={{ transform: `scale(${scales[activeElementId!] ?? 1}) rotate(${rotations[activeElementId!] ?? 0}deg)` }}
                          alt="Edit"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           <ImagePlus className="w-8 h-8 text-white" />
                        </div>
                     </div>
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="live-toolbar-btn h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center gap-3 shadow-glow hover:scale-105 transition-transform"
                     >
                        <ImagePlus className="w-5 h-5" />
                        <LiveText as="span" id="live-toolbar-replace-img" defaultText="Ganti Gambar" />
                     </button>
                  </div>
                ) : (
                  <ContentEditable
                    key={activeElementId}
                    id="central-editor"
                    html={draftHtml}
                    onChange={handleChange}
                    className="text-xl sm:text-2xl font-medium text-foreground outline-none leading-relaxed text-center min-h-[4rem] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl px-2 py-1"
                    spellCheck={false}
                  />
                )}
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col gap-3">
                 <div className="flex gap-3">
                    {!isImage && (
                       <button
                         onClick={() => fileInputRef.current?.click()}
                         className="live-toolbar-btn h-14 px-6 rounded-[1.25rem] surface-glass border border-white/10 text-foreground flex items-center gap-3 hover:bg-white/5 transition-colors"
                       >
                         <ImagePlus className="w-5 h-5 text-primary" />
                         <span className="text-sm font-semibold">
                           <LiveText as="span" id="live-toolbar-insert-media" defaultText="Insert Media" />
                         </span>
                       </button>
                    )}
                    <button
                       onClick={dismiss}
                       className="live-toolbar-btn flex-1 h-14 rounded-[1.25rem] gradient-primary text-primary-foreground font-bold flex items-center justify-center gap-3 shadow-glow hover:brightness-110 transition-all"
                    >
                       <Check className="w-5 h-5" />
                       <LiveText as="span" id="live-toolbar-save" defaultText="Simpan Perubahan" />
                    </button>
                 </div>
                 <button
                    onClick={dismiss}
                    className="live-toolbar-btn w-full h-10 rounded-xl text-xs font-bold text-muted-foreground hover:text-white transition-colors"
                 >
                    <LiveText as="span" id="live-toolbar-cancel" defaultText="Batal & Tutup" />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ToolBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="live-toolbar-btn w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors"
      title={title}
    >
      {children}
    </button>
  );
}
