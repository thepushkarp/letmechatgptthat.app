---
number: 10
title: Add meta tags (title, description, Open Graph, Twitter Cards)
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:33:01Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/10
---

# Add meta tags (title, description, Open Graph, Twitter Cards)

## Overview

Add comprehensive meta tags to improve search engine display and social media sharing previews.

## Implementation

Add to `<head>` section:

```html
<!-- Primary Meta Tags -->
<title>Let Me ChatGPT That For You - LMCGTFY</title>
<meta
  name="description"
  content="Create shareable links that demonstrate how easy it is to ask ChatGPT. For people who find it easier to ask you than to ChatGPT it themselves."
/>
<meta
  name="keywords"
  content="ChatGPT, LMGTFY, AI, shareable links, let me google that, chatgpt link generator"
/>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://letmechatgptthat.app/" />
<meta property="og:title" content="Let Me ChatGPT That For You" />
<meta
  property="og:description"
  content="Create shareable links that show how easy it is to ask ChatGPT - for people who could have just asked ChatGPT themselves"
/>
<meta property="og:image" content="https://letmechatgptthat.app/og-image.png" />
<meta property="og:site_name" content="Let Me ChatGPT That" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://letmechatgptthat.app/" />
<meta name="twitter:title" content="Let Me ChatGPT That For You" />
<meta
  name="twitter:description"
  content="Create shareable links that show how easy it is to ask ChatGPT"
/>
<meta
  name="twitter:image"
  content="https://letmechatgptthat.app/og-image.png"
/>

<!-- Additional SEO -->
<meta name="robots" content="index, follow" />
<meta name="author" content="Pushkar Patel" />
<link rel="canonical" href="https://letmechatgptthat.app/" />
```

## Dynamic OG Image (Optional Enhancement)

For shared query links, generate dynamic OG images showing the question:

```javascript
// Using @vercel/og or similar
export default function handler(req) {
  const { q } = req.query;

  return new ImageResponse(
    <div
      style={
        {
          /* styling */
        }
      }
    >
      <h1>Let Me ChatGPT That</h1>
      <p>"{q}"</p>
    </div>
  );
}
```

## Tasks

- [ ] Create static OG image (1200x630px) for homepage
- [ ] Add all meta tags to homepage
- [ ] (Optional) Generate dynamic OG images for shared links
- [ ] Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Acceptance Criteria

- [ ] Homepage has complete meta tags
- [ ] OG image displays correctly when shared on social media
- [ ] Twitter cards render properly

---

_Part of SEO + AI Search Optimization initiative_
