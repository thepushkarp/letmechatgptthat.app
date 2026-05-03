import type { Metadata, Viewport } from "next";
import { Inter, Victor_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const victorMono = Victor_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

const SITE_URL = "https://letmechatgptthat.app";
const SITE_NAME = "Let Me ChatGPT That";
const SITE_TITLE = "Let Me ChatGPT That For You";
const SITE_DESCRIPTION =
  "Create shareable links that demonstrate how easy it is to ask ChatGPT. For people who find it easier to ask you than to ChatGPT it themselves.";
const OG_DESCRIPTION =
  "Create shareable links that show how easy it is to ask ChatGPT - for people who could have just asked ChatGPT themselves";
const TWITTER_DESCRIPTION =
  "Create shareable links that show how easy it is to ask ChatGPT";
const AUTHOR_NAME = "Pushkar Patel";
const AUTHOR_URL = "https://thepushkarp.com/";
const SITE_KEYWORDS = [
  "ChatGPT",
  "LMGTFY",
  "AI",
  "shareable links",
  "let me google that",
  "let me chatgpt that",
  "chatgpt link generator",
  "OpenAI",
  "AI search",
];

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: AUTHOR_NAME, url: AUTHOR_URL }],
  creator: AUTHOR_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: OG_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: TWITTER_DESCRIPTION,
    creator: "@thepushkarp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_TITLE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "WebApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
  },
  datePublished: "2026-01-06",
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en",
  keywords: SITE_KEYWORDS,
  sameAs: [SITE_URL, AUTHOR_URL],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {jsonLdString}
        </Script>
      </head>
      <body className={`${inter.variable} ${victorMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
