"use client";

import React from "react";

export function AppFooter() {
  const currentYear = 2026;

  return (
    <footer
      id="site-footer"
      className="border-t border-border/40 bg-card/90 dark:bg-[#060A14] text-card-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] overflow-hidden mt-12 pt-10 sm:pt-14 pb-1"
    >
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Redesigned Single Metadata Line: Clean, No Flag, No Operational Badge, No Second Line */}
        <div className="container mx-auto max-w-7xl px-6 text-center text-xs text-muted-foreground font-mono">
          <span>
            Jagannath University • Dhaka • &copy; {currentYear} UniCareer Community. All rights reserved.
          </span>
        </div>

        {/* Massive Brand Wordmark: Image 3 Style Edge-to-Edge with Website Color Grading */}
        <div className="w-full overflow-hidden select-none pointer-events-none text-center leading-none">
          <div className="text-[14.5vw] sm:text-[15.5vw] md:text-[16vw] font-black tracking-[-0.05em] leading-[0.82] uppercase bg-gradient-to-b from-slate-900 via-blue-950 to-blue-900 dark:from-white dark:via-slate-200 dark:to-blue-600/80 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
            UNICAREER
          </div>
        </div>
      </div>
    </footer>
  );
}
