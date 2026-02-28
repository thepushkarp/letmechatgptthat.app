"use client";

interface TapIndicatorProps {
  position: { x: number; y: number };
  isClicking: boolean;
  visible: boolean;
}

export function TapIndicator({
  position,
  isClicking,
  visible,
}: TapIndicatorProps) {
  return (
    <div
      style={{
        position: "absolute",
        // Center the indicator on the tap point
        left: position.x - 16,
        top: position.y - 16,
        width: 32,
        height: 32,
        transform: isClicking ? "scale(0.9) translateY(4px)" : "scale(1)",
        transition:
          "transform 0.15s ease-out, left 0.35s cubic-bezier(0.16, 1, 0.3, 1), top 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          border: "2px solid rgba(255, 255, 255, 0.6)",
        }}
      />
      {/* Inner dot */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
        }}
      />
    </div>
  );
}
