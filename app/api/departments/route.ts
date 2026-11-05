import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, data: departments });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to load departments." },
      { status: 500 }
    );
  }
}
