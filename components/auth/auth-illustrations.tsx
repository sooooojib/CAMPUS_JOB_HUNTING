"use client";

import * as React from "react";

/**
 * Editorial Campus Scholar Illustration (Left Side)
 * Handcrafted minimalist architectural line art:
 * A focused university student with laptop seated at a modern minimalist plinth,
 * stacked academic volumes with gold ribbon, graduation mortarboard with golden tassel,
 * and tied diploma scroll.
 * Simple, solid strokes — absolutely zero dashed lines, no AI artifacts.
 */
export function CampusCareerIllustrationLeft({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle soft backdrop gradient */}
          <linearGradient id="scholarAura" x1="60" y1="50" x2="220" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.09" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="bookBlueGrad" x1="168" y1="186" x2="230" y2="206" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>

          <style>{`
            @keyframes softScholarFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px); }
            }
            .anim-scholar-float {
              animation: softScholarFloat 5.2s ease-in-out infinite;
              transform-origin: 140px 140px;
            }
          `}</style>
        </defs>

        <g className="anim-scholar-float">
          {/* Background Soft Circle (Solid subtle outline, NO dashed stroke) */}
          <circle cx="140" cy="140" r="102" fill="url(#scholarAura)" />
          <circle
            cx="140"
            cy="140"
            r="102"
            stroke="#2563EB"
            strokeOpacity="0.10"
            strokeWidth="1"
          />

          {/* Solid Floor Baseline */}
          <line
            x1="28"
            y1="240"
            x2="252"
            y2="240"
            stroke="#1E293B"
            className="dark:stroke-slate-500"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="28" cy="240" r="2.5" fill="#1E293B" className="dark:fill-slate-500" />
          <circle cx="252" cy="240" r="2.5" fill="#1E293B" className="dark:fill-slate-500" />

          {/* 1. MINIMALIST DESK / WORKSTATION PODIUM */}
          {/* Clean front face */}
          <rect
            x="74"
            y="130"
            width="68"
            height="110"
            rx="6"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="2"
          />
          {/* Solid accent detail on plinth (NO dashed lines) */}
          <line
            x1="84"
            y1="148"
            x2="114"
            y2="148"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 2. THE SCHOLAR (Clean, human vector proportions) */}
          {/* Trousers & Legs hanging over front */}
          <path
            d="M86 136 C86 148 76 166 66 186 C62 192 68 200 75 200 C86 200 96 178 102 165 L118 204 C121 210 127 212 132 210 C137 207 138 201 135 195 L116 144"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Shoes resting near floor */}
          <path
            d="M58 234 C58 234 52 237 50 240 H74 C75 237 73 234 71 234 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-700 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M124 234 C124 234 120 237 118 240 H140 C141 237 139 234 137 234 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-700 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Torso / Collegiate Sweater */}
          <path
            d="M88 102 C86 112 80 124 80 134 C80 142 90 144 100 144 C110 144 118 138 118 128 C118 118 112 104 102 98 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-800 dark:stroke-slate-300"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Modern Laptop with Glowing Screen Angle */}
          <line
            x1="116"
            y1="128"
            x2="148"
            y2="128"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M142 128 L150 106 L157 108"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="142,127 150,107 156,108 144,127"
            fill="#38BDF8"
            fillOpacity="0.25"
          />

          {/* Arms typing on laptop */}
          <path
            d="M96 112 L114 124 L128 122"
            stroke="#FAF9F5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M96 112 L114 124 L128 122"
            stroke="#1E293B"
            className="dark:stroke-slate-300"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="128" cy="122" r="2" fill="#1E293B" className="dark:fill-slate-300" />

          {/* Head & Thoughtful Profile */}
          <line
            x1="100"
            y1="98"
            x2="100"
            y2="90"
            stroke="#1E293B"
            className="dark:stroke-slate-300"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="78"
            r="12"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="2"
          />
          {/* Hair sweep */}
          <path
            d="M92 78 C90 68 98 65 105 65 C113 65 114 71 111 75 C107 71 99 71 92 78 Z"
            fill="#1E293B"
            className="dark:fill-slate-400"
          />
          {/* Wireframe Reading Glasses */}
          <circle
            cx="106"
            cy="78"
            r="3.5"
            stroke="#2563EB"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Three Clean Solid Radiance Lines (Focus / Inspiration — NO dashes) */}
          <line x1="88" y1="56" x2="84" y2="48" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="52" x2="100" y2="44" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          <line x1="112" y1="56" x2="116" y2="48" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />

          {/* 3. ACADEMIC TEXTBOOKS & GRADUATION REGALIA */}
          {/* Book 1 (Foundational Volume) */}
          <g>
            <rect
              x="164"
              y="208"
              width="68"
              height="20"
              rx="4"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="2"
            />
            {/* Solid gold foil spine lines (NO dashes) */}
            <line x1="172" y1="213" x2="172" y2="223" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="178" y1="218" x2="216" y2="218" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Book 2 (University Blue Middle Volume) */}
          <g>
            <rect
              x="168"
              y="186"
              width="62"
              height="20"
              rx="4"
              fill="url(#bookBlueGrad)"
              stroke="#2563EB"
              strokeWidth="2"
            />
            {/* Solid accent line on spine (NO dashes) */}
            <line x1="176" y1="196" x2="214" y2="196" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" />
          </g>

          {/* Book 3 (Top Volume with Bookmark) */}
          <g>
            <rect
              x="174"
              y="164"
              width="54"
              height="20"
              rx="4"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="2"
            />
            {/* Solid bookmark ribbon */}
            <path
              d="M184 184 C184 192 188 196 186 204 L189 202 L192 204 C190 196 190 192 190 184 Z"
              fill="#EF4444"
              stroke="#EF4444"
              strokeWidth="0.5"
            />
          </g>

          {/* Official Graduation Mortarboard resting atop Book 3 */}
          <g>
            {/* Skull Cap Base */}
            <path
              d="M184 150 C184 158 202 163 218 150"
              fill="#1E293B"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-300"
              strokeWidth="1.75"
            />
            {/* Rhombus Mortarboard Top */}
            <polygon
              points="201,128 234,142 201,154 168,142"
              fill="#2563EB"
              stroke="#1E293B"
              className="dark:stroke-slate-200"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Center Gold Button */}
            <circle cx="201" cy="142" r="2.5" fill="#F59E0B" />
            {/* Solid Draping Golden Tassel */}
            <path
              d="M201 142 C212 144 216 150 216 158"
              stroke="#F59E0B"
              strokeWidth="1.75"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="216" cy="159" r="2" fill="#F59E0B" />
            <polygon points="214,161 218,161 217,166 215,166" fill="#F59E0B" />
          </g>

          {/* Tied Parchment Diploma Scroll with Crimson Wax Seal */}
          <g>
            <rect
              x="160"
              y="230"
              width="56"
              height="10"
              rx="2.5"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-400"
              strokeWidth="1.5"
            />
            <rect x="184" y="230" width="6" height="10" fill="#EF4444" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * Editorial Career Milestone & Growth Illustration (Right Side)
 * Handcrafted architectural pedestals with solid, clean geometry:
 * 3 ascending milestone pillars (Internship -> Applied Skill -> Executive Leadership),
 * solid executive leather briefcase with brass fittings,
 * dynamic solid ascending career trajectory, and a pinnacle summit star.
 * Completely simple, clean, and elegant — zero dashed lines, no AI artifacts.
 */
