import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AgentDebugger } from "@/components/agents/AgentDebugger";

// Responsive breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

type LayoutMode = "mobile-native" | "tablet" | "desktop-phone-frame" | "desktop-wide";

function getLayoutMode(width: number, height: number): LayoutMode {
  // Mobile devices (actual phones)
  if (width < BREAKPOINTS.md) {
    return "mobile-native";
  }
  // Tablets (768px - 1024px)
  if (width < BREAKPOINTS.lg) {
    return "tablet";
  }
  // Desktop with phone frame simulation (1024px - 1280px)
  if (width < BREAKPOINTS.xl) {
    return "desktop-phone-frame";
  }
  // Large desktop (>= 1280px) - centered phone frame with ambient effects
  return "desktop-wide";
}

export function MobileFrame({ children }: { children: ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    if (typeof window === "undefined") return "mobile-native";
    return getLayoutMode(window.innerWidth, window.innerHeight);
  });
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update viewport height CSS variable for accurate mobile height
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      setLayoutMode(getLayoutMode(width, height));
      updateViewportHeight();
      
      // Update body classes for CSS targeting
      document.body.classList.toggle("layout-mobile-native", getLayoutMode(width, height) === "mobile-native");
      document.body.classList.toggle("layout-tablet", getLayoutMode(width, height) === "tablet");
      document.body.classList.toggle("layout-desktop-phone", getLayoutMode(width, height) === "desktop-phone-frame");
      document.body.classList.toggle("layout-desktop-wide", getLayoutMode(width, height) === "desktop-wide");
    };

    // Initial setup
    handleResize();
    updateViewportHeight();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => setTimeout(handleResize, 100));
    
    // Visual viewport API for better mobile handling (keyboard, zoom)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const isMobileNative = layoutMode === "mobile-native";
  const isTablet = layoutMode === "tablet";
  const isDesktopPhone = layoutMode === "desktop-phone-frame";
  const isDesktopWide = layoutMode === "desktop-wide";
  const showPhoneFrame = isDesktopPhone || isDesktopWide;

  // Calculate frame dimensions based on layout mode
  const getFrameWidth = () => {
    if (isMobileNative) return "100%";
    if (isTablet) return "100%";
    if (isDesktopPhone) return "min(430px, 100vw - 2rem)";
    return "430px"; // desktop-wide
  };

  return (
    <div
      className={`
        w-full font-sans relative overflow-hidden
        ${showPhoneFrame ? "flex items-center justify-center" : "flex flex-col"}
        ${isTablet ? "flex flex-col" : ""}
      `}
      style={{ 
        minHeight: "100vh",
        minHeight: "calc(var(--vh, 1vh) * 100)",
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      {/* Ambient background glows (desktop only) */}
      {showPhoneFrame && (
        <>
          <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-primary/18 blur-[160px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-accent/8 blur-[180px] pointer-events-none" />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: isMobileNative ? 0 : 16, scale: isMobileNative ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`
          relative overflow-hidden flex flex-col
          ${showPhoneFrame 
            ? "rounded-[3rem] border-[10px] border-[hsl(24_30%_8%)] shadow-[0_60px_140px_-30px_hsl(20_100%_4%/0.9),0_0_0_1px_hsl(30_20%_96%/0.07)]" 
            : ""
          }
          ${isTablet 
            ? "w-full max-w-none rounded-none" 
            : ""
          }
        `}
        style={{
          width: getFrameWidth(),
          height: "calc(var(--vh, 1vh) * 100)",
          maxHeight: showPhoneFrame ? "min(932px, calc(var(--vh, 1vh) * 100 - 2rem))" : "calc(var(--vh, 1vh) * 100)",
        }}
      >
        {/* Safe-area overlay for notch / dynamic island / status bar */}
        <div
          className="pointer-events-none absolute inset-0 z-[70]"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        />

        {/* Screen sheen */}
        <div className="pointer-events-none absolute inset-0 z-50 bg-gradient-to-tr from-white/[0.015] via-transparent to-white/[0.04]" />

        {/* Dynamic island pill — desktop sim only */}
        {showPhoneFrame && (
          <div className="flex absolute top-3 inset-x-0 h-9 z-[60] pointer-events-none justify-center">
            <div className="h-7 w-28 rounded-full bg-black/95 border border-white/5 flex items-center justify-center gap-2.5 shadow-inner">
              <span className="w-7 h-1 rounded-full bg-white/10" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse" />
            </div>
          </div>
        )}

        {/* Scrollable content — flex-col fills remaining space */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative z-10 flex flex-col"
          style={{
            background: "var(--gradient-deep)",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div className="relative grain min-h-full flex flex-col">{children}</div>
        </div>

        {/* Home indicator bar — desktop frame only */}
        {showPhoneFrame && (
          <div className="flex absolute bottom-2.5 inset-x-0 z-[60] pointer-events-none justify-center">
            <div className="w-28 h-1 rounded-full bg-white/20" />
          </div>
        )}
      </motion.div>

      {/* Global Agent Debugger — accessible from any page */}
      <AgentDebugger />
    </div>
  );
}
