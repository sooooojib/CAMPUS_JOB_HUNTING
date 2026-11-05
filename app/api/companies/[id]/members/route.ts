import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addCompanyMember } from "@/lib/services/company";
import { addCompanyMemberSchema } from "@/lib/validations/company";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = addCompanyMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid member payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const membership = await addCompanyMember(session.user.id, id, parsed.data);
    return NextResponse.json({ success: true, data: membership }, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "ADD_MEMBER_FAILED", message: error.message || "Failed to add company member." },
      { status }
    );
  }
}
