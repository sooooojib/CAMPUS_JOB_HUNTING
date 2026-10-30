import Link from "next/link";
import { GraduationCap, Activity } from "lucide-react";

export function AppFooter() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border/80 bg-card text-card-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              UniCareer Community
            </span>
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <Activity className="size-3 text-muted-foreground" />
            <span>Platform Services Operational</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <span className="text-border">•</span>
            <span>&copy; {currentYear} UniCareer. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
