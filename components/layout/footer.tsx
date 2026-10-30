"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export function AppFooter() {
  const currentYear = 2026;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <footer className="border-t border-border/40 bg-card/90 dark:bg-[#060A14] text-card-foreground rounded-t-[2.5rem] sm:rounded-t-[3.5rem] overflow-hidden mt-12">
      <div className="container mx-auto max-w-7xl px-6 sm:px-10 pt-16 sm:pt-20 pb-8 space-y-16">
        {/* Top Grid: Newsletter on Left, 3 Navigation Columns on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          {/* Left Column: Stay in the Know / Newsletter */}
          <div className="lg:col-span-5 space-y-5">
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground">
              Stay in the know
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Official campus placement drives, alumni dispatches, and verified career opportunities delivered to your institutional inbox.
            </p>

            {submitted ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-full border border-emerald-500/20 max-w-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  Subscribed. Welcome to the campus network digest.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
                <div className="relative flex items-center border-b border-foreground/30 focus-within:border-primary pb-2.5 transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground outline-none pr-8"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to updates"
                    className="absolute right-0 text-foreground hover:text-primary transition-colors p-1"
                  >
                    <ArrowRight className="size-4.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  By entering your email, you agree to receive official campus placement alerts in accordance with our Privacy Vault standards.
                </p>
              </form>
            )}
          </div>

          {/* Right Columns: 3 Navigation Link Categories */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono">
            {/* Column 1: Community */}
            <div className="space-y-4">
              <span className="font-bold tracking-wider uppercase text-foreground text-[11px]">
                Community
              </span>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="/register" className="hover:text-foreground transition-colors">
                    Alumni Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/referrals" className="hover:text-foreground transition-colors">
                    Referral Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Campus Feed
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Department Chapters
                  </Link>
                </li>
                <li>
                  <Link href="/design-system" className="hover:text-foreground transition-colors">
                    Design Tokens
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Opportunities */}
            <div className="space-y-4">
              <span className="font-bold tracking-wider uppercase text-foreground text-[11px]">
                Opportunities
              </span>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="/opportunities" className="hover:text-foreground transition-colors">
                    All Listings
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities" className="hover:text-foreground transition-colors">
                    Summer Internships
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities" className="hover:text-foreground transition-colors">
                    FinTech & Banking MTOs
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities" className="hover:text-foreground transition-colors">
                    Research Fellowships
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities/post" className="hover:text-foreground transition-colors">
                    Post an Opportunity
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Institution */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <span className="font-bold tracking-wider uppercase text-foreground text-[11px]">
                Institution
              </span>
              <ul className="space-y-2.5 text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Registrar Standards
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Private Vault
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Access
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Zero Web Scraping
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Institutional Desk
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Middle Metadata & Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span>🇧🇩</span>
              <span>Jagannath University • Dhaka</span>
            </span>
            <span className="text-border">•</span>
            <span>&copy; {currentYear} UniCareer Community. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-3.5 py-1.5 shadow-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <Activity className="size-3 text-emerald-500" />
            <span className="font-mono text-[11px] font-semibold text-foreground">
              Institutional Gateway Operational
            </span>
          </div>
        </div>

        {/* Bottom Scaled Display Wordmark (Outway Style, Scaled Tastefully) */}
        <div className="pt-6 select-none pointer-events-none text-center sm:text-left overflow-hidden border-t border-border/30">
          <div className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.04em] uppercase text-foreground/80 dark:text-foreground/90 leading-none">
            UNICAREER
          </div>
        </div>
      </div>
    </footer>
  );
}
