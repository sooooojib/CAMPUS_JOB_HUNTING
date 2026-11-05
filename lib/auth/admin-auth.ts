import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPlatformAdmin } from "@/lib/permissions";

/**
 * Validates that an incoming request is authenticated and originates from a verified platform admin.
 * Returns either the authorized admin User record or a structured 401/403 NextResponse.
 */
export async function requireAdminSession(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return {
      admin: null,
      errorResponse: NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } },
        { status: 401 }
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !isPlatformAdmin(user)) {
    return {
      admin: null,
      errorResponse: NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Administrator clearance required." } },
        { status: 403 }
      ),
    };
  }

  return {
    admin: user,
    errorResponse: null,
  };
}
