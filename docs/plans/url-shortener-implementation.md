# URL Shortener Implementation Plan

## Issue Reference

[GitHub Issue #4: Shorten the URL to make the shareable link unsuspecting](https://github.com/thepushkarp/letmechatgptthat.app/issues/4)

## Problem Statement

The current implementation generates URLs like:

```
https://letmechatgptthat.app/?q=how+do+I+google+something
```

This immediately reveals the joke in the URL itself, defeating the purpose of the passive-aggressive link. The goal is to make the URL **unsuspecting** from:

1. **The URL itself** - Should look innocuous (e.g., `/s/abc123`)
2. **Link previews** - Social media cards should NOT reveal the question being asked

---

## Research Findings

### How LMGTFY Handles This

Both [letmegooglethat.com](https://letmegooglethat.com/) and [lmgtfy.app](https://lmgtfy.app/) offer URL shortening:

- They use internal shortening services that map random codes to queries
- The shortened URL hides the search query completely
- Link previews show generic site branding, not the specific question

### Key Technical Components

1. **Short Code Generation** - Using `nanoid` or `shortid` libraries to create 6-8 character alphanumeric codes
2. **Storage Layer** - Mapping short codes to original queries
3. **Dynamic Metadata** - Serving generic Open Graph tags for short URLs to hide the question in link previews
4. **Redirect Flow** - `/s/[code]` → lookup query → render animation page

---

## Proposed Architecture

### URL Structure

| Type               | URL Format    | Example               |
| ------------------ | ------------- | --------------------- |
| Original (current) | `/?q={query}` | `/?q=how+do+I+google` |
| Short URL (new)    | `/s/{code}`   | `/s/xK9mP2`           |

Users will still be able to use the original `?q=` format, but the **generated shareable link** will use the short format.

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Link Generation                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   User types question  →  Generate short code  →  Store mapping   │
│                              (nanoid)            (Upstash Redis)  │
│                                                                   │
│   Return: https://letmechatgptthat.app/s/xK9mP2                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Link Resolution                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   GET /s/xK9mP2  →  Lookup in Redis  →  Render AnimationView     │
│                                        with query                 │
│                                                                   │
│   Social Crawlers see:                                           │
│   - Title: "Someone sent you a link"                             │
│   - Description: "Click to see what they want to show you"       │
│   - Image: Generic ChatGPT-style preview                         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Options

> **Note:** Vercel KV has been [sunset](https://vercel.com/changelog/vercel-kv). The recommended replacement is Upstash Redis via the [Vercel Marketplace](https://vercel.com/marketplace/upstash).

### Option A: Upstash Redis via Vercel Marketplace (Recommended)

**Pros:**

- Official replacement for Vercel KV
- Seamless Vercel integration with automatic env var provisioning
- Serverless Redis - no infrastructure management
- Unified billing through Vercel
- Free tier: 10K commands/day, 256MB storage
- Works at edge with low latency

**Cons:**

- Vendor lock-in to Upstash (though easily portable)
- Paid tiers required for high traffic

**Dependencies:**

```json
{
  "@upstash/redis": "^1.34.0",
  "nanoid": "^5.0.0"
}
```

**Environment Variables (auto-configured):**

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Option B: Upstash Redis (Direct, No Vercel Marketplace)

**Pros:**

- Works with any hosting provider (not just Vercel)
- Same SDK and capabilities
- Generous free tier (10K commands/day)
- Full control over Upstash console

**Cons:**

- Manual configuration of environment variables
- Separate billing from Vercel

### Option C: Vercel Postgres

**Pros:**

- Full SQL capabilities
- Can add analytics/click tracking later
- Persistent storage

**Cons:**

- Overkill for simple key-value lookups
- Slower than Redis for this use case
- Higher latency for edge deployments

### Option D: Edge Config (Simplest, Limited)

**Pros:**

- Zero database setup
- Ultra-fast edge reads

**Cons:**

- Write operations are slow (not real-time)
- 512KB limit - only viable for small scale
- Not suitable for user-generated short URLs

---

## Recommended Approach: Upstash Redis via Vercel Marketplace

Given this is a Next.js app deployed on Vercel, **Option A (Upstash Redis via Marketplace)** provides the best balance of simplicity, performance, and cost. It's the official successor to Vercel KV with seamless integration.

---

## Detailed Implementation Plan

### Phase 1: Database Setup

1. **Upstash Redis via Vercel Marketplace** ✅ Already installed
   - Environment variables auto-configured: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - Verify in Vercel Dashboard → Project → Settings → Environment Variables

2. **Install dependencies**

   ```bash
   yarn add @upstash/redis nanoid
   ```

3. **Create Redis utility** (`src/lib/redis.ts`)

   ```typescript
   import { Redis } from "@upstash/redis";

   export const redis = Redis.fromEnv();

   // Key prefix for short URLs
   const SHORT_URL_PREFIX = "short:";

   export async function storeShortUrl(
     code: string,
     query: string,
     ttlSeconds = 30 * 24 * 60 * 60
   ) {
     await redis.set(`${SHORT_URL_PREFIX}${code}`, query, { ex: ttlSeconds });
   }

   export async function getQueryByCode(code: string): Promise<string | null> {
     return redis.get<string>(`${SHORT_URL_PREFIX}${code}`);
   }
   ```

### Phase 2: API Routes

1. **Create `/api/shorten` endpoint** (`src/app/api/shorten/route.ts`)

   ```
   POST /api/shorten
   Body: { query: "how do I google something" }
   Response: { code: "xK9mP2", url: "https://letmechatgptthat.app/s/xK9mP2" }
   ```

   Logic:
   - Validate query (non-empty, reasonable length)
   - Generate nanoid (6 chars, alphanumeric)
   - Check for collision, regenerate if needed
   - Store in Redis with TTL (e.g., 30 days)
   - Return short URL

2. **Create `/s/[code]` dynamic route** (`src/app/s/[code]/page.tsx`)
   - Server component with `generateMetadata`
   - Lookup code in KV
   - If not found: show 404 or redirect to home
   - If found: render AnimationView with the stored query

### Phase 3: Dynamic Metadata (The "Unsuspecting" Part)

This is **critical** for making link previews not give away the joke.

1. **Create generic OG image** (`public/og-preview.png`)
   - ChatGPT-style dark theme
   - Text: "Someone sent you a link" or similar
   - Size: 1200x630 (standard OG image dimensions)

2. **Implement `generateMetadata`** in `/s/[code]/page.tsx`:

   ```typescript
   export async function generateMetadata(): Promise<Metadata> {
     return {
       title: "Someone sent you a link",
       description: "Click to see what they want to show you",
       openGraph: {
         title: "Someone sent you a link",
         description: "Click to see what they want to show you",
         images: ["/og-preview.png"],
         type: "website",
       },
       twitter: {
         card: "summary_large_image",
         title: "Someone sent you a link",
         description: "Click to see what they want to show you",
         images: ["/og-preview.png"],
       },
     };
   }
   ```

   **Key insight:** We intentionally do NOT include the query in metadata. Social crawlers will see generic text, preserving the surprise.

### Phase 4: Frontend Updates

1. **Update `page.tsx` (LandingPage)**
   - Modify `generateLink` to call `/api/shorten`
   - Show loading state while shortening
   - Display the short URL in `LinkDisplay`

2. **Update `LinkDisplay` component**
   - Handle the shorter URL format gracefully
   - Maybe add a "Show full link" toggle for debugging

3. **Error handling**
   - Rate limiting feedback
   - Network error states
   - Invalid short code handling in `/s/[code]`

### Phase 5: Cleanup & Polish

1. **Rate limiting** - Prevent abuse of the shorten API
   - Use Vercel's Edge Config or simple in-memory counter
   - Limit: ~100 shortens per IP per hour

2. **Analytics (optional)**
   - Track click counts per short URL
   - Store creation timestamp for debugging

3. **TTL Management**
   - Short URLs expire after 30 days (configurable)
   - Consider longer TTL for frequently accessed URLs

---

## File Structure After Implementation

```
src/
├── app/
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts          # POST endpoint for URL shortening
│   ├── s/
│   │   └── [code]/
│   │       └── page.tsx          # Dynamic route with generateMetadata
│   ├── page.tsx                  # Updated to use short URLs
│   └── layout.tsx                # Unchanged
├── components/
│   ├── AnimationView.tsx         # Unchanged (receives query as prop)
│   └── ...
└── lib/
    └── redis.ts                  # Upstash Redis wrapper utilities

public/
└── og-preview.png                # Generic OG image for link previews
```

---

## Alternative Metadata Strategies

### Option: Make It Look Like Real ChatGPT

Instead of generic text, the OG preview could mimic ChatGPT's actual link previews:

- Title: "ChatGPT"
- Description: "Get instant answers, find creative inspiration, learn something new."
- Image: ChatGPT logo/style

**Risk:** May violate OpenAI's brand guidelines. Current approach is safer.

### Option: Curiosity-Inducing Preview

- Title: "You've been sent a message"
- Description: "Someone wants to show you something..."
- Image: Mysterious/teasing design

This maximizes click-through while maintaining surprise.

---

## Cost Estimates

### Upstash Redis (Free Tier)

- 10,000 commands/day
- 256MB storage
- 1 database
- Sufficient for ~3,000-5,000 short URLs with normal usage

### Upstash Redis (Pay As You Go)

- $0.2 per 100K commands
- $0.25/GB storage
- Scales automatically

For a side project, the free tier should be plenty. At ~100 daily link generations + lookups, you'd use <1% of the free tier.

---

## Security Considerations

1. **Input validation** - Sanitize queries before storage
2. **Rate limiting** - Prevent database flooding
3. **No PII in short codes** - Codes are random, not derived from queries
4. **HTTPS only** - Already handled by Vercel

---

## Testing Plan

1. **Unit tests** for short code generation
   - Collision handling
   - Alphanumeric output

2. **Integration tests** for API
   - Shorten → lookup round-trip
   - Invalid code handling
   - Rate limit behavior

3. **E2E tests** for full flow
   - Generate link → copy → open → animation plays
   - Link preview verification (manual, using Facebook Debugger)

---

## Timeline Estimate

| Phase                     | Effort     |
| ------------------------- | ---------- |
| Phase 1: Database Setup   | ~1 hour    |
| Phase 2: API Routes       | ~2-3 hours |
| Phase 3: Dynamic Metadata | ~1 hour    |
| Phase 4: Frontend Updates | ~2 hours   |
| Phase 5: Polish           | ~2-3 hours |

**Total: ~8-12 hours of development**

---

## References

- [Upstash Redis Documentation](https://upstash.com/docs/redis/overall/getstarted)
- [Upstash Vercel Integration](https://upstash.com/docs/redis/howto/vercelintegration)
- [Vercel Marketplace - Upstash](https://vercel.com/marketplace/upstash)
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [nanoid](https://github.com/ai/nanoid) - Short ID generation
- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - Test OG tags
- [LMGTFY Implementation Reference](https://github.com/Arinerron/re-lmgtfy)
- [Vercel URL Shortener Example](https://github.com/samestrin/url-shortening-api-vercel)
- [Short.io OG Customization](https://blog.short.io/open-graph-short-links/)

---

## Decision Points for User

Before implementation, confirm:

1. **Storage choice**: ✅ Upstash Redis via Vercel Marketplace (already installed)
2. **Short code length**: 6 characters (62^6 = 56 billion combinations) sufficient?
3. **TTL**: 30 days default, or permanent?
4. **OG preview style**: Generic "Someone sent you a link" or ChatGPT mimicry?
5. **Rate limiting**: 100/hour per IP reasonable?
