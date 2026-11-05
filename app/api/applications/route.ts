import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserApplications,
  submitInternalApplication,
  recordExternalApplication,
} from "@/lib/services/application";
import {
  submitApplicationSchema,
  recordExternalApplicationSchema,
} from "@/lib/validations/application";
import { checkRateLimit, getClientIp, rateLimitExceededResponse } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";

    const result = await getUserApplications(session.user.id, status);

    return NextResponse.json({
      success: true,
      data: result.items,
      counts: result.statusCounts,
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applications." },
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
        { success: false, error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`application_submit_${session.user.id}_${ip}`, {
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck.limit, rateCheck.reset);
    }

    const body = await request.json();

    if (body.method === "EXTERNAL") {
      const parsed = recordExternalApplicationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            details: parsed.error.format(),
          },
          { status: 400 }
        );
      }

      const application = await recordExternalApplication(session.user.id, parsed.data);
      return NextResponse.json({ success: true, data: application }, { status: 201 });
    }

    const parsed = submitApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const application = await submitInternalApplication(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application." },
      { status: 400 }
    );
  }
}

