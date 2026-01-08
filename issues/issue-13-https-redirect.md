---
number: 13
title: Fix HTTP to HTTPS redirect
state: OPEN
labels: []
author: thepushkarp
created_at: 2026-01-07T18:34:45Z
closed_at: null
url: https://github.com/thepushkarp/letmechatgptthat.app/issues/13
---

# Fix HTTP to HTTPS redirect

## Problem

The site is accessible via `http://letmechatgptthat.app` without automatic redirect to HTTPS. This causes:

1. **Security concerns**: HTTP traffic is unencrypted
2. **SEO penalties**: Google penalizes non-HTTPS sites
3. **Duplicate content**: Search engines see http:// and https:// as different URLs
4. **Trust signals**: Modern browsers show "Not Secure" for HTTP sites

## Implementation Options

### Option 1: Vercel Configuration (If on Vercel)

Vercel automatically handles HTTPS, but ensure you're not overriding:

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        { "type": "header", "key": "x-forwarded-proto", "value": "http" }
      ],
      "destination": "https://letmechatgptthat.app/:path*",
      "permanent": true
    }
  ]
}
```

### Option 2: Next.js Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.headers.get("x-forwarded-proto") === "http") {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}`,
      301
    );
  }
}
```

### Option 3: Nginx/Apache (If self-hosted)

```nginx
# Nginx
server {
    listen 80;
    server_name letmechatgptthat.app;
    return 301 https://$server_name$request_uri;
}
```

### Option 4: Meta Refresh (Fallback)

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

## Also Ensure

1. **HSTS Header**: Add Strict-Transport-Security header

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

2. **Canonical URLs**: Always use `https://` in canonical tags

```html
<link rel="canonical" href="https://letmechatgptthat.app/" />
```

3. **Internal Links**: Ensure all internal links use HTTPS

## Testing

```bash
# Check redirect
curl -I http://letmechatgptthat.app

# Should return:
# HTTP/1.1 301 Moved Permanently
# Location: https://letmechatgptthat.app/
```

## Acceptance Criteria

- [ ] `http://letmechatgptthat.app` redirects to `https://` with 301 status
- [ ] HSTS header is set
- [ ] All internal links use HTTPS
- [ ] No mixed content warnings

---

_Part of SEO + AI Search Optimization initiative_
