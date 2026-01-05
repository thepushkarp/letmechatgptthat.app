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

## Architecture Overview

This is a "Let Me Google That For You" style app for ChatGPT - a single-page Next.js 15 app that generates shareable links which animate typing a question into a ChatGPT mockup before redirecting to the real ChatGPT.

### Two Main Views (in `src/app/page.tsx`)

1. **LandingPage** - When visiting without `?q=` parameter
   - User types a question in `ChatInput`
   - Generates a shareable URL with the query encoded
   - Shows the link in `LinkDisplay` for copying

2. **AnimationView** - When visiting with `?q=<query>` parameter
   - Displays a ChatGPT browser mockup
   - Animates typing the query character-by-character (with realistic variable speed)
   - Shows "Was that so hard?" message
   - Redirects to `chatgpt.com/?q=<query>` after animation

### Component Structure

```
src/
├── app/
│   ├── page.tsx        # Main page with LandingPage/AnimationView routing
│   ├── layout.tsx      # Root layout with metadata
│   └── globals.css     # Design system (CSS variables, animations)
└── components/
    ├── AnimationView.tsx  # Typing animation + ChatGPT mockup
    ├── ChatInput.tsx      # Auto-resizing textarea with ChatGPT styling
    ├── Header.tsx         # Site header with logo
    └── LinkDisplay.tsx    # Generated link display with copy button
```

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
