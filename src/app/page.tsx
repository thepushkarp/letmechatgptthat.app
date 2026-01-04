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
      // Fallback for older browsers
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
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Let Me ChatGPT That
            </h1>
            <p className="text-gray-400 text-lg">
              For all those people who find it more convenient to bother you
              <br />
              with their question rather than ChatGPT it themselves.
            </p>
          </div>

          <div className="space-y-4">
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
                className="px-8 py-3 bg-[#10a37f] hover:bg-[#1a7f64] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors duration-200"
              >
                Generate Link
              </button>
            </div>
          </div>

          {generatedLink && (
            <LinkDisplay
              link={generatedLink}
              copied={copied}
              onCopy={copyToClipboard}
            />
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>
          This site is not affiliated with OpenAI.{" "}
          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#10a37f] hover:underline"
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#212121]">
      <div className="w-8 h-8 border-2 border-[#10a37f] border-t-transparent rounded-full animate-spin"></div>
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

  // Show loading during SSR to avoid hydration mismatch
  if (!mounted) {
    return <LoadingSpinner />;
  }

  // If there's a query parameter, show the animation
  if (queryParam) {
    return <AnimationView query={queryParam} />;
  }

  // Otherwise, show the landing page
  return <LandingPage />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
