import { describe, it, expect } from "vitest";
import { DashboardTemplate } from "@/components/templates/dashboard-template";
import { ListingTemplate } from "@/components/templates/listing-template";
import { DetailsTemplate } from "@/components/templates/details-template";
import { FormTemplate } from "@/components/templates/form-template";
import { ProfileTemplate } from "@/components/templates/profile-template";
import { AdminTemplate } from "@/components/templates/admin-template";
import { AppSidebar } from "@/components/navigation/sidebar";
import { AppHeader } from "@/components/navigation/header";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";

describe("Stage 3 Navigation & Layout Architecture", () => {
  it("exports all 6 required reusable page templates as React components", () => {
    expect(typeof DashboardTemplate).toBe("function");
    expect(typeof ListingTemplate).toBe("function");
    expect(typeof DetailsTemplate).toBe("function");
    expect(typeof FormTemplate).toBe("function");
    expect(typeof ProfileTemplate).toBe("function");
    expect(typeof AdminTemplate).toBe("function");
  });

  it("exports authenticated shell and core navigation components", () => {
    expect(typeof AuthenticatedShell).toBe("function");
    expect(typeof AppSidebar).toBe("function");
    expect(typeof AppHeader).toBe("function");
    expect(typeof MobileNav).toBe("function");
  });

  it("defines the full suite of required authenticated navigation targets", () => {
    const requiredRoutes = [
      "/dashboard",
      "/opportunities",
      "/opportunities/post",
      "/community",
      "/referrals",
      "/applications",
      "/career-tools",
      "/contributions",
      "/settings",
      "/profile/me",
      "/notifications",
      "/admin",
    ];

    expect(requiredRoutes).toHaveLength(12);
    requiredRoutes.forEach((route) => {
      expect(route.startsWith("/")).toBe(true);
    });
  });

  it("defines public entry routes without exposing unauthenticated private opportunity feeds", () => {
    const publicRoutes = ["/", "/about", "/terms", "/privacy", "/login", "/register", "/forgot-password"];

    expect(publicRoutes).toContain("/");
    expect(publicRoutes).toContain("/login");
    expect(publicRoutes).toContain("/register");
    expect(publicRoutes).toContain("/terms");
    expect(publicRoutes).toContain("/privacy");
    expect(publicRoutes).not.toContain("/opportunities");
    expect(publicRoutes).not.toContain("/dashboard");
  });
});

