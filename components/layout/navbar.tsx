import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/25 bg-background/65 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
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
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted/60"
          >
            Design System
          </Link>

          <div className="hidden items-center gap-1.5 rounded-full border border-border/50 bg-card/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-muted-foreground md:flex">
            <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Verified University Network</span>
          </div>

          <ThemeToggle />

          <Link
            href="/login"
            className={buttonVariants({
              variant: "default",
              size: "sm",
              className: "rounded-full px-5 py-2 font-semibold shadow-xs hover:shadow-sm transition-all",
            })}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
