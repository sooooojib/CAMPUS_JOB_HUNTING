const T = require("./theme_config");
const { HEX, TINTS, W, M, CW, GUT, TOP, FS, header, intro, card, num, badge, pill } = T;
const SEC = "Chapter 2 — Requirements & Comparison";

module.exports = function ch2(pres) {
  pres.addSection({ title: SEC });

  // ---------- Slide 7: One quality goal drives many features ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "One goal shapes ", "many features");
    // goal card (left)
    card(pres, s, M, TOP, 4.6, 4.5, "Quality goal", HEX.accent4);
    s.addText("QUALITY GOAL", { x: M + 0.4, y: TOP + 0.4, w: 3.8, h: 0.3, fontSize: 13, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
    s.addText("Only real JnU people get in, and their data stays private", { x: M + 0.4, y: TOP + 0.85, w: 3.8, h: 2.2, fontSize: 28, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
    s.addText("non-functional requirement", { x: M + 0.4, y: TOP + 3.75, w: 3.8, h: 0.35, fontSize: 14, color: HEX.dk2, margin: 0, isTextBox: true });
    // features (right)
    const feats = ["Email check before login", "Admin approves every member", "Phone and student ID hidden", "Apply on the company's own site"];
    const fx = M + 4.6 + 0.9, fw = CW - 4.6 - 0.9;
    s.addText("FEATURES IT CREATES", { x: fx, y: TOP, w: fw, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    feats.forEach((f, i) => {
      const y = TOP + 0.45 + i * 1.02;
      card(pres, s, fx, y, fw, 0.85, `Feature ${i + 1}`);
      num(s, i + 1, fx + 0.3, y + 0.24);
      s.addText(f, { x: fx + 0.95, y, w: fw - 1.2, h: 0.85, fontSize: 20, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
    });
    s.addShape(pres.shapes.RIGHT_ARROW, { x: M + 4.68, y: TOP + 2.05, w: 0.7, h: 0.4, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Goal to features arrow" });
    s.addText("functional requirements", { x: fx, y: TOP + 4.6, w: fw, h: 0.3, fontSize: 14, color: HEX.dk2, margin: 0, isTextBox: true });
    s.addNotes("Point: a non-functional requirement (trust and privacy) drives several functional requirements. Code: Better Auth requireEmailVerification (ADR-007); admin review of MembershipRequest; getPublicProfile redacts studentId, phone, proofDetails; external application links (ADR-002).");
  }

  // ---------- Slides 8–9: Functional requirements ----------
  const frSlide = (plain, accent, items, startN, note) => {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, plain, accent);
    intro(s, "Functional requirements");
    const w = (CW - 2 * GUT) / 3, h = 2.35;
    items.forEach((it, i) => {
      const x = M + (i % 3) * (w + GUT), y = 1.75 + Math.floor(i / 3) * (h + GUT);
      card(pres, s, x, y, w, h, `FR-${startN + i}`);
      s.addText(`FR-${startN + i}`, { x: x + 0.3, y: y + 0.28, w: 1.2, h: 0.3, fontSize: 13, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
      s.addText(it[0], { x: x + 0.3, y: y + 0.62, w: w - 0.6, h: 0.45, fontSize: 21, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(it[1], { x: x + 0.3, y: y + 1.18, w: w - 0.6, h: 1.0, fontSize: 16, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes(note);
  };

  frSlide("What the system ", "must do (1/2)", [
    ["Sign up", "University email, student ID, department. Strong password: 8+ characters"],
    ["Email check", "Confirm the email link, then wait for admin approval"],
    ["Member approval", "Admin approves or rejects. An email tells you which"],
    ["Post a job", "Approved students and alumni only. Goes live right away"],
    ["Find jobs", "Search and filter by type, office or remote, department"],
    ["Apply and track", "Apply on the company site. One record per job"],
  ], 1, "Exact rules: password min 8 chars with uppercase, number and symbol (Zod, client and server). Unverified login returns 403 EMAIL_NOT_VERIFIED. Since 14 Nov, clicking the email link puts the member in the admin queue (afterEmailVerification hook) and login stays blocked until approval ('Awaiting Administrator Approval'; the dashboard layout redirects to /login?error=pending_admin_approval). Approval sends 'Your UniCareer Community Account has been Approved!'; rejection sends an email with the reason. MembershipRequest PENDING → VERIFIED/REJECTED with rejectionReason. canPostOpportunity: verified STUDENT/ALUMNI; status set to APPROVED on submit. Opportunity list: 12 per page. Applications: unique (opportunityId, applicantId); 30 per hour rate limit; verification requests 10 per 10 minutes.");

  frSlide("What the system ", "must do (2/2)", [
    ["Community feed", "Post, like, comment and save. Posts are 10 to 5,000 characters"],
    ["Report posts", "A post reported 3 times is flagged for admins"],
    ["Referrals", "Students send a short pitch. Alumni accept or decline"],
    ["Reminders", "Alerts before a saved job's deadline"],
    ["Admin tools", "Approve members, suspend accounts, handle reports"],
    ["Activity log", "Every admin action is saved: who, what and when"],
  ], 7, "Exact rules: post length 10–5,000 chars; ContentReport ≥ 3 → ModerationStatus FLAGGED; self-referral blocked; /api/cron/reminders covers deadlines in the next 72 hours, de-duplicated via DeadlineReminderLog; admins cannot suspend themselves; AdminAuditLog stores admin, action (16 types), target, reason and IP address.");

  // ---------- Slide 10: Non-functional requirements ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "How well it ", "must work");
    intro(s, "Non-functional requirements");
    const cols = [
      ["Product", [["Safe", "Private data hidden from other members"], ["Reliable", "193 automated tests, all passing"], ["Easy to use", "Works on phone and laptop"]]],
      ["Organisation", [["Standard tools", "Next.js and PostgreSQL"], ["Documented", "A written report for every build stage"], ["Online", "Live at jnujobhunting.vercel.app"]]],
      ["Outside rules", [["Privacy", "Student ID and phone never shown publicly"], ["University only", "Only JnU members can join"], ["Real email", "Messages sent through Gmail"]]],
    ];
    const w = (CW - 2 * GUT) / 3;
    cols.forEach((c, ci) => {
      const x = M + ci * (w + GUT), y = 1.75;
      card(pres, s, x, y, w, 4.95, `NFR group ${ci + 1}`, TINTS[ci]);
      s.addText([{ text: `${String(ci + 1).padStart(2, "0")}  `, options: { color: HEX.accent1 } }, { text: c[0], options: { color: HEX.dk1 } }], { x: x + 0.3, y: y + 0.25, w: w - 0.6, h: 0.45, fontSize: 22, bold: true, margin: 0, valign: "middle", isTextBox: true });
      c[1].forEach((it, ii) => {
        const iy = y + 0.9 + ii * 1.3;
        card(pres, s, x + 0.25, iy, w - 0.5, 1.12, `NFR ${ci + 1}.${ii + 1}`);
        s.addText([
          { text: it[0], options: { bold: true, fontSize: 19, color: HEX.dk1, breakLine: true } },
          { text: it[1], options: { fontSize: 15, color: HEX.dk2 } },
        ], { x: x + 0.45, y: iy + 0.08, w: w - 0.9, h: 0.96, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 3 });
      });
    });
    s.addNotes("Product: redaction of studentId/phone/proofDetails; 193/193 Vitest tests in 16 files, tsc and ESLint 0 errors; responsive layout, WCAG 2.1 AA contrast, light/dark/system themes. Organisation: Next.js 16, React 19, TypeScript, Prisma 7, PostgreSQL 16 on Neon; docs/stages has a report per stage; deployed on Vercel. External: privacy rules in SECURITY_AND_PRIVACY.md; JnU-only membership via admin verification; Gmail SMTP via Nodemailer (ADR-008).");
  }

  // ---------- Slide 11: Comparison ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "UniCareer vs. ", "other job sources");
    const tools = ["UniCareer", "LinkedIn", "Bdjobs", "Facebook job groups"];
    const rows = [
      ["Only checked JnU members", ["Yes", "No", "No", "No"]],
      ["See who shared each job", ["Yes", "Yes", "Yes", "Often not"]],
      ["Ask alumni for a referral", ["Yes", "Partly", "No", "Partly"]],
      ["Fake posts removed by admins", ["Yes", "Partly", "Partly", "Rarely"]],
      ["Free for students", ["Yes", "Yes", "Yes", "Yes"]],
    ];
    const lw = 3.9, cw = (CW - lw) / 4, y0 = 1.65, rh = 0.88;
    tools.forEach((t, i) => {
      const x = M + lw + i * cw;
      if (i === 0) card(pres, s, x + 0.05, y0 - 0.1, cw - 0.1, 0.65 + rows.length * rh + 0.15, "UniCareer column", HEX.accent4);
      s.addText(t, { x, y: y0, w: cw, h: 0.5, fontSize: 17, bold: true, color: i === 0 ? HEX.accent1 : HEX.dk1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    });
    rows.forEach((r, ri) => {
      const y = y0 + 0.65 + ri * rh;
      s.addShape(pres.shapes.LINE, { x: M, y, w: CW, h: 0, line: { color: HEX.accent6, width: 1 }, objectName: `Row line ${ri + 1}` });
      s.addText(r[0], { x: M, y, w: lw - 0.2, h: rh, fontSize: 18, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      r[1].forEach((v, vi) => {
        const x = M + lw + vi * cw;
        const style = v === "Yes" ? [HEX.accent5, HEX.accent2] : v === "No" ? [HEX.lt1, HEX.dk2] : [HEX.accent3, HEX.dk1];
        pill(pres, s, v, x + (cw - 1.3) / 2, y + (rh - 0.38) / 2, 1.3, style[0], style[1], 14);
      });
    });
    s.addNotes("Comparison is based on how each service generally works, not a formal audit. LinkedIn: open to anyone; referrals happen through personal messages; free with paid Premium. Bdjobs: Bangladesh's largest open job portal (free, with paid Pro plans at 99–199 BDT/month, per Future Startup, May 2024); employers post jobs, no alumni referral feature. Facebook groups: anyone can post; moderation depends on group admins. Handshake (US/Europe university job network, free for students) is not used in Bangladesh, so it is left out. Sources: https://futurestartup.com/2024/05/28/bdjobs-pro-radically-improving-job-search-experience-and-career-prospects-for-job-seekers-in-bangladesh/ ; https://joinhandshake.co.uk/blog/careers-services/about-handshake-discover-our-business-model-and-why-we-are-trusted-by-over-1500-universities-worldwide");
  }

  // ---------- Slide 12: Where we stand out ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What makes UniCareer ", "different");
    const items = [
      ["Only JnU members", "Every account is checked"],
      ["Clear job source", "Every job shows who shared it"],
      ["Built-in referrals", "Ask alumni directly"],
      ["Safe applying", "Apply on the company site"],
      ["Clean feed", "Admins remove fake posts"],
      ["Never miss a date", "Deadline reminders"],
    ];
    const w = (CW - 2 * GUT) / 3, h = 2.3;
    items.forEach((it, i) => {
      const x = M + (i % 3) * (w + GUT), y = 1.6 + Math.floor(i / 3) * (h + GUT);
      card(pres, s, x, y, w, h, `Strength ${i + 1}`);
      num(s, i + 1, x + 0.3, y + 0.3);
      s.addText(it[0], { x: x + 0.3, y: y + 0.85, w: w - 0.6, h: 0.5, fontSize: 23, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(it[1], { x: x + 0.3, y: y + 1.45, w: w - 0.6, h: 0.5, fontSize: 17, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes("Design decisions behind these: ADR-001 (single account for students and alumni), ADR-002 (community-shared posts with external apply), ADR-007 (verify email first), admin moderation and audit log (Stage 13), reminders (Stage 12).");
  }

  // ---------- Slide 13: What matters most (priority) ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What matters ", "most");
    const cols = [
      ["Must have", HEX.accent1, HEX.lt1, ["Sign up and email check", "Member approval", "Post and find jobs", "Apply and track"]],
      ["Should have", HEX.accent2, HEX.lt1, ["Alumni referrals", "Deadline reminders", "Report fake posts"]],
      ["Could have", HEX.accent3, HEX.dk1, ["Likes and saved posts", "Contribution stats"]],
      ["Not now", HEX.card, HEX.dk2, ["Private chat", "CV upload", "Career fair tickets"]],
    ];
    const w = (CW - 3 * GUT) / 4;
    cols.forEach((c, ci) => {
      const x = M + ci * (w + GUT), y = 1.6;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.7, rectRadius: 0.12, fill: { color: c[1] }, line: { color: ci === 3 ? HEX.accent6 : c[1], width: 0.75 }, objectName: `Priority ${c[0]}` });
      s.addText(c[0], { x, y, w, h: 0.7, fontSize: 21, bold: true, color: c[2], align: "center", valign: "middle", margin: 0, isTextBox: true });
      c[3].forEach((it, ii) => {
        const iy = y + 0.9 + ii * 1.05;
        card(pres, s, x, iy, w, 0.88, `${c[0]} ${ii + 1}`);
        s.addText(it, { x: x + 0.25, y: iy, w: w - 0.5, h: 0.88, fontSize: 17, bold: ci < 2, color: ci === 3 ? HEX.dk2 : HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      });
    });
    s.addNotes("Priority uses the MoSCoW method (Must, Should, Could, Won't for now). Must = the core loop without which the product has no value (FR-1 to FR-6). Should = strong value but the app still works without them (FR-8 to FR-10). Could = nice extras (likes, bookmarks, /contributions). Not now = deliberately deferred: private messaging (AGENTS.md), CV upload (removed in favour of external apply, ADR-002), career fair ticketing (KNOWN_ISSUES). Adjust if your team prioritised differently.");
  }

  // ---------- Slide 14: Requirements you can see in the app ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Requirements you can ", "see in the app");
    const w = (CW - 2 * GUT) / 3, y = 1.6, mh = 2.75;
    const labels = [
      ["FR-2", "No login until an admin approves you"],
      ["FR-4", "Every job shows who shared it"],
      ["FR-10", "A reminder before the deadline"],
    ];
    labels.forEach((l, i) => {
      const x = M + i * (w + GUT);
      card(pres, s, x, y, w, mh, `Screen area ${i + 1}`, HEX.accent3);
      s.addText(l[0], { x, y: y + mh + 0.3, w, h: 0.32, fontSize: 14, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
      s.addText(l[1], { x, y: y + mh + 0.65, w, h: 0.8, fontSize: 20, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
    });
    // Mock 1: login form with warning
    {
      const x = M + 0.3, iw = w - 0.6;
      card(pres, s, x, y + 0.3, iw, 2.15, "Mock login form");
      s.addText("Log in", { x: x + 0.25, y: y + 0.42, w: iw - 0.5, h: 0.35, fontSize: 16, bold: true, color: HEX.dk1, margin: 0, isTextBox: true });
      ["farhan@jnu.ac.bd", "••••••••"].forEach((t, k) => {
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.85 + k * 0.45, w: iw - 0.5, h: 0.36, rectRadius: 0.06, fill: { color: HEX.lt1 }, line: { color: HEX.accent6, width: 0.75 }, objectName: `Mock field ${k + 1}` });
        s.addText(t, { x: x + 0.37, y: y + 0.85 + k * 0.45, w: iw - 0.7, h: 0.36, fontSize: 12, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
      });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 1.8, w: iw - 0.5, h: 0.5, rectRadius: 0.06, fill: { color: HEX.accent4 }, line: { color: HEX.accent4, width: 0 }, objectName: "Mock warning" });
      s.addText("Awaiting admin approval", { x: x + 0.35, y: y + 1.8, w: iw - 0.7, h: 0.5, fontSize: 13, bold: true, color: HEX.accent1, margin: 0, valign: "middle", isTextBox: true });
    }
    // Mock 2: job card
    {
      const x = M + w + GUT + 0.3, iw = w - 0.6;
      card(pres, s, x, y + 0.3, iw, 2.15, "Mock job card");
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: y + 0.5, w: 0.6, h: 0.6, rectRadius: 0.1, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: "Mock logo" });
      s.addText("bK", { x: x + 0.25, y: y + 0.5, w: 0.6, h: 0.6, fontSize: 15, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText([{ text: "Junior Backend Engineer", options: { bold: true, fontSize: 14, color: HEX.dk1, breakLine: true } }, { text: "bKash Limited · Dhaka", options: { fontSize: 12, color: HEX.dk2 } }], { x: x + 1.0, y: y + 0.45, w: iw - 1.2, h: 0.7, margin: 0, valign: "middle", isTextBox: true });
      pill(pres, s, "Shared by Sabrina (alumna)", x + 0.25, y + 1.35, iw - 0.5, HEX.accent5, HEX.accent2, 12);
      pill(pres, s, "Apply on company website", x + 0.25, y + 1.85, iw - 0.5, HEX.accent1, HEX.lt1, 12);
    }
    // Mock 3: notifications
    {
      const x = M + 2 * (w + GUT) + 0.3, iw = w - 0.6;
      card(pres, s, x, y + 0.3, iw, 2.15, "Mock notifications");
      s.addText("Notifications", { x: x + 0.25, y: y + 0.42, w: iw - 0.5, h: 0.35, fontSize: 16, bold: true, color: HEX.dk1, margin: 0, isTextBox: true });
      const rows = [["Your saved bKash job closes in 2 days", true], ["Tariqul accepted your referral request", false]];
      rows.forEach((r, k) => {
        const ry = y + 0.9 + k * 0.72;
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: ry, w: iw - 0.5, h: 0.6, rectRadius: 0.06, fill: { color: r[1] ? HEX.accent4 : HEX.lt2 }, line: { color: r[1] ? HEX.accent4 : HEX.lt2, width: 0 }, objectName: `Mock notification ${k + 1}` });
        s.addText(r[0], { x: x + 0.37, y: ry, w: iw - 0.7, h: 0.6, fontSize: 12, bold: r[1], color: r[1] ? HEX.accent1 : HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      });
    }
    s.addNotes("These are simplified drawings of real screens, not screenshots. FR-2: Better Auth blocks sign-in with EMAIL_NOT_VERIFIED until the link is clicked (ADR-007). FR-4: every opportunity is COMMUNITY_SHARED and shows the poster (ADR-002); data from prisma/seed.ts. FR-10: /api/cron/reminders sends de-duplicated alerts for saved jobs closing within 72 hours; referral responses also trigger notifications (REFERRAL_RESPONSE). Swap in real screenshots later if you prefer.");
  }
};
