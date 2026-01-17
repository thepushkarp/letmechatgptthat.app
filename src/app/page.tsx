"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChatInput } from "@/components/ChatInput";
import { LinkDisplay } from "@/components/LinkDisplay";
import { Header } from "@/components/Header";
import { AnimationView } from "@/components/AnimationView";

function LandingPage() {
  const [query, setQuery] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Cleanup copied timeout on unmount
  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const generateLink = useCallback(async () => {
    if (!query.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate link");
      }

      setGeneratedLink(data.url);
      setCopied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate link");
    } finally {
      setIsGenerating(false);
    }
  }, [query, isGenerating]);

  const copyToClipboard = useCallback(async () => {
    if (!generatedLink) return;

    // Clear any existing timeout
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedLink]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateLink();
      }
    },
    [generateLink]
  );

  // Derived state for button enabled/disabled
  const canGenerate = !!query.trim() && !isGenerating;

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-primary)" }}
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[680px] space-y-10">
          {/* Hero section */}
          <div
            className={`text-center space-y-5 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
          >
            <h1
              className="font-bold tracking-tight"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                lineHeight: 1.1,
              }}
            >
              Let Me ChatGPT That
            </h1>
            <p
              className="max-w-lg mx-auto leading-relaxed"
              style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
              }}
            >
              For all those people who find it more convenient to bother you
              with their question rather than ChatGPT it themselves.
            </p>
          </div>

          {/* Input section */}
          <div
            className={`space-y-5 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            style={{
              transitionDelay: "100ms",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={generateLink}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
            />

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={generateLink}
                disabled={!canGenerate}
                className={`generate-btn font-medium ${canGenerate ? "enabled" : "disabled"}`}
                style={{
                  padding: "14px 32px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "15px",
                  opacity: isGenerating ? 0.7 : 1,
                }}
              >
                {isGenerating ? "Generating..." : "Generate Link"}
              </button>
              {error && (
                <p style={{ color: "#ef4444", fontSize: "14px" }}>{error}</p>
              )}
            </div>
          </div>

          {/* Link display */}
          {generatedLink && (
            <div
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
            >
              <LinkDisplay
                link={generatedLink}
                copied={copied}
                onCopy={copyToClipboard}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-6 px-4"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          <Link
            href="/faq"
            className="transition-colors hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            FAQ
          </Link>
          {" · "}
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

function LoadingSpinner() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full"
          style={{ border: "2px solid rgba(16, 163, 127, 0.3)" }}
        />
        <div
          className="absolute inset-0 w-10 h-10 rounded-full animate-spin"
          style={{
            border: "2px solid var(--accent)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    </main>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (queryParam) {
    return <AnimationView query={queryParam} />;
  }

  return <LandingPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
