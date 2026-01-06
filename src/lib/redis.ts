import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();

const SHORT_URL_PREFIX = "short:";
const DEFAULT_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

export async function storeShortUrl(
  code: string,
  query: string,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> {
  await redis.set(`${SHORT_URL_PREFIX}${code}`, query, { ex: ttlSeconds });
}

export async function getQueryByCode(code: string): Promise<string | null> {
  return redis.get<string>(`${SHORT_URL_PREFIX}${code}`);
}

export async function codeExists(code: string): Promise<boolean> {
  const result = await redis.exists(`${SHORT_URL_PREFIX}${code}`);
  return result === 1;
}
