const T = require("./theme_config");
const { HEX, M, CW, GUT, TOP, card, header, calloutStrip, tableOpts, TH } = T;
const SEC = "Chapter 1 — Opening, Problem & Workflow";

module.exports = function ch1(pres) {
  pres.addSection({ title: SEC });

  // ---------- Slide 1: Cover ----------
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: SEC });
    s.addText("JAGANNATH UNIVERSITY", { placeholder: "kicker" });
    s.addText("UniCareer Community", { placeholder: "title" });
    s.addText("A trusted career and referral network for JnU students and alumni", { placeholder: "subtitle" });

    const info = [["Course", "[Course name · Course code]"], ["Instructor", "[Instructor name]"], ["Presented by", "[Team members · Student IDs]"]];
    info.forEach((r, i) => {
      const y = 5.45 + i * 0.42;
      s.addText(r[0], { x: M, y, w: 1.7, h: 0.36, fontSize: 12, color: "94A3B8", margin: 0, valign: "middle", isTextBox: true });
      s.addText(r[1], { x: M + 1.7, y, w: 6, h: 0.36, fontSize: 14, color: HEX.lt1, margin: 0, valign: "middle", isTextBox: true });
    });

    // Right panel text
    s.addText("Software Engineering\nProject Defense", { x: 9.15, y: 2.2, w: 3.6, h: 1.3, fontSize: 24, bold: true, color: HEX.lt1, margin: 0, valign: "top", isTextBox: true, charSpacing: -0.5 });
    s.addText("2026", { x: 9.15, y: 6.25, w: 3.6, h: 0.5, fontSize: 18, color: HEX.accent2, margin: 0, valign: "bottom", isTextBox: true });
    s.addNotes("Cover. Fill in course, instructor and team details before presenting. Live site: jnujobhunting.vercel.app");
  }

  // ---------- Slide 2: Personas + cited stats ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "THE PROBLEM", "Three People, One Broken Campus Hiring Loop");
    const people = [
      ["FA", "Farhan Ahmed", "Student · CSE", "Can't tell which job posts are real, or whether he is eligible to apply."],
      ["TI", "Tariqul Islam", "Alumnus · Databricks", "Wants to share openings and refer juniors, but has no trusted channel."],
      ["AV", "Arthur Vance", "Platform administrator", "Must keep fake members, spam posts and student data leaks out."],
    ];
    const w = (CW - 2 * GUT) / 3, y = TOP, h = 2.15;
    people.forEach((p, i) => {
      const x = M + i * (w + GUT);
      card(pres, s, x, y, w, h, `Persona ${i + 1}`);
      s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.3, w: 0.62, h: 0.62, fill: { color: HEX.accent2 }, line: { color: HEX.accent2 }, objectName: `Persona avatar ${i + 1}` });
      s.addText(p[0], { x: x + 0.3, y: y + 0.3, w: 0.62, h: 0.62, fontSize: 14, bold: true, color: HEX.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText([
        { text: p[1], options: { bold: true, fontSize: 16, color: HEX.dk1, breakLine: true } },
        { text: p[2], options: { fontSize: 12, color: HEX.accent5 } },
      ], { x: x + 1.12, y: y + 0.28, w: w - 1.35, h: 0.7, margin: 0, valign: "middle", isTextBox: true });
      s.addText(p[3], { x: x + 0.3, y: y + 1.15, w: w - 0.6, h: 0.8, fontSize: 13, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });

    const stats = [
      ["906,000", "unemployed graduates in Bangladesh in 2023", "Source: BBS Labour Force Survey 2023"],
      ["1 in 16", "referred applicants get hired, compared with 1 in 152 from job boards", "Source: Lever hiring data, reported by SHRM"],
      ["Tk 2,000 a day", "typical fake work-from-home offer sent to students", "Source: CID Cyber Police, The Business Standard"],
    ];
    const sy = 4.35, sh = 1.95;
    stats.forEach((st, i) => {
      const x = M + i * (w + GUT);
      s.addShape(pres.shapes.RECTANGLE, { x, y: sy, w, h: sh, fill: { color: HEX.accent2 }, line: { color: HEX.accent2 }, objectName: `Stat ${i + 1}` });
      s.addText(st[0], { x: x + 0.3, y: sy + 0.22, w: w - 0.6, h: 0.6, fontSize: 30, bold: true, color: HEX.accent1, margin: 0, valign: "top", isTextBox: true, charSpacing: -0.5 });
      s.addText(st[1], { x: x + 0.3, y: sy + 0.85, w: w - 0.6, h: 0.6, fontSize: 13, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(st[2], { x: x + 0.3, y: sy + 1.5, w: w - 0.6, h: 0.3, fontSize: 10, color: HEX.accent5, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes("Personas are seeded demo accounts in prisma/seed.ts. Sources: (1) Dhaka Tribune, 'Graduate unemployment reaches 906,000', citing BBS Labour Force Survey 2023 (799,000 in 2022). https://www.dhakatribune.com/bangladesh/415371/graduate-unemployment-reaches-906-000-amid-skills  (2) SHRM, 'Lever Study Shows 1 in 100 Candidates Is Hired' (Oct 2016): referrals hired 1 in 16 vs 1 in 152. https://shrm.org/topics-tools/news/talent-acquisition/lever-study-shows-1-100-candidates-hired  (3) The Business Standard, 'Rise in work-from-home job scams in Bangladesh' (22 Sep 2023), CID Cyber Police; example offer Tk 2,000/day. https://www.tbsnews.net/node/705162");
  }

  // ---------- Slide 3: Problem -> Solution ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "PROBLEM TO SOLUTION", "From Problem to Solution");
    const rows = [
      ["Fake or spam job posts", "Anyone can post on open groups", "Only verified students and alumni can post; admins can reject or close any post", "ADR-001"],
      ["No idea who shared a job", "Anonymous reposts", "Every post shows the verified member who shared it, labelled as a community lead", "ADR-002"],
      ["Fake or anonymous members", "No identity check", "Email verified before login, then admin review of the student ID", "ADR-007"],
      ["Applying to jobs you can't get", "Eligibility rules are hidden", "Eligibility check and a transparent skill match %", "ADR-009"],
      ["CVs collected by strangers", "Uploads to unknown posters", "Apply on the employer's official site; student ID and phone stay hidden", "ADR-002"],
    ];
    const head = [TH("PROBLEM"), TH("ROOT CAUSE"), TH("UNICAREER RESPONSE"), TH("DECISION"), TH("STATUS")];
    const body = rows.map((r) => [
      { text: r[0], options: { bold: true } },
      { text: r[1], options: { color: HEX.dk2 } },
      { text: r[2] },
      { text: r[3], options: { fontSize: 11, color: HEX.accent1 } },
      { text: "DESIGNED", options: { fontSize: 9, bold: true, color: HEX.accent1, fill: { color: HEX.accent2 }, align: "center", charSpacing: 1 } },
    ]);
    s.addTable([head, ...body], tableOpts({ colW: [2.55, 2.55, 4.35, 1.18, 1.5], rowH: [0.45, 0.66, 0.66, 0.66, 0.66, 0.66] }));
    calloutStrip(pres, s, ["Trust is enforced on the server, not just hidden in the UI", "Each response traces to a recorded design decision", "All five responses are live in the current build"], 5.95, 0.75);
    s.addNotes("Decisions are in docs/DECISIONS.md. Note for Q&A: opportunities now publish instantly (no pre-approval); admins moderate after publishing. The resume upload API (/api/resumes) still exists in the code although the UI no longer uses it.");
  }

  // ---------- Slide 4: End-to-end workflow ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "USER WORKFLOW", "End-to-End Workflow: Prepare, Act, Follow Up");
    const phases = [
      ["PREPARE", [["Register", "With university email, student ID and department"], ["Verify email", "Login stays locked until the link is clicked"], ["Get verified", "An admin approves the membership claim"]]],
      ["ACTION", [["Browse and filter jobs", "By type, workplace, department and CGPA"], ["Check eligibility", "See the match score and missing skills"], ["Apply", "On the employer's official website"]]],
      ["FOLLOW UP", [["Track applications", "Keep every application in one dashboard"], ["Ask for a referral", "Send a short pitch to an alumnus"], ["Get reminders", "Alerts before saved deadlines close"]]],
    ];
    const pw = (CW - 2 * 0.55) / 3, y = TOP;
    phases.forEach((ph, pi) => {
      const x = M + pi * (pw + 0.55);
      s.addText(ph[0], { x, y, w: pw, h: 0.42, fontSize: 12, bold: true, color: pi === 1 ? HEX.lt1 : HEX.dk1, fill: { color: pi === 1 ? HEX.accent1 : HEX.accent6 }, align: "center", valign: "middle", margin: 0, isTextBox: true, charSpacing: 2 });
      ph[1].forEach((st, si) => {
        const n = pi * 3 + si + 1, sy = y + 0.62 + si * 1.15;
        card(pres, s, x, sy, pw, 1.0, `Step ${n}`);
        s.addText(String(n), { x: x + 0.2, y: sy + 0.15, w: 0.55, h: 0.7, fontSize: 26, bold: true, color: HEX.accent1, margin: 0, valign: "middle", isTextBox: true });
        s.addText([
          { text: st[0], options: { bold: true, fontSize: 15, color: HEX.dk1, breakLine: true } },
          { text: st[1], options: { fontSize: 12, color: HEX.accent5 } },
        ], { x: x + 0.8, y: sy + 0.1, w: pw - 0.95, h: 0.8, margin: 0, valign: "middle", isTextBox: true, paraSpaceAfter: 2 });
      });
      if (pi < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + pw + 0.13, y: y + 0.08, w: 0.3, h: 0.26, fill: { color: HEX.accent5 }, line: { color: HEX.accent5 }, objectName: `Phase arrow ${pi + 1}` });
    });
    calloutStrip(pres, s, ["No job is visible until the account is verified", "Every rule is checked again on the server", "Applications are private to the student and admins"], 5.95, 0.75);
    s.addNotes("Routes: /register, /verify-email, /onboarding, /opportunities, /applications, /referrals. Reminders: /api/cron/reminders scans deadlines in the next 72 hours. Applications rate-limited to 30 per hour.");
  }

  // ---------- Slides 5–6: User stories ----------
  const storySlide = (title, stories, callouts, note) => {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "USER STORIES", title);
    const head = [TH("AS A"), TH("I WANT TO"), TH("SO THAT"), TH("MODULE")];
    const body = stories.map((r) => [
      { text: r[0], options: { bold: true } },
      { text: r[1] },
      { text: r[2], options: { color: HEX.dk2 } },
      { text: r[3], options: { fontSize: 11, color: HEX.accent1 } },
    ]);
    s.addTable([head, ...body], tableOpts({ colW: [1.9, 4.2, 4.03, 2.0], rowH: [0.45, 0.72, 0.72, 0.72, 0.72] }));
    calloutStrip(pres, s, callouts, 5.95, 0.75);
    s.addNotes(note);
  };

  storySlide("User Stories: Students", [
    ["Student", "see which jobs I qualify for with skill matches", "I stop wasting applications", "Opportunities"],
    ["Student", "apply on the official site and track it here", "all my applications are in one place", "Applications"],
    ["Student", "ask an alumnus at a company for a referral", "my application gets noticed", "Referrals"],
    ["Student", "track application deadlines and interview rounds", "I never miss a cutoff", "Calendar"],
  ], ["Opportunities show matching qualifications", "A student can apply to each job once", "Applications are private to the student and admins"],
  "Opportunities show skill overlap. Duplicate applications are blocked by a unique (opportunityId, applicantId) constraint.");

  storySlide("User Stories: Alumni and Admins", [
    ["Alumnus", "share a job opening from my company", "juniors hear about roles early", "Opportunities"],
    ["Alumnus", "accept or decline referral requests", "I only vouch for people I trust", "Referrals"],
    ["Admin", "approve or reject membership claims", "only real JnU members get in", "Verification"],
    ["Admin", "reject or close misleading job posts", "students only see genuine openings", "Moderation"],
  ], ["Only verified members can post jobs", "Nobody can request a referral from themselves", "Every admin action is written to the audit log"],
  "Posting: canPostOpportunity allows verified STUDENT and ALUMNI. Admin actions are logged in admin_audit_logs (16 action types).");
};
