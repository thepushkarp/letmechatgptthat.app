# Interactive Cursor Animation for Link Preview

## Overview

This enhancement transforms the current auto-play animation into an interactive experience. When someone opens a shortened link, they'll see a macOS-style cursor (or tap indicator on mobile) that visually navigates the ChatGPT mockup interface:

1. Cursor appears and moves to the input box
2. Clicks (with ripple effect), input gains focus
3. Text types out with blinking cursor
4. Cursor moves to send button and hovers
5. User can click/tap/press Enter to proceed, or wait 5 seconds for auto-redirect

This creates a more engaging "demo" that shows exactly what ChatGPT search is, while giving users agency over when to proceed—making the passive-aggressive humor land better because they actively choose to "just do it."

## Goals

- **Increase engagement** — Transform passive watching into active participation; users decide when to proceed
- **Enhance the joke** — The cursor demonstrating "look, you just click here and type" amplifies the passive-aggressive message
- **Maintain authenticity** — macOS cursor + click ripples reinforce the realistic browser mockup aesthetic
- **Support all devices** — Tap indicator on mobile ensures the experience works everywhere
- **Preserve escape hatches** — 5-second auto-redirect ensures no one gets stuck; Enter key provides keyboard shortcut
- **Clear feedback** — Visible countdown timer sets expectations so users know what's happening

## Non-Goals

- **No skipping the cursor animation entirely** — Users can still skip via the existing "Skip animation" link, but we're not adding a "disable cursor" preference
- **No sound effects** — Click sounds or typing sounds would be annoying and break the clean aesthetic
- **No cursor trail/particles** — Keeping it authentic macOS cursor, no flashy effects
- **No gamification** — Not adding score, achievements, or incentives to click faster
- **No cursor customization** — Single cursor style, no user preferences
- **No recording/replay** — Not capturing user interactions or providing shareable recordings of the animation

## User Experience

### Desktop Flow

1. **Page loads** → Browser mockup fades in, macOS cursor appears at a neutral position (top-left area of the chat content)
2. **Cursor moves to input** (0.3-0.4s) → Smooth ease-out movement toward the input box
3. **Click interaction** → Cursor "presses" down briefly, ripple expands from click point, input gets focus ring/border glow
4. **Typing phase** → Blinking text cursor appears, query types out character-by-character (existing variable speed logic)
5. **Cursor moves to send button** (0.3-0.4s) → After typing completes, cursor glides to hover over the send button
6. **Waiting state** → Send button highlights, countdown text appears: "Redirecting in 5...4...3...2...1..."
7. **User action OR auto-redirect** → User can click the send button, tap, or press Enter at any time. Otherwise, auto-redirect after 5 seconds.

### Mobile Flow

- Same sequence but cursor is replaced with a **tap indicator** (finger/hand icon)
- Tap indicator animates a "press" motion instead of cursor click
- Touch anywhere on send button area or tap to proceed

### Escape Hatch

"Skip animation" link remains visible throughout for users who want to jump straight to ChatGPT.

## Technical Approach

### State Machine Redesign

Expand the current phase state machine from `typing → pause → sending → redirecting` to:

```
idle → cursorToInput → clicking → typing → pause → cursorToSend → waiting → redirecting
```

### Cursor Component

- Absolute-positioned element within the mockup container
- CSS transforms for smooth movement (`transform: translate(x, y)`)
- `transition: transform 0.35s ease-out` for snappy movement
- Media query detection for touch devices → swap to tap indicator

### Click Ripple Effect

- Pseudo-element or separate div that scales from 0 to full size with opacity fade
- Triggered when cursor reaches input, positioned at cursor coordinates

### Countdown Timer

- `useEffect` with `setInterval` decrementing from 5
- Display text below or near send button: "Redirecting in {n}..."
- Clear interval on user interaction (click/Enter/touch)

### Event Listeners

- `onClick` on send button area
- `onKeyDown` for Enter key (document-level during waiting phase)
- Both trigger immediate redirect and cancel countdown

### Responsive Detection

- Use `window.matchMedia('(pointer: coarse)')` or touch event detection
- Conditionally render cursor vs tap indicator based on device type

## Key Components

### Modified/New Components

1. **`AnimationView.tsx`** (modified)
   - Expanded phase state machine with new cursor-related phases
   - Refs for input box and send button to calculate cursor target positions
   - Countdown state and auto-redirect timer
   - Event handlers for click/Enter/touch to proceed early

2. **`AnimatedCursor.tsx`** (new)
   - Renders macOS cursor SVG (black arrow with white border)
   - Props: `position: {x, y}`, `isClicking: boolean`, `visible: boolean`
   - Click state triggers scale-down animation

3. **`TapIndicator.tsx`** (new)
   - Renders finger/hand icon for touch devices
   - Same props as AnimatedCursor
   - "Press" animation scales and slightly translates down

4. **`ClickRipple.tsx`** (new)
   - Absolute-positioned expanding circle
   - Props: `origin: {x, y}`, `active: boolean`
   - CSS animation: scale 0→1, opacity 1→0 over ~0.4s

5. **`globals.css`** (modified)
   - Add cursor/ripple keyframe animations
   - Focus ring styles for input in "clicked" state

### Data Flow

```
AnimationView (state machine)
  ├── AnimatedCursor / TapIndicator (position, clicking state)
  ├── ClickRipple (triggered on click phase)
  ├── Input box (focus ring state)
  └── Send button (hover highlight, countdown display)
```

## Open Questions

1. **Cursor starting position** — Should cursor fade in at a specific spot (e.g., center of chat area, top-left corner) or animate in from off-screen?

2. **Tap indicator design** — Simple hand icon, or a more stylized touch circle? Should it match iOS/Android conventions or be neutral?

3. **Countdown position** — Below the send button, inside the message bubble area, or as a small badge on the send button itself?

4. **Focus ring color** — Use the existing `--accent` green, or a more subtle border change to match ChatGPT's actual focus states?

5. **Interruption behavior** — If user clicks/taps during the typing phase (before cursor reaches send), should we skip ahead to redirect immediately, or ignore until the waiting phase?

6. **"Was that so hard?" timing** — Currently shows during typing. Should it stay visible throughout, or only appear once cursor reaches the send button?

---

_Generated via /brainstorm on 2026-01-06_
