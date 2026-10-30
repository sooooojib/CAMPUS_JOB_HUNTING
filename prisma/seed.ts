import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Starting development seed check...");
  
  try {
    // Perform a raw connection check query
    await prisma.$queryRaw`SELECT 1 as connected;`;
    console.log("✅ Database connectivity verified successfully.");
    console.log("ℹ️ No production/mock seed records injected during Stage 1 foundation.");
  } catch (error) {
    console.warn("⚠️ Database connection check failed or server is offline.");
    console.warn("Details:", error instanceof Error ? error.message : error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error("Seed runner error:", e);
    process.exit(1);
  });

