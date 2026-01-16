"use client";

import { useState, useEffect } from "react";

/**
 * Detects if the device has a coarse pointer (touch screen).
 * Returns `null` during SSR/initial render to prevent hydration mismatch,
 * then resolves to `true` or `false` after mount.
 */
export function useIsTouchDevice(): boolean | null {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for coarse pointer (touch screens)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isTouchDevice;
}
