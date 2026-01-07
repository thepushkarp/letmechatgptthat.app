# Implementation Plan: Interactive Cursor Animation

## 1. Overview

Transform the existing auto-play typing animation in `AnimationView` into an interactive cursor-driven experience. A macOS-style cursor (or tap indicator on mobile) will navigate the ChatGPT mockup, clicking into the input, typing the query, then hovering the send button for user interaction with a 5-second auto-redirect countdown.

**Design Doc:** `docs/brainstorms/interactive-cursor-animation.md`

---

## 2. Prerequisites

### Tools & Versions

- Node.js 18+
- Yarn (already configured)
- Next.js 15.1.0 (already installed)
- React 19.0.0 (already installed)
- TypeScript 5.7.2 (already installed)

### Environment Setup

```bash
cd /Users/pupa/projects/letmechatgptthat.app
yarn install
yarn dev  # Start dev server at localhost:3000
```

### Testing URL

Visit `http://localhost:3000/?q=test%20query` to see the animation view.

---

## 3. Codebase Orientation

### Key Files to Understand

| File                               | Purpose                                                           |
| ---------------------------------- | ----------------------------------------------------------------- |
| `src/components/AnimationView.tsx` | **PRIMARY** - Current animation logic, state machine, mockup UI   |
| `src/app/page.tsx`                 | Routes between LandingPage and AnimationView based on `?q=` param |
| `src/app/globals.css`              | Design system tokens, keyframe animations                         |
| `src/components/ChatInput.tsx`     | Reference for input styling patterns                              |

### Existing Patterns to Follow

**State Machine Pattern** (`AnimationView.tsx:13-16`):

```tsx
const [phase, setPhase] = useState<
  "typing" | "pause" | "sending" | "redirecting"
>("typing");
```

**CSS Variable Usage** (`globals.css`):

- Always use `var(--accent)`, `var(--bg-primary)`, etc.
- Transitions use `var(--ease-out-expo)` or `var(--transition-base)`

**Animation Keyframes** (`globals.css:128-199`):

- All keyframes defined in globals.css
- Utility classes like `.animate-fade-up`, `.animate-spin`

**Component Structure**:

- Functional components with TypeScript interfaces for props
- `"use client"` directive for client-side components
- Inline styles using CSS variables

---

## 4. Implementation Tasks

### Task 1: Add CSS Keyframes and Utilities

**Goal:** Define animations for cursor movement, click effect, and ripple

**Files to touch:**

- `src/app/globals.css` - Add new keyframes and utility classes

**Implementation steps:**

1. Add cursor click animation (scale down on press):

```css
@keyframes cursorClick {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.85);
  }
}
```

2. Add ripple expansion animation:

```css
@keyframes rippleExpand {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
```

3. Add tap indicator press animation:

```css
@keyframes tapPress {
  0%,
  100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(0.9) translateY(4px);
  }
}
```

4. Add focus ring pulse for input:

```css
@keyframes focusRingPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(116, 170, 156, 0.4);
  }
  100% {
    box-shadow: 0 0 0 4px rgba(116, 170, 156, 0);
  }
}
```

5. Add utility classes:

```css
.animate-cursor-click {
  animation: cursorClick 0.15s ease-out;
}

.animate-ripple {
  animation: rippleExpand 0.4s ease-out forwards;
}

.animate-tap-press {
  animation: tapPress 0.2s ease-out;
}

.input-focus-ring {
  border-color: rgba(116, 170, 156, 0.5) !important;
  box-shadow:
    var(--shadow-input-focus),
    0 0 0 4px rgba(116, 170, 156, 0.1);
}
```

**Code patterns to follow:**

- Reference: `src/app/globals.css:128-199` for keyframe structure
- Use existing CSS variable names for colors

**Verification:**

- Build passes: `yarn build`
- No CSS syntax errors

**Commit:** `feat: add cursor animation keyframes and utilities`

---

### Task 2: Create AnimatedCursor Component

**Goal:** Render a macOS-style cursor that can move and click

**Files to touch:**

