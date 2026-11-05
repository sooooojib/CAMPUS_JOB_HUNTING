import { NextRequest, NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store (can be connected to Redis in distributed production)
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale expired records periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export interface RateLimitOptions {
  limit?: number; // Maximum allowed requests within the window
  windowMs?: number; // Time window in milliseconds
}

/**
 * Evaluates whether an incoming client request exceeds rate limits.
 *
 * @param identifier Client identifier (IP address, user ID, or composite key)
 * @param options Configuration for limit and window duration
 * @returns Object with success boolean, remaining count, and reset timestamp
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const { limit = 60, windowMs = 60 * 1000 } = options;
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || record.resetAt <= now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(newRecord.resetAt / 1000),
    };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  const success = record.count <= limit;

  return {
    success,
    limit,
    remaining,
    reset: Math.ceil(record.resetAt / 1000),
  };
}

/**
 * Extracts a reliable client IP address from standard proxy/CDN headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Helper to generate a 429 Too Many Requests response with standard rate limit headers.
 */
export function rateLimitExceededResponse(limit: number, reset: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please slow down and try again shortly.",
      },
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(reset),
        "Retry-After": String(Math.max(1, reset - Math.ceil(Date.now() / 1000))),
      },
    }
  );
}

