import React from "react";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { cn } from "@/lib/utils";

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

export function LiveText({ id, defaultText, as, tagName, className }: LiveTextProps) {
  const isEditMode = useLiveEditStore((s) => s.isEditMode);
  const activeElementId = useLiveEditStore((s) => s.activeElementId);
  const fromStore = useLiveEditStore((s) => s.texts[id]);
  const beginEditElement = useLiveEditStore((s) => s.beginEditElement);

  const displayHtml = fromStore !== undefined ? fromStore : toDisplayHtml(defaultText);
  const isActive = isEditMode && activeElementId === id;
  const hasActiveElement = isEditMode && activeElementId !== null;

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      beginEditElement(id);
    }
  };

  const ComponentTag = as || tagName || "span";
  const Tag = ComponentTag as any;

  return (
    <Tag
      id={id}
      data-live-text={id}
      onClick={handleClick}
      className={cn(
        "live-text-target transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
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
  );
}
