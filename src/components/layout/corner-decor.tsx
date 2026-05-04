import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import badik from "@/assets/badik.png";
import aug from "@/assets/aug.png";

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

const CORNERS = [
  { key: "tl", cls: "top-0 left-0", origin: "top left", float: { x: [0, 6, 0], y: [0, 4, 0] } },
  { key: "tr", cls: "top-0 right-0", origin: "top right", float: { x: [0, -6, 0], y: [0, 4, 0] } },
  { key: "bl", cls: "bottom-0 left-0", origin: "bottom left", float: { x: [0, 6, 0], y: [0, -4, 0] } },
  { key: "br", cls: "bottom-0 right-0", origin: "bottom right", float: { x: [0, -6, 0], y: [0, -4, 0] } },
];

export function CornerDecor() {
  const { pathname } = useLocation();

  const layout = useMemo(() => {
    const rand = mulberry32(hashString(pathname || "/"));
    const shuffled = [...CORNERS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const rot = () => Math.round(rand() * 50 - 25);
    return [
      { ...shuffled[0], src: badik, rot: rot(), dur: 6 + rand() * 2 },
      { ...shuffled[1], src: aug, rot: rot(), dur: 7 + rand() * 2 },
    ];
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {layout.map((it) => (
        <motion.div
          key={it.key}
          className={`absolute ${it.cls}
            w-[44vw] h-[44vw]
            sm:w-[32vw] sm:h-[32vw]
            md:w-[26vw] md:h-[26vw]
            lg:w-[22vw] lg:h-[22vw]
            max-w-[360px] max-h-[360px]
            min-w-[140px] min-h-[140px]
            -translate-x-[18%] -translate-y-[18%]
            data-[corner=tr]:translate-x-[18%] data-[corner=tr]:-translate-y-[18%]
            data-[corner=bl]:-translate-x-[18%] data-[corner=bl]:translate-y-[18%]
            data-[corner=br]:translate-x-[18%] data-[corner=br]:translate-y-[18%]
          `}
          data-corner={it.key}
          style={{
            transformOrigin: it.origin,
            opacity: 0.32,
            filter:
              "drop-shadow(0 10px 28px rgba(249,115,22,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.55))",
            maskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 95%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 95%)",
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: it.rot }}
          animate={{
            opacity: 0.32,
            scale: [1, 1.04, 1],
            rotate: [it.rot, it.rot + 3, it.rot],
            x: it.float.x,
            y: it.float.y,
          }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: it.dur, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: it.dur * 1.2, repeat: Infinity, ease: "easeInOut" },
            x: { duration: it.dur, repeat: Infinity, ease: "easeInOut" },
            y: { duration: it.dur * 1.1, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <img
            src={it.src}
            alt=""
            aria-hidden
            draggable={false}
            className="w-full h-full object-contain select-none"
          />
        </motion.div>
      ))}
    </div>
  );
}
