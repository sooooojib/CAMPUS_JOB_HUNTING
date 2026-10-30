import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Neon Lakebase Postgres Integration Tests", () => {
  it("connects to Neon PostgreSQL and executes a raw test query", async () => {
    const result = await prisma.$queryRaw<Array<{ connected: number }>>`SELECT 1 as connected;`;
    expect(result).toHaveLength(1);
    expect(Number(result[0].connected)).toBe(1);
  });
});

