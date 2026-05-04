import { useMemo } from "react";
import badik from "@/assets/badik.png";
import aug from "@/assets/aug.png";

/**
 * CornerDecor — fixed decorative images at random corners.
 * Modern, subtle, blurred edges, low opacity, blends with background.
 */
export function CornerDecor() {
  const layout = useMemo(() => {
    const corners = [
      { pos: "top-[-40px] left-[-40px]", rot: -25 },
      { pos: "top-[-50px] right-[-40px]", rot: 30 },
      { pos: "bottom-[-50px] left-[-50px]", rot: 20 },
      { pos: "bottom-[-40px] right-[-40px]", rot: -35 },
    ];
    // shuffle
    const shuffled = [...corners].sort(() => Math.random() - 0.5);
    return [
      { ...shuffled[0], src: badik, size: 260 },
      { ...shuffled[1], src: aug, size: 240 },
    ];
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {layout.map((it, i) => (
        <div
          key={i}
          className={`absolute ${it.pos}`}
          style={{
            width: it.size,
            height: it.size,
            transform: `rotate(${it.rot}deg)`,
            opacity: 0.13,
            filter:
              "drop-shadow(0 12px 32px rgba(249,115,22,0.35)) blur(0.4px)",
            maskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)",
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
