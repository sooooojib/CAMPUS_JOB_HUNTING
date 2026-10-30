import Link from "next/link";
import { GraduationCap, Activity } from "lucide-react";

export function AppFooter() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border/30 bg-card/60 text-card-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
              <GraduationCap className="size-4.5" />
            </div>
            <span className="text-sm font-bold text-foreground">
              UniCareer Community
            </span>
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/60 backdrop-blur-md px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <Activity className="size-3 text-emerald-500" />
            <span className="font-medium text-foreground">Platform Services Operational</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors px-2 py-1 rounded-full">
              About
            </Link>
            <span className="text-border/60">•</span>
            <span>&copy; {currentYear} UniCareer. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
