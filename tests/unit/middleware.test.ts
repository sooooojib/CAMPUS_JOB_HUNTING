import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function createMockRequest(pathname: string, cookies: Record<string, string> = {}, search = "") {
  const url = `http://localhost:3000${pathname}${search}`;
  const req = new NextRequest(url);
  Object.entries(cookies).forEach(([k, v]) => {
    req.cookies.set(k, v);
  });
  return req;
}

describe("Stage 4: Server Route Protection & Proxy Tests", () => {
  it("1. redirects unauthenticated user from protected /dashboard to /login with callbackUrl", () => {
    const req = createMockRequest("/dashboard");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login?callbackUrl=%2Fdashboard");
  });

  it("2. redirects unauthenticated user from /opportunities/post to /login with preserved deep callbackUrl", () => {
    const req = createMockRequest("/opportunities/post", {}, "?type=internship");
    const res = proxy(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login?callbackUrl=%2Fopportunities%2Fpost%3Ftype%3Dinternship");
  });

  it("3. protects all private dashboards and member functionality", () => {
    const protectedPaths = [
      "/community",
      "/referrals",
      "/applications",
      "/career-tools",
      "/contributions",
      "/profile/me",
      "/settings",
      "/notifications",
      "/admin",
    ];

    for (const path of protectedPaths) {
      const req = createMockRequest(path);
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain(`/login?callbackUrl=${encodeURIComponent(path)}`);
    }
  });

  it("4. allows unauthenticated visitors to access public marketing & info routes", () => {
    const publicPaths = ["/"];

    for (const path of publicPaths) {
      const req = createMockRequest(path);
      const res = proxy(req);
      // Status 200 / NextResponse.next()
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("5. allows unauthenticated users to access auth routes (/login, /register, /forgot-password, /reset-password)", () => {
    const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

    for (const path of authPaths) {
      const req = createMockRequest(path);
      const res = proxy(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    }
  });

  it("6. allows authenticated member to access protected routes", () => {
    const req = createMockRequest("/dashboard", {
      "better-auth.session_token": "valid-active-session-token",
    });
    const res = proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("7. redirects authenticated member away from /login to requested callbackUrl or /dashboard", () => {
    const req = createMockRequest(
      "/login",
      { "better-auth.session_token": "valid-active-session-token" },
      "?callbackUrl=%2Fopportunities"
    );
    const res = proxy(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/opportunities");
  });

  it("8. permits access to /login when signout=true even if a session cookie is present and expires cookies", () => {
    const req = createMockRequest(
      "/login",
      { "better-auth.session_token": "valid-active-session-token" },
      "?signout=true"
    );
    const res = proxy(req);

    // Should NOT redirect back to /dashboard
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
    // Should set expired cookie header
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
  });
});
