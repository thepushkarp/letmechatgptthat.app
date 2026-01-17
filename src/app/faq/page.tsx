import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Header } from "@/components/Header";
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

export default function FAQPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-primary)" }}
    >
      <Script
        id="faq-json-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {faqJsonLd}
      </Script>

      <Header />

      <div className="flex-1 px-4 py-12 sm:py-16">
        <div className="w-full max-w-[680px] mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </Link>

          {/* Page header */}
          <header className="mb-10">
            <h1
              className="font-bold tracking-tight mb-3"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                lineHeight: 1.2,
              }}
            >
              Frequently Asked Questions
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "1.0625rem",
                lineHeight: 1.6,
              }}
            >
              Everything you need to know about Let Me ChatGPT That.
            </p>
          </header>

          {/* FAQ accordion */}
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details key={index} className="faq-item group">
                <summary className="faq-summary">
                  <span>{item.question}</span>
                  <svg
                    className="faq-chevron"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-6 px-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          This site is not affiliated with OpenAI.{" "}
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:underline"
            style={{ color: "var(--accent)" }}
          >
            ChatGPT
          </a>{" "}
          is a trademark of OpenAI.
        </p>
      </footer>
    </main>
  );
}
