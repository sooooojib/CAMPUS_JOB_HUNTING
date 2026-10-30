"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  Briefcase,
  Building2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import gsap from "gsap";

interface NodeData {
  id: string;
  role: string;
  category: string;
  name: string;
  status: string;
  detail: string;
  accent: {
    badge: string;
    border: string;
    glow: string;
    dot: string;
    stroke: string;
  };
  pos: {
    cx: number;
    cy: number;
  };
  // Curved SVG spline from node to the university center
  pathD: string;
}

const NODES: NodeData[] = [
  {
    id: "student",
    role: "Verified Student",
    category: "Talent",
    name: "Tanvir Ahmed",
    status: "CSE '25 • CGPA 3.84",
    detail: "Direct referral requested for Software Engineer Internship",
    accent: {
      badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      border: "border-sky-500/40 shadow-sky-500/10",
      glow: "rgba(14, 165, 233, 0.4)",
      dot: "bg-sky-500",
      stroke: "#0ea5e9",
    },
    pos: { cx: 160, cy: 110 },
    pathD: "M 160 110 C 260 120, 320 220, 380 250",
  },
  {
    id: "alumni",
    role: "Distinguished Alumni",
    category: "Mentorship",
    name: "Nadia Islam",
    status: "Alumni '18 • Lead Eng",
    detail: "Verified internal referral granted for Partner Tech Firm",
    accent: {
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      border: "border-blue-500/40 shadow-blue-500/10",
      glow: "rgba(59, 130, 246, 0.4)",
      dot: "bg-blue-500",
      stroke: "#3b82f6",
    },
    pos: { cx: 640, cy: 110 },
    pathD: "M 640 110 C 540 120, 480 220, 420 250",
  },
  {
    id: "employer",
    role: "Verified Employer",
    category: "Placement",
    name: "Apex Tech Labs",
    status: "Official Campus Partner",
    detail: "Direct on-campus hiring drive & interview shortlist active",
    accent: {
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      border: "border-emerald-500/40 shadow-emerald-500/10",
      glow: "rgba(16, 185, 129, 0.4)",
      dot: "bg-emerald-500",
      stroke: "#10b981",
    },
    pos: { cx: 160, cy: 470 },
    pathD: "M 160 470 C 250 440, 330 360, 380 320",
  },
  {
    id: "faculty",
    role: "Faculty Mentor",
    category: "Endorsement",
    name: "Dr. A. Rahman",
    status: "Dept. Chair • Professor",
    detail: "Dean-level academic endorsement & research recommendation",
    accent: {
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      border: "border-purple-500/40 shadow-purple-500/10",
      glow: "rgba(168, 85, 247, 0.4)",
      dot: "bg-purple-500",
      stroke: "#a855f7",
    },
    pos: { cx: 640, cy: 470 },
    pathD: "M 640 470 C 550 440, 470 360, 420 320",
  },
];

