import { ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { AgentDebugger } from "@/components/agents/AgentDebugger";
import { CornerDecor } from "@/components/layout/corner-decor";

/**
 * MobileFrame
 *
 * Container app yang fluid & responsif untuk semua device.
 * Tidak mengunci tinggi / overflow → scroll natural mengikuti body.
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
      style={{ minHeight: "100dvh" }}
    >
      <CornerDecor />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col flex-1 w-full"
        style={{ minHeight: "100dvh" }}
      >
        {/* Wrapper konten — lebar penuh di HP, dipusatkan di desktop */}
        <div
          className="relative grain flex flex-col w-full mx-auto flex-1"
          style={{ maxWidth: "min(100%, 1600px)" }}
        >
          {children}
        </div>
      </motion.div>

      {/* Global Agent Debugger */}
      <AgentDebugger />
    </div>
  );
}
