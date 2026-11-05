import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchMemberDirectory } from "@/lib/services/profile";
import { memberDirectoryQuerySchema } from "@/lib/validations/profile";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "You must be logged in to search the member directory." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = memberDirectoryQuerySchema.safeParse({
      q: searchParams.get("q") || undefined,
      department: searchParams.get("department") || undefined,
      membershipType: searchParams.get("membershipType") || undefined,
      company: searchParams.get("company") || undefined,
      skill: searchParams.get("skill") || undefined,
      interest: searchParams.get("interest") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_PARAMETERS",
            message: "Invalid query parameters.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const result = await searchMemberDirectory(session.user.id, parsed.data);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error querying member directory:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DIRECTORY_ERROR",
          message: error.message || "Failed to retrieve member directory.",
        },
      },
      { status: 500 }
    );
  }
}
