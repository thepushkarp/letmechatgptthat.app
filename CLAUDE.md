# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
yarn dev          # Start development server (Next.js)
yarn build        # Production build
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format with Prettier
yarn format:check # Check formatting
```

**Environment Variables** (for URL shortening):

- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token
- `NEXT_PUBLIC_BASE_URL` - Base URL for short links (optional, auto-detected)

## Architecture Overview

This is a "Let Me Google That For You" style app for ChatGPT - a Next.js 15 app that generates shareable short URLs which animate typing a question into a ChatGPT mockup before redirecting to the real ChatGPT.

### URL Flow

1. User enters question on landing page → generates short URL (`/s/{code}`)
2. Recipient visits short URL → sees typing animation → redirects to `chatgpt.com/?q={query}`

### Routes

| Route          | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `/`            | Landing page (no query) or legacy animation view (`?q=`) |
| `/s/[code]`    | Short URL resolution → AnimationView                     |
| `/api/shorten` | POST endpoint to create short URLs                       |

### Key Files

```
src/
├── app/
│   ├── page.tsx              # Landing/legacy animation routing
│   ├── layout.tsx            # Root layout + JSON-LD schema
│   ├── globals.css           # Design system (CSS variables)
│   ├── api/shorten/route.ts  # URL shortening API
│   └── s/[code]/
│       ├── page.tsx          # Short URL resolution
│       └── opengraph-image.tsx  # Dynamic OG images
├── components/
│   ├── AnimationView.tsx     # Main animation (state machine)
│   ├── AnimatedCursor.tsx    # Desktop cursor animation
│   ├── TapIndicator.tsx      # Mobile tap animation
│   ├── ClickRipple.tsx       # Click effect overlay
│   ├── ChatInput.tsx         # Auto-resizing textarea
│   └── LinkDisplay.tsx       # Copy-to-clipboard display
├── hooks/
│   └── useIsTouchDevice.ts   # Touch detection via media query
└── lib/
    └── redis.ts              # Upstash Redis operations
```

### Animation State Machine

`AnimationView` uses phases: `idle` → `cursorToInput` → `clicking` → `typing` → `pause` → `cursorToSend` → `waiting` → `redirecting`

- Device-aware: shows cursor on desktop, tap indicator on touch devices
- 5-second countdown during `waiting` phase before auto-redirect
- User can click send button or press Enter to skip countdown

### URL Shortening

- Uses Upstash Redis with 30-day TTL
- 6-character nanoid codes with collision detection
- Max query length: 2000 characters

### Design System

All styling uses CSS custom properties defined in `globals.css`:

- Color tokens: `--bg-*`, `--text-*`, `--border-*`, `--accent-*`, `--surface-*`
- Shadows: `--shadow-xs` through `--shadow-lg`, `--shadow-glow`
- Radii: `--radius-sm` through `--radius-full`
- Transitions: `--ease-out-expo`, `--transition-fast/base/slow`

The design mimics ChatGPT's dark mode aesthetic (accent color: `#10a37f`).

## Design Philosophy

This project's aesthetic is **faithful ChatGPT mimicry** - the joke lands harder when the mockup feels authentic. Every design decision should reinforce this.

### Aesthetic Direction: Refined Authenticity

- **Tone**: Polished, professional dark UI that could pass as the real ChatGPT at first glance
- **Differentiation**: The humor comes from the realistic typing animation and passive-aggressive "Was that so hard?" message - not from flashy design departures
- **Restraint**: This is intentionally NOT a place for creative experimentation. Match ChatGPT's exact patterns.

### Design Principles for This Project

1. **Typography**: Use Söhne (ChatGPT's actual font) with system font fallbacks. No decorative or distinctive fonts - authenticity is the goal.

2. **Color Discipline**: Stick to the existing CSS variable palette (`--bg-primary: #0d0d0d`, `--accent: #10a37f`). These are sampled from actual ChatGPT. Don't introduce new colors.

3. **Motion with Purpose**: Animations serve the joke (typing simulation, cursor blink, send button press). Use `--ease-out-expo` for smooth, premium-feeling transitions. Avoid gratuitous effects.

4. **Spatial Matching**: ChatGPT uses generous padding, rounded corners (`--radius-2xl` for inputs), and careful vertical rhythm. Mirror these patterns exactly.

5. **Browser Mockup Fidelity**: The `AnimationView` includes macOS traffic lights, URL bar, and ChatGPT branding. These details sell the illusion.

### What to Avoid

- Creative color schemes or gradients (breaks the ChatGPT illusion)
- Distinctive typography choices (this isn't a branding opportunity)
- Playful or whimsical UI elements (the humor is subtle, not cartoonish)
- Over-engineering animations (the typing effect is the star; supporting animations should be invisible)

### Animation System

`AnimationView` uses a state machine with phases: `typing` → `pause` → `sending` → `redirecting`

- Typing speed varies by character (spaces are faster)
- Cursor blink animation during typing/pause
- Visual feedback on send button press
- Spinner during redirect
