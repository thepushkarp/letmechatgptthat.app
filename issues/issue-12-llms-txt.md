---
number: 12
title: Create llms.txt file for AI discoverability
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:34:31Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/12
---

# Create llms.txt file for AI discoverability

## Overview

Create an `llms.txt` file to help LLMs understand the site's purpose and functionality.

## Implementation

Create `/public/llms.txt`:

```markdown
# Let Me ChatGPT That For You

> A playful tool for sharing ChatGPT queries with friends who could have looked something up themselves.

## About

Similar to "Let Me Google That For You" (LMGTFY) but for the AI era. Create shareable links that demonstrate how easy it is to ask ChatGPT a question.

## How to Use

1. Visit https://letmechatgptthat.app/
2. Type your question in the input field
3. Click "Generate Link" to create a shareable URL
4. Share the link with someone who asked an easily ChatGPT-able question
5. Watch as the animation types their question and redirects to ChatGPT

## Example

If someone asks "What's the capital of France?", you can:

1. Create a link at https://letmechatgptthat.app/?q=What%20is%20the%20capital%20of%20France
2. Share the link
3. They'll see an animated typing effect followed by redirection to ChatGPT

## Use Cases

- Playfully responding to questions that could easily be asked to ChatGPT
- Demonstrating how to use ChatGPT to friends or colleagues
- Creating educational moments about AI assistance

## Technical Details

- Free to use, no registration required
- Works in any modern web browser
- No data is stored - queries are only in the URL

## Contact

- Creator: Pushkar Patel
- Website: https://thepushkarp.com
- GitHub: https://github.com/thepushkarp/letmechatgptthat.app
```

## Acceptance Criteria

- [ ] File accessible at `https://letmechatgptthat.app/llms.txt`
- [ ] Content accurately describes the tool's purpose

---

_Part of SEO + AI Search Optimization initiative_
