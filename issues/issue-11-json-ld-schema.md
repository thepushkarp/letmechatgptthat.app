---
number: 11
title: Add JSON-LD structured data (Schema.org)
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:33:22Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/11
---

# Add JSON-LD structured data (Schema.org)

## Overview

Add JSON-LD structured data to help search engines and AI understand the application.

## Implementation

Add to homepage:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Let Me ChatGPT That For You",
    "alternateName": "LMCGTFY",
    "description": "Create shareable links that demonstrate how to ask ChatGPT - for people who find it easier to ask you than to ChatGPT it themselves",
    "url": "https://letmechatgptthat.app",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Pushkar Patel",
      "url": "https://thepushkarp.com"
    },
    "datePublished": "2024-01-01",
    "dateModified": "2025-01-07",
    "inLanguage": "en",
    "keywords": ["ChatGPT", "AI", "shareable links", "LMGTFY alternative"],
    "sameAs": [
      "https://github.com/thepushkarp/letmechatgptthat.app",
      "https://thepushkarp.com"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://letmechatgptthat.app/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }
</script>
```

## Tasks

- [ ] Add WebApplication schema to homepage
- [ ] Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Validate with [Schema.org Validator](https://validator.schema.org/)

## Acceptance Criteria

- [ ] JSON-LD validates without errors
- [ ] Schema accurately describes the application

---

_Part of SEO + AI Search Optimization initiative_
