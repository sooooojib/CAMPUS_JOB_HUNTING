import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
  "better-auth.dont_remember",
  "__Secure-better-auth.dont_remember",
];

async function performLogout(request: NextRequest, isRedirect: boolean) {
  // Extract session token
  const token =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (token) {
    try {
      await prisma.session.deleteMany({
        where: { token },
      });
    } catch (err) {
      console.error("[Logout Route] Failed to delete database session:", err);
    }
  }

  const response = isRedirect
    ? NextResponse.redirect(new URL("/login?signout=true", request.url))
    : NextResponse.json({ success: true, message: "Logged out successfully" });

  // Clear all Better Auth session cookies explicitly
  for (const name of COOKIE_NAMES) {
    response.cookies.delete(name);
    // Explicitly set expired cookie headers as fallback for various proxy/browser setups
    response.cookies.set({
      name,
      value: "",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return response;
}

export async function GET(request: NextRequest) {
  return performLogout(request, true);
}

export async function POST(request: NextRequest) {
  return performLogout(request, false);
}

