import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin;

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Let Me ChatGPT That For You API",
      version: "1.0.0",
      description:
        "Create short, shareable URLs that animate typing a question into a ChatGPT mockup before redirecting to ChatGPT.",
      contact: {
        name: "Pushkar Patel",
        url: "https://thepushkarp.com",
      },
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/api/shorten": {
        post: {
          summary: "Create a short URL for a ChatGPT query",
          operationId: "shortenQuery",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["query"],
                  properties: {
                    query: {
                      type: "string",
                      minLength: 1,
                      maxLength: 2000,
                      description: "The question or prompt to encode.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Short URL created",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["code", "url"],
                    properties: {
                      code: {
                        type: "string",
                        description: "6-character short code.",
                      },
                      url: {
                        type: "string",
                        format: "uri",
                        description: "Full short URL.",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid query",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { error: { type: "string" } },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { error: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/openapi+json",
    },
  });
}
