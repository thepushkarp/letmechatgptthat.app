"use client";

import { useCallback, useEffect, useRef } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SendIcon } from "./SendIcon";
import { AnimatedCursor } from "./AnimatedCursor";
import { TapIndicator } from "./TapIndicator";
import { ClickRipple } from "./ClickRipple";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useAnimationPhase } from "@/hooks/useAnimationPhase";

const steps = ["Open ChatGPT", "Ask your question", "Press send"];

export function AnimationView({ query }: { query: string }) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const isTouchDevice = useIsTouchDevice();

  const getElementCenter = useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current || !mockupRef.current) return { x: 80, y: 120 };
      const frame = mockupRef.current.getBoundingClientRect();
      const element = ref.current.getBoundingClientRect();
      return {
        x: element.left - frame.left + element.width / 2,
        y: element.top - frame.top + element.height / 2,
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
    window.location.assign(
      "https://chatgpt.com/?q=" + encodeURIComponent(query)
    );
  }, [query]);

  const {
    phase,
    displayedText,
    cursorPosition,
    isClicking,
    showRipple,
    rippleOrigin,
    countdown,
    cursorVisible,
    handleSendClick,
    openChatGPT,
    reducedMotion,
  } = useAnimationPhase({
    query,
    getInputCenter,
    getSendButtonCenter,
    onRedirect: redirectToChatGPT,
  });

  const activeStep =
    phase === "idle"
      ? 0
      : ["cursorToInput", "clicking", "typing", "pause"].includes(phase)
        ? 1
        : 2;
  const finishedTyping = [
    "pause",
    "cursorToSend",
    "waiting",
    "redirecting",
  ].includes(phase);

  useEffect(() => {
    const input = inputRef.current;
    if (input) input.scrollTop = input.scrollHeight;
  }, [displayedText]);

  return (
    <div className="page-shell">
      <Header />
      <main id="main" className="playback-main">
        <h1 className="sr-only">Let me ChatGPT that for you</h1>
        <div className="playback-layout" data-phase={phase}>
          <aside
            className="playback-steps"
            aria-label="How you could have asked ChatGPT"
          >
            <h2 className="guide-title">You could’ve just…</h2>
            <ol>
              {steps.map((step, index) => (
                <li
                  key={step}
                  aria-current={index === activeStep ? "step" : undefined}
                  data-complete={index < activeStep || phase === "redirecting"}
                >
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </aside>
          <div className="playback-stage">
            <p className="mobile-guide-title guide-title" aria-hidden="true">
              You could’ve just…
            </p>
            <p className="mobile-step" aria-hidden="true">
              <span>{activeStep + 1} / 3</span> {steps[activeStep]}
            </p>
            <p className="sr-only" role="status">
              {phase === "redirecting"
                ? "Opening ChatGPT"
                : phase === "waiting"
                  ? "Opening ChatGPT in five seconds. Open ChatGPT now to skip the countdown."
                  : "Step " + (activeStep + 1) + ": " + steps[activeStep]}
            </p>
            <div className="browser-frame" ref={mockupRef}>
              <div className="browser-chrome" aria-hidden="true">
                <div className="traffic-lights">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="url-bar">chatgpt.com</span>
                <span className="chrome-spacer" />
              </div>
              <div className="mockup-content">
                <div className="mockup-greeting">
                  <p>What can I help with?</p>
                </div>
                <div className="composer playback-composer">
                  {/* The visible typing is decorative; assistive technology receives the whole question once. */}
                  <div
                    ref={inputRef}
                    className="composer-text simulated-input"
                    tabIndex={0}
                    role="textbox"
                    aria-label="Question"
                    aria-readonly="true"
                  >
                    <span className="sr-only">{query}</span>
                    <span aria-hidden="true">
                      {displayedText || (
                        <span className="placeholder">Ask anything</span>
                      )}
                      {phase === "typing" && reducedMotion === false && (
                        <span className="text-caret" />
                      )}
                    </span>
                  </div>
                  <div className="composer-toolbar">
                    <span />
                    <button
                      ref={sendButtonRef}
                      type="button"
                      className="send-btn"
                      onClick={handleSendClick}
                      disabled={phase !== "waiting"}
                      aria-label="Send to ChatGPT"
                      title="Send to ChatGPT"
                    >
                      {phase === "redirecting" ? (
                        <span className="spinner" aria-hidden="true" />
                      ) : (
                        <SendIcon />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {isTouchDevice === false && (
                <AnimatedCursor
                  position={cursorPosition}
                  isClicking={isClicking}
                  visible={cursorVisible}
                />
              )}
              {isTouchDevice === true && (
                <TapIndicator
                  position={cursorPosition}
                  isClicking={isClicking}
                  visible={cursorVisible}
                />
              )}
              <ClickRipple origin={rippleOrigin} active={showRipple} />
            </div>
            <div className="playback-actions">
              <div className="playback-status">
                <p className="punchline">
                  {finishedTyping ? "Was that so hard?" : "\u00a0"}
                </p>
                <p className="countdown" aria-live="off">
                  {phase === "waiting"
                    ? "Opening ChatGPT in " + countdown + "s"
                    : phase === "redirecting"
                      ? "Opening ChatGPT…"
                      : "\u00a0"}
                </p>
              </div>
              <button
                type="button"
                className="button button-secondary"
                onClick={openChatGPT}
                disabled={phase === "redirecting"}
              >
                Open ChatGPT
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer playback />
    </div>
  );
}
