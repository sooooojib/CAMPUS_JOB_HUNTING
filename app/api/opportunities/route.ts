import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createOpportunity,
  expireOverdueOpportunities,
  getApprovedOpportunities,
} from "@/lib/services/opportunity";
import {
  createOpportunitySchema,
  opportunityFilterSchema,
} from "@/lib/validations/opportunity";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Unauthenticated visitors are rejected per AGENTS.md rule: "Unauthenticated visitors cannot browse job listings, view full job descriptions"
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Sign in required to access career opportunities." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filterInput = {
      type: searchParams.get("type") || undefined,
      sourceType: searchParams.get("sourceType") || undefined,
      department: searchParams.get("department") || undefined,
      workplaceType: searchParams.get("workplaceType") || undefined,
      companyId: searchParams.get("companyId") || undefined,
      companyName: searchParams.get("companyName") || undefined,
      location: searchParams.get("location") || undefined,
      skill: searchParams.get("skill") || undefined,
      maxMinCgpa: searchParams.get("maxMinCgpa") || undefined,
      openToAllDepartments: searchParams.get("openToAllDepartments") || undefined,
      bookmarkedOnly: searchParams.get("bookmarkedOnly") || undefined,
      query: searchParams.get("query") || undefined,
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 12,
    };

    const parsed = opportunityFilterSchema.safeParse(filterInput);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_FILTERS", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // Automatically transition overdue opportunities to EXPIRED
    await expireOverdueOpportunities();

    const result = await getApprovedOpportunities(parsed.data, session.user.id);
    return NextResponse.json({ success: true, data: result.items, pagination: result.pagination });
  } catch (error: any) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to retrieve opportunities." },
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
    const parsed = createOpportunitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_FAILED",
          message: "Invalid opportunity payload.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const opportunity = await createOpportunity(session.user.id, parsed.data);
    return NextResponse.json({ success: true, data: opportunity }, { status: 201 });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN") ? 403 : 400;
    return NextResponse.json(
      { error: "OPPORTUNITY_CREATION_FAILED", message: error.message || "Failed to post opportunity." },
      { status }
    );
  }
}
