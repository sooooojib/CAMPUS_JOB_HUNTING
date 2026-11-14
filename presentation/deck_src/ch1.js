const T = require("./theme_config");
const { HEX, TINTS, W, M, CW, GUT, TOP, FS, header, intro, card, num, pill } = T;
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
    { text: "Junior FinTech Backend Engineer", options: { bold: true, fontSize: compact ? 16 : 19, color: HEX.dk1, breakLine: true } },
    { text: "bKash Limited  ·  Dhaka  ·  Full-time", options: { fontSize: compact ? 13 : 14, color: HEX.dk2 } },
  ], { x: x + pad + lg + 0.2, y: y + pad - 0.05, w: w - lg - pad * 2 - 0.2, h: lg + 0.1, margin: 0, valign: "middle", isTextBox: true });
  if (compact) {
    pill(pres, s, "Shared by Sabrina Rahman, verified alumna", x + pad, y + h - 0.45, 3.9, HEX.accent5, HEX.accent2);
    s.addText("2 days left", { x: x + pad + 4.0, y: y + h - 0.45, w: w - pad * 2 - 4.0, h: 0.32, fontSize: 13, bold: true, color: HEX.accent1, align: "right", valign: "middle", margin: 0, isTextBox: true });
    return;
  }
  pill(pres, s, "Shared by Sabrina Rahman, verified alumna", x + 0.3, y + 1.25, Math.min(4.1, w - 0.6), HEX.accent5, HEX.accent2);
  s.addText([
    { text: "BDT 75,000 – 95,000 a month", options: { fontSize: 14, color: HEX.dk1, breakLine: true } },
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

  // ---------- Slide 1: Cover ----------
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: SEC });
    s.addText("Jagannath University", { x: M, y: 0.8, w: 6, h: 0.4, fontSize: 16, bold: true, color: HEX.accent2, margin: 0, valign: "top", isTextBox: true });
    s.addText([{ text: "UniCareer\n", options: {} }, { text: "Community", options: { color: HEX.accent1 } }], { x: M, y: 1.45, w: 6.6, h: 2.0, fontSize: 56, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true, charSpacing: -0.5 });
    s.addText("Trusted jobs and referrals for JnU students and alumni.", { x: M, y: 3.6, w: 6.2, h: 1.0, fontSize: 20, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });

    const info = [["Course", "[Course name and code]"], ["Teacher", "[Teacher's name]"], ["Presented by", "[Team members and IDs]"]];
    const iw = (CW - 2 * GUT) / 3;
    info.forEach((r, i) => {
      const x = M + i * (iw + GUT);
      s.addShape(pres.shapes.LINE, { x, y: 5.85, w: iw, h: 0, line: { color: HEX.accent6, width: 1 }, objectName: `Info rule ${i + 1}` });
      s.addText([
        { text: r[0], options: { fontSize: 13, bold: true, color: HEX.accent2, breakLine: true } },
        { text: r[1], options: { fontSize: 16, color: HEX.dk1 } },
      ], { x, y: 6.0, w: iw, h: 0.7, margin: 0, valign: "top", isTextBox: true });
    });

    // Right: what the app actually looks like
    jobCard(pres, s, 7.55, 1.2, 5.1);
    card(pres, s, 8.35, 4.45, 4.3, 0.95, "App mock: reminder");
    s.addText([
      { text: "Reminder", options: { fontSize: 13, bold: true, color: HEX.accent1, breakLine: true } },
      { text: "Your saved bKash job closes soon", options: { fontSize: 14, color: HEX.dk1 } },
    ], { x: 8.6, y: 4.53, w: 3.9, h: 0.8, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("Cover. The card on the right is drawn from a real job in the demo data (bKash, shared by alumna Sabrina Rahman). Fill in course, teacher and team before presenting. Live site: jnujobhunting.vercel.app");
  }

  // ---------- Slide 2: The problem ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Why job hunting at JnU is ", "hard today");
    intro(s, "906,000 unemployed graduates in Bangladesh (2023)");
    const people = [
      ["Farhan", "Student", "Can't tell which jobs are real"],
      ["Tariqul", "Alumnus at Databricks", "No trusted place to help juniors"],
      ["Arthur", "Admin", "Must keep fake accounts out"],
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
    const good = ["Shared by a checked alumna", "Apply on the company site", "Deadline reminder"];
    good.forEach((t, i) => {
      marker(pres, s, rx + 0.1, by + 2.08 + i * 0.42, HEX.accent2, `good ${i + 1}`);
      s.addText(t, { x: rx + 0.4, y: by + 1.95 + i * 0.42, w: bw - 0.5, h: 0.4, fontSize: 16, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addNotes("Source for 906,000: Dhaka Tribune, citing BBS Labour Force Survey 2023 (799,000 in 2022). https://www.dhakatribune.com/bangladesh/415371/graduate-unemployment-reaches-906-000-amid-skills  Extra facts for Q&A: Lever data via SHRM (2016) shows referred applicants are hired 1 in 16 vs 1 in 152 from job boards. The Business Standard (Sep 2023) reports CID warnings about fake work-from-home job offers to students. The left card is an illustrative example of a typical scam post; the right card uses real demo data from prisma/seed.ts.");
  }

  // ---------- Slide 3: Problem -> fix ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What goes wrong, and ", "how we fix it");
    const rows = [
      ["Fake job posts", "Only checked members can post"],
      ["Unknown posters", "Every job shows who shared it"],
      ["Fake accounts", "Email and student ID check"],
      ["CVs sent to strangers", "Apply on the company's own site"],
      ["Missed deadlines", "Saved jobs and reminders"],
    ];
    const lw = 3.9, gap = 0.5, rw = CW - lw - gap;
    s.addText("What goes wrong", { x: M, y: 1.45, w: lw, h: 0.35, fontSize: 14, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("How UniCareer fixes it", { x: M + lw + gap, y: 1.45, w: rw, h: 0.35, fontSize: 14, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    rows.forEach((r, i) => {
      const y = 1.9 + i * 0.97;
      card(pres, s, M, y, CW, 0.82, `Row ${i + 1}`);
      num(s, i + 1, M + 0.25, y + 0.22);
      s.addText(r[0], { x: M + 0.85, y, w: lw - 0.9, h: 0.82, fontSize: 20, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addShape(pres.shapes.RIGHT_ARROW, { x: M + lw + 0.05, y: y + 0.3, w: 0.32, h: 0.22, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: `Arrow ${i + 1}` });
      s.addText(r[1], { x: M + lw + gap, y, w: rw - 0.25, h: 0.82, fontSize: 20, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addNotes("Technical basis for Q&A: (1) canPostOpportunity allows verified STUDENT and ALUMNI; admins can reject or close posts (ADR-001, ADR-003). (2) Every post is COMMUNITY_SHARED and shows the poster (ADR-002). (3) Better Auth requireEmailVerification + admin review of MembershipRequest (ADR-007). (4) External application links; studentId/phone/proofDetails are redacted for other viewers (ADR-002, SECURITY). (5) Bookmarks, /applications tracker and /api/cron/reminders (deadlines in the next 72 hours). Note: jobs publish instantly; moderation happens after posting. The old resume upload API still exists in code but the app no longer uses it.");
  }

  // ---------- Slide 4: How it works ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "How it works in ", "three stages");
    const phases = [
      ["Get in", ["Sign up", "Confirm email", "Get approved"]],
      ["Find and apply", ["Browse jobs", "Save favourites", "Apply on company site"]],
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
    ["AS AN ALUMNUS", "answer referral requests", "I help people I trust"],
    ["AS AN ADMIN", "approve new members", "only real JnU people join"],
    ["AS AN ADMIN", "remove fake job posts", "students stay safe"],
  ], "Posting rights: verified STUDENT and ALUMNI (canPostOpportunity). Nobody can request a referral from themselves. Every admin action is saved in admin_audit_logs (16 action types).");
};
