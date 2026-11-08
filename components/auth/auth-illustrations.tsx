"use client";

import * as React from "react";

/**
 * Minimalist editorial line-art illustration of a student on a pedestal with laptop
 * Faithfully styled after the reference design:
 * Warm yellow accent block, black line contours, laptop, and idea sparks.
 */
export function AuthStudentIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Background outline block with diagonal arrow */}
        <rect
          x="30"
          y="150"
          width="70"
          height="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground/80 dark:text-foreground/60"
        />
        <path
          d="M48 190L82 156M82 156H64M82 156V174"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground/80 dark:text-foreground/60"
        />

        {/* Yellow main seating pedestal block */}
        <rect
          x="85"
          y="140"
          width="62"
          height="80"
          fill="#FAD980"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-foreground"
        />

        {/* Character legs & trousers */}
        <path
          d="M102 125C102 135 95 150 82 165C78 170 82 178 88 178C98 178 108 162 114 150L135 188C137 192 142 195 147 194C152 193 154 188 152 183L130 135"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />

        {/* Shoes */}
        <path
          d="M84 176C84 176 75 180 72 186C70 190 74 194 79 194C85 194 92 188 92 184L88 178"
          fill="#1E293B"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M148 192C148 192 146 198 143 203C141 206 145 209 149 209C155 209 161 201 160 196L154 191"
          fill="#1E293B"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Torso & patterned shirt */}
        <path
          d="M102 98C102 98 90 108 90 125C90 133 98 138 108 138C116 138 126 132 126 122C126 112 120 100 114 96"
          fill="#1E1E24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Subtle shirt pattern dots / strokes */}
        <circle cx="98" cy="112" r="1.5" fill="#FAF9F5" />
        <circle cx="106" cy="118" r="1.5" fill="#FAF9F5" />
        <circle cx="114" cy="112" r="1.5" fill="#FAF9F5" />
        <circle cx="102" cy="126" r="1.5" fill="#FAF9F5" />
        <circle cx="112" cy="128" r="1.5" fill="#FAF9F5" />

        {/* Arms holding laptop */}
        <path
          d="M112 108L126 120L144 116"
          stroke="#FAF9F5"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M112 108L126 120L144 116"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        />

        {/* Orange Laptop */}
        <path
          d="M130 120L148 124"
          stroke="#EB5E28"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M148 124L156 102"
          stroke="#EB5E28"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Neck & Head */}
        <path
          d="M112 95L114 86"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />
        {/* Face profile facing right */}
        <path
          d="M112 86C112 86 118 86 120 84C122 82 123 76 118 72C112 68 106 72 106 78C106 84 112 86 112 86Z"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2"
          className="text-foreground"
        />

        {/* Hair and bun */}
        <path
          d="M106 75C102 74 98 78 96 83C94 88 96 92 99 94C102 96 106 94 107 91C108 86 108 80 106 75Z"
          fill="#1E1E24"
        />
        <path
          d="M96 80C92 78 88 80 87 84C86 88 88 91 92 91C95 91 97 88 96 80Z"
          fill="#1E1E24"
        />

        {/* Idea / sketch rays above head */}
        <line
          x1="102"
          y1="56"
          x2="96"
          y2="46"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
        />
        <line
          x1="116"
          y1="52"
          x2="116"
          y2="40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
        />
        <line
          x1="128"
          y1="58"
          x2="136"
          y2="48"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-foreground"
        />

        {/* Base ground line */}
        <line
          x1="10"
          y1="220"
          x2="270"
          y2="220"
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
 * Geometric architectural pedestals with warm yellow and crisp contour lines
 * Matches the bottom-right corner of the reference design.
 */
export function AuthPedestalIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Soft background organic cloud/contour outline */}
        <path
          d="M60 120C50 110 50 90 65 80C80 70 105 75 115 85C125 70 150 70 160 85C170 100 160 120 150 130"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className="text-foreground/30 dark:text-foreground/20"
        />

        {/* Shorter white pedestal block */}
        <rect
          x="40"
          y="110"
          width="55"
          height="110"
          fill="#FAF9F5"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-foreground"
        />

        {/* Taller warm golden yellow pedestal block */}
        <rect
          x="95"
          y="70"
          width="60"
          height="150"
          fill="#FAD980"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-foreground"
        />

        {/* Base ground line */}
        <line
          x1="0"
          y1="220"
          x2="240"
          y2="220"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-foreground"
        />
      </svg>
    </div>
  );
}
