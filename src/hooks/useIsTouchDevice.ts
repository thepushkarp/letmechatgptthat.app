"use client";

import { useMediaQuery } from "./useMediaQuery";

/**
 * Detects if the device has a coarse pointer (touch screen).
 * Returns `null` during SSR/initial render to prevent hydration mismatch,
 * then resolves to `true` or `false` after mount.
 */
export function useIsTouchDevice(): boolean | null {
  return useMediaQuery("(pointer: coarse)");
}
