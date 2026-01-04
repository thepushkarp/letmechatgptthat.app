"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInput } from "@/components/ChatInput";
import { LinkDisplay } from "@/components/LinkDisplay";
import { Header } from "@/components/Header";
import { AnimationView } from "@/components/AnimationView";

function LandingPage() {
  const [query, setQuery] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const generateLink = useCallback(() => {
    if (!query.trim()) return;

    const encodedQuery = encodeURIComponent(query.trim());
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/?q=${encodedQuery}`;
    setGeneratedLink(link);
    setCopied(false);
  }, [query]);

  const copyToClipboard = useCallback(async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-2xl space-y-10">
          {/* Hero section */}
          <div
            className={`text-center space-y-5 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight">
              Let Me ChatGPT That
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
              For all those people who find it more convenient to bother you
              with their question rather than ChatGPT it themselves.
            </p>
          </div>

          {/* Input section */}
          <div
            className={`space-y-6 transition-all duration-700 delay-150 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={generateLink}
              onKeyDown={handleKeyDown}
              placeholder="Type your question here..."
            />

            <div className="flex justify-center">
              <button
                onClick={generateLink}
                disabled={!query.trim()}
                className="
                  px-8 py-3.5
                  bg-accent hover:bg-accent-hover
                  disabled:bg-bg-tertiary disabled:text-text-muted
                  text-white font-medium
                  rounded-full
                  transition-all duration-200
                  disabled:cursor-not-allowed
                  hover:shadow-md hover:-translate-y-0.5
                  active:translate-y-0
                "
              >
                Generate Link
              </button>
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
      <footer className="text-center py-6 border-t border-border-subtle">
        <p className="text-text-muted text-sm">
          This site is not affiliated with OpenAI.{" "}
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover transition-colors hover:underline"
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-accent/30 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
