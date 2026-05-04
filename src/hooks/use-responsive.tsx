import * as React from "react";

// Breakpoints aligned with Tailwind CSS defaults
const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;
type DeviceType = "mobile" | "tablet" | "desktop";
type Orientation = "portrait" | "landscape";

// Samsung device types
type SamsungDeviceType = 
  | "galaxy-s" 
  | "galaxy-a" 
  | "galaxy-z-fold" 
  | "galaxy-z-flip" 
  | "galaxy-tab" 
  | "galaxy-note"
  | "other-samsung"
  | null;

interface SamsungInfo {
  isSamsung: boolean;
  isSamsungBrowser: boolean;
  deviceType: SamsungDeviceType;
  isGalaxyFold: boolean;
  isGalaxyFlip: boolean;
  isGalaxyTab: boolean;
  isOneUI: boolean;
  modelName: string | null;
}

interface ResponsiveState {
  width: number;
  height: number;
  deviceType: DeviceType;
  orientation: Orientation;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  breakpoint: BreakpointKey;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  pixelRatio: number;
  viewportScale: number;
  // Samsung specific
  samsung: SamsungInfo;
}

const ResponsiveContext = React.createContext<ResponsiveState | null>(null);

// Calculate CSS custom property --vh for accurate mobile viewport height
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Get safe area insets from CSS env() values
function getSafeAreaInsets() {
  const computedStyle = getComputedStyle(document.documentElement);
  const getInset = (side: string) => {
    const value = computedStyle.getPropertyValue(`--safe-area-inset-${side}`);
    return parseInt(value) || 0;
  };
  
  // Fallback to env() CSS values by creating a temporary element
  const temp = document.createElement("div");
  temp.style.position = "fixed";
  temp.style.top = "env(safe-area-inset-top, 0px)";
  temp.style.right = "env(safe-area-inset-right, 0px)";
  temp.style.bottom = "env(safe-area-inset-bottom, 0px)";
  temp.style.left = "env(safe-area-inset-left, 0px)";
  temp.style.visibility = "hidden";
  temp.style.pointerEvents = "none";
  document.body.appendChild(temp);
  
  const style = getComputedStyle(temp);
  const insets = {
    top: parseInt(style.top) || 0,
    right: parseInt(style.right) || 0,
    bottom: parseInt(style.bottom) || 0,
    left: parseInt(style.left) || 0,
  };
  
  document.body.removeChild(temp);
  return insets;
}

// Detect Samsung device details
function detectSamsungDevice(): SamsungInfo {
  const ua = navigator.userAgent;
  
  // Check if Samsung device
  const isSamsung = /Samsung|SM-|SAMSUNG|Galaxy/i.test(ua);
  const isSamsungBrowser = /SamsungBrowser/i.test(ua);
  
  if (!isSamsung) {
    return {
      isSamsung: false,
      isSamsungBrowser,
      deviceType: null,
      isGalaxyFold: false,
      isGalaxyFlip: false,
      isGalaxyTab: false,
      isOneUI: false,
      modelName: null,
    };
  }
  
  // Extract Samsung model
  const modelMatch = ua.match(/SM-([A-Z]\d{3,4}[A-Z]?)/i);
  const modelName = modelMatch ? modelMatch[1] : null;
  
  // Detect Galaxy Fold (SM-F series)
  const isGalaxyFold = /SM-F9|SM-F7|Fold/i.test(ua);
  
  // Detect Galaxy Flip (SM-F7 series specifically)
  const isGalaxyFlip = /SM-F7[0-9]{2}|Flip/i.test(ua);
  
  // Detect Galaxy Tab (SM-T or SM-X series)
  const isGalaxyTab = /SM-T|SM-X|Galaxy Tab/i.test(ua);
  
  // Detect Galaxy Note (SM-N series)
  const isGalaxyNote = /SM-N|Galaxy Note/i.test(ua);
  
  // Detect Galaxy S series (SM-S or SM-G series)
  const isGalaxyS = /SM-S|SM-G9|Galaxy S/i.test(ua);
  
  // Detect Galaxy A series (SM-A series)
  const isGalaxyA = /SM-A/i.test(ua);
  
  // One UI detection (Samsung's Android skin)
  const isOneUI = isSamsung && /Android/i.test(ua);
  
  // Determine device type
  let deviceType: SamsungDeviceType = "other-samsung";
  if (isGalaxyFold && !isGalaxyFlip) deviceType = "galaxy-z-fold";
  else if (isGalaxyFlip) deviceType = "galaxy-z-flip";
  else if (isGalaxyTab) deviceType = "galaxy-tab";
  else if (isGalaxyNote) deviceType = "galaxy-note";
  else if (isGalaxyS) deviceType = "galaxy-s";
  else if (isGalaxyA) deviceType = "galaxy-a";
  
  return {
    isSamsung: true,
    isSamsungBrowser,
    deviceType,
    isGalaxyFold,
    isGalaxyFlip,
    isGalaxyTab,
    isOneUI,
    modelName,
  };
}

