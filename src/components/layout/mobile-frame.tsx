import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { AgentDebugger } from "@/components/agents/AgentDebugger";

/**
 * MobileFrame
 *
 * Fluid, fully responsive app shell.
 * - Tidak ada lagi simulasi "frame HP" di desktop.
 * - Konten otomatis menyesuaikan setiap ukuran layar (HP, tablet, desktop).
 * - Menggunakan 100dvh / --vh fallback agar tinggi akurat di iOS/Android.
 */
export function MobileFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", () =>
      setTimeout(updateViewportHeight, 100)
    );
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateViewportHeight);
    }

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateViewportHeight);
      }
    };
  }, []);

  return (
    <div
      className="w-full font-sans relative flex flex-col"
      style={{
        minHeight: "100dvh",
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col flex-1 w-full overflow-hidden"
        style={{
          minHeight: "100dvh",
          height: "calc(var(--vh, 1vh) * 100)",
        }}
      >
        {/* Safe-area overlay (notch / status bar) */}
        <div
          className="pointer-events-none absolute inset-0 z-[70]"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        />

        {/* Scrollable konten utama */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 flex flex-col w-full"
          style={{
            background: "var(--gradient-deep)",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {/* Wrapper konten: lebar penuh di HP, dipusatkan dengan max-width di desktop */}
          <div className="relative grain min-h-full flex flex-col w-full mx-auto max-w-screen-2xl">
            {children}
          </div>
        </div>
      </motion.div>

      {/* Global Agent Debugger */}
      <AgentDebugger />
    </div>
  );
}
