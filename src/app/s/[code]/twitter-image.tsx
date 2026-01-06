import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Someone sent you a link";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0d0d0d",
        padding: "60px",
      }}
    >
      {/* Mystery/Link icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#1a1a1a",
            border: "2px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10a37f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "56px",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "24px",
          letterSpacing: "-0.02em",
        }}
      >
        Someone sent you a link
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: "28px",
          color: "#9b9b9b",
          textAlign: "center",
          maxWidth: "700px",
          lineHeight: 1.4,
        }}
      >
        Click to see what they want to show you
      </div>

      {/* Accent line */}
      <div
        style={{
          width: "80px",
          height: "4px",
          backgroundColor: "#10a37f",
          borderRadius: "2px",
          marginTop: "40px",
        }}
      />
    </div>,
    {
      ...size,
    }
  );
}
