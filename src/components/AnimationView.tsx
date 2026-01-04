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
  const [isVisible, setIsVisible] = useState(false);

  const redirectToChatGPT = useCallback(() => {
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `https://chatgpt.com/?q=${encodedQuery}`;
  }, [query]);

  // Initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Typing animation
  useEffect(() => {
    if (phase === "typing") {
      if (displayedText.length < query.length) {
        const timeout = setTimeout(
          () => {
            setDisplayedText(query.slice(0, displayedText.length + 1));
          },
          40 + Math.random() * 60
        );
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setPhase("pause"), 600);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "pause") {
      const timeout = setTimeout(() => setPhase("sending"), 800);
      return () => clearTimeout(timeout);
    }

    if (phase === "sending") {
      setShowCursor(false);
      const timeout = setTimeout(() => setPhase("redirecting"), 1200);
      return () => clearTimeout(timeout);
    }

    if (phase === "redirecting") {
      const timeout = setTimeout(redirectToChatGPT, 1500);
      return () => clearTimeout(timeout);
    }
  }, [phase, displayedText, query, redirectToChatGPT]);

  // Blinking cursor
  useEffect(() => {
    if (phase === "typing" || phase === "pause") {
      const interval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <main className="min-h-screen flex flex-col bg-bg-primary">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-2xl space-y-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Message bubble */}
          <div
            className={`text-center transition-all duration-500 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-surface-primary px-5 py-3 rounded-2xl border border-border-subtle shadow-sm">
              {phase === "redirecting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <p className="text-text-secondary">
                    Redirecting to ChatGPT...
                  </p>
                </>
              ) : (
                <>
                  <span className="text-lg">😏</span>
                  <p className="text-text-secondary font-medium">
                    Was that so hard?
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ChatGPT Interface Mockup */}
          <div
            className={`
              bg-surface-primary
              rounded-2xl
              border border-border-subtle
              overflow-hidden
              shadow-lg
              transition-all duration-500 delay-300
              ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
            `}
          >
            {/* Browser-like header */}
            <div className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border-subtle">
              <div className="flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>

                {/* URL bar */}
                <div className="hidden sm:flex items-center gap-2 bg-bg-primary px-3 py-1.5 rounded-lg text-sm">
                  <svg
                    className="w-3.5 h-3.5 text-text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-text-secondary">chatgpt.com</span>
                </div>
              </div>

              {/* ChatGPT logo */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <span className="text-text-primary font-medium text-sm hidden sm:inline">
                  ChatGPT
                </span>
              </div>
            </div>

            {/* Chat area */}
            <div className="p-8 min-h-[180px] flex items-center justify-center bg-bg-primary">
              {phase === "redirecting" ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-accent/30 rounded-full" />
                    <div className="absolute inset-0 w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-text-tertiary">Opening ChatGPT...</p>
                </div>
              ) : (
                <p className="text-text-muted text-lg">What can I help with?</p>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 bg-bg-primary border-t border-border-subtle">
              <div
                className={`
                  flex items-end gap-3
                  bg-surface-primary
                  border rounded-2xl
                  px-4 py-3
                  transition-all duration-300
                  ${
                    phase === "sending"
                      ? "border-accent shadow-glow"
                      : "border-border-subtle"
                  }
                `}
              >
                {/* Text display */}
                <div className="flex-1 min-h-[28px] text-text-primary text-[15px] leading-7">
                  {displayedText}
                  {showCursor && (phase === "typing" || phase === "pause") && (
                    <span className="inline-block w-[2px] h-5 bg-text-primary ml-0.5 align-middle animate-blink" />
                  )}
                  {!displayedText && (
                    <span className="text-text-muted">Message ChatGPT</span>
                  )}
                </div>

                {/* Send button */}
                <button
                  className={`
                    p-2.5 rounded-xl
                    transition-all duration-300
                    flex-shrink-0
                    ${
                      phase === "sending"
                        ? "bg-accent scale-90 shadow-md"
                        : displayedText
                          ? "bg-text-primary hover:bg-text-secondary"
                          : "bg-bg-tertiary"
                    }
                  `}
                  aria-label="Send message"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`w-5 h-5 transition-colors duration-300 ${
                      phase === "sending"
                        ? "text-white"
                        : displayedText
                          ? "text-bg-primary"
                          : "text-text-muted"
                    }`}
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Skip button */}
          {phase !== "redirecting" && (
            <div
              className={`text-center transition-all duration-500 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <button
                onClick={redirectToChatGPT}
                className="text-text-muted hover:text-text-secondary text-sm transition-colors inline-flex items-center gap-1 group"
              >
                Skip animation
                <svg
                  className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-border-subtle">
        <Link
          href="/"
          className="text-accent hover:text-accent-hover text-sm transition-colors inline-flex items-center gap-1.5 group"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="group-hover:underline">Create your own link</span>
        </Link>
      </footer>
    </main>
  );
}
