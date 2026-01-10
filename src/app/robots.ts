import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://letmechatgptthat.app";

  // AI crawler user agents that should be explicitly allowed
  const aiCrawlers = [
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
  ];

  return {
    rules: [
      // Default rule: allow all except API routes
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Explicit allow rules for AI crawlers
      ...aiCrawlers.map((crawler) => ({
        userAgent: crawler,
        allow: "/",
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
