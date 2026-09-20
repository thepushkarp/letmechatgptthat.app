"use client";

import { useReducer, useEffect, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

export type Phase =
  | "idle"
  | "urlTyping"
  | "urlLoading"
  | "cursorToInput"
  | "clicking"
  | "typing"
  | "pause"
  | "cursorToSend"
  | "waiting"
  | "redirecting";
type Point = { x: number; y: number };

// Step one is "Open ChatGPT", so it plays out: the address is typed, then the page loads.
export const CHATGPT_HOST = "chatgpt.com";
const URL_KEYSTROKE_MS = 65;
const URL_SUBMIT_MS = 400;
const PAGE_LOAD_MS = 600;
interface AnimationState {
  phase: Phase;
  displayedUrl: string;
  displayedText: string;
  cursorPosition: Point;
  rippleOrigin: Point;
  countdown: number;
}
type Action =
  | { type: "phase"; phase: Phase; position?: Point }
  | { type: "typeUrl"; text: string }
  | { type: "type"; text: string }
  | { type: "reduceMotion"; text: string }
  | { type: "tick" };

const initialState: AnimationState = {
  phase: "idle",
  displayedUrl: "",
  displayedText: "",
  cursorPosition: { x: 80, y: 120 },
  rippleOrigin: { x: 0, y: 0 },
  countdown: 5,
};

function reducer(state: AnimationState, action: Action): AnimationState {
  switch (action.type) {
    case "phase":
      return {
        ...state,
        phase: action.phase,
        cursorPosition: action.position ?? state.cursorPosition,
        rippleOrigin:
          action.phase === "clicking"
            ? (action.position ?? state.cursorPosition)
            : state.rippleOrigin,
      };
    case "typeUrl":
      return { ...state, displayedUrl: action.text };
    case "type":
      return { ...state, displayedText: action.text };
    case "reduceMotion":
      return {
        ...state,
        displayedUrl: CHATGPT_HOST,
        displayedText: action.text,
        phase: "waiting",
      };
    case "tick":
      return {
        ...state,
        countdown: state.countdown - 1,
        phase: state.countdown <= 1 ? "redirecting" : "waiting",
      };
  }
}

interface UseAnimationPhaseOptions {
  query: string;
  getInputCenter: () => Point;
  getSendButtonCenter: () => Point;
  onRedirect: () => void;
}

export function useAnimationPhase({
  query,
  getInputCenter,
  getSendButtonCenter,
  onRedirect,
}: UseAnimationPhaseOptions) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reducedMotion = useReducedMotion();
  const { phase, displayedUrl, displayedText } = state;

  useEffect(() => {
    if (reducedMotion && phase !== "waiting" && phase !== "redirecting") {
      dispatch({ type: "reduceMotion", text: query });
    }
  }, [reducedMotion, phase, query]);

  useEffect(() => {
    // Resolve the media query before starting, so reduced-motion users never see a partial animation.
    if (
      reducedMotion === null ||
      (reducedMotion && phase !== "waiting" && phase !== "redirecting")
    )
      return;
    let timer: ReturnType<typeof setTimeout>;
    switch (phase) {
      case "idle":
        timer = setTimeout(
          () => dispatch({ type: "phase", phase: "urlTyping" }),
          400
        );
        break;
      case "urlTyping":
        if (displayedUrl.length < CHATGPT_HOST.length) {
          timer = setTimeout(
            () =>
              dispatch({
                type: "typeUrl",
                text: CHATGPT_HOST.slice(0, displayedUrl.length + 1),
              }),
            URL_KEYSTROKE_MS
          );
        } else {
          // A beat for the imagined Enter press before the page loads.
          timer = setTimeout(
            () => dispatch({ type: "phase", phase: "urlLoading" }),
            URL_SUBMIT_MS
          );
        }
        break;
      case "urlLoading":
        timer = setTimeout(
          () =>
            dispatch({
              type: "phase",
              phase: "cursorToInput",
              position: getInputCenter(),
            }),
          PAGE_LOAD_MS
        );
        break;
      case "cursorToInput":
        timer = setTimeout(
          () =>
            dispatch({
              type: "phase",
              phase: "clicking",
              position: getInputCenter(),
            }),
          400
        );
        break;
      case "clicking":
        timer = setTimeout(
          () => dispatch({ type: "phase", phase: "typing" }),
          300
        );
        break;
      case "typing":
        if (displayedText.length < query.length) {
          // Consume whole code points so emoji are never rendered as broken surrogate halves.
          const next = String.fromCodePoint(
            query.codePointAt(displayedText.length)!
          );
          timer = setTimeout(
            () => dispatch({ type: "type", text: displayedText + next }),
            (next === " " ? 30 : 50) + Math.random() * 40
          );
        } else {
          timer = setTimeout(
            () => dispatch({ type: "phase", phase: "pause" }),
            500
          );
        }
        break;
      case "pause":
        timer = setTimeout(
          () =>
            dispatch({
              type: "phase",
              phase: "cursorToSend",
              position: getSendButtonCenter(),
            }),
          700
        );
        break;
      case "cursorToSend":
        timer = setTimeout(
          () => dispatch({ type: "phase", phase: "waiting" }),
          400
        );
        break;
      case "waiting":
        return;
      case "redirecting":
        timer = setTimeout(onRedirect, 300);
        break;
    }
    return () => clearTimeout(timer);
  }, [
    phase,
    displayedUrl,
    displayedText,
    query,
    reducedMotion,
    getInputCenter,
    getSendButtonCenter,
    onRedirect,
  ]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const timer = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "waiting") return;
    const onKeyDown = (event: KeyboardEvent) => {
      // The read-only mock question has no Enter action; links and buttons keep theirs.
      if (
        event.key === "Enter" &&
        !event.isComposing &&
        !event.repeat &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        (event.target === document.body ||
          event.target === document.documentElement ||
          (event.target instanceof Element &&
            event.target.matches('[role="textbox"][aria-readonly="true"]')))
      ) {
        event.preventDefault();
        dispatch({ type: "phase", phase: "redirecting" });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  const openChatGPT = useCallback(
    () => dispatch({ type: "phase", phase: "redirecting" }),
    []
  );
  const handleSendClick = useCallback(() => {
    if (phase === "waiting") openChatGPT();
  }, [phase, openChatGPT]);

  return {
    ...state,
    reducedMotion,
    pageLoaded:
      phase !== "idle" && phase !== "urlTyping" && phase !== "urlLoading",
    cursorVisible:
      reducedMotion === false &&
      phase !== "idle" &&
      phase !== "urlTyping" &&
      phase !== "urlLoading" &&
      phase !== "waiting" &&
      phase !== "redirecting",
    isClicking: phase === "clicking",
    showRipple: reducedMotion === false && phase === "clicking",
    handleSendClick,
    openChatGPT,
  };
}
