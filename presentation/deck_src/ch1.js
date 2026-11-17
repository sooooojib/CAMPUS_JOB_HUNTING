const T = require("./theme_config");
const { HEX, TINTS, W, M, CW, GUT, TOP, FS, header, intro, card, num, pill } = T;
T.setChapter(0, "01 · PROBLEM");
const SEC = "Chapter 1 — Opening, Problem & Workflow";

// A drawn copy of a real UniCareer job card (data from prisma/seed.ts)
function jobCard(pres, s, x, y, w, opts = {}) {
  const h = opts.h || 3.0;
  const compact = !!opts.compact;
  card(pres, s, x, y, w, h, "App mock: job card");
  const lg = compact ? 0.55 : 0.7, pad = compact ? 0.2 : 0.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + pad, y: y + pad, w: lg, h: lg, rectRadius: 0.1, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Company logo" });
  s.addText("bK", { x: x + pad, y: y + pad, w: lg, h: lg, fontSize: compact ? 15 : 18, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText([
    { text: "Junior Backend Engineer", options: { bold: true, fontSize: compact ? 16 : 19, color: HEX.dk1, breakLine: true } },
    { text: "bKash Limited  ·  Dhaka  ·  Full-time", options: { fontSize: compact ? 13 : 14, color: HEX.dk2 } },
  ], { x: x + pad + lg + 0.2, y: y + pad - 0.05, w: w - lg - pad * 2 - 0.2, h: lg + 0.1, margin: 0, valign: "middle", isTextBox: true });
  if (compact) {
    pill(pres, s, "Shared by a verified JnU member", x + pad, y + h - 0.45, 3.9, HEX.accent5, HEX.accent2);
    s.addText("2 days left", { x: x + pad + 4.0, y: y + h - 0.45, w: w - pad * 2 - 4.0, h: 0.32, fontSize: 13, bold: true, color: HEX.accent1, align: "right", valign: "middle", margin: 0, isTextBox: true });
    return;
  }
  pill(pres, s, "Shared by a verified JnU member", x + 0.3, y + 1.25, Math.min(4.1, w - 0.6), HEX.accent5, HEX.accent2);
  s.addText([
    { text: "BDT 55,000 – 75,000 a month", options: { fontSize: 14, color: HEX.dk1, breakLine: true } },
    { text: "Closes in 2 days", options: { fontSize: 14, bold: true, color: HEX.accent1 } },
  ], { x: x + 0.3, y: y + 1.7, w: w - 0.6, h: 0.6, margin: 0, valign: "top", isTextBox: true });
  pill(pres, s, "Apply on company website", x + 0.3, y + h - 0.6, 2.9, HEX.accent1, HEX.lt1, 13);
  pill(pres, s, "Save", x + 3.35, y + h - 0.6, 1.0, HEX.lt2, HEX.dk1, 13);
}

function marker(pres, s, x, y, color, i) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.14, h: 0.14, fill: { color }, line: { color, width: 0 }, objectName: `Bullet ${i}` });
}

