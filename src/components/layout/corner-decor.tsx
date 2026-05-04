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

/** Hanya 2 sudut: kiri-atas & kanan-bawah (sesuai brief). Tengah tetap bersih. */
const ZONES = [
  { top: "2%", left: "2%" },
  { bottom: "2%", right: "2%" },
] as const;

export function CornerDecor() {
  const { pathname } = useLocation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Rotasi pelan supaya animasi tidak ramai
    const id = setInterval(() => setTick((t) => t + 1), 14000);
    return () => clearInterval(id);
  }, []);

  const items = useMemo(() => {
    const rng = mulberry32(hashString(pathname || "/") + tick * 1009);
    return ZONES.map((zone, i) => {
      const asset = ASSETS[Math.floor(rng() * ASSETS.length)];
      const rot = Math.round((rng() - 0.5) * 20);
      return { zone, asset, rot, delay: i * 0.2, key: `${i}-${tick}` };
    });
  }, [pathname, tick]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {items.map((it) => (
          <motion.div
            key={it.key}
            className="absolute
              w-[26vw] h-[26vw]
              sm:w-[20vw] sm:h-[20vw]
              md:w-[16vw] md:h-[16vw]
              lg:w-[13vw] lg:h-[13vw]
              xl:w-[11vw] xl:h-[11vw]
              max-w-[220px] max-h-[220px]
              min-w-[80px] min-h-[80px]"
            style={it.zone as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.9, rotate: it.rot - 4 }}
            animate={{ opacity: 0.22, scale: 1, rotate: it.rot }}
            exit={{ opacity: 0, scale: 0.95, rotate: it.rot + 4 }}
            transition={{ duration: 1.6, delay: it.delay, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={it.asset}
              alt=""
              aria-hidden
              draggable={false}
              className="w-full h-full object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 6px 16px rgba(249,115,22,0.35)) drop-shadow(0 4px 10px rgba(0,0,0,0.40))",
                maskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 96%)",
                WebkitMaskImage:
                  "radial-gradient(circle at center, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 96%)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
