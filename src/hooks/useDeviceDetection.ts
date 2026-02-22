"use client";

import { useState, useEffect } from "react";

export type DeviceType = "high" | "medium" | "low";
export type PerformanceLevel = "high" | "medium" | "low";

interface DeviceInfo {
  deviceType: DeviceType;
  performanceLevel: PerformanceLevel;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  prefersReducedMotion: boolean;
  hardwareConcurrency: number;
  memory: number | null;
}

function detectDeviceType(width: number): DeviceType {
  if (width < 768) return "low";
  if (width < 1024) return "medium";
  return "high";
}

function detectPerformanceLevel(info: Navigator & { hardwareConcurrency?: number; deviceMemory?: number }): PerformanceLevel {
  const cores = info.hardwareConcurrency || 2;
  const memory = info.deviceMemory || 4;
  
  // Check for low-end devices
  if (cores <= 2 || memory <= 2) return "low";
  // Check for mid-range devices
  if (cores <= 4 || memory <= 4) return "medium";
  // High-end devices
  return "high";
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    deviceType: "high",
    performanceLevel: "high",
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    supportsWebGL: true,
    prefersReducedMotion: false,
    hardwareConcurrency: 4,
    memory: null,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const navigator = window.navigator;
      
      const newDeviceType = detectDeviceType(width);
      const newPerformanceLevel = detectPerformanceLevel(navigator);
      
      // Override performance level based on device type
      const finalPerformanceLevel: PerformanceLevel = 
        newDeviceType === "low" ? "low" : 
        newDeviceType === "medium" ? "medium" : 
        newPerformanceLevel;

      setDeviceInfo({
        deviceType: newDeviceType,
        performanceLevel: finalPerformanceLevel,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        supportsWebGL: supportsWebGL(),
        prefersReducedMotion: prefersReducedMotion(),
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
        memory: (navigator as any).deviceMemory || null,
      });
    };

    // Initial detection
    updateDeviceInfo();

    // Listen for resize and reduced motion changes
    const handleResize = () => updateDeviceInfo();
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return deviceInfo;
}

// Hook to get animation settings based on device capabilities
export function useAnimations() {
  const { performanceLevel, prefersReducedMotion } = useDeviceDetection();
  
  const shouldAnimate = performanceLevel !== "low" && !prefersReducedMotion;
  const animationDuration = performanceLevel === "high" ? 0.3 : performanceLevel === "medium" ? 0.5 : 0;
  const staggerDelay = performanceLevel === "high" ? 0.1 : 0;

  return {
    shouldAnimate,
    animationDuration,
    staggerDelay,
    performanceLevel,
  };
}
