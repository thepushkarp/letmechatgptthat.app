"use client";

interface ClickRippleProps {
  origin: { x: number; y: number };
  active: boolean;
}

export function ClickRipple({ origin, active }: ClickRippleProps) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        // Center the ripple on the click point
        left: origin.x - 24,
        top: origin.y - 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "rgba(116, 170, 156, 0.3)",
        pointerEvents: "none",
        zIndex: 999,
      }}
      className="animate-ripple"
    />
  );
}
