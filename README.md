# Let Me ChatGPT That

> For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.

A passive-aggressive link generator inspired by [Let Me Google That For You](https://lmgtfy.app/), but for ChatGPT. Generate a shareable short link that animates typing a question into a ChatGPT mockup before redirecting the recipient to the real ChatGPT with their question pre-filled.

## Features

- **Short URLs** — Generate clean links like `letmechatgptthat.app/s/abc123` (powered by Upstash Redis)
- **Realistic Typing Animation** — Variable-speed character-by-character typing that mimics human input
- **Animated Cursor/Tap** — Desktop shows a moving cursor; mobile shows a tap indicator
- **Authentic ChatGPT Mockup** — Browser chrome with macOS traffic lights, URL bar, and ChatGPT branding
- **State Machine Animation** — Smooth progression through phases: cursor movement → click → typing → send
- **Interactive Countdown** — 5-second countdown with click or Enter to skip
- **One-Click Copy** — Easily copy generated links to clipboard
- **Mobile Responsive** — Device-aware animations for touch and desktop

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **React**: React 19
- **Styling**: CSS Custom Properties + Tailwind CSS
- **Database**: [Upstash Redis](https://upstash.com/) for URL shortening
- **Language**: TypeScript
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Bun
- Upstash Redis account (for URL shortening)

### Installation

```bash
# Clone the repository
git clone https://github.com/thepushkarp/letmechatgptthat.app.git
cd letmechatgptthat.app

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Add your Upstash Redis credentials

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable                   | Description                         |
| -------------------------- | ----------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | Upstash Redis REST URL              |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token            |
| `NEXT_PUBLIC_BASE_URL`     | Base URL for short links (optional) |

### Available Scripts

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `bun run dev`          | Start development server        |
| `bun run build`        | Create production build         |
| `bun run start`        | Start production server         |
| `bun run lint`         | Run ESLint                      |
| `bun run lint:fix`     | Fix ESLint issues automatically |
| `bun run format`       | Format code with Prettier       |
| `bun run format:check` | Check code formatting           |

## How It Works

### URL Flow

1. **Landing Page** (`/`)
   - User types a question into a ChatGPT-styled input
   - Clicking "Generate Link" calls `/api/shorten` to create a short URL
   - Displays the short link with a copy button

2. **Animation View** (`/s/{code}`)
   - Resolves the short code to the original query via Redis
   - Shows animated cursor moving to input, clicking, typing the query
   - Displays "Was that so hard?" message
   - 5-second countdown, then redirects to `chatgpt.com/?q={query}`

### Animation State Machine

```
idle → cursorToInput → clicking → typing → pause → cursorToSend → waiting → redirecting
```

- **Desktop**: Animated macOS-style cursor
- **Mobile**: Tap indicator with ripple effect
- **Interruptible**: Click send button or press Enter during countdown

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page + legacy ?q= support
│   ├── layout.tsx            # Root layout with JSON-LD schema
│   ├── globals.css           # Design system (CSS variables)
│   ├── api/shorten/route.ts  # URL shortening API
│   └── s/[code]/
│       ├── page.tsx          # Short URL resolution
│       └── opengraph-image.tsx
├── components/
│   ├── AnimationView.tsx     # Main animation (state machine)
│   ├── AnimatedCursor.tsx    # Desktop cursor
│   ├── TapIndicator.tsx      # Mobile tap indicator
│   ├── ClickRipple.tsx       # Click effect
│   ├── ChatInput.tsx         # Auto-resizing textarea
│   └── LinkDisplay.tsx       # Copy-to-clipboard display
├── hooks/
│   └── useIsTouchDevice.ts   # Touch detection
└── lib/
    └── redis.ts              # Upstash Redis operations
```

## Design Philosophy

This project's aesthetic prioritizes **faithful ChatGPT mimicry** — the joke lands harder when the mockup feels authentic.

- **Typography**: Uses system fonts that match ChatGPT's style
- **Color Discipline**: Colors are sampled directly from ChatGPT's dark mode
- **Motion with Purpose**: Animations serve the joke (cursor movement, typing, button interactions)
- **Browser Mockup Fidelity**: Includes macOS traffic lights, URL bar, and ChatGPT branding

## Deployment

This is a standard Next.js app that can be deployed to any platform supporting Node.js:

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thepushkarp/letmechatgptthat.app&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN)

### Other Platforms

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the [repository](https://github.com/thepushkarp/letmechatgptthat.app)
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Disclaimer

This project is not affiliated with OpenAI. ChatGPT is a trademark of OpenAI. This is a parody/utility project created for entertainment purposes.

## License

MIT
