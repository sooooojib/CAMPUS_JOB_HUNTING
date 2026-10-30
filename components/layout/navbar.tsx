import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight text-foreground">
              UniCareer
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Community
            </span>
          </div>
        </Link>

        {/* Informational Nav / Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/design-system"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md"
          >
            Design System
          </Link>

          <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground md:flex">
            <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Verified University Network</span>
          </div>

          <ThemeToggle />

          <Link
            href="/login"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