- `src/components/AnimatedCursor.tsx` - New file

**Implementation steps:**

1. Create the file with this structure:

```tsx
"use client";

interface AnimatedCursorProps {
  position: { x: number; y: number };
  isClicking: boolean;
  visible: boolean;
}

export function AnimatedCursor({
  position,
  isClicking,
  visible,
}: AnimatedCursorProps) {
  // ... implementation
}
```

2. Render an SVG of the macOS cursor (black arrow with white border):

```tsx
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style={{
    position: "absolute",
    left: position.x,
    top: position.y,
    transform: isClicking ? "scale(0.85)" : "scale(1)",
    transition:
      "transform 0.1s ease-out, left 0.35s ease-out, top 0.35s ease-out",
    opacity: visible ? 1 : 0,
    pointerEvents: "none",
    zIndex: 1000,
  }}
>
  {/* macOS cursor path */}
  <path
    d="M5.5 3.21V20.8l4.86-4.86h6.36L5.5 3.21z"
    fill="#000"
    stroke="#fff"
    strokeWidth="1.5"
  />
</svg>
```

3. The actual macOS cursor SVG path (more accurate):

```tsx
<path
  d="M3 2L3 20L7.5 15.5H14L3 2Z"
  fill="black"
  stroke="white"
  strokeWidth="1.2"
  strokeLinejoin="round"
/>
```

**Code patterns to follow:**

- Reference: `src/components/Header.tsx` for component structure
- Use inline styles with CSS variables

**Testing:**

- Import and render with static position to verify SVG renders correctly
- Check cursor appears at specified coordinates

**Verification:**

- Component renders without errors
- Cursor is visually correct (black arrow, white border)
- Position updates smoothly

**Commit:** `feat: add AnimatedCursor component`

---

### Task 3: Create TapIndicator Component

**Goal:** Render a finger/hand icon for touch devices

**Files to touch:**

- `src/components/TapIndicator.tsx` - New file

**Implementation steps:**

1. Create component with same props interface as AnimatedCursor:

```tsx
"use client";

interface TapIndicatorProps {
  position: { x: number; y: number };
  isClicking: boolean;
  visible: boolean;
}

export function TapIndicator({
  position,
  isClicking,
  visible,
}: TapIndicatorProps) {
  // ... implementation
}
```

2. Render a simple hand/finger SVG icon:

```tsx
<svg
  width="32"
  height="32"
  viewBox="0 0 24 24"
  style={{
    position: "absolute",
    left: position.x - 8, // Center on tap point
    top: position.y - 8,
    transform: isClicking ? "scale(0.9) translateY(4px)" : "scale(1)",
    transition:
      "transform 0.15s ease-out, left 0.35s ease-out, top 0.35s ease-out",
    opacity: visible ? 1 : 0,
    pointerEvents: "none",
    zIndex: 1000,
  }}
>
  {/* Simple finger tap icon */}
  <circle
    cx="12"
    cy="12"
    r="8"
    fill="rgba(255,255,255,0.3)"
    stroke="white"
    strokeWidth="2"
  />
  <circle cx="12" cy="12" r="3" fill="white" />
</svg>
```

**Code patterns to follow:**

- Mirror structure of `AnimatedCursor.tsx`

**Verification:**

- Component renders without errors
- Tap indicator is visible and centered correctly

**Commit:** `feat: add TapIndicator component for mobile`

---

### Task 4: Create ClickRipple Component

**Goal:** Render expanding ripple effect on click

**Files to touch:**

- `src/components/ClickRipple.tsx` - New file

**Implementation steps:**

1. Create component:

```tsx
"use client";

interface ClickRippleProps {
  origin: { x: number; y: number };
  active: boolean;
}

export function ClickRipple({ origin, active }: ClickRippleProps) {
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: origin.x - 20,
        top: origin.y - 20,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(116, 170, 156, 0.3)",
        pointerEvents: "none",
        zIndex: 999,
      }}
      className="animate-ripple"
    />
  );
}
```

