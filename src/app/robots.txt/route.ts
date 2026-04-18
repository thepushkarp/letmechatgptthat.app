const BASE_URL = "https://letmechatgptthat.app";

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*?q=

Content-Signal: search=yes, ai-train=no, ai-input=yes

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
