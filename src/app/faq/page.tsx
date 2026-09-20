import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { faqItems } from "./faq-data";

const SITE_URL = "https://letmechatgptthat.app";
const PAGE_TITLE = "Frequently Asked Questions";
const PAGE_DESCRIPTION =
  "Find answers to common questions about Let Me ChatGPT That - how to create links, what happens when someone clicks them, and more.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

const faqJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQPage() {
  return (
    <div className="page-shell">
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {faqJsonLd}
      </Script>
      <Header />
      <main id="main" className="content-main">
        <Link href="/" className="back-link">
          Back to home
        </Link>
        <h1>Frequently asked questions</h1>
        <div>
          {faqItems.map((item) => (
            <details key={item.question} className="faq-item">
              <summary className="faq-summary">
                <span>{item.question}</span>
                <ChevronIcon className="faq-chevron" aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