2. The ripple should:
   - Appear at click position
   - Expand from center
   - Fade out over 0.4s
   - Auto-remove after animation (handled by parent state)

**Code patterns to follow:**

- Use `var(--accent)` color with opacity for the ripple

**Verification:**

- Ripple appears at correct position
- Animation plays smoothly
- Ripple disappears after animation

**Commit:** `feat: add ClickRipple component`

---

### Task 5: Create useIsTouchDevice Hook

**Goal:** Detect if user is on touch device to swap cursor/tap indicator

**Files to touch:**

- `src/hooks/useIsTouchDevice.ts` - New file

**Implementation steps:**

1. Create hooks directory if needed and add hook:

```tsx
"use client";

import { useState, useEffect } from "react";

export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for coarse pointer (touch screens)
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isTouchDevice;
}
```

**Code patterns to follow:**

- Use `useEffect` for client-side detection
- Return `false` initially for SSR compatibility

**Verification:**

- Returns `false` on desktop
- Returns `true` on mobile/tablet
- Test using Chrome DevTools device emulation

**Commit:** `feat: add useIsTouchDevice hook`

---

### Task 6: Refactor AnimationView State Machine

**Goal:** Expand phase states to include cursor phases

**Files to touch:**

- `src/components/AnimationView.tsx` - Modify existing

**Implementation steps:**

1. Update the phase type:

```tsx
const [phase, setPhase] = useState<
  | "idle" // Initial state, cursor not visible yet
  | "cursorToInput" // Cursor moving to input box
  | "clicking" // Click animation + ripple
  | "typing" // Typing animation (existing)
  | "pause" // Brief pause after typing (existing)
  | "cursorToSend" // Cursor moving to send button
  | "waiting" // Waiting for user click, countdown active
  | "redirecting" // Redirect in progress (existing)
>("idle");
```

2. Add new state variables:

```tsx
const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 100 });
const [isClicking, setIsClicking] = useState(false);
const [showRipple, setShowRipple] = useState(false);
const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });
const [countdown, setCountdown] = useState(5);
const [inputFocused, setInputFocused] = useState(false);
```

3. Add refs for measuring element positions:

```tsx
const mockupRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLDivElement>(null);
const sendButtonRef = useRef<HTMLButtonElement>(null);
```

4. Keep existing state:

```tsx
const [displayedText, setDisplayedText] = useState("");
const [showCursor, setShowCursor] = useState(true); // Text cursor
const [isVisible, setIsVisible] = useState(false);
```

**Code patterns to follow:**

- Reference: `AnimationView.tsx:12-17` for existing state pattern

**Verification:**

- Component still renders
- No TypeScript errors
- Old functionality temporarily broken (expected)

**Commit:** `refactor: expand AnimationView state machine for cursor phases`

---

### Task 7: Implement Phase Transitions

**Goal:** Wire up the new state machine with proper timing

**Files to touch:**

- `src/components/AnimationView.tsx` - Modify useEffect hooks

**Implementation steps:**

1. Create a helper to get element center coordinates:

```tsx
const getElementCenter = (ref: React.RefObject<HTMLElement>) => {
  if (!ref.current || !mockupRef.current) return { x: 0, y: 0 };
  const mockupRect = mockupRef.current.getBoundingClientRect();
  const elRect = ref.current.getBoundingClientRect();
  return {
    x: elRect.left - mockupRect.left + elRect.width / 2,
    y: elRect.top - mockupRect.top + elRect.height / 2,
  };
};
```

2. Replace the main phase transition useEffect:

