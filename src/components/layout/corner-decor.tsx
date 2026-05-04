import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import topi from "@/assets/topi.png";
import rompi from "@/assets/rompi.png";
import celana from "@/assets/celana.png";
import senjata from "@/assets/senjata.png";

const ASSETS = [topi, rompi, celana, senjata];

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 6 random anchor zones across the viewport — keeps content middle clear-ish */
const ZONES = [
  { top: "2%", left: "2%" },
  { top: "4%", right: "3%" },
  { top: "38%", left: "1%" },
  { top: "42%", right: "2%" },
  { bottom: "3%", left: "4%" },
  { bottom: "2%", right: "3%" },
] as const;

export function CornerDecor() {
  const { pathname } = useLocation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    const rng = mulberry32(hashString(pathname || "/") + tick * 1009);
    // pick 4 zones out of 6 deterministically per (path + tick)
    const zoneOrder = [...ZONES.keys()].sort(() => rng() - 0.5).slice(0, 4);
    return zoneOrder.map((zi, i) => {
      const zone = ZONES[zi];
      const asset = ASSETS[Math.floor(rng() * ASSETS.length)];
      const rot = Math.round((rng() - 0.5) * 40); // -20..20
      const driftX = Math.round((rng() - 0.5) * 14);
      const driftY = Math.round((rng() - 0.5) * 14);
      const delay = i * 0.15;
      return { zone, asset, rot, driftX, driftY, delay, key: `${zi}-${i}-${tick}` };
    });
  }, [pathname, tick]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {items.map((it) => (
          <motion.div
            key={it.key}
            className="absolute
              w-[34vw] h-[34vw]
              sm:w-[24vw] sm:h-[24vw]
              md:w-[18vw] md:h-[18vw]
              lg:w-[14vw] lg:h-[14vw]
              xl:w-[12vw] xl:h-[12vw]
              max-w-[240px] max-h-[240px]
              min-w-[96px] min-h-[96px]"
            style={it.zone as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.6, rotate: it.rot - 12 }}
            animate={{
              opacity: 0.28,
              scale: 1,
              rotate: it.rot,
              x: [0, it.driftX, 0],
              y: [0, it.driftY, 0],
            }}
            exit={{ opacity: 0, scale: 0.7, rotate: it.rot + 12 }}
            transition={{
              opacity: { duration: 1.0, delay: it.delay, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 1.0, delay: it.delay, ease: [0.16, 1, 0.3, 1] },
              rotate: { duration: 1.0, delay: it.delay, ease: [0.16, 1, 0.3, 1] },
              x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <img
              src={it.asset}
              alt=""
              aria-hidden
              draggable={false}
              className="w-full h-full object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 6px 18px rgba(249,115,22,0.40)) drop-shadow(0 4px 10px rgba(0,0,0,0.45))",
                maskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 96%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 96%)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
