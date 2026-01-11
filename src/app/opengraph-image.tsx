import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Let Me ChatGPT That For You - Create shareable ChatGPT links";
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
      {/* Logo */}
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
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#10a37f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "24px",
          letterSpacing: "-0.02em",
        }}
      >
        Let Me ChatGPT That
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "28px",
          color: "#9b9b9b",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.4,
        }}
      >
        Create shareable links that show how easy it is to ask ChatGPT
      </div>

      {/* Accent line */}
      <div
        style={{
          width: "120px",
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
