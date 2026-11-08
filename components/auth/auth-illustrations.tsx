"use client";

import * as React from "react";

/**
 * Editorial Campus Scholar Illustration (Left Side)
 * Handcrafted architectural line art: An elegant university scholar at a minimalist
 * plinth workstation, refined laptop, stack of foil-embossed academic volumes,
 * graduation mortarboard with draped gold tassel, tied diploma scroll, and stellar orbit nodes.
 * Professional, human-designed editorial geometry — zero cartoon AI artifacts.
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
          {/* Subtle ambient gradients */}
          <linearGradient id="scholarAura" x1="60" y1="50" x2="220" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="bookBlueGrad" x1="170" y1="175" x2="235" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="laptopGlow" x1="125" y1="105" x2="155" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.05" />
          </linearGradient>

          <style>{`
            @keyframes softScholarFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-5px); }
            }
            @keyframes sparkPulse {
              0%, 100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.3); opacity: 1; }
            }
            @keyframes ringRotate {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 40; }
            }
            .anim-scholar-float {
              animation: softScholarFloat 5.2s ease-in-out infinite;
              transform-origin: 140px 140px;
            }
            .anim-spark-1 {
              animation: sparkPulse 3.2s ease-in-out infinite;
              transform-origin: 105px 42px;
            }
            .anim-spark-2 {
              animation: sparkPulse 2.8s ease-in-out infinite 0.7s;
              transform-origin: 242px 105px;
            }
            .anim-orbit {
              animation: ringRotate 20s linear infinite;
            }
          `}</style>
        </defs>

        <g className="anim-scholar-float">
          {/* Background Soft Aura & Celestial Rings */}
          <circle cx="140" cy="142" r="105" fill="url(#scholarAura)" />
          <circle
            cx="140"
            cy="142"
            r="105"
            stroke="#2563EB"
            strokeOpacity="0.15"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="anim-orbit"
          />

          {/* Floor / Ground Calibration Baseline */}
          <line
            x1="25"
            y1="240"
            x2="255"
            y2="240"
            stroke="#1E293B"
            className="dark:stroke-slate-600"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="25" cy="240" r="2" fill="#1E293B" className="dark:fill-slate-600" />
          <circle cx="255" cy="240" r="2" fill="#1E293B" className="dark:fill-slate-600" />

          {/* 1. ARCHITECTURAL PLINTH / WORKSTATION (Isometric Bevel) */}
          {/* Top Face */}
          <path
            d="M68 135 L80 125 L148 125 L136 135 Z"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Right Side Isometric Bevel */}
          <path
            d="M136 135 L148 125 L148 230 L136 240 Z"
            fill="#E2E8F0"
            stroke="#1E293B"
            className="dark:fill-slate-800 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Main Front Face */}
          <rect
            x="68"
            y="135"
            width="68"
            height="105"
            rx="2"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-400"
            strokeWidth="1.5"
          />
          {/* Architectural datum tick line on plinth */}
          <line
            x1="76"
            y1="152"
            x2="128"
            y2="152"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <line
            x1="76"
            y1="156"
            x2="100"
            y2="156"
            stroke="#2563EB"
            strokeWidth="1.5"
          />

          {/* 2. THE SCHOLAR (Proportionate, Elegant & Professional) */}
          {/* Seated Leg Structure */}
          <path
            d="M86 136 C86 148 76 166 66 186 C62 192 68 200 75 200 C86 200 96 178 102 165 L118 204 C121 210 127 212 132 210 C137 207 138 201 135 195 L116 144"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Minimalist Oxford Shoes resting on floor */}
          <path
            d="M62 232 C62 232 55 235 52 238 C50 240 52 242 56 242 H76 C78 242 80 239 79 237 L75 232 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-700 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M128 232 C128 232 124 235 122 238 C120 240 122 242 126 242 H144 C146 242 148 239 146 237 L140 232 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-700 dark:stroke-slate-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Tailored Collegiate Blazer / Torso */}
          <path
            d="M88 102 C88 102 76 112 76 130 C76 140 86 144 98 144 C108 144 118 136 118 126 C118 116 110 102 102 98 Z"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-800 dark:stroke-slate-300"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Blazer Lapel & University Tie Detail */}
          <path
            d="M94 98 L98 114 L102 98"
            stroke="#FAF9F5"
            className="dark:stroke-slate-400"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M97 104 L97 116 L99 122 L97 124"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Arms with clean sleeve cuffs */}
          <path
            d="M94 112 L112 124 L128 120"
            stroke="#FAF9F5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M94 112 L112 124 L128 120"
            stroke="#1E293B"
            className="dark:stroke-slate-300"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Hand resting on keyboard */}
          <circle cx="128" cy="120" r="2" fill="#1E293B" className="dark:fill-slate-300" />

          {/* Refined Laptop (MacBook style aluminum profile) */}
          <path
            d="M116 126 H146"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Laptop Screen with glowing display angle */}
          <path
            d="M142 126 L150 102 L158 104"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="142,125 150,103 157,105 145,125"
            fill="url(#laptopGlow)"
          />

          {/* Head & Thoughtful Profile */}
          <path
            d="M99 98 V90"
            stroke="#1E293B"
            className="dark:stroke-slate-300"
            strokeWidth="1.5"
          />
          {/* Head silhouette */}
          <circle
            cx="100"
            cy="78"
            r="12"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="1.75"
          />
          {/* Modern minimalist hair sweep */}
          <path
            d="M92 78 C90 70 96 66 104 66 C112 66 114 72 110 76 C106 72 98 72 92 78 Z"
            fill="#1E293B"
            className="dark:fill-slate-400"
          />
          {/* Wireframe Reading Glasses */}
          <circle
            cx="105"
            cy="78"
            r="3.5"
            stroke="#2563EB"
            strokeWidth="1.25"
            fill="none"
          />
          <line x1="101.5" y1="78" x2="100" y2="78" stroke="#2563EB" strokeWidth="1" />

          {/* 3. ACADEMIC TEXTBOOKS & GRADUATION REGALIA */}
          {/* Book 1 (Foundational Tome) */}
          <g>
            <rect
              x="165"
              y="200"
              width="72"
              height="22"
              rx="3"
              fill="#1E293B"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-400"
              strokeWidth="1.5"
            />
            {/* Gold foil spine accent */}
            <line x1="172" y1="205" x2="172" y2="217" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="176" y1="205" x2="176" y2="217" stroke="#F59E0B" strokeWidth="1" />
            <line x1="184" y1="211" x2="225" y2="211" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Book 2 (University Blue Middle Volume) */}
          <g>
            <rect
              x="170"
              y="178"
              width="66"
              height="20"
              rx="3"
              fill="url(#bookBlueGrad)"
              stroke="#2563EB"
              strokeWidth="1.5"
            />
            <line x1="178" y1="183" x2="178" y2="193" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="186" y1="188" x2="224" y2="188" stroke="#2563EB" strokeWidth="1" strokeDasharray="2 3" />
          </g>

          {/* Book 3 (Top Volume) */}
          <g>
            <rect
              x="176"
              y="156"
              width="58"
              height="20"
              rx="3"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="1.5"
            />
            {/* Flowing bookmark ribbon */}
            <path
              d="M188 176 C188 184 192 188 190 196 L193 194 L196 196 C194 188 194 184 194 176 Z"
              fill="#EF4444"
              stroke="#EF4444"
              strokeWidth="0.5"
            />
          </g>

          {/* Official Graduation Mortarboard resting atop Book 3 */}
          <g>
            {/* Skull Cap Base */}
            <path
              d="M188 144 C188 152 205 156 222 144"
              fill="#1E293B"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-300"
              strokeWidth="1.5"
            />
            {/* Rhombus Diamond Mortarboard Top in Perspective */}
            <polygon
              points="205,124 235,136 205,148 175,136"
              fill="#2563EB"
              stroke="#1E293B"
              className="dark:stroke-slate-200"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            {/* Center Gold Button */}
            <circle cx="205" cy="136" r="2.5" fill="#F59E0B" />
            {/* Draping Fine Golden Tassel with Bell */}
            <path
              d="M205 136 C214 138 218 144 218 152"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="218" cy="153" r="2" fill="#F59E0B" />
            <path d="M216 155 L220 155 L219 160 L217 160 Z" fill="#F59E0B" />
          </g>

          {/* Tied Parchment Diploma Scroll with Crimson Wax Seal */}
          <g>
            <rect
              x="160"
              y="226"
              width="60"
              height="12"
              rx="3"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-400"
              strokeWidth="1.25"
            />
            <line x1="188" y1="226" x2="188" y2="238" stroke="#EF4444" strokeWidth="2" />
            <circle cx="188" cy="232" r="3" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.5" />
          </g>

          {/* 4. INTELLECTUAL CONSTELLATIONS & AMBIENT SPARKS */}
          {/* Top Idea Spark 1 */}
          <g className="anim-spark-1">
            <path
              d="M105 34 L107 41 L114 43 L107 45 L105 52 L103 45 L96 43 L103 41 Z"
              fill="#2563EB"
            />
            <circle cx="105" cy="43" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Right Idea Spark 2 */}
          <g className="anim-spark-2">
            <path
              d="M242 98 L243.5 103 L248 104.5 L243.5 106 L242 111 L240.5 106 L236 104.5 L240.5 103 Z"
              fill="#F59E0B"
            />
          </g>

          {/* Subtle Knowledge Radiance Rays above scholar */}
          <line x1="84" y1="58" x2="88" y2="64" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" opacity="0.6" />
          <line x1="100" y1="52" x2="100" y2="58" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" opacity="0.8" />
          <line x1="116" y1="58" x2="112" y2="64" stroke="#3B82F6" strokeWidth="1.25" strokeLinecap="round" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Editorial Career Milestone & Growth Illustration (Right Side)
 * Handcrafted architectural pedestals with 2.5D isometric depth, ascending career trajectory,
 * precision executive leather briefcase with brass fittings, constellation networking links,
 * and an 8-point summit compass star. Clean, human, prestigious editorial artwork.
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
          {/* Career aura gradient */}
          <linearGradient id="careerAura" x1="80" y1="40" x2="220" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.10" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.03" />
          </linearGradient>

          <linearGradient id="pathGradient" x1="45" y1="210" x2="215" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          <linearGradient id="goldPillarGrad" x1="180" y1="75" x2="230" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="midPillarGrad" x1="125" y1="115" x2="175" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.03" />
          </linearGradient>

          <style>{`
            @keyframes softCareerFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(5px); }
            }
            @keyframes beaconPulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.2); opacity: 1; }
            }
            @keyframes radarWave {
              0% { r: 6px; opacity: 0.8; }
              100% { r: 20px; opacity: 0; }
            }
            .anim-career-float {
              animation: softCareerFloat 5s ease-in-out infinite 0.3s;
              transform-origin: 140px 140px;
            }
            .anim-beacon {
              animation: beaconPulse 2.6s ease-in-out infinite;
              transform-origin: 208px 60px;
            }
            .anim-radar {
              animation: radarWave 2.6s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
            }
          `}</style>
        </defs>

        <g className="anim-career-float">
          {/* Background Soft Aura & Orbital Guide */}
          <circle cx="140" cy="142" r="105" fill="url(#careerAura)" />
          <circle
            cx="140"
            cy="142"
            r="105"
            stroke="#2563EB"
            strokeOpacity="0.12"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Floor / Ground Calibration Baseline */}
          <line
            x1="25"
            y1="240"
            x2="255"
            y2="240"
            stroke="#1E293B"
            className="dark:stroke-slate-600"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="25" cy="240" r="2" fill="#1E293B" className="dark:fill-slate-600" />
          <circle cx="255" cy="240" r="2" fill="#1E293B" className="dark:fill-slate-600" />

          {/* 1. TIERED ISOMETRIC ARCHITECTURAL MILESTONE PODIUMS */}
          {/* Pillar 1: Foundation (Internship / Exploration) */}
          <g>
            {/* Top Bevel */}
            <path
              d="M72 152 L82 144 L118 144 L108 152 Z"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-400"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Side Bevel */}
            <path
              d="M108 152 L118 144 L118 232 L108 240 Z"
              fill="#E2E8F0"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-400"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Main Face */}
            <rect
              x="72"
              y="152"
              width="36"
              height="88"
              rx="2"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-400"
              strokeWidth="1.5"
            />
            {/* Calibration tick line */}
            <line x1="78" y1="170" x2="102" y2="170" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* Pillar 2: Mentorship & Applied Acceleration */}
          <g>
            {/* Top Bevel */}
            <path
              d="M125 116 L135 108 L175 108 L165 116 Z"
              fill="#DBEAFE"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Side Bevel */}
            <path
              d="M165 116 L175 108 L175 232 L165 240 Z"
              fill="#BFDBFE"
              stroke="#2563EB"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Main Face */}
            <rect
              x="125"
              y="116"
              width="40"
              height="124"
              rx="2"
              fill="url(#midPillarGrad)"
              stroke="#2563EB"
              strokeWidth="1.5"
            />
            {/* Technical grid lines */}
            <line x1="131" y1="135" x2="159" y2="135" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
            <line x1="131" y1="155" x2="159" y2="155" stroke="#2563EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
          </g>

          {/* Pillar 3: Summit Placement & Leadership */}
          <g>
            {/* Top Bevel */}
            <path
              d="M182 76 L192 68 L236 68 L226 76 Z"
              fill="#FEF3C7"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Side Bevel */}
            <path
              d="M226 76 L236 68 L236 232 L226 240 Z"
              fill="#FDE68A"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Main Face */}
            <rect
              x="182"
              y="76"
              width="44"
              height="164"
              rx="2"
              fill="url(#goldPillarGrad)"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="1.5"
            />
            {/* Gold summit emblem stripe */}
            <line x1="190" y1="95" x2="218" y2="95" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="190" y1="102" x2="206" y2="102" stroke="#F59E0B" strokeWidth="1.25" strokeLinecap="round" />
          </g>

          {/* 2. DYNAMIC ASCENDING CAREER TRAJECTORY */}
          <path
            d="M48 206 C80 188 126 142 208 60"
            stroke="url(#pathGradient)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Milestone Waypoint Circles */}
          {/* Waypoint 1 (Pillar 1) */}
          <circle cx="90" cy="148" r="4.5" fill="#FAF9F5" stroke="#2563EB" strokeWidth="2" />
          <circle cx="90" cy="148" r="1.5" fill="#2563EB" />

          {/* Waypoint 2 (Pillar 2) */}
          <circle cx="145" cy="112" r="5" fill="#FAF9F5" stroke="#2563EB" strokeWidth="2" />
          <circle cx="145" cy="112" r="2" fill="#2563EB" />

          {/* Waypoint 3 (Pillar 3 Summit) */}
          <circle cx="208" cy="60" r="5.5" fill="#FAF9F5" stroke="#10B981" strokeWidth="2" />
          <circle cx="208" cy="60" r="2.5" fill="#10B981" />

          {/* Radar ripple at summit */}
          <circle cx="208" cy="60" r="12" stroke="#10B981" strokeWidth="1" fill="none" className="anim-radar" />

          {/* 3. PINNACLE COMPASS STAR (The Summit Beacon) */}
          <g className="anim-beacon">
            {/* 8-point geometric faceted star */}
            <path
              d="M208 42 L211 54 L223 57 L211 60 L208 72 L205 60 L193 57 L205 54 Z"
              fill="#2563EB"
              stroke="#1D4ED8"
              strokeWidth="0.5"
            />
            {/* Diagonal facet points */}
            <path
              d="M208 47 L216 51 L218 57 L214 63 L208 65 L202 63 L198 57 L200 51 Z"
              fill="#60A5FA"
              opacity="0.6"
            />
            {/* Center diamond spark */}
            <circle cx="208" cy="57" r="2.5" fill="#FFFFFF" />
          </g>

          {/* 4. EXECUTIVE LEATHER PORTFOLIO / BRIEFCASE */}
          <g>
            {/* Shadow under briefcase */}
            <ellipse cx="50" cy="239" rx="22" ry="2" fill="#1E293B" opacity="0.15" />

            {/* Briefcase Structured Body */}
            <rect
              x="30"
              y="188"
              width="44"
              height="32"
              rx="3"
              fill="#FAF9F5"
              stroke="#1E293B"
              className="dark:fill-slate-900 dark:stroke-slate-300"
              strokeWidth="1.75"
            />

            {/* Briefcase Flap Overhang */}
            <path
              d="M30 198 L48 206 C50 207 54 207 56 206 L74 198 V188 H30 Z"
              fill="#F1F5F9"
              stroke="#1E293B"
              className="dark:fill-slate-800 dark:stroke-slate-300"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Dual Straps with Brass Buckles */}
            <line x1="38" y1="188" x2="38" y2="220" stroke="#1E293B" className="dark:stroke-slate-400" strokeWidth="1.25" />
            <line x1="66" y1="188" x2="66" y2="220" stroke="#1E293B" className="dark:stroke-slate-400" strokeWidth="1.25" />
            {/* Brass Pin Buckles */}
            <rect x="36.5" y="204" width="3" height="4" rx="0.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
            <rect x="64.5" y="204" width="3" height="4" rx="0.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />

            {/* Brass Center Lock with Keyhole */}
            <rect x="50" y="204" width="4" height="5" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
            <circle cx="52" cy="206" r="0.75" fill="#1E293B" />

            {/* Arch Handle with Metal Mounts */}
            <path
              d="M46 188 V182 C46 180 48 179 50 179 H54 C56 179 58 180 58 182 V188"
              stroke="#1E293B"
              className="dark:stroke-slate-300"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            {/* Handle hinge hardware */}
            <circle cx="46" cy="188" r="1.5" fill="#F59E0B" />
            <circle cx="58" cy="188" r="1.5" fill="#F59E0B" />
          </g>

          {/* 5. PROFESSIONAL CONSTELLATION NODES & CONNECTORS */}
          <g opacity="0.85">
            <circle cx="85" cy="55" r="3" fill="#2563EB" />
            <circle cx="128" cy="38" r="3.5" fill="#3B82F6" />
            <circle cx="242" cy="95" r="3" fill="#10B981" />

            {/* Delicate connector lines */}
            <line x1="85" y1="55" x2="128" y2="38" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="128" y1="38" x2="175" y2="52" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="175" y1="52" x2="208" y2="42" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="208" y1="72" x2="242" y2="95" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* Micro Diamond Accent Sparks */}
          <polygon points="128,26 130,30 128,34 126,30" fill="#F59E0B" />
          <polygon points="70,120 72,123 70,126 68,123" fill="#3B82F6" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
