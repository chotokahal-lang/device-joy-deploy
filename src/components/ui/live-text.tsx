import React, { useRef, useState } from "react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { cn } from "@/lib/utils";
import { Move } from "lucide-react";

/** Plain text → HTML aman; string yang sudah berisi tag HTML dipertahankan */
function toDisplayHtml(s: string): string {
  if (/<[a-z][\s\S]*>/i.test(s.trim())) return s;
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface LiveTextProps {
  id: string;
  defaultText: string;
  as?: string;
  className?: string;
  tagName?: string;
}

export const LiveText = React.forwardRef<HTMLElement, LiveTextProps>(
  ({ id, defaultText, as, tagName, className }, ref) => {
    const isEditMode = useLiveEditStore((s) => s.isEditMode);
    const activeElementId = useLiveEditStore((s) => s.activeElementId);
    const fromStore = useLiveEditStore((s) => s.texts[id]);
    const transform = useLiveEditStore((s) => s.transforms[id]);
    const beginEditElement = useLiveEditStore((s) => s.beginEditElement);
    const setActiveElementId = useLiveEditStore((s) => s.setActiveElementId);
    const patchTransform = useLiveEditStore((s) => s.patchTransform);
    const commit = useLiveEditStore((s) => s.commit);

    const wrapRef = useRef<HTMLSpanElement>(null);
    const [dragging, setDragging] = useState(false);

    const displayHtml = fromStore !== undefined ? fromStore : toDisplayHtml(defaultText);
    const isActive = isEditMode && activeElementId === id;
    const hasActiveElement = isEditMode && activeElementId !== null;

    const offsetX = transform?.offsetX ?? 0;
    const offsetY = transform?.offsetY ?? 0;

    const handleClick = (e: React.MouseEvent) => {
      if (isEditMode) {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey) {
          useLiveEditStore.getState().toggleSelect(id);
        } else {
          beginEditElement(id);
        }
      }
    };

    const startDrag = (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveElementId(id);
      const startX = e.clientX;
      const startY = e.clientY;
      const baseX = offsetX;
      const baseY = offsetY;
      setDragging(true);
      const move = (ev: PointerEvent) => {
        patchTransform(id, { offsetX: baseX + (ev.clientX - startX), offsetY: baseY + (ev.clientY - startY) }, false);
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

    const ComponentTag = (as || tagName || "span") as any;

    const wrapStyle: React.CSSProperties = {
      display: "inline-block",
      transform: offsetX || offsetY ? `translate(${offsetX}px, ${offsetY}px)` : undefined,
      position: "relative",
    };

    return (
      <span ref={wrapRef} style={wrapStyle} className={dragging ? "cursor-grabbing" : ""}>
        <ComponentTag
          ref={ref as any}
          id={id}
          data-live-text={id}
          onClick={handleClick}
          className={cn(
            "live-text-target transition-all duration-200",
            isEditMode && "cursor-pointer rounded-md px-0.5 -mx-0.5 relative z-[1]",
            isEditMode &&
              !hasActiveElement &&
              "ring-1 ring-inset ring-primary/30 hover:ring-primary/60 hover:bg-primary/[0.08]",
            isActive &&
              "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/12 shadow-[0_0_24px_hsl(var(--primary)/0.28)] z-[2]",
            hasActiveElement && !isActive && "opacity-[0.24] grayscale pointer-events-none select-none",
            className
          )}
          dangerouslySetInnerHTML={{ __html: displayHtml }}
        />
        {isActive && (
          <button
            type="button"
            onPointerDown={startDrag}
            className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl cursor-grab active:cursor-grabbing z-[60]"
            title="Geser posisi"
          >
            <Move className="w-3.5 h-3.5" />
          </button>
        )}
      </span>
    );
  }
);
LiveText.displayName = "LiveText";
