import * as React from "react";

// Re-export from the comprehensive responsive hook for backward compatibility
export { useIsMobile } from "./use-responsive";

// Legacy MOBILE_BREAKPOINT constant for backward compatibility
export const MOBILE_BREAKPOINT = 768;

// Additional convenient hooks
export function useIsMobileSimple(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

// Export all responsive hooks for convenience
export {
  useResponsive,
  useIsTablet,
  useIsDesktop,
  useDeviceType,
  useOrientation,
  useBreakpoint,
  useMediaQuery,
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointBetween,
  ResponsiveProvider,
  // Samsung-specific hooks
  useSamsung,
  useIsSamsung,
  useIsGalaxyFold,
  useIsGalaxyFlip,
  useIsGalaxyTab,
  useSamsungDeviceType,
} from "./use-responsive";
