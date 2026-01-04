import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#212121",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Let Me ChatGPT That For You",
  description:
    "For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.",
  keywords: ["ChatGPT", "AI", "search", "LMGTFY", "let me google that"],
  authors: [{ name: "Let Me ChatGPT That" }],
  openGraph: {
    title: "Let Me ChatGPT That For You",
    description:
      "For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.",
    type: "website",
    siteName: "Let Me ChatGPT That",
  },
  twitter: {
    card: "summary_large_image",
    title: "Let Me ChatGPT That For You",
    description:
      "For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
