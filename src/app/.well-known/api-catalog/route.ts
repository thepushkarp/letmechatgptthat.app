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

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
    },
  });
}
