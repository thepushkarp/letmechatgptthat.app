---
number: 9
title: Add robots.txt allowing AI crawlers
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:32:37Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/9
---

# Add robots.txt allowing AI crawlers

## Overview

Create a `robots.txt` file that explicitly allows AI crawlers access to the site for improved visibility in AI-powered search tools.

## Implementation

Create `/public/robots.txt`:

```text
# Default: allow all
User-agent: *
Allow: /
Disallow: /api/

# ——— OPENAI ———
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

# ——— ANTHROPIC (Claude) ———
User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

# ——— PERPLEXITY ———
User-agent: PerplexityBot
Allow: /

# ——— GOOGLE AI ———
User-agent: Google-Extended
Allow: /

# ——— OTHER AI CRAWLERS ———
User-agent: Amazonbot
Allow: /

User-agent: YouBot
Allow: /

User-agent: PhindBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

# Sitemap
Sitemap: https://letmechatgptthat.app/sitemap.xml
```

## Acceptance Criteria

- [ ] `robots.txt` accessible at `https://letmechatgptthat.app/robots.txt`
- [ ] AI crawlers explicitly allowed
- [ ] API routes blocked from indexing

---

_Part of SEO + AI Search Optimization initiative_