export function CampusNetworkGraph() {
  const [activeNode, setActiveNode] = useState<string | null>("student");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle floating animation for nodes
      gsap.to(".network-node-float", {
        y: "-=6",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.6,
      });

      // Subtle pulse on the central university crest
      gsap.to(".university-crest-pulse", {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center center",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const selectedNode = NODES.find((n) => n.id === activeNode) || NODES[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto rounded-3xl border border-border/80 bg-gradient-to-b from-card/80 via-card/50 to-background/90 p-4 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Background Institutional Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top Header & Status */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border/60 z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-1.5">
              <span>Jagannath University Career Network</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Institutional Core
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time student referrals, faculty endorsements, and employer recruitment
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs font-mono text-muted-foreground">
          <ShieldCheck className="size-3.5 text-blue-500" />
          <span>Registrar Verified Ecosystem</span>
        </div>
      </div>

      {/* Interactive Network Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] my-4 flex items-center justify-center">
        {/* SVG Splines & Concentric Circles */}
        <svg
          viewBox="0 0 800 580"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Gradients for connecting splines */}
            <linearGradient id="splineStudent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="splineAlumni" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="splineEmployer" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="splineFaculty" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>

            {/* Glowing filter for traveling photons */}
            <filter id="photonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Orbital Radar Rings */}
          <circle
            cx="400"
            cy="285"
            r="190"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border/60"
            strokeDasharray="4 6"
          />
          <circle
            cx="400"
            cy="285"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/20"
          />

          {/* Base Connection Paths */}
          {NODES.map((node) => {
            const isHovered = activeNode === node.id;
            return (
              <g key={`path-${node.id}`}>
                {/* Background dashed line */}
                <path
                  d={node.pathD}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  className={
                    isHovered
                      ? "text-primary transition-all duration-300"
                      : "text-border/70 transition-all duration-300"
                  }
                  strokeDasharray={isHovered ? "none" : "3 5"}
                />

                {/* Colored highlight line when active */}
                {isHovered && (
                  <path
                    d={node.pathD}
                    fill="none"
                    stroke={node.accent.stroke}
                    strokeWidth="2.5"
                    strokeOpacity="0.9"
                    className="transition-all duration-300"
                  />
                )}

                {/* Traveling Photon Light Packet */}
                <circle r={isHovered ? "5" : "3.5"} fill={node.accent.stroke} filter="url(#photonGlow)">
                  <animateMotion
                    path={node.pathD}
                    dur={isHovered ? "2.4s" : "4.2s"}
                    repeatCount="indefinite"
                    rotate="auto"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* ========================================================= */}
        {/* THE CENTERPIECE: Jagannath University Administrative Core  */}
        {/* ========================================================= */}
        <div className="relative z-10 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-card/90 border border-primary/30 shadow-xl backdrop-blur-md max-w-[210px] sm:max-w-[250px] text-center select-none">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-primary/20 to-amber-500/20 blur-md pointer-events-none" />

          {/* Architectural Heritage Vector SVG of Jagannath University Building */}
          <div className="relative w-full aspect-[16/10] flex items-center justify-center mb-2">
            <svg
              viewBox="0 0 240 150"
              className="w-full h-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky / Ambient Backing */}
              <rect x="10" y="20" width="220" height="120" rx="4" fill="currentColor" className="text-muted/10" />

              {/* Pediment / Triangular Neoclassical Roof */}
              <polygon
                points="120,8 60,42 180,42"
                fill="currentColor"
                className="text-primary/20"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polygon
                points="120,13 68,40 172,40"
                fill="none"
                stroke="currentColor"
                className="text-primary/40"
                strokeWidth="1"
              />

              {/* JNU Crest Medallion in Pediment */}
              <circle
                cx="120"
                cy="27"
                r="7"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1.5"
                className="university-crest-pulse"
              />
              <circle cx="120" cy="27" r="4" fill="#0284c7" />

              {/* Roof Balustrade / Cornice */}
              <rect x="25" y="42" width="190" height="6" fill="currentColor" className="text-primary/30" stroke="currentColor" strokeWidth="1" />
              {/* Balusters */}
              {[35, 45, 55, 65, 175, 185, 195, 205].map((bx) => (
                <rect key={`bal-${bx}`} x={bx} y="38" width="2" height="4" fill="currentColor" className="text-muted-foreground/40" />
              ))}

              {/* The Iconic Orange Jagannath University Banner */}
              <rect
                x="64"
                y="52"
                width="112"
                height="15"
                rx="2"
                fill="#ea580c"
                stroke="#c2410c"
                strokeWidth="1"
              />
              <text
                x="120"
                y="63"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="bold"
                fill="#ffffff"
                fontFamily="sans-serif"
                letterSpacing="0.2"
              >
                জগন্নাথ বিশ্ববিদ্যালয়
              </text>

              {/* Main Building Body / Facade */}
              <rect
                x="25"
                y="48"
                width="190"
                height="82"
                fill="currentColor"
                className="text-card"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              {/* 4 Grand Classical Columns (Neoclassical Portico) */}
              {/* Column 1 */}
              <rect x="70" y="68" width="8" height="58" fill="currentColor" className="text-primary/15" stroke="currentColor" strokeWidth="1" />
              <rect x="68" y="68" width="12" height="4" rx="1" fill="#d97706" />
              <rect x="68" y="123" width="12" height="4" rx="1" fill="currentColor" className="text-primary/30" />

              {/* Column 2 */}
              <rect x="96" y="68" width="8" height="58" fill="currentColor" className="text-primary/15" stroke="currentColor" strokeWidth="1" />
              <rect x="94" y="68" width="12" height="4" rx="1" fill="#d97706" />
              <rect x="94" y="123" width="12" height="4" rx="1" fill="currentColor" className="text-primary/30" />

              {/* Column 3 */}
              <rect x="136" y="68" width="8" height="58" fill="currentColor" className="text-primary/15" stroke="currentColor" strokeWidth="1" />
              <rect x="134" y="68" width="12" height="4" rx="1" fill="#d97706" />
              <rect x="134" y="123" width="12" height="4" rx="1" fill="currentColor" className="text-primary/30" />

              {/* Column 4 */}
              <rect x="162" y="68" width="8" height="58" fill="currentColor" className="text-primary/15" stroke="currentColor" strokeWidth="1" />
              <rect x="160" y="68" width="12" height="4" rx="1" fill="#d97706" />
              <rect x="160" y="123" width="12" height="4" rx="1" fill="currentColor" className="text-primary/30" />

              {/* Central Grand Archway (Warm Interior Glow) */}
              <path
                d="M 110 126 L 110 96 Q 120 86 130 96 L 130 126 Z"
                fill="#fbbf24"
                fillOpacity="0.25"
                stroke="#d97706"
                strokeWidth="1.2"
              />
              <circle cx="120" cy="98" r="2" fill="#f59e0b" />

              {/* Left Wing Arches */}
              <path d="M 33 126 L 33 100 Q 40 92 47 100 L 47 126 Z" fill="currentColor" className="text-muted/30" stroke="currentColor" strokeWidth="1" />
              <path d="M 51 126 L 51 100 Q 58 92 65 100 L 65 126 Z" fill="currentColor" className="text-muted/30" stroke="currentColor" strokeWidth="1" />

              {/* Right Wing Arches */}
              <path d="M 175 126 L 175 100 Q 182 92 189 100 L 189 126 Z" fill="currentColor" className="text-muted/30" stroke="currentColor" strokeWidth="1" />
              <path d="M 193 126 L 193 100 Q 200 92 207 100 L 207 126 Z" fill="currentColor" className="text-muted/30" stroke="currentColor" strokeWidth="1" />

              {/* Second Story Arched Windows */}
              <path d="M 36 78 Q 40 72 44 78 L 44 86 L 36 86 Z" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 54 78 Q 58 72 62 78 L 62 86 L 54 86 Z" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 178 78 Q 182 72 186 78 L 186 86 L 178 86 Z" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 196 78 Q 200 72 204 78 L 204 86 L 196 86 Z" fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth="0.8" />

              {/* Base Plinth & Steps */}
              <rect x="20" y="130" width="200" height="5" fill="currentColor" className="text-muted" stroke="currentColor" strokeWidth="1" />
              <rect x="15" y="135" width="210" height="5" fill="currentColor" className="text-muted/80" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-foreground tracking-tight">
              Central Institutional Nexus
            </h4>
            <p className="text-[10px] text-muted-foreground font-mono">
              Registrar Verified Core
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4 ORBITAL COMMUNITY NODES                                 */}
        {/* ========================================================= */}

        {/* 1. Student Node (Top Left) */}
        <div
          onClick={() => setActiveNode("student")}
          onMouseEnter={() => setActiveNode("student")}
          className={`network-node-float absolute top-[4%] left-[2%] sm:left-[6%] z-20 cursor-pointer transition-all duration-300 ${
            activeNode === "student" ? "scale-105" : "hover:scale-102 opacity-90"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border bg-card/90 backdrop-blur-md shadow-lg transition-all ${
              activeNode === "student"
                ? "border-sky-500 shadow-sky-500/20 ring-1 ring-sky-500/50"
                : "border-border/80 hover:border-sky-500/50"
            }`}
          >
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <GraduationCap className="size-4 sm:size-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">Verified Student</span>
                <span className="size-1.5 rounded-full bg-sky-500" />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">Dept. of CSE • Talent</p>
            </div>
          </div>
        </div>

        {/* 2. Alumni Node (Top Right) */}
        <div
          onClick={() => setActiveNode("alumni")}
          onMouseEnter={() => setActiveNode("alumni")}
          className={`network-node-float absolute top-[4%] right-[2%] sm:right-[6%] z-20 cursor-pointer transition-all duration-300 ${
            activeNode === "alumni" ? "scale-105" : "hover:scale-102 opacity-90"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border bg-card/90 backdrop-blur-md shadow-lg transition-all ${
              activeNode === "alumni"
                ? "border-blue-500 shadow-blue-500/20 ring-1 ring-blue-500/50"
                : "border-border/80 hover:border-blue-500/50"
            }`}
          >
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Award className="size-4 sm:size-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">Distinguished Alumni</span>
                <span className="size-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">Lead Engineer • Referral</p>
            </div>
          </div>
        </div>

        {/* 3. Employer Node (Bottom Left) */}
        <div
          onClick={() => setActiveNode("employer")}
          onMouseEnter={() => setActiveNode("employer")}
          className={`network-node-float absolute bottom-[4%] left-[2%] sm:left-[6%] z-20 cursor-pointer transition-all duration-300 ${
            activeNode === "employer" ? "scale-105" : "hover:scale-102 opacity-90"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border bg-card/90 backdrop-blur-md shadow-lg transition-all ${
              activeNode === "employer"
                ? "border-emerald-500 shadow-emerald-500/20 ring-1 ring-emerald-500/50"
                : "border-border/80 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Building2 className="size-4 sm:size-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">Verified Employer</span>
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">Industry Placement Partner</p>
            </div>
          </div>
        </div>

        {/* 4. Faculty Node (Bottom Right) */}
        <div
          onClick={() => setActiveNode("faculty")}
          onMouseEnter={() => setActiveNode("faculty")}
          className={`network-node-float absolute bottom-[4%] right-[2%] sm:right-[6%] z-20 cursor-pointer transition-all duration-300 ${
            activeNode === "faculty" ? "scale-105" : "hover:scale-102 opacity-90"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl border bg-card/90 backdrop-blur-md shadow-lg transition-all ${
              activeNode === "faculty"
                ? "border-purple-500 shadow-purple-500/20 ring-1 ring-purple-500/50"
                : "border-border/80 hover:border-purple-500/50"
            }`}
          >
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <BookOpen className="size-4 sm:size-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">Faculty Mentor</span>
                <span className="size-1.5 rounded-full bg-purple-500" />
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">Dean & Chair Endorsement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Educational Live Connection Telemetry Card */}
      <div className="relative mt-2 p-3 sm:p-4 rounded-xl border border-border/80 bg-background/80 backdrop-blur-md transition-all z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  Active Connection: {selectedNode.role} ({selectedNode.name})
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${selectedNode.accent.badge}`}>
                  {selectedNode.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedNode.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <span className="hidden sm:inline">Tap any node to view pathway</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
