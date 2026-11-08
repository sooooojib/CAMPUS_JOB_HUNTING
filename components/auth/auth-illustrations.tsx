"use client";

import * as React from "react";

/**
 * Campus & Academic Heritage Vector Illustration (Bottom-Left)
 * Features university campus columns, a graduation cap, academic books, and stepping stones.
 */
export function CampusCareerIllustrationLeft({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 280 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        {/* University Classical Portico / Pillars */}
        {/* Pediment triangle */}
        <path
          d="M30 90L95 55L160 90H30Z"
          fill="currentColor"
          className="text-primary/10 dark:text-primary/20"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Architrave beam */}
        <rect
          x="26"
          y="90"
          width="138"
          height="10"
          rx="2"
          fill="currentColor"
          className="text-primary/15 dark:text-primary/25"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* 3 Classical Columns */}
        {/* Column 1 */}
        <rect x="36" y="100" width="16" height="85" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="44" y1="104" x2="44" y2="181" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        {/* Column 2 */}
        <rect x="87" y="100" width="16" height="85" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="95" y1="104" x2="95" y2="181" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        {/* Column 3 */}
        <rect x="138" y="100" width="16" height="85" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="146" y1="104" x2="146" y2="181" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />

        {/* Column Base Foundation */}
        <rect
          x="20"
          y="185"
          width="150"
          height="14"
          rx="2"
          fill="currentColor"
          className="text-primary/15 dark:text-primary/25"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Stack of Academic Books in Front */}
        {/* Book 1 (bottom) */}
        <rect
          x="145"
          y="172"
          width="60"
          height="14"
          rx="2"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />
        {/* Book 2 (middle) */}
        <rect
          x="150"
          y="158"
          width="52"
          height="14"
          rx="2"
          fill="currentColor"
          className="text-primary/25 text-primary"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Book 3 (top) */}
        <rect
          x="154"
          y="144"
          width="46"
          height="14"
          rx="2"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />

        {/* Graduation Cap (Mortarboard) resting on books */}
        <path
          d="M177 122L208 132L177 142L146 132L177 122Z"
          fill="currentColor"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M162 137V146C162 150 169 153 177 153C185 153 192 150 192 146V137"
          fill="currentColor"
          className="text-primary/80"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Tassel */}
        <path
          d="M177 132C182 135 186 142 186 148"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-amber-500"
        />
        <circle cx="186" cy="149" r="2" fill="#F59E0B" />

        {/* Knowledge & Ideas Sparks */}
        <line x1="177" y1="108" x2="177" y2="100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
        <line x1="162" y1="112" x2="156" y2="106" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
        <line x1="192" y1="112" x2="198" y2="106" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />

        {/* Stepping Stones / Path towards career hub */}
        <ellipse cx="225" cy="192" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-muted-foreground" />
        <ellipse cx="255" cy="186" rx="14" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="text-muted-foreground" />

        {/* Base ground line */}
        <line
          x1="10"
          y1="199"
          x2="275"
          y2="199"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
      </svg>
    </div>
  );
}

/**
 * Career Growth & Professional Networking Vector Illustration (Bottom-Right)
 * Features an upward career trajectory bar graph, professional briefcase, and verified networking nodes.
 */
export function CampusCareerIllustrationRight({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 280 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Career Growth Progression Bar Pedestals */}
        {/* Bar 1 (Internship/Student tier) */}
        <rect
          x="65"
          y="145"
          width="36"
          height="54"
          rx="2"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />

        {/* Bar 2 (Graduation / Entry Level) */}
        <rect
          x="115"
          y="110"
          width="36"
          height="89"
          rx="2"
          fill="currentColor"
          className="text-primary/20"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Bar 3 (Alumni Leadership / Full Time) */}
        <rect
          x="165"
          y="75"
          width="38"
          height="124"
          rx="2"
          fill="currentColor"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Upward Career Trajectory Arrow Curve */}
        <path
          d="M50 160C85 140 120 100 185 55"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-primary"
        />
        {/* Arrow head */}
        <path
          d="M172 52L188 53L187 69"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />

        {/* Professional Briefcase beside graph */}
        <rect
          x="215"
          y="148"
          width="50"
          height="36"
          rx="4"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />
        {/* Briefcase handle */}
        <path
          d="M232 148V142C232 140 234 138 236 138H244C246 138 248 140 248 142V148"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Briefcase center latch */}
        <rect x="237" y="160" width="6" height="5" rx="1" fill="currentColor" className="text-primary" />
        <line x1="215" y1="162" x2="265" y2="162" stroke="currentColor" strokeWidth="1.5" />

        {/* Network Connections & Mentorship Constellation Nodes */}
        <circle cx="95" cy="65" r="4" fill="currentColor" className="text-primary" />
        <circle cx="140" cy="45" r="5" fill="currentColor" className="text-primary" />
        <circle cx="230" cy="85" r="4" fill="currentColor" className="text-primary" />
        <line x1="95" y1="65" x2="140" y2="45" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-primary/60" />
        <line x1="140" y1="45" x2="185" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-primary/60" />
        <line x1="185" y1="55" x2="230" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-primary/60" />

        {/* Base ground line */}
        <line
          x1="10"
          y1="199"
          x2="275"
          y2="199"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground/70"
        />
      </svg>
    </div>
  );
}
