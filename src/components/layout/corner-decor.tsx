import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import badik from "@/assets/badik.png";
import aug from "@/assets/aug.png";
import topi from "@/assets/topi.png";
import rompi from "@/assets/rompi.png";
import celana from "@/assets/celana.png";
import senjata from "@/assets/senjata.png";

const ASSETS = [topi, rompi, celana, senjata, badik, aug];

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const CORNERS = [
  {
    key: "tl",
    cls: "top-0 left-0",
    origin: "top left",
    tx: "-14%",
    ty: "-14%",
    baseRot: -12,
  },
  {
    key: "br",
    cls: "bottom-0 right-0",
    origin: "bottom right",
    tx: "14%",
    ty: "14%",
    baseRot: 12,
  },
];

export function CornerDecor() {
  const { pathname } = useLocation();
  const seed = hashString(pathname || "/");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {CORNERS.map((c, idx) => {
        const assetIdx = (seed + tick * (idx + 1) + idx * 3) % ASSETS.length;
        const src = ASSETS[assetIdx];
        return (
          <div
            key={c.key}
            className={`absolute ${c.cls}
              w-[40vw] h-[40vw]
              sm:w-[28vw] sm:h-[28vw]
              md:w-[22vw] md:h-[22vw]
              lg:w-[18vw] lg:h-[18vw]
              max-w-[300px] max-h-[300px]
              min-w-[120px] min-h-[120px]
            `}
            style={{
              transformOrigin: c.origin,
              translate: `${c.tx} ${c.ty}`,
            }}
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={assetIdx}
                src={src}
                alt=""
                aria-hidden
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain select-none will-change-transform"
                style={{
                  filter:
                    "drop-shadow(0 8px 22px rgba(249,115,22,0.45)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
                  maskImage:
                    "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 95%)",
                }}
                initial={{ opacity: 0, scale: 0.7, rotate: c.baseRot - 8 }}
                animate={{ opacity: 0.32, scale: 1, rotate: c.baseRot }}
                exit={{ opacity: 0, scale: 0.85, rotate: c.baseRot + 8 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
