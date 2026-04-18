import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  const linkset = {
    linkset: [
      {
        anchor: `${baseUrl}/api/shorten`,
        "service-desc": [
          {
            href: `${baseUrl}/.well-known/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${baseUrl}/llms.txt`,
            type: "text/plain",
          },
        ],
      },
    ],
  };

  const linkHeader = [
    `<${baseUrl}/.well-known/openapi.json>; rel="service-desc"; anchor="${baseUrl}/api/shorten"; type="application/openapi+json"`,
    `<${baseUrl}/llms.txt>; rel="service-doc"; anchor="${baseUrl}/api/shorten"; type="text/plain"`,
  ].join(", ");

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      Link: linkHeader,
    },
  });
}
