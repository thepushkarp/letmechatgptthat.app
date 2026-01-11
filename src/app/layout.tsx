import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://letmechatgptthat.app";
const SITE_NAME = "Let Me ChatGPT That";
const SITE_TITLE = "Let Me ChatGPT That For You";
const SITE_DESCRIPTION =
  "Create shareable links that demonstrate how easy it is to ask ChatGPT. For people who find it easier to ask you than to ChatGPT it themselves.";
const AUTHOR_NAME = "Pushkar Patel";
const AUTHOR_URL = "https://thepushkarp.com";

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
  keywords: [
    "ChatGPT",
    "LMGTFY",
    "AI",
    "shareable links",
    "let me google that",
    "let me chatgpt that",
    "chatgpt link generator",
    "OpenAI",
    "AI search",
  ],
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
    description:
      "Create shareable links that show how easy it is to ask ChatGPT - for people who could have just asked ChatGPT themselves",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Create shareable links that show how easy it is to ask ChatGPT",
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
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
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
  datePublished: "2024-01-01",
  dateModified: "2025-01-07",
  inLanguage: "en",
  keywords: ["ChatGPT", "AI", "shareable links", "LMGTFY alternative"],
  sameAs: ["https://github.com/thepushkarp/letmechatgptthat.app", AUTHOR_URL],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Victor+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {jsonLdString}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
