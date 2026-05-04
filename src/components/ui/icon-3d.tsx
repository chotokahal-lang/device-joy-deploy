import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { LiveImage } from "./live-image";

type Size = "sm" | "md" | "lg" | "xl" | "hero";

const sizes: Record<Size, string> = {
  sm: "w-12 h-12 rounded-2xl p-2",
  md: "w-16 h-16 rounded-[1.4rem] p-2.5",
  lg: "w-20 h-20 rounded-[1.7rem] p-3",
  xl: "w-28 h-28 rounded-[2rem] p-4",
  hero: "w-44 h-44 rounded-[2.4rem] p-5",
};

interface Icon3DProps extends HTMLMotionProps<"div"> {
  src: string;
  alt: string;
  size?: Size;
  glow?: boolean;
  tone?: "primary" | "neutral" | "accent";
  float?: boolean;
}

const tones = {
  primary:
    "bg-[radial-gradient(circle_at_30%_20%,hsl(22_100%_55%/0.35),hsl(22_100%_30%/0.1)_60%,transparent_80%)] border-primary/25",
  neutral:
    "bg-[radial-gradient(circle_at_30%_20%,hsl(30_20%_96%/0.08),hsl(30_20%_96%/0.02)_60%,transparent_80%)] border-white/10",
  accent:
    "bg-[radial-gradient(circle_at_30%_20%,hsl(42_100%_60%/0.3),hsl(42_100%_45%/0.08)_60%,transparent_80%)] border-accent/25",
};

export function Icon3D({
  src,
  alt,
  size = "md",
  glow = true,
  tone = "primary",
  float = false,
  className,
  ...rest
}: Icon3DProps) {
  return (
    <motion.div
      {...rest}
      className={cn(
        "relative shrink-0 inline-flex items-center justify-center border surface",
        sizes[size],
        tones[tone],
        glow && "shadow-glow",
        float && "animate-float",
        className,
      )}
    >
      {/* Inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/10 via-transparent to-black/20"
      />
      <LiveImage
        id={`icon-${alt.replace(/\s+/g, '-').toLowerCase()}`}
        defaultSrc={src}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] relative z-10"
      />
    </motion.div>
  );
}
