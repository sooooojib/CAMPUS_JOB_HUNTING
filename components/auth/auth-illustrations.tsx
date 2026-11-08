"use client";

import * as React from "react";

/**
 * Editorial Campus Scholar Illustration (Left Side)
 * Handcrafted minimalist line art: A student with a laptop, stack of university books,
 * graduation cap, and subtle idea rays. Pure artwork with zero SVG text to ensure
 * crisp, flawless rendering across all devices and resolutions.
 */
export function CampusCareerIllustrationLeft({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        <defs>
          <style>{`
            @keyframes softFloatLeft {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes sparkTwinkle {
              0%, 100% { opacity: 0.35; transform: scale(0.9); }
              50% { opacity: 1; transform: scale(1.1); }
            }
            .animate-editorial-left {
              animation: softFloatLeft 4.5s ease-in-out infinite;
              transform-origin: center;
            }
            .animate-spark {
              animation: sparkTwinkle 2.5s ease-in-out infinite;
              transform-origin: 105px 42px;
            }
          `}</style>
        </defs>

        <g className="animate-editorial-left">
          {/* Background Soft Aura Circle */}
          <circle cx="120" cy="135" r="95" fill="#2563EB" fillOpacity="0.06" />

          {/* Pedestal Seating Block */}
          <rect
            x="70"
            y="135"
            width="65"
            height="85"
            rx="4"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-400"
            strokeWidth="2"
          />
          {/* Subtle interior block line */}
          <line
            x1="70"
            y1="150"
            x2="135"
            y2="150"
            stroke="#1E293B"
            className="dark:stroke-slate-500"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Student Character: Trousers & Legs */}
          <path
            d="M86 122C86 132 80 148 68 162C64 167 68 174 74 174C83 174 93 158 98 147L117 184C119 188 124 190 128 189C133 188 135 183 133 178L112 132"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-200"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Minimalist Shoes */}
          <path
            d="M70 172C70 172 63 176 60 181C58 185 62 188 66 188C72 188 78 182 78 178L74 174"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-300 dark:stroke-slate-200"
            strokeWidth="1.5"
          />
          <path
            d="M129 187C129 187 127 192 125 196C123 199 127 202 131 202C136 202 142 195 141 190L135 186"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-300 dark:stroke-slate-200"
            strokeWidth="1.5"
          />

          {/* Torso & Navy Patterned Shirt */}
          <path
            d="M87 96C87 96 76 106 76 122C76 130 84 134 94 134C102 134 111 128 111 119C111 110 105 98 99 94"
            fill="#1E293B"
            stroke="#1E293B"
            className="dark:fill-slate-800 dark:stroke-slate-200"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Subtle University Blue Accent on Collar */}
          <circle cx="86" cy="110" r="1.5" fill="#3B82F6" />
          <circle cx="94" cy="116" r="1.5" fill="#3B82F6" />
          <circle cx="102" cy="110" r="1.5" fill="#3B82F6" />

          {/* Arms holding laptop */}
          <path
            d="M97 106L110 118L126 114"
            stroke="#FAF9F5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M97 106L110 118L126 114"
            stroke="#1E293B"
            className="dark:stroke-slate-200"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Royal Blue Laptop */}
          <path
            d="M114 118L130 122"
            stroke="#2563EB"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M130 122L137 102"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Head & Face profile */}
          <path
            d="M97 94L99 85"
            stroke="#1E293B"
            className="dark:stroke-slate-200"
            strokeWidth="2"
          />
          <path
            d="M97 85C97 85 103 85 105 83C107 81 108 75 103 71C97 67 91 71 91 77C91 83 97 85 97 85Z"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-200"
            strokeWidth="2"
          />

          {/* Hair bun */}
          <path
            d="M92 74C88 73 84 77 82 82C80 87 82 91 85 93C88 95 92 93 93 90C94 85 94 79 92 74Z"
            fill="#1E293B"
            className="dark:fill-slate-300"
          />
          <circle cx="80" cy="80" r="4.5" fill="#1E293B" className="dark:fill-slate-300" />

          {/* Idea Sparks / Rays */}
          <g className="animate-spark">
            <line x1="102" y1="52" x2="98" y2="44" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="112" y1="48" x2="112" y2="38" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
            <line x1="122" y1="52" x2="128" y2="44" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Stack of University Books beside student */}
          <rect
            x="148"
            y="170"
            width="55"
            height="14"
            rx="2"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-200"
            strokeWidth="1.5"
          />
          <rect
            x="152"
            y="156"
            width="48"
            height="14"
            rx="2"
            fill="#2563EB"
            fillOpacity="0.15"
            stroke="#2563EB"
            strokeWidth="1.5"
          />
          <rect
            x="155"
            y="142"
            width="42"
            height="14"
            rx="2"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-200"
            strokeWidth="1.5"
          />

          {/* Graduation Cap resting on top book */}
          <path
            d="M176 122L202 131L176 140L150 131L176 122Z"
            fill="#2563EB"
            stroke="#1E293B"
            className="dark:stroke-slate-200"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M164 136C164 142 170 146 176 146C182 146 188 142 188 136"
            stroke="#1E293B"
            className="dark:stroke-slate-200"
            strokeWidth="1.5"
          />
          {/* Gold Tassel */}
          <path
            d="M176 131C180 133 184 139 184 144"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="184" cy="145" r="1.5" fill="#F59E0B" />

          {/* Clean Stepping Base Line */}
          <line
            x1="30"
            y1="220"
            x2="230"
            y2="220"
            stroke="#1E293B"
            className="dark:stroke-slate-500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * Editorial Career Milestone & Growth Illustration (Right Side)
 * Handcrafted minimalist architectural pedestals, ascending career pathway with
 * compass star, portfolio briefcase, and constellation networking nodes.
 * Completely free of SVG text to ensure timeless, non-AI editorial elegance.
 */