export function CampusCareerIllustrationRight({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 280 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle soft backdrop gradient */}
          <linearGradient id="careerAura" x1="80" y1="40" x2="220" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.09" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="pathGradient" x1="48" y1="205" x2="202" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="65%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="goldPillarGrad" x1="178" y1="72" x2="226" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          <linearGradient id="midPillarGrad" x1="124" y1="112" x2="168" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>

          <style>{`
            @keyframes softCareerFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(4px); }
            }
            @keyframes beaconPulse {
              0%, 100% { transform: scale(1); opacity: 0.95; }
              50% { transform: scale(1.15); opacity: 1; }
            }
            .anim-career-float {
              animation: softCareerFloat 5s ease-in-out infinite 0.3s;
              transform-origin: 140px 140px;
            }
            .anim-beacon {
              animation: beaconPulse 2.8s ease-in-out infinite;
              transform-origin: 202px 58px;
            }
          `}</style>
        </defs>

        <g className="anim-career-float">
          {/* Background Soft Circle (Solid subtle outline, NO dashed stroke) */}
          <circle cx="140" cy="140" r="102" fill="url(#careerAura)" />
          <circle
            cx="140"
            cy="140"
            r="102"
            stroke="#2563EB"
            strokeOpacity="0.10"
            strokeWidth="1"
          />

          {/* Solid Floor Baseline */}
          <line
            x1="28"
            y1="240"
            x2="252"
            y2="240"
            stroke="#1E293B"
            className="dark:stroke-slate-500"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="28" cy="240" r="2.5" fill="#1E293B" className="dark:fill-slate-500" />
          <circle cx="252" cy="240" r="2.5" fill="#1E293B" className="dark:fill-slate-500" />

          {/* 1. TIERED MILESTONE PILLARS (Clean, solid rounded geometry) */}
          {/* Pillar 1: Exploration & Internship Foundation */}
          <g>
            <rect
              x="74"
              y="152"
              width="40"
              height="88"
              rx="6"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="2"
            />
            {/* Solid accent line (NO dashes) */}
            <line x1="82" y1="170" x2="106" y2="170" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Pillar 2: Industry Acceleration & Applied Skills */}
          <g>
            <rect
              x="124"
              y="112"
              width="44"
              height="128"
              rx="6"
              fill="url(#midPillarGrad)"
              stroke="#2563EB"
              strokeWidth="2"
            />
            {/* Solid technical accent lines (NO dashes) */}
            <line x1="132" y1="132" x2="160" y2="132" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" opacity="0.6" />
            <line x1="132" y1="146" x2="152" y2="146" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" opacity="0.4" />
          </g>

          {/* Pillar 3: Leadership & Executive Placement Summit */}
          <g>
            <rect
              x="178"
              y="72"
              width="48"
              height="168"
              rx="6"
              fill="url(#goldPillarGrad)"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="2"
            />
            {/* Solid gold leadership stripes (NO dashes) */}
            <line x1="188" y1="94" x2="216" y2="94" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="188" y1="102" x2="206" y2="102" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" />
          </g>

          {/* 2. EXECUTIVE LEATHER PORTFOLIO / BRIEFCASE */}
          <g>
            {/* Briefcase Structured Body */}
            <rect
              x="32"
              y="190"
              width="42"
              height="30"
              rx="4"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="2"
            />

            {/* Briefcase Flap Overhang */}
            <path
              d="M32 199 L49 207 C51 208 55 208 57 207 L74 199 V190 H32 Z"
              fill="#F1F5F9"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-300"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />

            {/* Straps with Brass Buckles */}
            <line x1="39" y1="190" x2="39" y2="220" stroke="#1E293B" className="dark:stroke-slate-400" strokeWidth="1.25" />
            <line x1="67" y1="190" x2="67" y2="220" stroke="#1E293B" className="dark:stroke-slate-400" strokeWidth="1.25" />
            <rect x="37.5" y="204" width="3" height="4" rx="0.5" fill="#F59E0B" />
            <rect x="65.5" y="204" width="3" height="4" rx="0.5" fill="#F59E0B" />

            {/* Brass Center Clasp */}
            <rect x="50.5" y="204" width="5" height="6" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
            <circle cx="53" cy="207" r="0.75" fill="#1E293B" />

            {/* Handle on top */}
            <path
              d="M47 190 V184 C47 182 49 181 51 181 H55 C57 181 59 182 59 184 V190"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* 3. DYNAMIC SOLID ASCENDING CAREER TRAJECTORY */}
          <path
            d="M48 205 C78 184 120 138 202 58"
            stroke="url(#pathGradient)"
            strokeWidth="3.25"
            strokeLinecap="round"
          />

          {/* Waypoint Nodes along the career path (Clean solid circles) */}
          <circle cx="94" cy="150" r="4.5" fill="#FAF9F5" stroke="#2563EB" strokeWidth="2" />
          <circle cx="94" cy="150" r="1.5" fill="#2563EB" />

          <circle cx="146" cy="110" r="4.5" fill="#FAF9F5" stroke="#2563EB" strokeWidth="2" />
          <circle cx="146" cy="110" r="1.5" fill="#2563EB" />

          <circle cx="202" cy="58" r="5" fill="#FAF9F5" stroke="#10B981" strokeWidth="2" />
          <circle cx="202" cy="58" r="2" fill="#10B981" />

          {/* 4. PINNACLE SUMMIT STAR (The Career Compass) */}
          <g className="anim-beacon">
            <polygon
              points="202,40 206,53 219,58 206,63 202,76 198,63 185,58 198,53"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="0.75"
            />
            {/* Center diamond core */}
            <circle cx="202" cy="58" r="2.5" fill="#FFFFFF" />
          </g>

          {/* 5. MINIMALIST SOLID OVERHEAD GUIDANCE ARC (NO dashes) */}
          <path
            d="M80 72 C115 34 165 32 225 72"
            stroke="#93C5FD"
            strokeOpacity="0.45"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle celestial guide nodes */}
          <circle cx="80" cy="72" r="2.5" fill="#3B82F6" />
          <circle cx="130" cy="42" r="3" fill="#2563EB" />
          <circle cx="170" cy="43" r="3" fill="#3B82F6" />
          <circle cx="225" cy="72" r="2.5" fill="#10B981" />
        </g>
      </svg>
    </div>
  );
}
