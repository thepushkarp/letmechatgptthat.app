"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { Header } from "./Header";
import { AnimatedCursor } from "./AnimatedCursor";
import { TapIndicator } from "./TapIndicator";
import { ClickRipple } from "./ClickRipple";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useAnimationPhase } from "@/hooks/useAnimationPhase";

interface AnimationViewProps {
  query: string;
}

export function AnimationView({ query }: AnimationViewProps) {
  // Refs for element positions
  const mockupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // Touch device detection
  const isTouchDevice = useIsTouchDevice();

  // Helper to get element center relative to mockup
  const getElementCenter = useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current || !mockupRef.current) return { x: 80, y: 120 };
      const mockupRect = mockupRef.current.getBoundingClientRect();
      const elRect = ref.current.getBoundingClientRect();
      return {
        x: elRect.left - mockupRect.left + elRect.width / 2,
        y: elRect.top - mockupRect.top + elRect.height / 2,
      };
    },
    []
  );

  const getInputCenter = useCallback(
    () => getElementCenter(inputRef),
    [getElementCenter]
  );
  const getSendButtonCenter = useCallback(
    () => getElementCenter(sendButtonRef),
    [getElementCenter]
  );

  const redirectToChatGPT = useCallback(() => {
    const encodedQuery = encodeURIComponent(query);
    window.location.href = `https://chatgpt.com/?q=${encodedQuery}`;
  }, [query]);

  // Use the animation phase hook
  const {
    phase,
    displayedText,
    showTextCursor,
    cursorPosition,
    isClicking,
    showRipple,
    rippleOrigin,
    countdown,
    inputFocused,
    isVisible,
    cursorVisible,
    handleSendClick,
  } = useAnimationPhase({
    query,
    getInputCenter,
    getSendButtonCenter,
    onRedirect: redirectToChatGPT,
  });

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-primary)" }}
    >
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-[720px] space-y-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
        >
          {/* Message bubble - ChatGPT style pill */}
          <div
            className={`text-center transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background: "var(--surface-primary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {phase === "redirecting" ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full animate-spin"
                    style={{
                      border: "2px solid var(--accent)",
                      borderTopColor: "transparent",
                    }}
                  />
                  <p
                    style={{ color: "var(--text-secondary)", fontSize: "14px" }}
                  >
                    Redirecting to ChatGPT...
                  </p>
                </>
              ) : (
                <>
                  <span style={{ fontSize: "16px" }}>😏</span>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    Was that so hard?
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ChatGPT Interface Mockup */}
          <div
            ref={mockupRef}
            className={`overflow-hidden relative transition-all duration-600 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
            }`}
            style={{
              background: "var(--surface-primary)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-lg)",
              transitionDelay: "200ms",
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            {/* Browser chrome */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "var(--bg-secondary)",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Traffic lights */}
                <div className="flex gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#ff5f57" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#febc2e" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#28c840" }}
                  />
                </div>

                {/* URL bar */}
                <div
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5"
                  style={{
                    background: "var(--bg-tertiary)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "13px",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--text-muted)" }}
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
                  <span style={{ color: "var(--text-secondary)" }}>
                    chatgpt.com
                  </span>
                </div>
              </div>

              {/* ChatGPT branding */}
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{
                    background: "var(--accent)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                  </svg>
                </div>
                <span
                  className="hidden sm:inline font-medium"
                  style={{ color: "var(--text-primary)", fontSize: "14px" }}
                >
                  ChatGPT
                </span>
              </div>
            </div>

            {/* Chat content area */}
            <div
              className="min-h-[200px] flex items-center justify-center p-8"
              style={{ background: "var(--bg-primary)" }}
            >
              {phase === "redirecting" ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ border: "2px solid var(--accent-light)" }}
                    />
                    <div
                      className="absolute inset-0 w-10 h-10 rounded-full animate-spin"
                      style={{
                        border: "2px solid var(--accent)",
                        borderTopColor: "transparent",
                      }}
                    />
                  </div>
                  <p
                    style={{ color: "var(--text-tertiary)", fontSize: "15px" }}
                  >
                    Opening ChatGPT...
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "32px",
                    fontWeight: 600,
                  }}
                >
                  What can I help with?
                </p>
              )}
            </div>

            {/* Input area - matches real ChatGPT */}
            <div
              className="p-4 relative"
              style={{
                background: "var(--bg-primary)",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <div
                ref={inputRef}
                className={`flex items-end gap-3 px-4 py-3 transition-all duration-300 ${
                  inputFocused ? "input-focus-ring" : ""
                }`}
                style={{
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-2xl)",
                  border:
                    phase === "waiting"
                      ? "1px solid var(--accent)"
                      : "1px solid var(--border-input)",
                  boxShadow:
                    phase === "waiting" ? "var(--shadow-glow)" : "none",
                }}
              >
                {/* Attachment button (decorative) */}
                <button
                  type="button"
                  className="p-2 -ml-1 transition-colors"
                  style={{
                    color: "var(--text-muted)",
                    borderRadius: "var(--radius-lg)",
                  }}
                  tabIndex={-1}
                  aria-label="Attach file"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>

                {/* Text display area */}
                <div
                  className="flex-1 min-h-[28px]"
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "15px",
                    lineHeight: "1.75",
                  }}
                >
                  {displayedText}
                  {showTextCursor &&
                    (phase === "typing" || phase === "pause") && (
                      <span
                        className="inline-block w-[2px] h-5 ml-0.5 align-middle"
                        style={{
                          background: "var(--text-primary)",
                          animation: "cursorBlink 1s step-end infinite",
                        }}
                      />
                    )}
                  {!displayedText && (
                    <span style={{ color: "var(--text-placeholder)" }}>
                      Message ChatGPT
                    </span>
                  )}
                </div>

                {/* Send button */}
                <button
                  ref={sendButtonRef}
                  onClick={handleSendClick}
                  className="p-2.5 flex-shrink-0 transition-all duration-300"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    background:
                      phase === "waiting"
                        ? "var(--accent)"
                        : displayedText
                          ? "white"
                          : "var(--bg-tertiary)",
                    transform: phase === "waiting" ? "scale(1.05)" : "scale(1)",
                    cursor: phase === "waiting" ? "pointer" : "default",
                    boxShadow:
                      phase === "waiting" ? "var(--shadow-glow)" : "none",
                  }}
                  aria-label="Send message"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 transition-colors duration-300"
                    style={{
                      color:
                        phase === "waiting"
                          ? "white"
                          : displayedText
                            ? "var(--bg-primary)"
                            : "var(--text-muted)",
                    }}
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

              {/* Countdown display */}
              {phase === "waiting" && (
                <div
                  className="text-center mt-3"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Redirecting in {countdown}... (click or press Enter)
                </div>
              )}
            </div>

            {/* Animated cursor / tap indicator */}
            {!isTouchDevice ? (
              <AnimatedCursor
                position={cursorPosition}
                isClicking={isClicking}
                visible={cursorVisible}
              />
            ) : (
              <TapIndicator
                position={cursorPosition}
                isClicking={isClicking}
                visible={cursorVisible}
              />
            )}

            {/* Click ripple */}
            <ClickRipple origin={rippleOrigin} active={showRipple} />
          </div>

          {/* Skip button */}
          {phase !== "redirecting" && (
            <div
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <button
                onClick={redirectToChatGPT}
                className="text-link-muted inline-flex items-center gap-1.5 text-sm group"
              >
                Skip animation
                <svg
                  className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform"
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
      <footer
        className="text-center py-6"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm transition-colors group"
          style={{ color: "var(--accent)" }}
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