export function CampusCareerIllustrationRight({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
        aria-hidden="true"
      >
        <defs>
          <style>{`
            @keyframes softFloatRight {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(6px); }
            }
            @keyframes starGlow {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.25); opacity: 1; }
            }
            .animate-editorial-right {
              animation: softFloatRight 4.8s ease-in-out infinite 0.4s;
              transform-origin: center;
            }
            .animate-compass-star {
              animation: starGlow 2.8s ease-in-out infinite;
              transform-origin: 165px 65px;
            }
          `}</style>
        </defs>

        <g className="animate-editorial-right">
          {/* Background Soft Aura Circle */}
          <circle cx="140" cy="135" r="95" fill="#2563EB" fillOpacity="0.06" />

          {/* Minimalist Milestone Architectural Blocks */}
          {/* Shorter Pedestal (Internship / Foundation) */}
          <rect
            x="55"
            y="145"
            width="42"
            height="75"
            rx="4"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-300"
            strokeWidth="2"
          />

          {/* Mid Pedestal (Mentorship & Applied Projects) */}
          <rect
            x="105"
            y="110"
            width="45"
            height="110"
            rx="4"
            fill="#2563EB"
            fillOpacity="0.12"
            stroke="#2563EB"
            strokeWidth="2"
          />
          {/* Subtle internal grid accent */}
          <line
            x1="112"
            y1="125"
            x2="143"
            y2="125"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Tallest Pedestal (Alumni Career Milestone) */}
          <rect
            x="158"
            y="75"
            width="46"
            height="145"
            rx="4"
            fill="#FAD980"
            stroke="#1E293B"
            className="dark:stroke-slate-300"
            strokeWidth="2"
          />

          {/* Ascending Career Pathway Line */}
          <path
            d="M35 185C65 170 100 130 162 70"
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Summit Career Star / Compass Node */}
          <g className="animate-compass-star">
            {/* Compass 4-point star */}
            <path
              d="M165 52L168 62L178 65L168 68L165 78L162 68L152 65L162 62L165 52Z"
              fill="#2563EB"
            />
            <circle cx="165" cy="65" r="3" fill="#FFFFFF" />
          </g>

          {/* Minimalist Professional Briefcase */}
          <rect
            x="32"
            y="180"
            width="40"
            height="28"
            rx="3"
            fill="#FAF9F5"
            stroke="#1E293B"
            className="dark:fill-slate-900 dark:stroke-slate-200"
            strokeWidth="1.5"
          />
          {/* Briefcase Handle */}
          <path
            d="M46 180V175C46 173.5 47.5 172 49 172H55C56.5 172 58 173.5 58 175V180"
            stroke="#1E293B"
            className="dark:stroke-slate-200"
            strokeWidth="1.5"
          />
          {/* Briefcase Center Latch */}
          <rect x="50" y="190" width="4" height="4" rx="1" fill="#2563EB" />
          <line x1="32" y1="192" x2="72" y2="192" stroke="#1E293B" className="dark:stroke-slate-400" strokeWidth="1" strokeDasharray="2 2" />

          {/* Constellation Networking Nodes */}
          <circle cx="95" cy="55" r="3" fill="#2563EB" />
          <circle cx="125" cy="40" r="3.5" fill="#3B82F6" />
          <circle cx="215" cy="85" r="3" fill="#2563EB" />
          <line x1="95" y1="55" x2="125" y2="40" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="125" y1="40" x2="165" y2="65" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="165" y1="65" x2="215" y2="85" stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />

          {/* Clean Stepping Base Line */}
          <line
            x1="25"
            y1="220"
            x2="225"
            y2="220"
            stroke="#1E293B"
            className="dark:stroke-slate-500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
