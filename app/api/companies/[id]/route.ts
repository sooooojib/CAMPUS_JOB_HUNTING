import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCompany, updateCompany } from "@/lib/services/company";
import { updateCompanySchema } from "@/lib/validations/company";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const company = await getCompany(id);
    return NextResponse.json({ success: true, data: company });
  } catch (error: any) {
    const status = error.message?.includes("NOT_FOUND") ? 404 : 500;
    return NextResponse.json(
      { error: "GET_COMPANY_FAILED", message: error.message || "Failed to retrieve company." },
      { status }
    );
  }
}

export async function PUT(
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
    const parsed = updateCompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid update payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const updated = await updateCompany(session.user.id, id, parsed.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("NOT_FOUND")
      ? 404
      : 400;
    return NextResponse.json(
      { error: "UPDATE_COMPANY_FAILED", message: error.message || "Failed to update company." },
      { status }
    );
  }
}
