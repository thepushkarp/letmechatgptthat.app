---
number: 15
title: Create and submit XML sitemap
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:36:54Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/15
---

# Create and submit XML sitemap

## Overview

Create an XML sitemap for search engine discovery, even though this is a single-page app.

## Implementation

Create `/public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://letmechatgptthat.app/</loc>
    <lastmod>2025-01-07</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

For a more dynamic approach (if you add pages later):

```typescript
// Next.js app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://letmechatgptthat.app",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
```

## Submission

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add and verify `letmechatgptthat.app`
3. Submit sitemap URL

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add and verify site
3. Submit sitemap

## Tasks

- [ ] Create sitemap.xml
- [ ] Reference in robots.txt
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools

## Acceptance Criteria

- [ ] Sitemap accessible at `https://letmechatgptthat.app/sitemap.xml`
- [ ] Valid XML format
- [ ] Submitted to search engines

---

_Part of SEO + AI Search Optimization initiative_
