const T = require("./theme_config");
const { HEX, MONO, M, CW, GUT, TOP, badge, card, header, calloutStrip, tableOpts, TH } = T;
const SEC = "Chapter 1 — Opening, Problem & Workflow";

module.exports = function ch1(pres) {
  pres.addSection({ title: SEC });

  // ---------- Slide 1: Cover ----------
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: SEC });
    s.addText("JAGANNATH UNIVERSITY  ·  DEPT. OF CSE", { placeholder: "kicker" });
    s.addText("UniCareer Community", { placeholder: "title" });
    s.addText("A verified career, referral and opportunity network for the JnU community", { placeholder: "subtitle" });

    const rows = [
      ["COURSE", "[Course name · Course code]"],
      ["INSTRUCTOR", "[Instructor name, designation]"],
      ["PRESENTED BY", "[Team member names · Student IDs]"],
      ["LIVE", "jnujobhunting.vercel.app"],
    ];
    rows.forEach((r, i) => {
      const y = 4.35 + i * 0.5;
      s.addText(r[0], { x: M, y, w: 1.9, h: 0.4, fontFace: MONO, fontSize: 10, bold: true, color: HEX.accent5, margin: 0, valign: "middle", isTextBox: true, charSpacing: 1 });
      s.addText(r[1], { x: M + 1.9, y, w: 6.2, h: 0.4, fontFace: i === 3 ? MONO : undefined, fontSize: 15, color: HEX.lt1, margin: 0, valign: "middle", isTextBox: true });
    });

    // Right: three key figures in a Swiss grid
    const figs = [["6", "membership types,\none account model"], ["30", "PostgreSQL models,\n28 enums"], ["193", "automated tests,\nall passing"]];
    figs.forEach((f, i) => {
      const y = 0.95 + i * 1.95;
      s.addShape(pres.shapes.LINE, { x: 9.35, y, w: 3.38, h: 0, line: { color: "334155", width: 1 }, objectName: `Figure rule ${i + 1}` });
      s.addText(f[0], { x: 9.35, y: y + 0.12, w: 3.38, h: 0.95, fontSize: 54, bold: true, color: HEX.lt1, margin: 0, valign: "top", isTextBox: true, charSpacing: -0.5 });
      s.addText(f[1], { x: 9.35, y: y + 1.07, w: 3.38, h: 0.65, fontSize: 13, color: HEX.accent6, margin: 0, valign: "top", isTextBox: true });
    });
    s.addText("Next.js 16  ·  PostgreSQL 16 (Neon)  ·  Prisma 7  ·  Better Auth  ·  2026", { x: M, y: 6.75, w: 9, h: 0.3, fontFace: MONO, fontSize: 10, color: HEX.accent5, margin: 0, isTextBox: true });
    s.addNotes("Cover. Fill in course, instructor and team details before presenting. Figures come from prisma/schema.prisma (30 models, 28 enums) and docs/FINAL_TEST_REPORT.md (193/193 tests).");
  }

  // ---------- Slide 2: Personas + cited stats ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "01  ·  THE PROBLEM", "Four People, One Broken Campus Hiring Loop");
    const people = [
      ["FA", "Farhan Ahmed", "CSE student · CGPA 3.88", "Cannot tell which job posts are real, or whether he is even eligible."],
      ["TI", "Tariqul Islam", "Alumnus · Databricks", "Wants to refer juniors, but has no trusted channel to vet them."],
      ["SJ", "Sarah Jenkins", "Recruiter · Vercel", "Needs verified JnU talent, not thousands of unscreened CVs."],
      ["AV", "Dean Arthur Vance", "Platform administrator", "Must keep fake jobs, spam and student data leaks out."],
    ];
    const w = (CW - 3 * GUT) / 4, y = TOP, h = 2.45;
    people.forEach((p, i) => {
      const x = M + i * (w + GUT);
      card(pres, s, x, y, w, h, `Persona ${i + 1}`);
      s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: HEX.dk1 }, line: { color: HEX.dk1 }, objectName: `Persona avatar ${i + 1}` });
      s.addText(p[0], { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, fontFace: MONO, fontSize: 13, bold: true, color: HEX.lt1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(p[1], { x: x + 0.25, y: y + 0.98, w: w - 0.5, h: 0.32, fontSize: 15, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(p[2], { x: x + 0.25, y: y + 1.3, w: w - 0.5, h: 0.28, fontFace: MONO, fontSize: 10, color: HEX.accent1, margin: 0, valign: "top", isTextBox: true });
      s.addText(p[3], { x: x + 0.25, y: y + 1.65, w: w - 0.5, h: 0.7, fontSize: 12, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });

    const stats = [
      ["906,000", "unemployed graduates in Bangladesh, 2023", "BBS Labour Force Survey 2023, via Dhaka Tribune"],
      ["1 in 16", "referred applicants hired, vs 1 in 152 from job boards", "Lever hiring data, via SHRM (2016)"],
      ["Tk 2,000/day", "fake work-from-home offers sent to students by SMS and WhatsApp", "CID Cyber Police, via TBS (Sep 2023)"],
    ];
    const sw = (CW - 2 * GUT) / 3, sy = 4.5;
    stats.forEach((st, i) => {
      const x = M + i * (sw + GUT);
      s.addShape(pres.shapes.RECTANGLE, { x, y: sy, w: sw, h: 0.03, fill: { color: HEX.dk1 }, line: { color: HEX.dk1, width: 0 }, objectName: `Stat rule ${i + 1}` });
      s.addText(st[0], { x, y: sy + 0.12, w: sw, h: 0.72, fontSize: 36, bold: true, color: HEX.accent1, margin: 0, valign: "top", isTextBox: true, charSpacing: -0.5 });
      s.addText(st[1], { x, y: sy + 0.85, w: sw, h: 0.55, fontSize: 13, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(st[2], { x, y: sy + 1.45, w: sw, h: 0.3, fontFace: MONO, fontSize: 9, color: HEX.accent5, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes("Personas are the seeded demo accounts in prisma/seed.ts. Sources: (1) Dhaka Tribune, 'Graduate unemployment reaches 906,000', citing BBS Labour Force Survey 2023 (799,000 in 2022). https://www.dhakatribune.com/bangladesh/415371/graduate-unemployment-reaches-906-000-amid-skills  (2) SHRM, 'Lever Study Shows 1 in 100 Candidates Is Hired' (Oct 2016): referrals hired 1 in 16 vs 1 in 152. https://shrm.org/topics-tools/news/talent-acquisition/lever-study-shows-1-100-candidates-hired  (3) The Business Standard, 'Rise in work-from-home job scams in Bangladesh' (22 Sep 2023), CID Cyber Police comments; example offer Tk 2,000/day. https://www.tbsnews.net/node/705162");
  }

  // ---------- Slide 3: Problem -> Solution ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "02  ·  PROBLEM TO SOLUTION", "From Problem to Solution");
    const rows = [
      ["Fake or spam job posts", "Anyone can post, nothing is vetted", "Every post starts PENDING until an admin approves it", "ADR-003"],
      ["Unclear who is behind a post", "Leads look like official adverts", "OFFICIAL_EMPLOYER vs COMMUNITY_SHARED label", "ADR-002"],
      ["Anonymous or fake members", "No identity check", "Email verified before login, then registrar review", "ADR-007"],
      ["Applying to jobs you can't get", "CGPA and department rules hidden", "Eligibility check and explainable match %", "ADR-009"],
      ["CVs and student IDs leak", "Public uploads and profiles", "Private resume vault and field redaction", "SECURITY §14"],
    ];
    const head = [TH("PROBLEM"), TH("ROOT CAUSE"), TH("UNICAREER RESPONSE"), TH("DECISION"), TH("STATUS")];
    const body = rows.map((r) => [
      { text: r[0], options: { bold: true } },
      { text: r[1], options: { color: HEX.dk2 } },
      { text: r[2] },
      { text: r[3], options: { fontFace: MONO, fontSize: 10, color: HEX.accent1 } },
      { text: "DESIGNED", options: { fontFace: MONO, fontSize: 9, bold: true, color: HEX.accent1, fill: { color: HEX.accent2 }, align: "center" } },
    ]);
    s.addTable([head, ...body], tableOpts({ colW: [2.6, 2.75, 3.85, 1.43, 1.5], rowH: [0.45, 0.62, 0.62, 0.62, 0.62, 0.62] }));
    calloutStrip(pres, s, ["Trust is enforced on the server, not hidden in the UI", "Each fix traces to a recorded design decision", "All five responses are live and tested"]);
    s.addNotes("Each response maps to an Architecture Decision Record in docs/DECISIONS.md, or to section 14 of docs/SECURITY_AND_PRIVACY.md.");
  }

  // ---------- Slide 4: End-to-end workflow ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "03  ·  USER WORKFLOW", "End-to-End Workflow: Prepare, Act, Follow Up");
    const phases = [
      ["PREPARE", [["Register", "/register"], ["Verify email", "login blocked (403) until clicked"], ["Onboard and get verified", "/onboarding → admin review"]]],
      ["ACTION", [["Browse and filter jobs", "/opportunities · 12 filters"], ["Check eligibility and match", "CGPA · dept · year · skills"], ["Apply with resume", "PDF/DOCX ≤ 5 MB · 30 per hour"]]],
      ["AFTER", [["Track application status", "/applications · status history"], ["Request an alumni referral", "/referrals"], ["Get deadline reminders", "cron · next 72 hours"]]],
    ];
    const pw = (CW - 2 * 0.55) / 3, y = TOP;
    phases.forEach((ph, pi) => {
      const x = M + pi * (pw + 0.55);
      s.addText(ph[0], { x, y, w: pw, h: 0.4, fontFace: MONO, fontSize: 13, bold: true, color: pi === 1 ? HEX.lt1 : HEX.dk1, fill: { color: pi === 1 ? HEX.accent1 : HEX.accent6 }, align: "center", valign: "middle", margin: 0, isTextBox: true, charSpacing: 2 });
      ph[1].forEach((st, si) => {
        const n = pi * 3 + si + 1, sy = y + 0.6 + si * 1.15;
        card(pres, s, x, sy, pw, 1.0, `Step ${n}`);
        s.addText(String(n).padStart(2, "0"), { x: x + 0.2, y: sy + 0.15, w: 0.7, h: 0.7, fontFace: MONO, fontSize: 26, bold: true, color: HEX.accent1, margin: 0, valign: "middle", isTextBox: true });
        s.addText([
          { text: st[0], options: { bold: true, fontSize: 15, color: HEX.dk1, breakLine: true } },
          { text: st[1], options: { fontFace: MONO, fontSize: 10, color: HEX.accent5 } },
        ], { x: x + 0.95, y: sy + 0.12, w: pw - 1.1, h: 0.76, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 2 });
      });
      if (pi < 2) {
        s.addShape(pres.shapes.RIGHT_ARROW, { x: x + pw + 0.13, y: y + 0.07, w: 0.3, h: 0.26, fill: { color: HEX.accent5 }, line: { color: HEX.accent5 }, objectName: `Phase arrow ${pi + 1}` });
      }
    });
    calloutStrip(pres, s, ["No job is visible until the email and account are verified", "Every rule is checked again on the server", "Every status change is logged with a timestamp"], 5.95, 0.75);
    s.addNotes("Steps follow docs/ROUTES_AND_PAGES.md. Rate limit from lib/security/rate-limit.ts (applications: 30/hour). Reminder window from API_REFERENCE §8.3 (/api/cron/reminders, 72 h, de-duplicated).");
  }

  // ---------- Slides 5–6: User stories ----------
  const storySlide = (kicker, title, stories, note, callouts) => {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, kicker, title);
    const head = [TH("AS A"), TH("I WANT TO"), TH("SO THAT"), TH("MODULE")];
    const body = stories.map((r) => [
      { text: r[0], options: { bold: true } },
      { text: r[1] },
      { text: r[2], options: { color: HEX.dk2 } },
      { text: r[3], options: { fontFace: MONO, fontSize: 10, color: HEX.accent1 } },
    ]);
    s.addTable([head, ...body], tableOpts({ colW: [1.9, 4.1, 4.13, 2.0], rowH: [0.45, 0.72, 0.72, 0.72, 0.72] }));
    calloutStrip(pres, s, callouts);
    s.addNotes(note);
    return s;
  };

  storySlide("04  ·  USER STORIES", "User Stories: Students and Alumni", [
    ["Student", "see only jobs I'm eligible for, with a match %", "I stop wasting applications", "Career tools"],
    ["Student", "apply with a private resume and track its status", "my CV is never public", "Applications"],
    ["Alumnus", "share a job lead from my company", "juniors hear about roles early", "Opportunities"],
    ["Alumnus", "accept or decline referral requests", "I only vouch for people I trust", "Referrals"],
  ], "Rules: career tools are STUDENT-only (canAccessStudentTools). Verified students and alumni can post COMMUNITY_SHARED leads (canPostOpportunity). Self-referral is blocked.", ["Career tools are visible to STUDENT accounts only", "Alumni leads are labelled COMMUNITY_SHARED", "Nobody can request a referral from themselves"]);

  storySlide("04  ·  USER STORIES", "User Stories: Employers, Faculty and Admins", [
    ["Employer", "review applicants for my company's postings", "I shortlist verified JnU talent", "Applicant pipeline"],
    ["Faculty / Staff", "find alumni by department and employer", "I can connect students to mentors", "Directory"],
    ["Admin", "approve or reject jobs before they go live", "no fake jobs reach students", "Moderation"],
    ["Admin", "see every admin action in one log", "every decision can be audited", "Audit log"],
  ], "Employer review requires company affiliation (assertCanManageApplicantsForOpportunity) and the canReviewApplicants flag. Admin actions are written to admin_audit_logs (16 action types).", ["Employers see only their own company's applicants", "Every admin permission is checked on the server", "16 admin action types are written to the audit log"]);
};
