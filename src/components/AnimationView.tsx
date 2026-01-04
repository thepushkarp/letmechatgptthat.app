"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "./Header";

interface AnimationViewProps {
  query: string;
}

export function AnimationView({ query }: AnimationViewProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<
    "typing" | "pause" | "sending" | "redirecting"
  >("typing");
  const [showCursor, setShowCursor] = useState(true);

  const redirectToChatGPT = useCallback(() => {
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `https://chatgpt.com/?q=${encodedQuery}`;
  }, [query]);

  useEffect(() => {
    if (phase === "typing") {
      if (displayedText.length < query.length) {
        const timeout = setTimeout(
          () => {
            setDisplayedText(query.slice(0, displayedText.length + 1));
          },
          50 + Math.random() * 50
        ); // Random delay for realistic typing
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause briefly
        const timeout = setTimeout(() => setPhase("pause"), 500);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "pause") {
      const timeout = setTimeout(() => setPhase("sending"), 800);
      return () => clearTimeout(timeout);
    }

    if (phase === "sending") {
      setShowCursor(false);
      const timeout = setTimeout(() => setPhase("redirecting"), 1000);
      return () => clearTimeout(timeout);
    }

    if (phase === "redirecting") {
      const timeout = setTimeout(redirectToChatGPT, 1500);
      return () => clearTimeout(timeout);
    }
  }, [phase, displayedText, query, redirectToChatGPT]);

  // Blinking cursor effect
  useEffect(() => {
    if (phase === "typing" || phase === "pause") {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl space-y-8">
          {/* Instruction bubble */}
          <div className="fade-in text-center">
            <div className="inline-block bg-[#2f2f2f] px-6 py-3 rounded-2xl border border-[#424242]">
              <p className="text-gray-300">
                {phase === "redirecting"
                  ? "Redirecting you to ChatGPT..."
                  : "Was that so hard?"}
              </p>
            </div>
          </div>

          {/* Fake ChatGPT interface */}
          <div className="bg-[#2f2f2f] rounded-3xl border border-[#424242] overflow-hidden shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#424242]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#10a37f] flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-4 h-4 text-white"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium">ChatGPT</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27ca40]"></div>
              </div>
            </div>

            {/* Chat area */}
            <div className="p-8 min-h-[200px] flex items-center justify-center">
              {phase === "redirecting" ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-[#10a37f] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400">Opening ChatGPT...</p>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">
                  How can I help you today?
                </p>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-[#424242]">
              <div
                className={`flex items-end gap-2 bg-[#212121] border rounded-3xl px-4 py-3 transition-all duration-300 ${
                  phase === "sending"
                    ? "border-[#10a37f] ring-2 ring-[#10a37f] ring-opacity-50"
                    : "border-[#424242]"
                }`}
              >
                <div className="flex-1 min-h-[24px] text-white">
                  {displayedText}
                  {showCursor && (phase === "typing" || phase === "pause") && (
                    <span className="inline-block w-0.5 h-5 bg-white ml-0.5 align-middle"></span>
                  )}
                </div>
                <button
                  className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    phase === "sending"
                      ? "bg-[#10a37f] scale-95"
                      : displayedText
                        ? "bg-white"
                        : "bg-gray-600"
                  }`}
                  aria-label="Send message"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`w-5 h-5 transition-colors ${
                      phase === "sending" ? "text-white" : "text-black"
                    }`}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Skip button */}
          {phase !== "redirecting" && (
            <div className="text-center">
              <button
                onClick={redirectToChatGPT}
                className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
              >
                Skip animation
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>
          <Link href="/" className="text-[#10a37f] hover:underline">
            Create your own link
          </Link>
        </p>
      </footer>
    </main>
  );
}