function detectDeviceInfo() {
  const ua = navigator.userAgent;
  const samsung = detectSamsungDevice();
  
  return {
    isIOS: /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    isAndroid: /Android/i.test(ua),
    isSafari: /^((?!chrome|android).)*safari/i.test(ua),
    isChrome: /Chrome/i.test(ua) && !/Edge/i.test(ua),
    isFirefox: /Firefox/i.test(ua),
    isTouchDevice: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    pixelRatio: window.devicePixelRatio || 1,
    samsung,
  };
}

function getBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

function getDeviceType(width: number, isTouchDevice: boolean): DeviceType {
  // Mobile: < 768px or touch device with small screen
  if (width < BREAKPOINTS.md) return "mobile";
  // Tablet: 768px - 1024px or touch device with medium screen
  if (width < BREAKPOINTS.lg || (isTouchDevice && width < BREAKPOINTS.xl)) return "tablet";
  // Desktop: >= 1024px non-touch or >= 1280px touch
  return "desktop";
}

function getViewportScale(): number {
  const viewport = document.querySelector("meta[name=viewport]");
  if (!viewport) return 1;
  
  const content = viewport.getAttribute("content") || "";
  const match = content.match(/initial-scale=([0-9.]+)/);
  return match ? parseFloat(match[1]) : 1;
}

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ResponsiveState>(() => {
    const deviceInfo = detectDeviceInfo();
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const height = typeof window !== "undefined" ? window.innerHeight : 768;
    const orientation: Orientation = width > height ? "landscape" : "portrait";
    const breakpoint = getBreakpoint(width);
    const deviceType = getDeviceType(width, deviceInfo.isTouchDevice);
    
    return {
      width,
      height,
      deviceType,
      orientation,
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",
      isPortrait: orientation === "portrait",
      isLandscape: orientation === "landscape",
      breakpoint,
      safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      viewportScale: 1,
      ...deviceInfo,
    };
  });

  React.useEffect(() => {
    // Set initial viewport height
    setViewportHeight();
    
    const updateResponsiveState = () => {
      const deviceInfo = detectDeviceInfo();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation: Orientation = width > height ? "landscape" : "portrait";
      const breakpoint = getBreakpoint(width);
      const deviceType = getDeviceType(width, deviceInfo.isTouchDevice);
      const safeAreaInsets = getSafeAreaInsets();
      const viewportScale = getViewportScale();
      
      // Update --vh for accurate mobile viewport
      setViewportHeight();
      
      // Update body classes for CSS targeting
      document.body.classList.toggle("is-mobile", deviceType === "mobile");
      document.body.classList.toggle("is-tablet", deviceType === "tablet");
      document.body.classList.toggle("is-desktop", deviceType === "desktop");
      document.body.classList.toggle("is-touch", deviceInfo.isTouchDevice);
      document.body.classList.toggle("is-portrait", orientation === "portrait");
      document.body.classList.toggle("is-landscape", orientation === "landscape");
      document.body.classList.toggle("is-ios", deviceInfo.isIOS);
      document.body.classList.toggle("is-android", deviceInfo.isAndroid);
      
      // Samsung-specific body classes for CSS targeting
      document.body.classList.toggle("is-samsung", deviceInfo.samsung.isSamsung);
      document.body.classList.toggle("is-samsung-browser", deviceInfo.samsung.isSamsungBrowser);
      document.body.classList.toggle("is-galaxy-fold", deviceInfo.samsung.isGalaxyFold);
      document.body.classList.toggle("is-galaxy-flip", deviceInfo.samsung.isGalaxyFlip);
      document.body.classList.toggle("is-galaxy-tab", deviceInfo.samsung.isGalaxyTab);
      document.body.classList.toggle("is-one-ui", deviceInfo.samsung.isOneUI);
      
      // Samsung device type classes
      if (deviceInfo.samsung.deviceType) {
        document.body.classList.add(`is-${deviceInfo.samsung.deviceType}`);
      }
      
      setState({
        width,
        height,
        deviceType,
        orientation,
        isMobile: deviceType === "mobile",
        isTablet: deviceType === "tablet",
        isDesktop: deviceType === "desktop",
        isPortrait: orientation === "portrait",
        isLandscape: orientation === "landscape",
        breakpoint,
        safeAreaInsets,
        viewportScale,
        ...deviceInfo,
      });
    };

    // Initial update
    updateResponsiveState();

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateResponsiveState, 100);
    };

    // Orientation change handler (immediate)
    const handleOrientationChange = () => {
      // Small delay to allow browser to settle
      setTimeout(updateResponsiveState, 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Visual viewport API for better mobile handling
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", setViewportHeight);
    }

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", setViewportHeight);
      }
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={state}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive(): ResponsiveState {
  const context = React.useContext(ResponsiveContext);
  if (!context) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }
  return context;
}

