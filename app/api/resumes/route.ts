import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserResumes, saveUploadedResume } from "@/lib/services/resume";
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

    const resumes = await getUserResumes(session.user.id);
    return NextResponse.json({ success: true, data: resumes });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resumes." },
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
    const rateCheck = checkRateLimit(`resume_upload_${session.user.id}_${ip}`, {
      limit: 10,
      windowMs: 10 * 60 * 1000,
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck.limit, rateCheck.reset);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No resume file was attached to the request." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resume = await saveUploadedResume({
      userId: session.user.id,
      buffer,
      originalFileName: file.name,
      clientMimeType: file.type,
    });

    return NextResponse.json({ success: true, data: resume }, { status: 201 });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload resume." },
      { status: 400 }
    );
  }
}

