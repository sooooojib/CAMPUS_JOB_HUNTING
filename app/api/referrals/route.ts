import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createReferralRequest,
  getUserReferralRequests,
} from "@/lib/services/referral";
import {
  createReferralSchema,
  referralQuerySchema,
} from "@/lib/validations/referral";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const parsed = referralQuerySchema.safeParse({
      role: searchParams.get("role") || undefined,
      status: searchParams.get("status") || undefined,
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: "Invalid query parameters.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const result = await getUserReferralRequests(session.user.id, parsed.data);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error retrieving referral requests:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REFERRAL_ERROR",
          message: error.message || "Failed to retrieve referral requests.",
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createReferralSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid referral request data.",
            details: parsed.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const referral = await createReferralRequest(session.user.id, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: referral,
        message: "Referral request submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating referral request:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "CREATION_FAILED",
          message: error.message || "Failed to create referral request.",
        },
      },
      { status: 400 }
    );
  }
}
