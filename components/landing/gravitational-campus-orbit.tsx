"use client";

import React, { useRef, useEffect, useState } from "react";
import { ShieldCheck, Sparkles, Zap, Award, CheckCircle2, ArrowUpRight } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface MatchEvent {
  active: boolean;
  studentName: string;
  studentDept: string;
  alumniName: string;
  alumniCompany: string;
  companyName: string;
  progress: number; // 0 to 1
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
}

export function GravitationalCampusOrbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Current active live referral match info displayed on UI
  const [currentMatch, setCurrentMatch] = useState<{
    student: string;
    dept: string;
    alumni: string;
    company: string;
  }>({
    student: "Tanvir Ahmed",
    dept: "CSE '25 (CGPA 3.84)",
    alumni: "Nadia Islam (JNU '18)",
    company: "Optimizely",
  });

  const [referralCount, setReferralCount] = useState(14);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse on container
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseRef.current.targetX = relX * 25; // tilt degrees/offset
      mouseRef.current.targetY = relY * 20;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // Node data
    const students = [
      { name: "Tanvir Ahmed", dept: "CSE '25", cgpa: "3.84", angle: 0 },
      { name: "Sabrina Mostafa", dept: "BBA '24", cgpa: "3.78", angle: (2 * Math.PI) / 3 },
      { name: "Fahim Shahriar", dept: "Physics '25", cgpa: "3.91", angle: (4 * Math.PI) / 3 },
    ];

    const alumni = [
      { name: "Nadia Islam", role: "Sr. Eng", company: "Optimizely", angle: Math.PI / 4 },
      { name: "Tanvir Hasan", role: "Product Lead", company: "bKash", angle: (3 * Math.PI) / 4 },
      { name: "Rahat Karim", role: "Lead Arch", company: "Brain Station 23", angle: (5 * Math.PI) / 4 },
      { name: "Dr. Masud Rana", role: "Staff Scientist", company: "Google", angle: (7 * Math.PI) / 4 },
    ];

    const companies = [
      { name: "Optimizely", angle: 0.3 },
      { name: "Brain Station 23", angle: 1.8 },
      { name: "bKash FinTech", angle: 3.4 },
      { name: "Google", angle: 4.9 },
    ];

    // Sonar pulses
    const pulses: { r: number; alpha: number }[] = [];
    let pulseTimer = 0;

    // Laser arc match state
    const matchState: MatchEvent = {
      active: false,
      studentName: "",
      studentDept: "",
      alumniName: "",
      alumniCompany: "",
      companyName: "",
      progress: 0,
      startX: 0,
      startY: 0,
      midX: 0,
      midY: 0,
      endX: 0,
      endY: 0,
    };

    const particles: Particle[] = [];
    let laserTimer = 0;
    let time = 0;

    // Spawn sparks
    const spawnSparks = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    // Main Render Loop
    const render = () => {
      time += 0.016;

      // Smooth mouse spring physics
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const dpr = window.devicePixelRatio || 1;
      const centerX = width / 2 + mouseRef.current.x * dpr;
      const centerY = height / 2 + mouseRef.current.y * dpr;

      // Clean background: deep cinematic dark navy
      ctx.fillStyle = "#080c16";
      ctx.fillRect(0, 0, width, height);

      // Ambient radial vortex
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.min(width, height) * 0.65
      );
      grad.addColorStop(0, "rgba(37, 99, 235, 0.22)");
      grad.addColorStop(0.4, "rgba(15, 23, 42, 0.45)");
      grad.addColorStop(1, "rgba(8, 12, 22, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Background Grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40 * dpr;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Sonar Pulses from center
      pulseTimer += 0.016;
      if (pulseTimer > 2.0) {
        pulses.push({ r: 35 * dpr, alpha: 0.8 });
        pulseTimer = 0;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.r += 1.2 * dpr;
        p.alpha -= 0.005;
        if (p.alpha <= 0) {
          pulses.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(centerX, centerY, p.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${p.alpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 3 Concentric 3D Orbital Rings (Elliptical projection)
      const scaleY = 0.58; // 3D tilt aspect ratio
      const r1 = 110 * dpr; // Student ring
      const r2 = 190 * dpr; // Alumni ring
      const r3 = 275 * dpr; // Partner ring

      const drawOrbitalRing = (
        r: number,
        color: string,
        dash: number[],
        tiltAngle: number
      ) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(tiltAngle);
        ctx.scale(1, scaleY);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.setLineDash(dash);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      };

      // Draw the 3 orbital tracks
      drawOrbitalRing(r1, "rgba(56, 189, 248, 0.35)", [4, 6], -0.1);
      drawOrbitalRing(r2, "rgba(59, 130, 246, 0.4)", [6, 8], 0.05);
      drawOrbitalRing(r3, "rgba(16, 185, 129, 0.35)", [8, 12], -0.05);

      // Calculate Positions:
      // Inner Ring (Students) — rotates clockwise
      const studentSpeed = 0.25;
      const studentCoords = students.map((st, i) => {
        const currentAngle = st.angle + time * studentSpeed;
        const x = centerX + Math.cos(currentAngle) * r1;
        const y = centerY + Math.sin(currentAngle) * r1 * scaleY;
        return { ...st, x, y };
      });

      // Middle Ring (Alumni) — rotates counter-clockwise
      const alumniSpeed = -0.2;
      const alumniCoords = alumni.map((al, i) => {
        const currentAngle = al.angle + time * alumniSpeed;
        const x = centerX + Math.cos(currentAngle) * r2;
        const y = centerY + Math.sin(currentAngle) * r2 * scaleY;
        return { ...al, x, y };
      });

      // Outer Ring (Companies) — slow clockwise
      const companySpeed = 0.08;
      const companyCoords = companies.map((cp, i) => {
        const currentAngle = cp.angle + time * companySpeed;
        const x = centerX + Math.cos(currentAngle) * r3;
        const y = centerY + Math.sin(currentAngle) * r3 * scaleY;
        return { ...cp, x, y };
      });

      // =========================================================
      // REFERRAL LASER ARC TRIGGER (Every 3.5 seconds)
      // =========================================================
      laserTimer += 0.016;
      if (laserTimer > 3.6 && !matchState.active) {
        laserTimer = 0;
        // Find the closest pair of Student and Alumni
        let bestDist = Infinity;
        let sIdx = 0;
        let aIdx = 0;
        studentCoords.forEach((s, si) => {
          alumniCoords.forEach((a, ai) => {
            const dist = Math.hypot(s.x - a.x, s.y - a.y);
            if (dist < bestDist) {
              bestDist = dist;
              sIdx = si;
              aIdx = ai;
            }
          });
        });

        const chosenStudent = studentCoords[sIdx];
        const chosenAlumni = alumniCoords[aIdx];
        const chosenCompany = companyCoords[aIdx % companyCoords.length];

        matchState.active = true;
        matchState.progress = 0;
        matchState.studentName = chosenStudent.name;
        matchState.studentDept = chosenStudent.dept;
        matchState.alumniName = chosenAlumni.name;
        matchState.alumniCompany = chosenAlumni.company;
        matchState.companyName = chosenCompany.name;

        matchState.startX = chosenStudent.x;
        matchState.startY = chosenStudent.y;
        matchState.midX = chosenAlumni.x;
        matchState.midY = chosenAlumni.y;
        matchState.endX = chosenCompany.x;
        matchState.endY = chosenCompany.y;

        spawnSparks(chosenStudent.x, chosenStudent.y, "#38bdf8", 16);
        spawnSparks(chosenAlumni.x, chosenAlumni.y, "#3b82f6", 16);

        setCurrentMatch({
          student: chosenStudent.name,
          dept: chosenStudent.dept,
          alumni: `${chosenAlumni.name} (${chosenAlumni.company})`,
          company: chosenCompany.name,
        });

        setReferralCount((c) => c + 1);
      }

      // Render Laser Arc
      if (matchState.active) {
        matchState.progress += 0.025; // Duration of laser strike
        const p = matchState.progress;

        // Glowing Laser Arc 1: Student -> Alumni
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(matchState.startX, matchState.startY);
        const curMidX = matchState.startX + (matchState.midX - matchState.startX) * Math.min(1, p * 1.5);
        const curMidY = matchState.startY + (matchState.midY - matchState.startY) * Math.min(1, p * 1.5);
        ctx.lineTo(curMidX, curMidY);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.9)";
        ctx.lineWidth = 3.5 * dpr;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 15;
        ctx.stroke();

        // Glowing Laser Arc 2: Alumni -> Partner Company (ascending into industry)
        if (p > 0.4) {
          const p2 = (p - 0.4) / 0.6;
          ctx.beginPath();
          ctx.moveTo(matchState.midX, matchState.midY);
          const curEndX = matchState.midX + (matchState.endX - matchState.midX) * Math.min(1, p2);
          const curEndY = matchState.midY + (matchState.endY - matchState.midY) * Math.min(1, p2);
          ctx.lineTo(curEndX, curEndY);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.95)";
          ctx.lineWidth = 3.5 * dpr;
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 18;
          ctx.stroke();
        }
        ctx.restore();

        // Laser finished
        if (p >= 1) {
          spawnSparks(matchState.endX, matchState.endY, "#10b981", 20);
          matchState.active = false;
        }
      }

      // Render & Update Spark Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.02;
        if (pt.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * dpr, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // =========================================================
      // DRAW NODES: Outer (Companies)
      // =========================================================
      companyCoords.forEach((cp) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, 8 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981";
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.font = `bold ${10 * dpr}px sans-serif`;
        ctx.fillStyle = "#e2e8f0";
        ctx.textAlign = "center";
        ctx.fillText(cp.name, cp.x, cp.y + 18 * dpr);
        ctx.restore();
      });

      // DRAW NODES: Middle (Alumni Mentors)
      alumniCoords.forEach((al) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(al.x, al.y, 7 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.font = `${9 * dpr}px sans-serif`;
        ctx.fillStyle = "#93c5fd";
        ctx.textAlign = "center";
        ctx.fillText(`${al.name}`, al.x, al.y - 12 * dpr);
        ctx.restore();
      });

      // DRAW NODES: Inner (Students)
      studentCoords.forEach((st) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(st.x, st.y, 6 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.font = `${9 * dpr}px sans-serif`;
        ctx.fillStyle = "#bae6fd";
        ctx.textAlign = "center";
        ctx.fillText(st.name.split(" ")[0], st.x, st.y + 15 * dpr);
        ctx.restore();
      });

      // =========================================================
      // CENTERPIECE: Jagannath University Crest Gravitational Anchor
      // =========================================================
      const centerRadius = 38 * dpr;

      // Outer Halo Ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius + 6 * dpr, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(217, 119, 6, 0.45)";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // Glowing Center Plate
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.shadowColor = "rgba(59, 130, 246, 0.6)";
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-3xl border border-border/80 bg-[#080c16] text-white shadow-2xl overflow-hidden select-none"
    >
      {/* Top Telemetry Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-white/10 bg-[#080c16]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-emerald-500" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Jagannath University Gravitational Career Orbit</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Live Field
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive physics simulation: Students ascending to industry through Alumni referrals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>Registrar Validated Network</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold">
            <Zap className="size-3.5" />
            <span>{referralCount} Matches Fired</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

        {/* DOM Center Medallion (Guarantees Razor-Sharp Crest Rendering) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center justify-center">
          <div className="relative size-16 sm:size-20 rounded-full border-2 border-amber-500/80 bg-slate-900/90 shadow-[0_0_30px_rgba(217,119,6,0.5)] flex items-center justify-center p-2 backdrop-blur-md">
            <img
              src="/images/jnu-crest.png"
              alt="Jagannath University Crest"
              className="w-full h-full object-contain filter drop-shadow-md brightness-110"
            />
          </div>
          <span className="mt-1 text-[9px] sm:text-[10px] font-bold text-amber-400 font-mono tracking-wider drop-shadow-sm">
            JNU CORE
          </span>
        </div>

        {/* Legend Pills (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            <span className="text-slate-300">Inner Orbit: Verified Students</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
            <span className="text-slate-300">Middle Orbit: Alumni Mentors (Tech/Finance)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            <span className="text-slate-300">Outer Orbit: Partner Corporations</span>
          </div>
        </div>

        {/* Instructions (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-slate-950/70 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
          <span>Move cursor to bend gravitational plane</span>
        </div>
      </div>

      {/* Live Referral Strike Telemetry Card */}
      <div className="relative z-10 p-4 sm:p-5 border-t border-white/10 bg-slate-950/90 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Zap className="size-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ⚡ REFERRAL MATCH FIRED
                </span>
                <span className="text-xs font-bold text-white">
                  {currentMatch.student} ({currentMatch.dept})
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <span>Endorsed by {currentMatch.alumni}</span>
                <span className="text-slate-500">→</span>
                <span className="text-emerald-400 font-semibold">Priority Interview at {currentMatch.company}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 shrink-0">
            <span>Ascension Velocity: 100% Real Referral</span>
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