```tsx
useEffect(() => {
  // idle → cursorToInput (after mount animation)
  if (phase === "idle" && isVisible) {
    const timer = setTimeout(() => {
      const inputCenter = getElementCenter(inputRef);
      setCursorPosition(inputCenter);
      setPhase("cursorToInput");
    }, 500); // Wait for fade-in
    return () => clearTimeout(timer);
  }

  // cursorToInput → clicking (after cursor arrives)
  if (phase === "cursorToInput") {
    const timer = setTimeout(() => {
      setPhase("clicking");
    }, 400); // 0.35s cursor movement + buffer
    return () => clearTimeout(timer);
  }

  // clicking → typing (after click animation)
  if (phase === "clicking") {
    setIsClicking(true);
    const inputCenter = getElementCenter(inputRef);
    setRippleOrigin(inputCenter);
    setShowRipple(true);
    setInputFocused(true);

    const timer = setTimeout(() => {
      setIsClicking(false);
      setShowRipple(false);
      setPhase("typing");
    }, 300);
    return () => clearTimeout(timer);
  }

  // typing (existing logic, adapted)
  if (phase === "typing") {
    if (displayedText.length < query.length) {
      const nextChar = query[displayedText.length];
      const baseDelay = nextChar === " " ? 30 : 50;
      const timeout = setTimeout(
        () => {
          setDisplayedText(query.slice(0, displayedText.length + 1));
        },
        baseDelay + Math.random() * 40
      );
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setPhase("pause"), 500);
      return () => clearTimeout(timeout);
    }
  }

  // pause → cursorToSend
  if (phase === "pause") {
    const timer = setTimeout(() => {
      const sendCenter = getElementCenter(sendButtonRef);
      setCursorPosition(sendCenter);
      setPhase("cursorToSend");
    }, 700);
    return () => clearTimeout(timer);
  }

  // cursorToSend → waiting
  if (phase === "cursorToSend") {
    const timer = setTimeout(() => {
      setPhase("waiting");
    }, 400);
    return () => clearTimeout(timer);
  }

  // waiting: countdown handled in separate useEffect

  // redirecting
  if (phase === "redirecting") {
    const timeout = setTimeout(redirectToChatGPT, 500);
    return () => clearTimeout(timeout);
  }
}, [phase, displayedText, query, isVisible, redirectToChatGPT]);
```

3. Add countdown useEffect:

```tsx
useEffect(() => {
  if (phase === "waiting") {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("redirecting");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }
}, [phase]);
```

4. Add keyboard listener for Enter key during waiting phase:

```tsx
useEffect(() => {
  if (phase === "waiting") {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setPhase("redirecting");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }
}, [phase]);
```

**Code patterns to follow:**

- Reference: `AnimationView.tsx:30-65` for existing useEffect structure
- Always return cleanup functions from timeouts

**Verification:**

- Console log each phase transition to verify sequence
- Timing feels natural (not too fast, not too slow)

**Commit:** `feat: implement cursor phase transitions`

---

### Task 8: Update AnimationView JSX

**Goal:** Add cursor/tap indicator, ripple, and interactive send button to the render

**Files to touch:**

- `src/components/AnimationView.tsx` - Update return JSX

**Implementation steps:**

1. Import new components at top:

```tsx
import { AnimatedCursor } from "./AnimatedCursor";
import { TapIndicator } from "./TapIndicator";
import { ClickRipple } from "./ClickRipple";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
```

2. Add hook call in component:

```tsx
const isTouchDevice = useIsTouchDevice();
```

3. Add ref to mockup container div (the one with `overflow-hidden`):

```tsx
<div
  ref={mockupRef}
  className={`overflow-hidden relative ...`}  // Add "relative" for cursor positioning
  ...
>
```

4. Add ref to input container:

```tsx
<div
  ref={inputRef}
  className={`flex items-end gap-3 px-4 py-3 transition-all duration-300 ${inputFocused ? 'input-focus-ring' : ''}`}
  ...
>
```

5. Add ref to send button:

```tsx
<button
  ref={sendButtonRef}
  onClick={() => phase === "waiting" && setPhase("redirecting")}
  className={`p-2.5 flex-shrink-0 transition-all duration-300 ${phase === "waiting" ? "cursor-pointer" : ""}`}
  ...
>
```

6. Add cursor/tap indicator inside mockup container (at the end, before closing div):

