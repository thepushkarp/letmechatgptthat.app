"use client";

interface AnimatedCursorProps {
  position: { x: number; y: number };
  isClicking: boolean;
  visible: boolean;
}

export function AnimatedCursor({
  position,
  isClicking,
  visible,
}: AnimatedCursorProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: isClicking ? "scale(0.85)" : "scale(1)",
        transition:
          "transform 0.1s ease-out, left 0.35s ease-out, top 0.35s ease-out",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        zIndex: 1000,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      }}
    >
      {/* macOS cursor - black arrow with white border */}
      <path
        d="M5.5 3.21V20.8l4.86-4.86h6.36L5.5 3.21z"
        fill="#000"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
