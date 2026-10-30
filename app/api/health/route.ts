import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const startTime = Date.now();
    const result = await prisma.$queryRaw<Array<{ connected: number; now: Date; version: string }>>`
      SELECT 1 as connected, NOW() as now, version() as version;
    `;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: "neon-postgres",
      branch: process.env.NEON_BRANCH || "production",
      latencyMs,
      timestamp: result[0]?.now,
      serverVersion: result[0]?.version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

