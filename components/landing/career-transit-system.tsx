"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Building2,
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";

interface Station {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  badge: string;
  cx: number;
  cy: number;
  details: {
    stage: string;
    description: string;
    who: string;
    outcome: string;
    stat: string;
  };
}

interface TransitLine {
  id: string;
  name: string;
  tag: string;
  color: {
    primary: string;
    glow: string;
    bg: string;
    border: string;
    dot: string;
  };
  sampleStudent: {
    name: string;
    dept: string;
    cgpa: string;
    destination: string;
  };
  pathD: string;
  stations: Station[];
}

const TRANSIT_LINES: TransitLine[] = [
  {
    id: "tech",
    name: "Software & Engineering Line",
    tag: "TRACK 01",
    color: {
      primary: "#2563eb",
      glow: "rgba(37, 99, 235, 0.45)",
      bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      border: "border-blue-500",
      dot: "bg-blue-500",
    },
    sampleStudent: {
      name: "Tanvir Ahmed",
      dept: "Dept. of Computer Science & Engineering ('25)",
      cgpa: "CGPA 3.84 / 4.00",
      destination: "Optimizely & Brain Station 23",
    },
    // Symmetrical smooth railway track from left to right through JNU center
    pathD: "M 80 180 C 180 180, 220 180, 280 180 C 340 180, 360 180, 425 180 C 490 180, 520 180, 580 180 C 640 180, 680 180, 770 180",
    stations: [
      {
        id: "st-1",
        name: "Dept. Registrar Station",
        shortLabel: "01. Verification",
        subtitle: "Academic Checkpoint",
        badge: "ID: #2022-CSE-014",
        cx: 110,
        cy: 180,
        details: {
          stage: "Gate 01: Registrar Identity Check",
          description: "Student identity, enrollment status, and verified CGPA confirmed directly against institutional records.",
          who: "Registrar's Office & Dept. of CSE",
          outcome: "Verified Student Credential Issued",
          stat: "100% Institutional Match",
        },
      },
      {
        id: "st-2",
        name: "Faculty Endorsement Hub",
        shortLabel: "02. Endorsement",
        subtitle: "Academic Recommendation",
        badge: "Dean Approved",
        cx: 280,
        cy: 180,
        details: {
          stage: "Gate 02: Faculty Academic Endorsement",
          description: "Department Chair and faculty advisors review course performance and issue a cryptographically signed letter of endorsement.",
          who: "Prof. Dr. A. Rahman (Dept. Chair)",
          outcome: "Academic Endorsement Badge Attached",
          stat: "3 Recommendations Granted",
        },
      },
      {
        id: "st-3",
        name: "JNU Central Junction",
        shortLabel: "03. JNU Hub",
        subtitle: "University Core Interchange",
        badge: "Campus Core",
        cx: 425,
        cy: 180,
        details: {
          stage: "Gate 03: Central Institutional Nexus",
          description: "All career tracks intersect at the university gateway, indexing verified talent into private alumni search filters.",
          who: "Jagannath University Career Community",
          outcome: "Elevator Pitch Dispatched to Alumni",
          stat: "450+ Partner Connections",
        },
      },
      {
        id: "st-4",
        name: "Alumni Referral Terminal",
        shortLabel: "04. Referral",
        subtitle: "Internal Company Referral",
        badge: "Alumni '18 @ Tech Firm",
        cx: 580,
        cy: 180,
        details: {
          stage: "Gate 04: Alumni Internal Referral Exchange",
          description: "Verified alumni working inside partner tech enterprises evaluate student portfolio and submit internal referral code.",
          who: "Nadia Islam (Senior Software Engineer)",
          outcome: "Fast-Track Interview Code Issued",
          stat: "Direct Internal Referral",
        },
      },
      {
        id: "st-5",
        name: "Corporate Partner Placement",
        shortLabel: "05. Placement",
        subtitle: "Direct Interview Stage",
        badge: "Shortlist Active",
        cx: 740,
        cy: 180,
        details: {
          stage: "Gate 05: Direct Campus Placement",
          description: "Partner companies receive consent-gated, un-scraped resumes directly into their candidate portal.",
          who: "Apex Labs & Partner Enterprise",
          outcome: "Direct Technical Interview Scheduled",
          stat: "Priority Interview Scheduled",
        },
      },
    ],
  },
  {
    id: "business",
    name: "Business & Management Line",
    tag: "TRACK 02",
    color: {
      primary: "#d97706",
      glow: "rgba(217, 119, 6, 0.45)",
      bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      border: "border-amber-500",
      dot: "bg-amber-500",
    },
    sampleStudent: {
      name: "Sabrina Mostafa",
      dept: "Faculty of Business Studies ('24)",
      cgpa: "CGPA 3.78 / 4.00",
      destination: "Standard Chartered & bKash FinTech",
    },
    pathD: "M 80 180 C 180 180, 220 180, 280 180 C 340 180, 360 180, 425 180 C 490 180, 520 180, 580 180 C 640 180, 680 180, 770 180",
    stations: [
      {
        id: "st-1",
        name: "Business Faculty Office",
        shortLabel: "01. Verification",
        subtitle: "Academic Checkpoint",
        badge: "ID: #2021-BBA-089",
        cx: 110,
        cy: 180,
        details: {
          stage: "Gate 01: BBA Credential Check",
          description: "Major specialization in Finance & Marketing verified with official transcript records.",
          who: "Faculty of Business Studies",
          outcome: "Certified Business Candidate",
          stat: "Accredited JNU Record",
        },
      },
      {
        id: "st-2",
        name: "Case & Leadership Lab",
        shortLabel: "02. Endorsement",
        subtitle: "Faculty Evaluation",
        badge: "Top 5% Cohort",
        cx: 280,
        cy: 180,
        details: {
          stage: "Gate 02: Leadership & Case Competition Endorsement",
          description: "Faculty mentorship records and national case competition achievements validated by department mentors.",
          who: "Dr. K. Alam (Associate Professor)",
          outcome: "Leadership Recommendation",
          stat: "National Finalist Verified",
        },
      },
      {
        id: "st-3",
        name: "JNU Central Junction",
        shortLabel: "03. JNU Hub",
        subtitle: "University Core Interchange",
        badge: "Campus Core",
        cx: 425,
        cy: 180,
        details: {
          stage: "Gate 03: Central Institutional Nexus",
          description: "Transfers verified business candidate profile directly to the Banking & FinTech Alumni circle.",
          who: "Jagannath University Career Community",
          outcome: "Alumni Match Algorithm Activated",
          stat: "120+ Banking Partners",
        },
      },
      {
        id: "st-4",
        name: "Corporate Banking Terminal",
        shortLabel: "04. Referral",
        subtitle: "FinTech Alumni Network",
        badge: "VP Product @ bKash",
        cx: 580,
        cy: 180,
        details: {
          stage: "Gate 04: Banking & FinTech Alumni Referral",
          description: "Senior Alumni executives mentor the candidate on technical assessment and submit an internal referral.",
          who: "Tanvir Hasan (Product Lead, JNU '16)",
          outcome: "Internal Management Trainee Referral",
          stat: "MTO Priority Pipeline",
        },
      },
      {
        id: "st-5",
        name: "FinTech Placement Gate",
        shortLabel: "05. Placement",
        subtitle: "MTO Assessment Stage",
        badge: "Shortlist Active",
        cx: 740,
        cy: 180,
        details: {
          stage: "Gate 05: Direct Enterprise Placement",
          description: "Direct invitation for Management Trainee Officer assessment rounds.",
          who: "Partner Multinational Bank",
          outcome: "Executive Interview Round",
          stat: "Direct Shortlist Confirmed",
        },
      },
    ],
  },
  {
    id: "science",
    name: "Sciences & Research Line",
    tag: "TRACK 03",
    color: {
      primary: "#059669",
      glow: "rgba(5, 150, 105, 0.45)",
      bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      border: "border-emerald-500",
      dot: "bg-emerald-500",
    },
    sampleStudent: {
      name: "Fahim Shahriar",
      dept: "Dept. of Physics & Applied Sciences ('24)",
      cgpa: "CGPA 3.91 / 4.00",
      destination: "National Research Labs & Global Fellowship",
    },
    pathD: "M 80 180 C 180 180, 220 180, 280 180 C 340 180, 360 180, 425 180 C 490 180, 520 180, 580 180 C 640 180, 680 180, 770 180",
    stations: [
      {
        id: "st-1",
        name: "Science Faculty Registrar",
        shortLabel: "01. Verification",
        subtitle: "Academic Checkpoint",
        badge: "ID: #2021-PHY-033",
        cx: 110,
        cy: 180,
        details: {
          stage: "Gate 01: Science & Laboratory Verification",
          description: "Laboratory thesis credits and academic research standing verified by faculty registrar.",
          who: "Faculty of Science Registrar",
          outcome: "Research Standing Confirmed",
          stat: "Thesis Distinction",
        },
      },
      {
        id: "st-2",
        name: "Research & Publication Lab",
        shortLabel: "02. Endorsement",
        subtitle: "Principal Investigator",
        badge: "Published Author",
        cx: 280,
        cy: 180,
        details: {
          stage: "Gate 02: Publication & Laboratory Endorsement",
          description: "Department Chair verifies peer-reviewed paper co-authorship and laboratory contributions.",
          who: "Dr. S. Parveen (Research Director)",
          outcome: "Principal Investigator Recommendation",
          stat: "2 Indexed Publications",
        },
      },
      {
        id: "st-3",
        name: "JNU Central Junction",
        shortLabel: "03. JNU Hub",
        subtitle: "University Core Interchange",
        badge: "Campus Core",
        cx: 425,
        cy: 180,
        details: {
          stage: "Gate 03: Central Institutional Nexus",
          description: "Routes academic profile into international alumni research fellowship networks.",
          who: "Jagannath University Career Community",
          outcome: "Fellowship Dispatch",
          stat: "Global Alumni Scholars",
        },
      },
      {
        id: "st-4",
        name: "Global Scholar Terminal",
        shortLabel: "04. Referral",
        subtitle: "Doctoral Alumni Network",
        badge: "Postdoc Fellow @ Max Planck",
        cx: 580,
        cy: 180,
        details: {
          stage: "Gate 04: Doctoral & Industry Fellowship Referral",
          description: "Alumni researchers connect the student with funded industrial research and laboratory positions.",
          who: "Dr. Masud Rana (Research Scientist, JNU '15)",
          outcome: "Funded Research Referral",
          stat: "Full Research Stipend",
        },
      },
      {
        id: "st-5",
        name: "Research Fellowship Gate",
        shortLabel: "05. Placement",
        subtitle: "Direct Fellowship Offer",
        badge: "Grant Awarded",
        cx: 740,
        cy: 180,
        details: {
          stage: "Gate 05: Direct Research Appointment",
          description: "Candidate joins verified applied science research laboratory with institutional accreditation.",
          who: "National Science Foundation Partner",
          outcome: "Research Associate Contract",
          stat: "Appointed Research Fellow",
        },
      },
    ],
  },
];