```tsx
{
  /* Animated cursor/tap indicator */
}
{
  !isTouchDevice ? (
    <AnimatedCursor
      position={cursorPosition}
      isClicking={isClicking}
      visible={phase !== "idle" && phase !== "redirecting"}
    />
  ) : (
    <TapIndicator
      position={cursorPosition}
      isClicking={isClicking}
      visible={phase !== "idle" && phase !== "redirecting"}
    />
  );
}

{
  /* Click ripple */
}
<ClickRipple origin={rippleOrigin} active={showRipple} />;
```

7. Update send button styling for waiting phase (highlight):

```tsx
style={{
  ...existing styles,
  background: phase === "waiting"
    ? "var(--accent)"
    : phase === "sending" || displayedText
      ? "white"
      : "var(--bg-tertiary)",
  boxShadow: phase === "waiting" ? "var(--shadow-glow)" : "none",
}}
```

8. Add countdown display below send button (inside input area):

```tsx
{
  phase === "waiting" && (
    <div
      style={{
        position: "absolute",
        bottom: "-28px",
        right: "16px",
        color: "var(--text-muted)",
        fontSize: "13px",
      }}
    >
      Redirecting in {countdown}...
    </div>
  );
}
```

**Code patterns to follow:**

- Reference: `AnimationView.tsx:77-448` for JSX structure
- Keep existing structure, add new elements

**Verification:**

- Cursor appears and moves correctly
- Ripple shows on click
- Send button highlights in waiting phase
- Countdown displays and decrements
- Click/Enter triggers redirect

**Commit:** `feat: add cursor animation UI to AnimationView`

---

### Task 9: Fix Initial Cursor Position

**Goal:** Position cursor at a sensible starting point (top-left of chat area)

**Files to touch:**

- `src/components/AnimationView.tsx` - Adjust initial state and positioning

**Implementation steps:**

1. Update initial cursor position to be relative to chat content area:

```tsx
const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
```

2. Set proper initial position after mount:

```tsx
useEffect(() => {
  // Set initial cursor position when mockup is visible
  if (isVisible && mockupRef.current) {
    // Start near top-left of the chat content area
    setCursorPosition({ x: 80, y: 120 });
  }
}, [isVisible]);
```

3. Ensure cursor only becomes visible after initial position is set:
   - Keep `visible={phase !== "idle" && phase !== "redirecting"}`
   - The idle → cursorToInput transition happens after initial position is set

**Verification:**

- Cursor appears at sensible position (not corner of screen)
- Movement to input looks natural

**Commit:** `fix: set cursor initial position correctly`

---

### Task 10: Polish and Edge Cases

**Goal:** Handle edge cases and polish the experience

**Files to touch:**

- `src/components/AnimationView.tsx` - Final adjustments

**Implementation steps:**

1. Reset countdown when entering waiting phase:

```tsx
// At the start of the waiting phase
if (phase === "cursorToSend") {
  const timer = setTimeout(() => {
    setCountdown(5); // Reset countdown
    setPhase("waiting");
  }, 400);
  return () => clearTimeout(timer);
}
```

2. Hide text cursor during cursor movement phases:

```tsx
// Update the blinking cursor visibility
{showCursor && (phase === "typing" || phase === "pause") && ...}
```

3. Update "Was that so hard?" message visibility:
   - Keep it visible during all phases except "redirecting"
   - This maintains the passive-aggressive humor throughout

4. Ensure skip button still works in all phases:

```tsx
{phase !== "redirecting" && (
  <button onClick={redirectToChatGPT} ...>
    Skip animation
  </button>
)}
```

5. Add pointer cursor to send button only during waiting:

```tsx
style={{
  ...styles,
  cursor: phase === "waiting" ? "pointer" : "default",
}}
```

**Verification:**

- Full animation plays smoothly from start to finish
- Skip button works at any point
- Enter key works during waiting phase
- Countdown resets properly if animation is restarted

**Commit:** `polish: handle edge cases and improve timing`

---

### Task 11: Mobile Testing and Adjustments

**Goal:** Verify tap indicator works correctly on mobile

**Files to touch:**

- `src/components/TapIndicator.tsx` - Potential adjustments
- `src/components/AnimationView.tsx` - Mobile-specific tweaks if needed

