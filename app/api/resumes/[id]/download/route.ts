import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getResumeFileBuffer } from "@/lib/services/resume";

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
    const { buffer, fileName, mimeType } = await getResumeFileBuffer(
      id,
      session.user.id,
      (session.user as any).systemRole
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    if (error?.digest === "NEXT_PRERENDER_INTERRUPTED") throw error;
    console.error("Error downloading resume:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unauthorized resume download." },
      { status: 403 }
    );
  }
}
