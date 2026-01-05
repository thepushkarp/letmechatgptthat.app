# Let Me ChatGPT That

> For all those people who find it more convenient to bother you with their question rather than ChatGPT it themselves.

A passive-aggressive link generator inspired by [Let Me Google That For You](https://lmgtfy.app/), but for ChatGPT. Generate a shareable link that animates typing a question into a ChatGPT mockup before redirecting the recipient to the real ChatGPT with their question pre-filled.

## Features

- **Realistic Typing Animation** — Variable-speed character-by-character typing that mimics human input (spaces type faster than letters)
- **Authentic ChatGPT Mockup** — Browser chrome with macOS traffic lights, URL bar, and ChatGPT branding
- **State Machine Animation** — Smooth progression through phases: typing → pause → sending → redirecting
- **Shareable Links** — Generate URLs like `letmechatgptthat.app/?q=your+question` to share with friends
- **One-Click Copy** — Easily copy generated links to clipboard
- **Skip Animation** — Recipients can skip straight to ChatGPT if they're impatient
- **Mobile Responsive** — Works on all device sizes

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **React**: React 19
- **Styling**: CSS Custom Properties + Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: Yarn (with PnP)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/thepushkarp/letmechatgptthat.app.git
cd letmechatgptthat.app

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Available Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `yarn dev`          | Start development server        |
| `yarn build`        | Create production build         |
| `yarn start`        | Start production server         |
| `yarn lint`         | Run ESLint                      |
| `yarn lint:fix`     | Fix ESLint issues automatically |
| `yarn format`       | Format code with Prettier       |
| `yarn format:check` | Check code formatting           |

## How It Works

### Two Main Views

1. **Landing Page** (`/?q` parameter absent)
   - User types a question into a ChatGPT-styled input
   - Generates a shareable URL with the query encoded
   - Displays the link with a copy button

2. **Animation View** (`/?q=your+question`)
   - Displays a realistic ChatGPT browser mockup
   - Animates typing the query character-by-character
   - Shows a passive-aggressive "Was that so hard?" message
   - Redirects to `chatgpt.com/?q=your+question` after animation completes

### Animation State Machine

```
typing → pause → sending → redirecting
  │         │        │          │
  ├─────────┴────────┴──────────┤
  │     Cursor blinks during    │
  │     typing and pause phases │
  └─────────────────────────────┘
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx        # Main page with routing logic
│   ├── layout.tsx      # Root layout with metadata
│   └── globals.css     # Design system (CSS variables, animations)
└── components/
    ├── AnimationView.tsx  # Typing animation + ChatGPT mockup
    ├── ChatInput.tsx      # Auto-resizing textarea
    ├── Header.tsx         # Site header with logo
    └── LinkDisplay.tsx    # Generated link display with copy button
```

## Design System

All styling uses CSS custom properties defined in `globals.css`:

### Color Tokens

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary` — Background colors
- `--text-primary`, `--text-secondary`, `--text-muted` — Text colors
- `--accent` (`#10a37f`) — ChatGPT's signature green
- `--border-subtle`, `--border-input` — Border colors

### Other Tokens

- Shadows: `--shadow-xs` through `--shadow-lg`, `--shadow-glow`
- Border radii: `--radius-sm` through `--radius-full`
- Transitions: `--ease-out-expo`, `--transition-fast/base/slow`

## Design Philosophy

This project's aesthetic prioritizes **faithful ChatGPT mimicry** — the joke lands harder when the mockup feels authentic.

- **Typography**: Uses system fonts that match ChatGPT's style
- **Color Discipline**: Colors are sampled directly from ChatGPT's dark mode
- **Motion with Purpose**: Animations serve the joke (typing simulation, cursor blink, send button press)
- **Browser Mockup Fidelity**: Includes macOS traffic lights, URL bar, and ChatGPT branding

## Deployment

This is a standard Next.js app that can be deployed to any platform supporting Node.js:

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thepushkarp/letmechatgptthat.app)

### Other Platforms

```bash
# Build for production
yarn build

# Start production server
yarn start
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
