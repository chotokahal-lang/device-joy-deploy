import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize viewport height CSS variable for accurate mobile viewport
function initViewportHeight() {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  
  // Set initial value
  setVH();
  
  // Update on resize and orientation change
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", () => {
    // Small delay to allow browser to settle after orientation change
    setTimeout(setVH, 100);
  });
  
  // Visual Viewport API for better mobile handling (keyboard, zoom)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setVH);
    window.visualViewport.addEventListener("scroll", setVH);
  }
}

// Detect device type and set body classes for CSS targeting
function initDeviceDetection() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  // Samsung device detection
  const isSamsung = /Samsung|SM-|SAMSUNG|Galaxy/i.test(ua);
  const isSamsungBrowser = /SamsungBrowser/i.test(ua);
  const isGalaxyFold = /SM-F9|SM-F7|Fold/i.test(ua);
  const isGalaxyFlip = /SM-F7[0-9]{2}|Flip/i.test(ua);
  const isGalaxyTab = /SM-T|SM-X|Galaxy Tab/i.test(ua);
  const isGalaxyS = /SM-S|SM-G9|Galaxy S/i.test(ua);
  const isGalaxyA = /SM-A/i.test(ua);
  const isGalaxyNote = /SM-N|Galaxy Note/i.test(ua);
  
  document.body.classList.toggle("is-ios", isIOS);
  document.body.classList.toggle("is-android", isAndroid);
  document.body.classList.toggle("is-touch", isTouchDevice);
  document.body.classList.toggle("is-safari", isSafari);
  
  // Samsung-specific classes
  document.body.classList.toggle("is-samsung", isSamsung);
  document.body.classList.toggle("is-samsung-browser", isSamsungBrowser);
  document.body.classList.toggle("is-galaxy-fold", isGalaxyFold);
  document.body.classList.toggle("is-galaxy-flip", isGalaxyFlip);
  document.body.classList.toggle("is-galaxy-tab", isGalaxyTab);
  document.body.classList.toggle("is-galaxy-s", isGalaxyS);
  document.body.classList.toggle("is-galaxy-a", isGalaxyA);
  document.body.classList.toggle("is-galaxy-note", isGalaxyNote);
  document.body.classList.toggle("is-one-ui", isSamsung && isAndroid);
  
  // Set orientation classes
  const updateOrientation = () => {
    const isPortrait = window.innerHeight > window.innerWidth;
    document.body.classList.toggle("is-portrait", isPortrait);
    document.body.classList.toggle("is-landscape", !isPortrait);
  };
  
  updateOrientation();
  window.addEventListener("resize", updateOrientation);
  window.addEventListener("orientationchange", () => setTimeout(updateOrientation, 100));
}

// Prevent iOS Safari zoom on input focus
function preventIOSZoom() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    // Ensure viewport meta tag has user-scalable=no for iOS
    let viewport = document.querySelector("meta[name=viewport]");
    if (viewport) {
      const content = viewport.getAttribute("content") || "";
      if (!content.includes("user-scalable=no")) {
        viewport.setAttribute("content", content + ", user-scalable=no");
      }
    }
  }
}

// Initialize all responsive features before mounting React
initViewportHeight();
initDeviceDetection();
preventIOSZoom();

createRoot(document.getElementById("root")!).render(<App />);
