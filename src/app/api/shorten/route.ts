import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { storeShortUrl, codeExists } from "@/lib/redis";

const MAX_QUERY_LENGTH = 2000;
const SHORT_CODE_LENGTH = 6;
const MAX_COLLISION_RETRIES = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmedQuery.length > MAX_QUERY_LENGTH) {
      return NextResponse.json(
        { error: `Query must be less than ${MAX_QUERY_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Generate unique short code with collision handling
    let code: string;
    let attempts = 0;

    do {
      code = nanoid(SHORT_CODE_LENGTH);
      attempts++;
      if (attempts > MAX_COLLISION_RETRIES) {
        return NextResponse.json(
          { error: "Failed to generate unique code. Please try again." },
          { status: 500 }
        );
      }
    } while (await codeExists(code));

    // Store the mapping
    await storeShortUrl(code, trimmedQuery);

    // Build the short URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      `https://${request.headers.get("host")}`;

    const shortUrl = `${baseUrl}/s/${code}`;

    return NextResponse.json({
      code,
      url: shortUrl,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
