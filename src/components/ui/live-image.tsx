import React, { useRef, useState } from "react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { LiveText } from "@/components/ui/live-text";
import { ImagePlus, Move } from "lucide-react";
import { motion } from "framer-motion";

interface LiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  id: string;
  defaultSrc: string;
}

export function LiveImage({ id, defaultSrc, className, alt, style, ...props }: LiveImageProps) {
  const { isEditMode, images, transforms, setImage, patchTransform, patchTransformMany, commit, activeElementId, setActiveElementId, toggleSelect, selectedIds } = useLiveEditStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSrc = images[id] || defaultSrc;
  const t = transforms[id] ?? {};
  const scale = t.scale ?? 1;
  const rotation = t.rotation ?? 0;
  const offsetX = t.offsetX ?? 0;
  const offsetY = t.offsetY ?? 0;
  const widthOverride = t.width;

  const isSelected = isEditMode && selectedIds.includes(id);
  const isActive = isEditMode && activeElementId === id;
  const hasActiveElement = isEditMode && activeElementId !== null;

  const [dragging, setDragging] = useState(false);

  const startDrag = (e: React.PointerEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const ids = selectedIds.length > 1 ? selectedIds : [id];
    const baseMap: Record<string, { x: number; y: number }> = {};
    const allTransforms = useLiveEditStore.getState().transforms;
    ids.forEach((eid) => {
      const tr = allTransforms[eid] ?? {};
      baseMap[eid] = { x: tr.offsetX ?? 0, y: tr.offsetY ?? 0 };
    });
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      ids.forEach((eid) => {
        const b = baseMap[eid];
        patchTransform(eid, { offsetX: b.x + dx, offsetY: b.y + dy }, false);
      });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDragging(false);
      commit();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (e: React.PointerEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    const baseW = widthOverride ?? rect?.width ?? 100;
    const startX = e.clientX;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const next = Math.max(40, baseW + dx);
      patchTransform(id, { width: next }, false);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      commit();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const containerStyle: React.CSSProperties = {
    transform: `translate(${offsetX}px, ${offsetY}px)`,
    width: widthOverride ? `${widthOverride}px` : undefined,
  };

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative inline-block w-full h-full transition-shadow ${isEditMode ? "group cursor-pointer rounded-xl" : ""} ${
        isActive ? "ring-2 ring-primary shadow-[0_0_20px_rgba(249,115,22,0.4)] z-[50]" : isSelected ? "ring-2 ring-accent z-[40]" : ""
      } ${hasActiveElement && !isActive && !isSelected ? "opacity-20 grayscale pointer-events-none" : ""} ${dragging ? "cursor-grabbing" : ""}`}
      style={containerStyle}
      onClick={(e) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        if (images[id] === undefined) setImage(id, currentSrc);
        if (e.shiftKey) toggleSelect(id); else setActiveElementId(id);
      }}
      onMouseDown={(e) => isEditMode && e.stopPropagation()}
    >
      <img
        src={currentSrc}
        alt={alt || "Image"}
        draggable={false}
        className={`transition-transform duration-200 w-full h-full object-contain select-none ${className || ""} ${
          isEditMode && !hasActiveElement ? "group-hover:opacity-80 ring-2 ring-transparent group-hover:ring-primary/50 rounded-xl" : ""
        }`}
        style={{ ...style, transform: `scale(${scale}) rotate(${rotation}deg)`, transformOrigin: "center" }}
        {...props}
      />

      {isActive && (
        <>
          <button
            type="button"
            onPointerDown={startDrag}
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing z-[60]"
            title="Drag"
          >
            <Move className="w-4 h-4" />
          </button>
          <div
            onPointerDown={startResize}
            className="absolute -bottom-2 -right-2 w-5 h-5 rounded-sm bg-primary border-2 border-white cursor-nwse-resize z-[60]"
            title="Resize"
          />
        </>
      )}

      {isEditMode && !isActive && !hasActiveElement && (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl opacity-0 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl mb-2">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
            <LiveText as="span" id="live-image-overlay-hint" defaultText="Edit Gambar" />
          </span>
        </motion.div>
      )}
    </div>
  );
}