**Implementation steps:**

1. Test using Chrome DevTools device emulation:
   - iPhone SE, iPhone 12 Pro, iPad
   - Samsung Galaxy S8+, Galaxy Fold

2. Verify:
   - Tap indicator appears instead of cursor
   - Position is correct (centered on tap point)
   - Press animation plays during clicking phase
   - All touch interactions work (tap send button)

3. Adjust tap indicator size if needed for smaller screens:

```tsx
// In TapIndicator.tsx, consider viewport-relative sizing
width: "clamp(24px, 8vw, 32px)";
```

4. Ensure countdown text doesn't overflow on narrow screens:

```tsx
// Adjust countdown position for mobile
style={{
  position: 'absolute',
  bottom: '-28px',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  ...
}}
```

**Verification:**

- Works correctly in all device emulation modes
- No overflow or positioning issues
- Touch interactions responsive

**Commit:** `fix: mobile compatibility adjustments`

---

## 5. Testing Strategy

### Manual Testing Checklist

Since this is a UI animation feature, manual testing is primary:

- [ ] Desktop: Full animation sequence plays correctly
- [ ] Desktop: Cursor movement is smooth (0.35s ease-out)
- [ ] Desktop: Click ripple appears at correct position
- [ ] Desktop: Input focus ring appears after click
- [ ] Desktop: Typing animation works (variable speed)
- [ ] Desktop: Cursor moves to send button after typing
- [ ] Desktop: Send button highlights during waiting phase
- [ ] Desktop: Countdown displays and decrements correctly
- [ ] Desktop: Clicking send button triggers redirect
- [ ] Desktop: Pressing Enter triggers redirect
- [ ] Desktop: Auto-redirect after 5 seconds
- [ ] Desktop: Skip button works at any point
- [ ] Mobile: Tap indicator appears instead of cursor
- [ ] Mobile: Tap indicator press animation plays
- [ ] Mobile: Tapping send button works
- [ ] Mobile: Layout doesn't break on narrow screens

### Test URLs

```
# Short query
http://localhost:3000/?q=hello

# Long query (test typing duration)
http://localhost:3000/?q=What%20is%20the%20meaning%20of%20life%20and%20why%20are%20we%20here

# Special characters
http://localhost:3000/?q=How%20do%20I%20use%20%22quotes%22%20%26%20symbols%3F
```

### Browser Testing

Test in:

- Chrome (primary)
- Safari
- Firefox
- Mobile Safari (real device if possible)
- Chrome on Android (real device if possible)

---

## 6. Documentation Updates

### No External Documentation Needed

This is a UI enhancement with no API changes or configuration. The code is self-documenting.

### Code Comments

Add brief comments in `AnimationView.tsx` explaining:

- The phase state machine sequence
- Why certain timing values were chosen

---

## 7. Definition of Done

- [ ] All 11 implementation tasks completed
- [ ] `yarn build` passes without errors
- [ ] `yarn lint` passes without errors
- [ ] Manual testing checklist complete (desktop + mobile)
- [ ] Cross-browser testing complete
- [ ] Animation timing feels natural and smooth
- [ ] No console errors during animation
- [ ] Skip button works throughout all phases
- [ ] Auto-redirect works after 5 seconds
- [ ] Enter key triggers redirect during waiting phase
- [ ] Code committed with descriptive messages

---

## 8. Quick Reference: File Changes Summary

| File                                | Action | Description                |
| ----------------------------------- | ------ | -------------------------- |
| `src/app/globals.css`               | Modify | Add keyframes, utilities   |
| `src/components/AnimatedCursor.tsx` | Create | macOS cursor SVG           |
| `src/components/TapIndicator.tsx`   | Create | Touch device indicator     |
| `src/components/ClickRipple.tsx`    | Create | Expanding ripple effect    |
| `src/hooks/useIsTouchDevice.ts`     | Create | Touch detection hook       |
| `src/components/AnimationView.tsx`  | Modify | State machine, JSX updates |

---

_Generated via /brainstorm-plan on 2026-01-06_
