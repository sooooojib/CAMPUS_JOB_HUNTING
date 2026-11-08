"use client";

import * as React from "react";

/**
 * Animated Academic & Student Identity Vector Illustration (Left Side)
 * Modern duotone isometric graduation cap, pulsing merit ripples, floating diploma,
 * and verified student credential badge with smooth CSS floating motion.
 */
export function CampusCareerIllustrationLeft({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          {/* Blue Gradients matching UniCareer Theme */}
          <linearGradient id="leftGradNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="leftGradCyan" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          <linearGradient id="leftGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="leftAura" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          <filter id="leftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Embedded Smooth Animation Keyframes */}
          <style>{`
            @keyframes capFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(-1.5deg); }
            }
            @keyframes badgeFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes rippleWave {
              0% { r: 18px; opacity: 0.7; }
              100% { r: 65px; opacity: 0; }
            }
            @keyframes tasselSway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(4deg); }
            }
            @keyframes beaconPulse {
              0%, 100% { opacity: 0.4; transform: scale(0.95); }
              50% { opacity: 1; transform: scale(1.1); }
            }
            .animate-cap {
              animation: capFloat 4.8s ease-in-out infinite;
              transform-origin: 140px 140px;
            }
            .animate-badge-left {
              animation: badgeFloat 4.2s ease-in-out infinite 0.6s;
            }
            .animate-ripple-1 {
              animation: rippleWave 3.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }
            .animate-ripple-2 {
              animation: rippleWave 3.2s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.6s;
            }
            .animate-tassel {
              animation: tasselSway 2.4s ease-in-out infinite;
              transform-origin: 140px 115px;
            }
            .animate-beacon {
              animation: beaconPulse 2s ease-in-out infinite;
              transform-origin: center;
            }
          `}</style>
        </defs>

        {/* Ambient Soft Blue Radial Aura */}
        <circle cx="140" cy="140" r="110" fill="url(#leftAura)" />

        {/* Pulsing Concentric Ripple Rings */}
        <circle cx="140" cy="130" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5" className="animate-ripple-1" />
        <circle cx="140" cy="130" r="20" fill="none" stroke="#60A5FA" strokeWidth="1.2" className="animate-ripple-2" />

        {/* Floating Academic Cap & Books Group */}
        <g className="animate-cap">
          {/* Base Book 1 */}
          <rect x="90" y="172" width="100" height="15" rx="3" fill="#FAF9F5" stroke="#2563EB" strokeWidth="2" />
          <line x1="96" y1="179" x2="184" y2="179" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

          {/* Base Book 2 */}
          <rect x="100" y="157" width="80" height="15" rx="3" fill="url(#leftGradNavy)" stroke="#1D4ED8" strokeWidth="2" />
          <line x1="106" y1="164" x2="174" y2="164" stroke="#FAF9F5" strokeWidth="1.5" strokeOpacity="0.8" strokeLinecap="round" />

          {/* Graduation Cap Base Skullcap */}
          <path
            d="M115 125C115 137 126 146 140 146C154 146 165 137 165 125V120H115V125Z"
            fill="url(#leftGradNavy)"
            stroke="#1E3A8A"
            strokeWidth="1.5"
          />

          {/* 3D Mortarboard Rhombus Top */}
          <path
            d="M140 92L192 114L140 136L88 114L140 92Z"
            fill="url(#leftGradNavy)"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Inner Highlight for Depth */}
          <path
            d="M140 96L184 114L140 132L96 114L140 96Z"
            fill="url(#leftGradCyan)"
            fillOpacity="0.25"
          />

          {/* Cap Center Button */}
          <ellipse cx="140" cy="114" rx="4" ry="2.5" fill="url(#leftGradGold)" />

          {/* Gold Tassel with Idle Sway */}
          <g className="animate-tassel">
            <path
              d="M140 114C154 118 165 128 168 142"
              stroke="url(#leftGradGold)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Tassel Fringe */}
            <rect x="164" y="142" width="8" height="13" rx="2" fill="url(#leftGradGold)" />
          </g>
        </g>

        {/* Floating Verified Student Credential Badge */}
        <g className="animate-badge-left">
          {/* Glassmorphic Badge Container */}
          <rect
            x="24"
            y="70"
            width="132"
            height="38"
            rx="19"
            fill="#FFFFFF"
            className="dark:fill-slate-900"
            stroke="#3B82F6"
            strokeWidth="1.5"
            filter="url(#leftGlow)"
          />
          {/* University Blue Shield Icon */}
          <circle cx="43" cy="89" r="10" fill="#2563EB" />
          <path
            d="M40 89L42.5 91.5L46.5 86.5"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Badge Label */}
          <text
            x="60"
            y="87"
            fontFamily="system-ui, sans-serif"
            fontSize="10"
            fontWeight="700"
            fill="#1E293B"
            className="dark:fill-white"
          >
            Verified Student
          </text>
          <text
            x="60"
            y="98"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="500"
            fill="#64748B"
            className="dark:fill-slate-400"
          >
            Campus Network
          </text>

          {/* Live Active Green Pulse Dot */}
          <circle cx="144" cy="89" r="3.5" fill="#10B981" />
          <circle cx="144" cy="89" r="6" fill="none" stroke="#10B981" strokeWidth="1" className="animate-beacon" />
        </g>

        {/* Constellation Network Nodes */}
        <circle cx="50" cy="180" r="3.5" fill="#3B82F6" />
        <circle cx="75" cy="210" r="4.5" fill="#2563EB" />
        <line x1="50" y1="180" x2="75" y2="210" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="75" y1="210" x2="110" y2="225" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="110" cy="225" r="3" fill="#60A5FA" />
      </svg>
    </div>
  );
}

