import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCompany, listCompanies } from "@/lib/services/company";
import { createCompanySchema } from "@/lib/validations/company";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listCompanies(page, limit);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to list companies." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const parsed = createCompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid company payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const company = await createCompany(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: company }, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN") ? 403 : 400;
    return NextResponse.json(
      { error: "COMPANY_CREATION_FAILED", message: error.message || "Failed to create company." },
      { status }
    );
  }
}
