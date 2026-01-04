import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let Me ChatGPT That For You",
  description:
    "For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.",
  keywords: ["ChatGPT", "AI", "search", "LMGTFY", "let me google that"],
  openGraph: {
    title: "Let Me ChatGPT That For You",
    description:
      "For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