export function CareerTransitSystem() {
  const [selectedLineId, setSelectedLineId] = useState<string>("tech");
  const [activeStationId, setActiveStationId] = useState<string>("st-3");

  const currentLine =
    TRANSIT_LINES.find((line) => line.id === selectedLineId) || TRANSIT_LINES[0];

  const currentStation =
    currentLine.stations.find((st) => st.id === activeStationId) ||
    currentLine.stations[2];

  // Auto-cycle the active station smoothly if user hasn't clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStationId((prevId) => {
        const currentIndex = currentLine.stations.findIndex((s) => s.id === prevId);
        const nextIndex = (currentIndex + 1) % currentLine.stations.length;
        return currentLine.stations[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [currentLine]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl p-5 sm:p-8 select-none transition-all duration-300">
      {/* Background Harmonized Grid & Ambient Light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none rounded-3xl" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 blur-3xl pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentLine.color.glow }}
      />

      {/* Top Bar: Line Switcher & Track Indicator */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full animate-pulse" style={{ backgroundColor: currentLine.color.primary }} />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-muted-foreground">
              JNU Career Transit System • Interactive Pathway
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight mt-0.5">
            The Verified Campus Route to Industry Placement
          </h3>
        </div>

        {/* 3 Harmonized Line Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-muted/60 border border-border/80 self-start sm:self-auto">
          {TRANSIT_LINES.map((line) => {
            const isSelected = line.id === selectedLineId;
            return (
              <button
                key={line.id}
                onClick={() => {
                  setSelectedLineId(line.id);
                  setActiveStationId("st-3");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-background text-foreground shadow-xs border border-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: line.color.primary }}
                />
                <span>{line.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Interactive Transit Schematic Map (SVG) */}
      <div className="relative w-full aspect-[16/7] min-h-[220px] sm:min-h-[260px] my-6 flex items-center justify-center">
        <svg
          viewBox="0 0 850 260"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Filter for glowing transit capsule */}
            <filter id="trainGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Sleeper / Track Ties */}
          <path
            d={currentLine.pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray="2 16"
            className="text-border/60"
          />

          {/* Main Dual Railway Track Line */}
          <path
            d={currentLine.pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/60"
          />

          {/* Active Colored High-Speed Track Line */}
          <path
            d={currentLine.pathD}
            fill="none"
            stroke={currentLine.color.primary}
            strokeWidth="4"
            strokeLinecap="round"
            className="transition-colors duration-500"
          />

          {/* Continuous Gliding High-Speed Light Capsule (The Train) */}
          <circle
            r="7"
            fill="#ffffff"
            stroke={currentLine.color.primary}
            strokeWidth="3"
            filter="url(#trainGlow)"
          >
            <animateMotion
              path={currentLine.pathD}
              dur="6.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>

          {/* 5 STATIONS ALONG THE ROUTE */}
          {currentLine.stations.map((st, idx) => {
            const isActive = st.id === activeStationId;
            const isCenterHub = st.id === "st-3";

            return (
              <g
                key={st.id}
                onClick={() => setActiveStationId(st.id)}
                className="cursor-pointer group"
              >
                {/* Outer Ripple for Active Station */}
                {isActive && (
                  <circle
                    cx={st.cx}
                    cy={st.cy}
                    r={isCenterHub ? "36" : "24"}
                    fill={currentLine.color.primary}
                    fillOpacity="0.15"
                    className="animate-ping"
                  />
                )}

                {/* Station Base Plate */}
                <circle
                  cx={st.cx}
                  cy={st.cy}
                  r={isCenterHub ? "28" : "15"}
                  fill="currentColor"
                  stroke={isActive ? currentLine.color.primary : "currentColor"}
                  strokeWidth={isActive ? "3.5" : "2"}
                  className={`text-card transition-all duration-300 ${
                    isActive ? "" : "text-card stroke-border hover:stroke-foreground"
                  }`}
                />

                {/* Center Hub Special: The Jagannath University Crest */}
                {isCenterHub ? (
                  <image
                    href="/images/jnu-crest.png"
                    x={st.cx - 20}
                    y={st.cy - 20}
                    height="40"
                    width="40"
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />
                ) : (
                  <circle
                    cx={st.cx}
                    cy={st.cy}
                    r={isActive ? "7" : "5"}
                    fill={isActive ? currentLine.color.primary : "currentColor"}
                    className={isActive ? "" : "text-muted-foreground/60 group-hover:text-foreground"}
                  />
                )}

                {/* Station Labels */}
                <text
                  x={st.cx}
                  y={st.cy + (isCenterHub ? 45 : 34)}
                  textAnchor="middle"
                  className={`text-[11px] sm:text-xs font-bold transition-colors duration-200 select-none ${
                    isActive ? "fill-foreground font-extrabold" : "fill-muted-foreground group-hover:fill-foreground"
                  }`}
                >
                  {st.shortLabel}
                </text>

                <text
                  x={st.cx}
                  y={st.cy + (isCenterHub ? 58 : 46)}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-muted-foreground/80 select-none hidden sm:block"
                >
                  {st.subtitle}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Station Detailed Telemetry Inspection Deck */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl border border-border/80 bg-background/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Station Identity & What Happens Here */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentLine.color.bg}`}>
                {currentStation.details.stage}
              </span>
              <span className="text-xs font-bold text-foreground">
                {currentStation.name}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="size-3" />
                {currentStation.details.who}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
              {currentStation.details.description}
            </p>
          </div>

          {/* Right: Real Student Journey Simulation */}
          <div className="flex items-center gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-border/60">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                Active Candidate in Pipeline
              </span>
              <span className="text-xs font-bold text-foreground">
                {currentLine.sampleStudent.name}
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block">
                {currentStation.details.outcome}
              </span>
            </div>

            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grounding Bar: Registrar Trust & Active Partners */}
      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-blue-500" />
          <span>Zero Unverified Profiles • All Records Registrar Validated</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Target Placement: <strong className="text-foreground">{currentLine.sampleStudent.destination}</strong></span>
          <span className="text-emerald-500 font-bold">● SYSTEM OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
}

