import React from "react";
import { motion } from "framer-motion";
import { useLiveEditStore } from "@/store/useLiveEditStore";
import { ImagePlus } from "lucide-react";
import { LiveText } from "@/components/ui/live-text";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";
type Intensity = "low" | "normal" | "high";

interface Logo3DImgProps {
  size?: Size;
  float?: boolean;
  intensity?: Intensity;
  className?: string;
}

/* px dimensions used as inline style so glow is always centered */
const imgPx: Record<Size, number> = {
  xs: 110,
  sm: 170,
  md: 240,
  lg: 320,
  xl: 400,
  hero: 600,
};

const glowScale: Record<Size, number> = {
  xs: 1.8,
  sm: 1.9,
  md: 2.0,
  lg: 2.1,
  xl: 2.2,
  hero: 2.3,
};

const shadowFilter: Record<Intensity, string> = {
  low:
    "drop-shadow(0 2px 6px rgba(0,0,0,0.75)) " +
    "drop-shadow(0 6px 16px rgba(249,115,22,0.45))",
  normal:
    "drop-shadow(0 2px 6px rgba(0,0,0,0.85)) " +
    "drop-shadow(0 8px 20px rgba(0,0,0,0.55)) " +
    "drop-shadow(0 14px 32px rgba(249,115,22,0.55)) " +
    "drop-shadow(0 24px 50px rgba(249,115,22,0.30))",
  high:
    "drop-shadow(0 3px 8px rgba(0,0,0,0.95)) " +
    "drop-shadow(0 10px 24px rgba(0,0,0,0.65)) " +
    "drop-shadow(0 20px 44px rgba(249,115,22,0.65)) " +
    "drop-shadow(0 34px 70px rgba(249,115,22,0.38)) " +
    "drop-shadow(0 -2px 8px rgba(255,200,100,0.30))",
};

const tiltTransform: Record<Size, string> = {
  xs: "perspective(300px) rotateX(6deg) rotateY(-5deg) scale(1.02)",
  sm: "perspective(380px) rotateX(8deg) rotateY(-6deg) scale(1.03)",
  md: "perspective(450px) rotateX(10deg) rotateY(-8deg) scale(1.04)",
  lg: "perspective(520px) rotateX(11deg) rotateY(-9deg) scale(1.05)",
  xl: "perspective(620px) rotateX(12deg) rotateY(-10deg) scale(1.05)",
  hero: "perspective(720px) rotateX(14deg) rotateY(-12deg) scale(1.06)",
};

const labelSize: Record<Size, { line1: string; line2: string }> = {
  xs: { line1: "text-[0px]", line2: "text-[0px]" },
  sm: { line1: "text-[0px]", line2: "text-[0px]" },
  md: { line1: "text-[7px]", line2: "text-[7px]" },
  lg: { line1: "text-[9px]", line2: "text-[8px]" },
  xl: { line1: "text-[10px]", line2: "text-[9px]" },
  hero: { line1: "text-[12px]", line2: "text-[11px]" },
};

export function Logo3DImg({
  size = "md",
  float = false,
  intensity = "normal",
  className = "",
}: Logo3DImgProps) {
  const { isEditMode, images, activeElementId, setActiveElementId } = useLiveEditStore();

  const currentSrc = images["main-logo"] || "/logo.png";
  const isActive = isEditMode && activeElementId === "main-logo";
  const hasActiveElement = isEditMode && activeElementId !== null;

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveElementId("main-logo");
  };

  const px = imgPx[size];
  const gpx = Math.round(px * glowScale[size]);
  const showLabel = px >= 120;

  const containerStyle: React.CSSProperties = {
    width: px,
    height: px,
    flexShrink: 0,
  };

  const tiltStyle: React.CSSProperties = {
    filter: shadowFilter[intensity],
    transform: tiltTransform[size],
    willChange: "transform",
  };

  const glowStyle: React.CSSProperties = {
    width: gpx,
    height: gpx,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const midGlowStyle: React.CSSProperties = {
    width: px * 1.3,
    height: px * 1.3,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const floorStyle: React.CSSProperties = {
    width: px * 0.9,
    height: px * 0.3,
    bottom: "-12%",
    left: "50%",
    transform: "translateX(-50%)",
    background: "radial-gradient(ellipse at center, rgba(249,115,22,0.65) 0%, transparent 70%)",
  };

  const floatVariants = float
    ? {
      animate: { y: [0, -(px * 0.06), 0] },
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
    }
    : {};

  const ls = labelSize[size];

  // Top label sized proportionally to logo width
  const topLabelWidth = Math.round(px * 0.95);
  const topLabelFontPx = Math.max(8, Math.round(px * 0.085));
  const topLabelTracking = `${Math.max(1, Math.round(px * 0.012))}px`;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      {/* Top institutional label removed — now part of logo image */}
      {/* Image wrapper — relative container so glows center on the image */}
      <div className="relative flex items-center justify-center" style={containerStyle}>
        {/* Outer ambient glow */}
        <div
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{ ...glowStyle, filter: "blur(56px)" }}
        />
        {/* Mid glow ring */}
        <div
          className="absolute rounded-full bg-primary/18 pointer-events-none"
          style={{ ...midGlowStyle, filter: "blur(24px)" }}
        />
        {/* Floor reflection */}
        <div
          className="absolute rounded-full pointer-events-none opacity-40"
          style={{ ...floorStyle, filter: "blur(18px)" }}
        />
        {/* Logo image */}
        <div
          id="main-logo"
          className={`relative flex items-center justify-center ${isEditMode ? "group cursor-pointer" : ""} ${isActive ? "ring-2 ring-primary rounded-2xl pointer-events-auto" : ""} ${hasActiveElement && !isActive ? "opacity-30 pointer-events-none" : ""}`}
          onClick={handleImageClick}
          style={{ width: px, height: px, ...(isActive ? { position: "relative" as const, zIndex: 9999 } : {}) }}
        >
          <motion.img
            src={currentSrc}
            alt="KUBOYAKO"
            draggable={false}
            decoding="async"
            loading="eager"
            className={`relative object-contain select-none transition-all ${isEditMode && !hasActiveElement ? "group-hover:opacity-50 group-hover:blur-[2px]" : ""}`}
            style={{
              ...tiltStyle,
              width: px,
              height: px,
              imageRendering: "auto",
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            }}
            {...floatVariants}
          />
          {isEditMode && !isActive && !hasActiveElement && (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl">
                <ImagePlus className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom subtitle — only md and above */}
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`flex flex-col items-center gap-[3px] select-none ${isEditMode ? "" : "pointer-events-none"}`}
        >
          <LiveText
            as="p"
            id="logo-subtitle"
            defaultText="UNIT V SUBDIT JATANRAS DIREKTORAT KRIMINAL UMUM POLDA SULSEL"
            className={`font-black tracking-[0.20em] uppercase text-center text-foreground/95 ${ls.line1}`}
          />
          <div
            className="rounded-full bg-primary/40 mt-1"
            style={{ width: Math.min(px * 0.45, 52), height: 1 }}
          />
        </motion.div>
      )}
    </div>
  );
}
