"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInput, MAX_QUERY_LENGTH } from "@/components/ChatInput";
import { LinkDisplay } from "@/components/LinkDisplay";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimationView } from "@/components/AnimationView";

function LandingPage() {
  const [query, setQuery] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef(false);

  async function generateLink() {
    const question = query.trim();
    // Lock synchronously: rapid Enter/click events can precede React's next render.
    if (!question || question.length > MAX_QUERY_LENGTH || pendingRef.current)
      return;
    pendingRef.current = true;
    setIsGenerating(true);
    setError(null);
    setGeneratedLink(null);
    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });
      if (!response.ok)
        throw new Error("Create link failed (" + response.status + ")");
      const data = await response.json();
      if (typeof data.url !== "string" || !/^https?:\/\//.test(data.url))
        throw new Error("Create link returned an invalid URL");
      setGeneratedLink(data.url);
    } catch (cause) {
      console.error("Could not create link", cause);
      setError("Couldn’t create your link. Try again.");
    } finally {
      pendingRef.current = false;
      setIsGenerating(false);
    }
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="landing-main" id="main">
        <div className="landing-content">
          <h1>Let Me ChatGPT That</h1>
          <ChatInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setGeneratedLink(null);
              setError(null);
            }}
            onSubmit={generateLink}
            isSubmitting={isGenerating}
            error={error}
          />
          {generatedLink && (
            <LinkDisplay key={generatedLink} link={generatedLink} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HomeContent() {
  const query = useSearchParams().get("q");
  return query ? <AnimationView key={query} query={query} /> : <LandingPage />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="loading-page" role="status">
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading</span>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
