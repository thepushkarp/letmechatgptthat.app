"use client";

import { useReducer, useEffect, useCallback } from "react";

// Animation phases
export type Phase =
  | "idle" // Initial state, cursor not visible yet
  | "cursorToInput" // Cursor moving to input box
  | "clicking" // Click animation + ripple
  | "typing" // Typing animation
  | "pause" // Brief pause after typing
  | "cursorToSend" // Cursor moving to send button
  | "waiting" // Waiting for user click, countdown active
  | "redirecting"; // Redirect in progress

// State shape
interface AnimationState {
  phase: Phase;
  displayedText: string;
  showTextCursor: boolean;
  cursorPosition: { x: number; y: number };
  isClicking: boolean;
  showRipple: boolean;
  rippleOrigin: { x: number; y: number };
  countdown: number;
  inputFocused: boolean;
  isVisible: boolean;
}

// Action types
type AnimationAction =
  | { type: "MOUNT_COMPLETE" }
  | { type: "MOVE_TO_INPUT"; position: { x: number; y: number } }
  | { type: "START_CLICKING"; rippleOrigin: { x: number; y: number } }
  | { type: "FINISH_CLICKING" }
  | { type: "TYPE_CHARACTER"; text: string }
  | { type: "FINISH_TYPING" }
  | { type: "MOVE_TO_SEND"; position: { x: number; y: number } }
  | { type: "START_WAITING" }
  | { type: "COUNTDOWN_TICK" }
  | { type: "START_REDIRECT" }
  | { type: "TOGGLE_CURSOR" };

const initialState: AnimationState = {
  phase: "idle",
  displayedText: "",
  showTextCursor: true,
  cursorPosition: { x: 80, y: 120 },
  isClicking: false,
  showRipple: false,
  rippleOrigin: { x: 0, y: 0 },
  countdown: 5,
  inputFocused: false,
  isVisible: false,
};

function animationReducer(
  state: AnimationState,
  action: AnimationAction
): AnimationState {
  switch (action.type) {
    case "MOUNT_COMPLETE":
      return { ...state, isVisible: true };

    case "MOVE_TO_INPUT":
      return {
        ...state,
        phase: "cursorToInput",
        cursorPosition: action.position,
      };

    case "START_CLICKING":
      return {
        ...state,
        phase: "clicking",
        isClicking: true,
        showRipple: true,
        rippleOrigin: action.rippleOrigin,
        inputFocused: true,
      };

    case "FINISH_CLICKING":
      return {
        ...state,
        phase: "typing",
        isClicking: false,
        showRipple: false,
      };

    case "TYPE_CHARACTER":
      return { ...state, displayedText: action.text };

    case "FINISH_TYPING":
      return { ...state, phase: "pause" };

    case "MOVE_TO_SEND":
      return {
        ...state,
        phase: "cursorToSend",
        cursorPosition: action.position,
      };

    case "START_WAITING":
      return { ...state, phase: "waiting", countdown: 5 };

    case "COUNTDOWN_TICK":
      const newCountdown = state.countdown - 1;
      if (newCountdown <= 0) {
        return { ...state, phase: "redirecting", countdown: 0 };
      }
      return { ...state, countdown: newCountdown };

    case "START_REDIRECT":
      return { ...state, phase: "redirecting" };

    case "TOGGLE_CURSOR":
      return { ...state, showTextCursor: !state.showTextCursor };

    default:
      return state;
  }
}

interface UseAnimationPhaseOptions {
  query: string;
  getInputCenter: () => { x: number; y: number };
  getSendButtonCenter: () => { x: number; y: number };
  onRedirect: () => void;
}

export function useAnimationPhase({
  query,
  getInputCenter,
  getSendButtonCenter,
  onRedirect,
}: UseAnimationPhaseOptions) {
  const [state, dispatch] = useReducer(animationReducer, initialState);
  const { phase, displayedText, isVisible } = state;

  // Initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: "MOUNT_COMPLETE" }), 100);
    return () => clearTimeout(timer);
  }, []);

  // Phase: idle → cursorToInput
  useEffect(() => {
    if (phase === "idle" && isVisible) {
      const timer = setTimeout(() => {
        dispatch({ type: "MOVE_TO_INPUT", position: getInputCenter() });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, isVisible, getInputCenter]);

  // Phase: cursorToInput → clicking
  useEffect(() => {
    if (phase === "cursorToInput") {
      const timer = setTimeout(() => {
        dispatch({
          type: "START_CLICKING",
          rippleOrigin: getInputCenter(),
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase, getInputCenter]);

  // Phase: clicking → typing
  useEffect(() => {
    if (phase === "clicking") {
      const timer = setTimeout(() => {
        dispatch({ type: "FINISH_CLICKING" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase: typing (character by character)
  useEffect(() => {
    if (phase === "typing") {
      if (displayedText.length < query.length) {
        const nextChar = query[displayedText.length];
        const baseDelay = nextChar === " " ? 30 : 50;
        const timeout = setTimeout(
          () => {
            dispatch({
              type: "TYPE_CHARACTER",
              text: query.slice(0, displayedText.length + 1),
            });
          },
          baseDelay + Math.random() * 40
        );
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(
          () => dispatch({ type: "FINISH_TYPING" }),
          500
        );
        return () => clearTimeout(timeout);
      }
    }
  }, [phase, displayedText, query]);

  // Phase: pause → cursorToSend
  useEffect(() => {
    if (phase === "pause") {
      const timer = setTimeout(() => {
        dispatch({ type: "MOVE_TO_SEND", position: getSendButtonCenter() });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [phase, getSendButtonCenter]);

  // Phase: cursorToSend → waiting
  useEffect(() => {
    if (phase === "cursorToSend") {
      const timer = setTimeout(() => {
        dispatch({ type: "START_WAITING" });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Phase: redirecting → actual redirect
  useEffect(() => {
    if (phase === "redirecting") {
      const timeout = setTimeout(onRedirect, 500);
      return () => clearTimeout(timeout);
    }
  }, [phase, onRedirect]);

  // Countdown timer during waiting phase
  useEffect(() => {
    if (phase === "waiting") {
      const interval = setInterval(() => {
        dispatch({ type: "COUNTDOWN_TICK" });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Keyboard listener for Enter key during waiting phase
  useEffect(() => {
    if (phase === "waiting") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          dispatch({ type: "START_REDIRECT" });
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [phase]);

  // Blinking text cursor
  useEffect(() => {
    if (phase === "typing" || phase === "pause") {
      const interval = setInterval(() => {
        dispatch({ type: "TOGGLE_CURSOR" });
      }, 530);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Action handlers
  const handleSendClick = useCallback(() => {
    if (phase === "waiting") {
      dispatch({ type: "START_REDIRECT" });
    }
  }, [phase]);

  // Computed values
  const cursorVisible =
    phase !== "idle" && phase !== "redirecting" && isVisible;

  return {
    ...state,
    cursorVisible,
    handleSendClick,
  };
}