// Convenience hooks for specific checks
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

export function useIsTablet(): boolean {
  const { isTablet } = useResponsive();
  return isTablet;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useResponsive();
  return isDesktop;
}

export function useDeviceType(): DeviceType {
  const { deviceType } = useResponsive();
  return deviceType;
}

export function useOrientation(): Orientation {
  const { orientation } = useResponsive();
  return orientation;
}

export function useBreakpoint(): BreakpointKey {
  const { breakpoint } = useResponsive();
  return breakpoint;
}

// Media query hook for custom breakpoints
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    mql.addEventListener("change", handler);
    setMatches(mql.matches);
    
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// Breakpoint comparison hooks
export function useBreakpointUp(breakpoint: BreakpointKey): boolean {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[breakpoint];
}

export function useBreakpointDown(breakpoint: BreakpointKey): boolean {
  const { width } = useResponsive();
  return width < BREAKPOINTS[breakpoint];
}

export function useBreakpointBetween(min: BreakpointKey, max: BreakpointKey): boolean {
  const { width } = useResponsive();
  return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max];
}

// Samsung-specific hooks
export function useSamsung(): SamsungInfo {
  const { samsung } = useResponsive();
  return samsung;
}

export function useIsSamsung(): boolean {
  const { samsung } = useResponsive();
  return samsung.isSamsung;
}

export function useIsGalaxyFold(): boolean {
  const { samsung } = useResponsive();
  return samsung.isGalaxyFold;
}

export function useIsGalaxyFlip(): boolean {
  const { samsung } = useResponsive();
  return samsung.isGalaxyFlip;
}

export function useIsGalaxyTab(): boolean {
  const { samsung } = useResponsive();
  return samsung.isGalaxyTab;
}

export function useSamsungDeviceType(): SamsungDeviceType {
  const { samsung } = useResponsive();
  return samsung.deviceType;
}