module.exports = function ch1(pres) {
  pres.addSection({ title: SEC });

  // ---------- Slide 1: Cover (v5, typographic, no UI mock) ----------
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: SEC });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.1, y: 0, w: W - 8.1, h: 7.5, fill: { color: "E3EBF4" }, line: { type: "none" }, objectName: "Right panel" });
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 0.95, w: 0.32, h: 0.05, fill: { color: HEX.accent1 }, line: { type: "none" }, objectName: "Kicker bar" });
    s.addText("SOFTWARE ENGINEERING PROJECT  ·  JAGANNATH UNIVERSITY", { x: M + 0.42, y: 0.83, w: 7, h: 0.3, fontSize: 12, bold: true, color: HEX.accent1, charSpacing: 2, margin: 0, valign: "middle", isTextBox: true });
    s.addText([{ text: "UniCareer\n", options: {} }, { text: "Community", options: { color: HEX.accent1 } }], { x: M, y: 1.45, w: 7.2, h: 2.4, fontSize: 66, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true, lineSpacingMultiple: 0.9 });
    s.addText("Trusted jobs and referrals for JnU students and alumni", { x: M, y: 3.95, w: 7, h: 0.6, fontSize: 22, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    const info = ["Course", "Teacher", "Presented by"];
    const iw = (7.2 - 2 * 0.3) / 3;
    info.forEach((r, i) => {
      const x = M + i * (iw + 0.3);
      s.addText(r, { x, y: 5.45, w: iw, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
      s.addShape(pres.shapes.LINE, { x, y: 6.25, w: iw, h: 0, line: { color: "B8C4D4", width: 1 }, objectName: `Blank line ${i + 1}` });
      if (r === "Presented by") s.addText("Group-1", { x, y: 5.8, w: iw, h: 0.4, fontSize: 18, bold: true, color: HEX.dk1, margin: 0, valign: "bottom", isTextBox: true });
    });
    // right: three promise cards
    const items = [["01", "Trusted jobs", "Shared by verified JnU members"], ["02", "Alumni referrals", "Ask in the app or by email"], ["03", "No missed deadlines", "Saved jobs on your calendar"]];
    items.forEach((it, i) => {
      const x = 8.75 + (i % 2) * 0.35, y = 1.25 + i * 1.7;
      card(pres, s, x, y, 3.9, 1.35, `Promise ${i + 1}`);
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: 1.35, fill: { color: i === 0 ? HEX.accent1 : HEX.accent2 }, line: { type: "none" }, objectName: `Promise bar ${i + 1}` });
      s.addText(it[0], { x: x + 0.35, y: y + 0.18, w: 1, h: 0.35, fontSize: 14, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
      s.addText(it[1], { x: x + 0.35, y: y + 0.48, w: 3.3, h: 0.45, fontSize: 21, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(it[2], { x: x + 0.35, y: y + 0.9, w: 3.3, h: 0.35, fontSize: 14, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
    });
    T.progress(s, 0);
    s.addNotes("Cover. Fill in the course and teacher on the blank lines before presenting; the team (Group-1) is introduced on the next slide. The three cards are UniCareer's three promises: trusted job leads from verified JnU members, alumni referrals (in the app or by email), and deadline reminders on the calendar. Live site: jnujobhunting.vercel.app");
  }

  // ---------- Slide 2: Team (Presented by Group-1) ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    T.setChapter(0, "PRESENTED BY");
    header(s, "Meet ", "Group-1");
    T.setChapter(0, "01 · PROBLEM");
    const team = [
      ["Ifrat Jahan Juthy", "B220305004"], ["Jannatun Nahar Jui", "B220305005"], ["Fariha Yasmeen", "B220305007"],
      ["Nazmul Hasan Riyan", "B220305008"], ["S.M Sajib Al Hasan", "B220305009"], ["Naima Marjan", "B220305010"],
      ["Maufiya Khatun", "B220305011"],
    ];
    const cw = 2.85, ch = 2.15, g = 0.3;
    const rows = [team.slice(0, 4), team.slice(4)];
    rows.forEach((row, r) => {
      const x0 = (W - (row.length * cw + (row.length - 1) * g)) / 2, y = 1.8 + r * (ch + 0.45);
      row.forEach(([name, id], i) => {
        const k = r * 4 + i, x = x0 + i * (cw + g);
        card(pres, s, x, y, cw, ch, `Member ${k + 1}`);
        const ini = name.replace("S.M ", "").split(" ").filter(Boolean);
        const initials = (ini[0][0] + ini[ini.length - 1][0]).toUpperCase();
        const d = 0.8, accent = k % 2 === 0;
        s.addShape(pres.shapes.OVAL, { x: x + (cw - d) / 2, y: y + 0.28, w: d, h: d, fill: { color: accent ? HEX.accent4 : HEX.accent3 }, line: { type: "none" }, objectName: `Avatar ${k + 1}` });
        s.addText(initials, { x: x + (cw - d) / 2, y: y + 0.28, w: d, h: d, fontSize: 22, bold: true, color: accent ? HEX.accent1 : HEX.accent2, align: "center", valign: "middle", margin: 0, isTextBox: true });
        s.addText(name, { x: x + 0.1, y: y + 1.2, w: cw - 0.2, h: 0.42, fontSize: 17, bold: true, color: HEX.dk1, align: "center", valign: "middle", margin: 0, isTextBox: true });
        s.addText(id, { x: x + 0.1, y: y + 1.62, w: cw - 0.2, h: 0.32, fontSize: 14, color: HEX.dk2, align: "center", valign: "middle", margin: 0, isTextBox: true });
      });
    });
    s.addNotes("Group-1 team members with their student IDs: Ifrat Jahan Juthy (B220305004), Jannatun Nahar Jui (B220305005), Fariha Yasmeen (B220305007), Nazmul Hasan Riyan (B220305008), S.M Sajib Al Hasan (B220305009), Naima Marjan (B220305010), Maufiya Khatun (B220305011).");
  }

  // ---------- Slide 2: The problem ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Why job hunting at JnU is ", "hard today");
    intro(s, "13.5% of graduates are unemployed; 1 in 3 wait up to 2 years (BBS Labour Force Survey 2024)");
    const people = [
      ["Tanvir", "Student", "Can't tell which jobs are real"],
      ["Al-Amin", "Alumnus at Chaldal", "No trusted place to help juniors"],
      ["Arif", "Admin", "Must keep fake accounts out"],
    ];
    const pw = (CW - 2 * GUT) / 3;
    people.forEach((p, i) => {
      const x = M + i * (pw + GUT), y = 1.8;
      card(pres, s, x, y, pw, 1.3, `Person ${i + 1}`, TINTS[i]);
      s.addText([
        { text: `${p[0]}  `, options: { fontSize: FS.body, bold: true, color: HEX.dk1 } },
        { text: p[1], options: { fontSize: 14, color: HEX.accent2 } },
      ], { x: x + 0.25, y: y + 0.15, w: pw - 0.5, h: 0.42, margin: 0, valign: "middle", isTextBox: true });
      s.addText(p[2], { x: x + 0.25, y: y + 0.58, w: pw - 0.5, h: 0.62, fontSize: 16, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
    });

    const bw = (CW - GUT) / 2, by = 3.4, bh = 3.35;
    // Left: today
    s.addText("Finding a job today", { x: M, y: by, w: bw, h: 0.4, fontSize: FS.body, bold: true, color: HEX.dk1, margin: 0, isTextBox: true });
    card(pres, s, M, by + 0.5, bw, 1.25, "Mock: social media post");
    s.addText([
      { text: "Unknown Page", options: { fontSize: 13, bold: true, color: HEX.dk2, breakLine: true } },
      { text: "URGENT hiring!! Send your CV in inbox.", options: { fontSize: 15, color: HEX.dk1 } },
    ], { x: M + 0.25, y: by + 0.6, w: bw - 0.5, h: 1.05, margin: 0, valign: "top", isTextBox: true });
    const bad = ["Unknown poster", "CV goes to a stranger", "No deadline"];
    bad.forEach((t, i) => {
      marker(pres, s, M + 0.1, by + 2.08 + i * 0.42, HEX.accent1, `bad ${i + 1}`);
      s.addText(t, { x: M + 0.4, y: by + 1.95 + i * 0.42, w: bw - 0.5, h: 0.4, fontSize: 16, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    // Right: UniCareer
    const rx = M + bw + GUT;
    s.addText([{ text: "Finding a job on ", options: { color: HEX.dk1 } }, { text: "UniCareer", options: { color: HEX.accent1 } }], { x: rx, y: by, w: bw, h: 0.4, fontSize: FS.body, bold: true, margin: 0, isTextBox: true });
    jobCard(pres, s, rx, by + 0.5, bw, { compact: true, h: 1.25 });
    const good = ["Shared by a verified member", "Apply on the company site", "Deadline reminder"];
    good.forEach((t, i) => {
      marker(pres, s, rx + 0.1, by + 2.08 + i * 0.42, HEX.accent2, `good ${i + 1}`);
      s.addText(t, { x: rx + 0.4, y: by + 1.95 + i * 0.42, w: bw - 0.5, h: 0.4, fontSize: 16, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addNotes("Numbers: graduate unemployment 13.5% in 2024 (BBS-based figure reported via The Daily Star/IANS, Jun 2026) and, from Labour Force Survey 2024, about 1 in 3 graduates stayed jobless for up to two years (Asia News Network, Sep 2025). LFS 2024 also shows 35.8% of job seekers look for work through relatives and friends (bdnews24, Sep 2025). Tanvir, Al-Amin and Arif are example personas, not real people. The left card is an illustrative example of a typical scam post; the right card uses a real job from our database (bKash, Junior Backend Engineer).");
  }

  // ---------- Slide 3: Problem -> fix ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What goes wrong, and ", "how we fix it");
    const rows = [
      ["Fake job posts", "Only approved members can post"],
      ["Unknown posters", "Every job page shows who shared it"],
      ["Fake accounts", "Email and student ID check"],
      ["CVs sent to strangers", "Apply on the company's own site"],
      ["Missed deadlines", "Saved jobs and reminders"],
    ];
    const lw = 3.9, gap = 0.5, rw = CW - lw - gap;
    s.addText("What goes wrong", { x: M, y: 1.45, w: lw, h: 0.35, fontSize: 14, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("How UniCareer fixes it", { x: M + lw + gap, y: 1.45, w: rw, h: 0.35, fontSize: 14, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    rows.forEach((r, i) => {
      const y = 1.95 + i * 1.0;
      card(pres, s, M, y, CW, 0.86, `Row ${i + 1}`);
      num(s, i + 1, M + 0.25, y + 0.22);
      s.addText(r[0], { x: M + 0.85, y, w: lw - 0.9, h: 0.86, fontSize: 20, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addShape(pres.shapes.RIGHT_ARROW, { x: M + lw + 0.05, y: y + 0.3, w: 0.32, h: 0.22, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: `Arrow ${i + 1}` });
      s.addText(r[1], { x: M + lw + gap, y, w: rw - 0.25, h: 0.86, fontSize: 20, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addNotes("Technical basis for Q&A: (1) canPostOpportunity allows verified STUDENT and ALUMNI; admins can reject or close posts (ADR-001, ADR-003). (2) Every post is COMMUNITY_SHARED and shows the poster (ADR-002). (3) Better Auth requireEmailVerification + admin review of MembershipRequest (ADR-007). (4) External application links; studentId/phone/proofDetails are redacted for other viewers (ADR-002, SECURITY). (5) Bookmarks, /applications tracker and /api/cron/reminders (deadlines in the next 72 hours). Note: jobs publish instantly; moderation happens after posting. The old resume upload API still exists in code but the app no longer uses it.");
  }

  // ---------- Slide 4: How it works ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "How it works in ", "three stages");
    const phases = [
      ["Get in", ["Sign up", "Confirm email", "Admin approves"]],
      ["Find and apply", ["Browse jobs", "Save jobs", "Apply on company site"]],
      ["Keep track", ["Track applications", "Ask for a referral", "Get reminders"]],
    ];
    const w = (CW - 2 * GUT) / 3;
    phases.forEach((ph, pi) => {
      const x = M + pi * (w + GUT), y = TOP - 0.15;
      card(pres, s, x, y, w, 5.0, `Stage ${pi + 1}`, TINTS[pi]);
      s.addText([{ text: `${String(pi + 1).padStart(2, "0")}  `, options: { color: HEX.accent1 } }, { text: ph[0], options: { color: HEX.dk1 } }], { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: 0.5, fontSize: 22, bold: true, margin: 0, valign: "middle", isTextBox: true });
      ph[1].forEach((st, si) => {
        const sy = y + 0.95 + si * 1.3;
        card(pres, s, x + 0.25, sy, w - 0.5, 1.12, `Step ${pi * 3 + si + 1}`);
        s.addText(st, { x: x + 0.5, y: sy, w: w - 1.0, h: 1.12, fontSize: 20, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      });

    });
    s.addNotes("Pages: /register, /verify-email, /onboarding, /opportunities, /opportunities/saved, /applications, /referrals, /notifications. Applications are limited to 30 per hour per user. Reminders look at deadlines in the next 72 hours.");
  }

  // ---------- Slides 5–6: What people can do ----------
  const canDo = (plain, accent, items, note) => {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, plain, accent);
    const w = (CW - GUT) / 2, h = 2.3;
    items.forEach((it, i) => {
      const x = M + (i % 2) * (w + GUT), y = 1.55 + Math.floor(i / 2) * (h + GUT);
      card(pres, s, x, y, w, h, `Story ${i + 1}`);
      s.addText(it[0], { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.35, fontSize: 14, bold: true, color: HEX.accent2, margin: 0, valign: "top", isTextBox: true });
      s.addText([
        { text: "I want to ", options: { color: HEX.dk2 } },
        { text: it[1], options: { bold: true, color: HEX.dk1 } },
      ], { x: x + 0.35, y: y + 0.72, w: w - 0.7, h: 0.75, fontSize: 24, margin: 0, valign: "top", isTextBox: true });
      s.addText([
        { text: "so that ", options: { color: HEX.dk2 } },
        { text: it[2], options: { color: HEX.accent1 } },
      ], { x: x + 0.35, y: y + 1.68, w: w - 0.7, h: 0.45, fontSize: 20, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes(note);
  };

  canDo("What ", "students can do", [
    ["AS A STUDENT", "find trusted jobs", "I avoid fake offers"],
    ["AS A STUDENT", "track my applications", "nothing gets lost"],
    ["AS A STUDENT", "ask an alumnus for a referral", "I get noticed"],
    ["AS A STUDENT", "get deadline reminders", "I never miss one"],
  ], "A student can only track each job once (unique opportunityId + applicantId). Applications are visible only to the student and admins. Reminders cover deadlines in the next 72 hours.");

  canDo("What alumni and ", "admins can do", [
    ["AS AN ALUMNUS", "share job openings", "juniors hear early"],
    ["AS AN ALUMNUS", "answer referrals by app or email", "I help people I trust"],
    ["AS AN ADMIN", "approve new members", "only real JnU people join"],
    ["AS AN ADMIN", "remove fake job posts", "students stay safe"],
  ], "Posting rights: verified STUDENT and ALUMNI (canPostOpportunity). Nobody can request a referral from themselves. Every admin action is saved in admin_audit_logs (16 action types).");
};