/**
 * Animated Career Growth & Alumni Referral Vector Illustration (Right Side)
 * Modern duotone gradient growth columns, flowing animated trajectory curve,
 * glowing peak beacon, and floating alumni referral badge.
 */
export function CampusCareerIllustrationRight({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-hidden="true"
      >
        <defs>
          {/* Blue Gradients */}
          <linearGradient id="rightGradBlue1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          <linearGradient id="rightGradBlue2" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id="rightGradBlue3" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>

          <linearGradient id="rightAura" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>

          <filter id="rightGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Embedded Animation Keyframes */}
          <style>{`
            @keyframes rightFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(7px); }
            }
            @keyframes flowTrajectory {
              0% { stroke-dashoffset: 48; }
              100% { stroke-dashoffset: 0; }
            }
            @keyframes pulseSummit {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.35); opacity: 1; }
            }
            @keyframes columnBreath {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(1.02); }
            }
            .animate-badge-right {
              animation: rightFloat 4.6s ease-in-out infinite 0.3s;
            }
            .animate-trajectory {
              stroke-dasharray: 8 4;
              animation: flowTrajectory 1.8s linear infinite;
            }
            .animate-summit {
              animation: pulseSummit 2.2s ease-in-out infinite;
              transform-origin: 215px 70px;
            }
            .animate-column {
              transform-origin: bottom;
              animation: columnBreath 4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Ambient Radial Aura */}
        <circle cx="180" cy="140" r="110" fill="url(#rightAura)" />

        {/* Modern Rounded Growth Pedestals (Sleek Duotone Bars) */}
        <g className="animate-column">
          {/* Pillar 1: Enrolled / Early Internship */}
          <rect
            x="95"
            y="155"
            width="34"
            height="55"
            rx="8"
            fill="url(#rightGradBlue1)"
            stroke="#60A5FA"
            strokeWidth="1.5"
          />
          {/* Pillar 1 Top Cap Highlight */}
          <rect x="99" y="157" width="26" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.6" />

          {/* Pillar 2: Verified Mentorship & Projects */}
          <rect
            x="145"
            y="115"
            width="34"
            height="95"
            rx="8"
            fill="url(#rightGradBlue2)"
            stroke="#3B82F6"
            strokeWidth="1.5"
          />
          {/* Pillar 2 Top Cap Highlight */}
          <rect x="149" y="117" width="26" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" />

          {/* Pillar 3: Alumni Placement / High-Trust Career Hire */}
          <rect
            x="195"
            y="75"
            width="36"
            height="135"
            rx="8"
            fill="url(#rightGradBlue3)"
            stroke="#1D4ED8"
            strokeWidth="1.5"
          />
          {/* Pillar 3 Top Cap Highlight */}
          <rect x="199" y="77" width="28" height="3.5" rx="1.5" fill="#60A5FA" />
        </g>

        {/* Animated Ascending Career Trajectory Line */}
        <path
          d="M60 185C95 165 140 120 215 70"
          stroke="#2563EB"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-trajectory"
        />

        {/* Summit Beacon with Animated Radiant Pulse */}
        <g className="animate-summit">
          <circle cx="215" cy="70" r="9" fill="#3B82F6" fillOpacity="0.3" />
          <circle cx="215" cy="70" r="5" fill="#2563EB" />
          <circle cx="215" cy="70" r="2" fill="#FFFFFF" />
        </g>

        {/* Floating Alumni Referral Card Badge */}
        <g className="animate-badge-right">
          {/* Glassmorphic Badge Container */}
          <rect
            x="150"
            y="30"
            width="142"
            height="38"
            rx="19"
            fill="#FFFFFF"
            className="dark:fill-slate-900"
            stroke="#2563EB"
            strokeWidth="1.5"
            filter="url(#rightGlow)"
          />

          {/* Royal Blue Briefcase Icon Circle */}
          <circle cx="169" cy="49" r="10" fill="#2563EB" />
          <path
            d="M165 47H173M164 48H174V53H164V48ZM167 47V45C167 44.5 167.5 44 168 44H170C170.5 44 171 44.5 171 45V47"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Badge Text */}
          <text
            x="186"
            y="47"
            fontFamily="system-ui, sans-serif"
            fontSize="10"
            fontWeight="700"
            fill="#1E293B"
            className="dark:fill-white"
          >
            Alumni Referral
          </text>
          <text
            x="186"
            y="58"
            fontFamily="system-ui, sans-serif"
            fontSize="8"
            fontWeight="600"
            fill="#2563EB"
          >
            98% High Match
          </text>
        </g>

        {/* Constellation Network Nodes on the Right */}
        <circle cx="255" cy="140" r="4" fill="#3B82F6" />
        <circle cx="280" cy="180" r="3.5" fill="#2563EB" />
        <line x1="215" y1="70" x2="255" y2="140" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="255" y1="140" x2="280" y2="180" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}
