import { describe, it, expect } from "vitest";
import { buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";

describe("Stage 2 Design System Component Unit Tests", () => {
  it("generates correct button variant classes", () => {
    const primary = buttonVariants({ variant: "default", size: "default" });
    expect(primary).toContain("bg-primary");
    expect(primary).toContain("text-primary-foreground");

    const destructive = buttonVariants({ variant: "destructive" });
    expect(destructive).toContain("bg-destructive");

    const small = buttonVariants({ size: "sm" });
    expect(small).toContain("h-7");
  });

  it("generates correct badge variant classes", () => {
    const defaultBadge = badgeVariants({ variant: "default" });
    expect(defaultBadge).toContain("bg-primary");

    const successBadge = badgeVariants({ variant: "success" });
    expect(successBadge).toContain("bg-emerald-500/15");

    const warningBadge = badgeVariants({ variant: "warning" });
    expect(warningBadge).toContain("bg-amber-500/15");

    const infoBadge = badgeVariants({ variant: "info" });
    expect(infoBadge).toContain("bg-sky-500/15");
  });
});

