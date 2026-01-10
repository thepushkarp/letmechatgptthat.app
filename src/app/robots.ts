import type { MetadataRoute } from "next";

const BASE_URL = "https://letmechatgptthat.app";

// AI crawler user agents that should be explicitly allowed
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  // Google AI
  "Google-Extended",
  // Other AI crawlers
  "Amazonbot",
  "YouBot",
  "PhindBot",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Bytespider",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule: allow all except API routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicit allow rules for AI crawlers
      ...AI_CRAWLERS.map((crawler) => ({
        userAgent: crawler,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
