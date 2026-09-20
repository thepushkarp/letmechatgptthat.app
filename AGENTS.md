# AGENTS.md

This file provides guidance to coding agents working in this repository.

## Build & Development Commands

```bash
bun run dev          # Start development server (Next.js)
bun run build        # Production build
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run format       # Format with Prettier
bun run format:check # Check formatting
bun run test         # Run isolated Playwright browser checks
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
- Enter also skips while the read-only simulated question has focus; focused links and buttons retain their native actions.
- Reduced motion displays the completed question immediately and starts the countdown.
- Derive the recipient's three-step guide from these phases rather than separate timers.

### URL Shortening

- Uses Upstash Redis with 30-day TTL
- 6-character nanoid codes with collision detection
- Max query length: 2000 characters

### Design System

All styling uses CSS custom properties defined in `globals.css`:

- Color tokens: `--bg-*`, `--text-*`, `--border-*`, `--button-*`, `--error`, `--focus`
- Browser-frame shadow: `--shadow-frame`
- Shared composer, button, and status classes keep both flows consistent.
- Cursor easing: `--ease-out-expo`

Use restrained neutral surfaces in both system light and dark themes via
`prefers-color-scheme`, with no theme switch. Theme changes must apply without a
reload or theme flash. The green `#10a37f` background is retained only in the app icons.

## Design Philosophy

This project's aesthetic is **faithful ChatGPT mimicry** - the joke lands harder when the mockup feels authentic. Every design decision should reinforce this.

### Aesthetic Direction: Refined Authenticity

- **Tone**: Polished, restrained UI that follows the system light or dark theme
- **Differentiation**: The humor comes from the realistic typing animation and passive-aggressive "Was that so hard?" message - not from flashy design departures
- **Restraint**: This is intentionally NOT a place for creative experimentation. Match ChatGPT's exact patterns.

### Design Principles for This Project

1. **Typography**: Use the existing Inter font with system fallbacks. No decorative fonts.

2. **Color Discipline**: Use the light/dark semantic tokens in `globals.css`. Keep controls neutral; avoid green accents, glows, and decorative gradients.

3. **Motion with Purpose**: Preserve typing, cursor/tap feedback, and the countdown. Respect reduced motion and avoid entrance effects or button lifts.

4. **Spatial Matching**: Use generous padding, consistent rounded corners, and shared composer styles. Keep long questions scrollable without displacing composer controls.

5. **Browser Mockup Fidelity**: Keep desktop traffic lights and the `chatgpt.com` URL bar, with compact chrome on mobile. Avoid duplicate ChatGPT logos or headings. The recipient guide reads “You could’ve just…” with steps beside the frame on desktop and the current step above it on mobile.

6. **Concise Copy**: Keep essential actions, the joke, FAQ access, and brief affiliation text. Put creator attribution in the footer. App icons contain only the question mark on the existing background.

### What to Avoid

- Creative color schemes or gradients (breaks the ChatGPT illusion)
- Distinctive typography choices (this isn't a branding opportunity)
- Playful or whimsical UI elements (the humor is subtle, not cartoonish)
- Over-engineering animations (the typing effect is the star; supporting animations should be invisible)

### Browser Verification

Use `node tests/serve.mjs` for a disposable source snapshot with mocked Redis and
captured redirect destinations. It must not use production storage or submit test
questions to ChatGPT. Restart the snapshot after source changes. The production
redirect remains `https://chatgpt.com/?q=` followed by the encoded question.
