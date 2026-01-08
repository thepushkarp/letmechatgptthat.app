---
number: 14
title: Add FAQ schema for common questions
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:36:34Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/14
---

# Add FAQ schema for common questions

## Overview

Add FAQ structured data for common questions about the tool. FAQ content is highly cited by AI systems and can appear in Google's rich results.

## Implementation

### 1. FAQ Content

```markdown
## Frequently Asked Questions

### What is Let Me ChatGPT That?

Let Me ChatGPT That (LMCGTFY) is a playful tool similar to "Let Me Google That For You" but for ChatGPT. It creates shareable links that demonstrate how easy it is to ask AI a question.

### How do I use it?

1. Go to letmechatgptthat.app
2. Type the question you want to demonstrate
3. Click "Generate Link"
4. Share the generated URL with the person who asked you an easily-searchable question

### Is it free to use?

Yes, Let Me ChatGPT That is completely free with no registration required.

### Does it store my queries?

No, queries are only stored in the URL itself. No data is saved on our servers.

### Is this affiliated with OpenAI?

No, this is an independent project not affiliated with OpenAI or ChatGPT.
```

### 2. FAQPage Schema

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Let Me ChatGPT That?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Let Me ChatGPT That (LMCGTFY) is a playful tool similar to 'Let Me Google That For You' but for ChatGPT. It creates shareable links that demonstrate how easy it is to ask AI a question."
        }
      },
      {
        "@type": "Question",
        "name": "How do I use Let Me ChatGPT That?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Go to letmechatgptthat.app, type the question you want to demonstrate, click 'Generate Link', and share the generated URL with the person who asked you an easily-searchable question."
        }
      },
      {
        "@type": "Question",
        "name": "Is Let Me ChatGPT That free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Let Me ChatGPT That is completely free with no registration required."
        }
      },
      {
        "@type": "Question",
        "name": "Does Let Me ChatGPT That store my queries?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, queries are only stored in the URL itself. No data is saved on our servers, ensuring your privacy."
        }
      },
      {
        "@type": "Question",
        "name": "Is this affiliated with OpenAI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Let Me ChatGPT That is an independent project not affiliated with OpenAI or ChatGPT."
        }
      }
    ]
  }
</script>
```

## Tasks

- [ ] Add FAQ content to homepage or dedicated FAQ section
- [ ] Add FAQPage schema markup
- [ ] Validate with [Google Rich Results Test](https://search.google.com/test/rich-results)

## Acceptance Criteria

- [ ] FAQ schema validates without errors
- [ ] FAQs are visible to users on the site
- [ ] Answers are concise and accurate

---

_Part of SEO + AI Search Optimization initiative_
