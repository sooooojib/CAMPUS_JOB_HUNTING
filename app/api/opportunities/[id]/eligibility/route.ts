import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkApplicationEligibility } from "@/lib/services/application";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const result = await checkApplicationEligibility(session.user.id, id);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error checking eligibility:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to check eligibility." },
      { status: 400 }
    );
  }
}
