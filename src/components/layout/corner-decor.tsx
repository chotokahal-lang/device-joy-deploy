import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import badik from "@/assets/badik.png";
import aug from "@/assets/aug.png";

/**
 * CornerDecor — decorative images at corners.
 * Seeded by current route so layout stays consistent across re-renders/navigation
 * within the same page, but varies between pages.
 */

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function CornerDecor() {
  const { pathname } = useLocation();

  const layout = useMemo(() => {
    const rand = mulberry32(hashString(pathname || "/"));
    const corners = [
      { pos: "top-[-24px] left-[-24px] sm:top-[-32px] sm:left-[-32px]" },
      { pos: "top-[-24px] right-[-24px] sm:top-[-32px] sm:right-[-32px]" },
      { pos: "bottom-[-24px] left-[-24px] sm:bottom-[-32px] sm:left-[-32px]" },
      { pos: "bottom-[-24px] right-[-24px] sm:bottom-[-32px] sm:right-[-32px]" },
    ];
    // Fisher-Yates with seeded RNG
    const shuffled = [...corners];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const rot = () => Math.round(rand() * 60 - 30);
    return [
      { ...shuffled[0], src: badik, rot: rot() },
      { ...shuffled[1], src: aug, rot: rot() },
    ];
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {layout.map((it, i) => (
        <div
          key={i}
          className={`absolute ${it.pos} w-[38vw] h-[38vw] max-w-[260px] max-h-[260px] min-w-[120px] min-h-[120px]`}
          style={{
            transform: `rotate(${it.rot}deg)`,
            opacity: 0.14,
            maskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 90%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 90%)",
          }}
        >
          <img
            src={it.src}
            alt=""
            aria-hidden
            draggable={false}
            className="w-full h-full object-contain select-none"
          />
        </div>
      ))}
    </div>
  );
}
