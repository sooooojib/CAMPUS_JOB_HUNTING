const T = require("./theme_config");
const { HEX, TINTS, W, M, CW, GUT, header, intro, card, num, badge, pill } = T;
const SEC = "Chapter 6 — Testing and Evidence";

function strip(pres, s, items, y = 6.3) {
  const w = (CW - 2 * GUT) / 3;
  items.forEach((t, i) => {
    const x = M + i * (w + GUT);
    s.addText([{ text: `${String(i + 1).padStart(2, "0")}  `, options: { bold: true, color: HEX.accent1 } }, { text: t, options: { color: HEX.dk1 } }], { x, y, w, h: 0.42, fontSize: 15, margin: 0, valign: "middle", isTextBox: true });
  });
}

module.exports = function ch6(pres) {
  pres.addSection({ title: SEC });

  // ---------- 1: Test results ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "194 tests, ", "0 failures");
    const stats = [["194 / 194", "tests passed"], ["16", "test files"], ["0", "code errors (type check)"]];
    stats.forEach((st, i) => {
      const y = 1.6 + i * 1.5;
      card(pres, s, M, y, 3.6, 1.3, `Stat ${i + 1}`, TINTS[i]);
      s.addText(st[0], { x: M + 0.3, y: y + 0.15, w: 3.0, h: 0.65, fontSize: 34, bold: true, color: i === 0 ? HEX.accent1 : HEX.dk1, margin: 0, valign: "middle", isTextBox: true, charSpacing: -0.5 });
      s.addText(st[1], { x: M + 0.3, y: y + 0.8, w: 3.1, h: 0.38, fontSize: 15, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    const data = [
      ["Jobs and companies", 31], ["User journeys", 23], ["Community feed", 22], ["Skills and CGPA", 20],
      ["Applications", 17], ["Membership and approval", 16], ["Login and page guard", 16], ["Admin and moderation", 13],
      ["Referrals", 12], ["Alerts and calendar", 12], ["Setup and design", 12],
    ].reverse();
    card(pres, s, M + 3.9, 1.6, CW - 3.9, 4.35, "Chart card");
    s.addChart(pres.charts.BAR, [{ name: "Tests", labels: data.map((d) => d[0]), values: data.map((d) => d[1]) }], {
      x: M + 4.05, y: 1.68, w: CW - 4.25, h: 4.2, barDir: "bar",
      chartColors: [HEX.accent2], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 14, dataLabelFontBold: true, dataLabelFontFace: "+mn-lt",
      catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMaxVal: 36,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false,
      showTitle: true, title: "Tests per part of the app", titleFontSize: 14, titleColor: HEX.dk1, titleFontFace: "+mn-lt", barGapWidthPct: 40,
    });
    s.addNotes("Source: docs/TEST_RESULTS.md, run of 2026-11-14: 194/194 passing across 16 Vitest files, tsc --noEmit 0 errors. Counting the it() cases in tests/unit gives the same 194. Per area: companies-and-opportunities 17 + job-browsing-and-posting 14 = 31; complete-user-workflows 23; community 22; smart-matching-and-career-tools 20; applications 17; membership-and-profiles 16; auth 8 + middleware 8 = 16; admin-and-moderation 13; connections-and-referrals 12; notifications-and-calendar 12; database 1 + foundation 5 + design-system 2 + navigation-layout 4 = 12. 'Older features' (36 tests) = tests for things the latest PRODUCT_REQUIREMENTS no longer offers, whose code is still in the repo: career tools / smart matching / eligibility / skill-gap / recommendations (12 in smart-matching file); CV upload vault (5), eligibility advisory (1), internal application with CV (1) and employer applicant pipeline (4) in applications; company accounts (4), OFFICIAL_EMPLOYER posting (2) and the old PENDING approval queue (1) in companies-and-opportunities; Workflow C employer journey (4) plus Workflow A's resume-upload and match-score steps (2). The other 158 test features visible on the site today. Plan: delete or rewrite those 36 tests together with the unused code.");
  }

  // ---------- 1b: Growth ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "More tests ", "with every stage");
    const g = [["Login", 27], ["Members", 42], ["Companies", 60], ["Search", 74], ["Applying", 91], ["Feed", 113], ["Referrals", 125], ["Skills", 145], ["Alerts", 157], ["Admin", 170], ["Final", 193], ["Approval", 194]];
    card(pres, s, M, 1.5, CW, 4.45, "Chart card");
    s.addChart(pres.charts.BAR, [{ name: "Tests passing", labels: g.map((d) => d[0]), values: g.map((d) => d[1]) }], {
      x: M + 0.2, y: 1.6, w: CW - 0.4, h: 4.25, barDir: "col",
      chartColors: [HEX.accent2], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 14, dataLabelFontBold: true, dataLabelFontFace: "+mn-lt",
      catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt", catAxisLabelRotate: 0, valAxisHidden: true, valAxisMaxVal: 220,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 35,
    });
    s.addText([{ text: "0 failures ", options: { bold: true, color: HEX.accent1 } }, { text: "at every stage. Old tests kept running, so new work never broke old work.", options: { color: HEX.dk1 } }],
      { x: M, y: 6.1, w: CW, h: 0.45, fontSize: 18, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("Running totals from docs/TEST_RESULTS.md, one bar per stage: Stage 4 auth 27, Stage 5 membership 42, Stage 6 companies and opportunities 60, Stage 7 job browsing and posting 74, Stage 8 applications 91, Stage 9 community feed 113, Stage 10 directory and referrals 125, Stage 11 skills and matching 145, Stage 12 notifications and calendar 157, Stage 13 admin 170, Stage 14 final testing 193 (5 Nov), Stage 16 approval emails 194 (14 Nov). Every recorded run shows 0 failures. This is regression testing: the full suite runs after each stage.");
  }

  // ---------- 2: Four journeys ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Three real journeys, ", "tested end to end");
    const j = [
      ["Student", "9 checks", ["Sign up and get approved", "Search, save and apply", "Second apply is blocked"]],
      ["Alumnus", "4 checks", ["Get verified", "Share a job lead", "Accept a referral request"]],
      ["Admin", "6 checks", ["Approve or reject members", "Remove spam, suspend users", "Every action is logged"]],
    ];
    const w = (CW - 2 * GUT) / 3;
    j.forEach((it, i) => {
      const x = M + i * (w + GUT), y = 1.55;
      card(pres, s, x, y, w, 4.5, `Journey ${i + 1}`);
      num(s, i + 1, x + 0.3, y + 0.3);
      s.addText(it[0], { x: x + 0.3, y: y + 0.75, w: w - 0.6, h: 0.5, fontSize: 24, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      pill(pres, s, `${it[1]} passed`, x + 0.3, y + 1.35, 1.75, HEX.accent5, HEX.accent2, 13);
      it[2].forEach((t, k) => {
        const ty = y + 2.0 + k * 0.78;
        s.addShape(pres.shapes.RECTANGLE, { x: x + 0.3, y: ty + 0.13, w: 0.12, h: 0.12, fill: { color: HEX.accent1 }, line: { color: HEX.accent1, width: 0 }, objectName: `Bullet ${i}-${k}` });
        s.addText(t, { x: x + 0.55, y: ty, w: w - 0.8, h: 0.7, fontSize: 16, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      });
    });
    strip(pres, s, ["Real database, real rules", "Every step must pass", "19 journey checks in total"]);
    s.addNotes("tests/unit/complete-user-workflows.test.ts (23 tests). Workflow A Student: registration and email verification, registrar approval, profile, search and filter, eligibility, bookmark, external application tracking, duplicate blocked by the database, notification, community post and comments. Workflow B Alumni: verification, COMMUNITY_SHARED lead with external link, connection request accepted, referral accepted with a note. Workflow C (4 more checks) still tests an old 'employer/recruiter' flow (company 'Vercel Labs', anti-IDOR check). The app no longer has an employer role (only Student, Alumni, Admin), so it is not shown as a journey here; the file has 23 checks in total. Workflow D Admin: systemRole ADMIN check, verification queue, job moderation, report resolution, suspension and restore with AdminAuditLog, live KPIs.");
  }

  // ---------- 3: Safety checks ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Safety rules we ", "proved with tests");
    const rows = [
      ["Login gate", "Logging in before confirming the email", "Blocked"],
      ["Approval email", "Admin approves a new member", "Email sent"],
      ["No duplicates", "Saving the same job application twice", "Blocked"],
      ["Private info", "Seeing another member's student ID or phone", "Hidden"],
      ["Your posts only", "Editing someone else's post or comment", "Blocked"],
      ["Admin only", "A normal member using admin tools", "Blocked"],
      ["Real job links", "Posting a job without a valid apply link", "Rejected"],
      ["Audit trail", "Any admin action", "Logged"],
    ];
    s.addText("RULE", { x: M + 0.3, y: 1.45, w: 3.0, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("WHAT WE TRIED", { x: M + 3.6, y: 1.45, w: 5.5, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("RESULT", { x: M + CW - 2.1, y: 1.45, w: 1.8, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, align: "center", isTextBox: true });
    rows.forEach((r, i) => {
      const y = 1.85 + i * 0.58;
      card(pres, s, M, y, CW, 0.5, `Rule ${i + 1}`);
      s.addText(r[0], { x: M + 0.3, y, w: 3.2, h: 0.5, fontSize: 18, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(r[1], { x: M + 3.6, y, w: 6.0, h: 0.5, fontSize: 17, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
      const good = r[2] === "Logged" || r[2] === "Email sent";
      pill(pres, s, r[2], M + CW - 2.0, y + 0.09, 1.6, good ? HEX.accent3 : HEX.accent4, good ? HEX.accent2 : HEX.accent1, 14);
    });
    s.addNotes("Where each rule is tested (tests/unit): Login gate → auth.test.ts #5 'strictly blocks login attempts before email verification is complete' (EMAIL_NOT_VERIFIED). Approval email → membership-and-profiles.test.ts 'approves request…' checks devEmailStore for a subject containing 'Approved'; the reject test checks the rejection email, and approving an unconfirmed email throws EMAIL_NOT_VERIFIED. No duplicates → applications.test.ts 'enforces database-level unique constraint' (@@unique opportunityId + applicantId). Private info → membership-and-profiles.test.ts 'redacts studentId, phone, and private email'. Your posts only → community.test.ts #5 and #10. Admin only → admin-and-moderation.test.ts 'enforces admin assertion and throws error for non-admin accounts'. Real job links → companies-and-opportunities.test.ts 'external applications require a valid external URL'. Audit trail → admin-and-moderation.test.ts audit log tests and workflow D. Not covered by tests: the 30-per-hour application limit and the login screen's 'Awaiting Administrator Approval' redirect.");
  }

  // ---------- 4: What the data means ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "From evidence ", "to design");
    const rows = [
      ["906,000 graduates out of work (2023)", "Students need trusted, focused job leads", "A JnU-only, checked community"],
      ["Referrals: 1 in 16 hired vs 1 in 152", "Who you know matters more than mass applying", "Built-in alumni referrals"],
      ["Fake job offers target students", "Strangers shouldn't get your CV", "Verified posters, apply on company sites"],
      ["194 / 194 tests and 3 journeys pass", "The core flows work as designed", "Ready to demo the main features"],
    ];
    const cols = [["WHAT WE FOUND", 3.95], ["WHAT IT MEANS", 3.95], ["OUR DESIGN CHOICE", 3.73]];
    let cx = M;
    cols.forEach((c) => { s.addText(c[0], { x: cx + 0.25, y: 1.45, w: c[1] - 0.3, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true }); cx += c[1] + 0.15; });
    rows.forEach((r, i) => {
      const y = 1.85 + i * 1.05;
      let x = M;
      r.forEach((t, k) => {
        const w = cols[k][1];
        card(pres, s, x, y, w, 0.9, `Cell ${i}-${k}`, k === 2 ? HEX.accent4 : undefined);
        s.addText(t, { x: x + 0.25, y, w: w - 0.5, h: 0.9, fontSize: 16, bold: k !== 1, color: k === 2 ? HEX.accent1 : HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
        if (k < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w - 0.02, y: y + 0.36, w: 0.18, h: 0.18, fill: { color: HEX.accent2 }, line: { color: HEX.accent2, width: 0 }, objectName: `Arrow ${i}-${k}` });
        x += w + 0.15;
      });
    });
    s.addNotes("Sources: BBS Labour Force Survey 2023 via Dhaka Tribune (906,000 unemployed graduates); Lever hiring data via SHRM, Oct 2016 (referrals 1 in 16 vs job boards 1 in 152); The Business Standard, 22 Sep 2023 (CID warnings about fake work-from-home offers to students); docs/TEST_RESULTS.md (194/194 on 14 Nov 2026, four persona workflows). Each design choice maps to ADR-001 (single verified account), ADR-002 (community leads with external apply) and ADR-007 (verify email first).");
  }

  // ---------- 5: What we haven't tested yet ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What we ", "still need to test");
    const items = [
      ["Click-through browser tests", "Tests run on the code, not in a real browser yet", "PLANNED"],
      ["Many users at once", "No load test yet; the spam limit counts per server", "PLANNED"],
      ["Login screen while waiting", "The approval block works, but that screen has no test", "PLANNED"],
      ["Phones and screen readers", "Checked by hand, not with automatic tools", "PLANNED"],
    ];
    const w = (CW - GUT) / 2, h = 2.1;
    items.forEach((it, i) => {
      const x = M + (i % 2) * (w + GUT), y = 1.55 + Math.floor(i / 2) * (h + GUT);
      card(pres, s, x, y, w, h, `Gap ${i + 1}`);
      num(s, i + 1, x + 0.35, y + 0.3);
      badge(pres, s, it[2], x + w - 1.9, y + 0.3, 1.55);
      s.addText(it[0], { x: x + 0.35, y: y + 0.8, w: w - 0.7, h: 0.5, fontSize: 22, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(it[1], { x: x + 0.35, y: y + 1.35, w: w - 0.7, h: 0.6, fontSize: 16, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes("Honest gaps: (1) AGENTS.md asks for Playwright end-to-end browser tests, but Playwright is not installed; the 'journeys' run in Vitest against the real services and database. (2) No load/performance test; the 30-per-hour application limit is in memory per server instance and has no automated test (KNOWN_ISSUES suggests Redis/Upstash). (3) The 14 Nov approval change is tested at the service level (approval and rejection emails, queue only after email confirmation), but the redirect in app/(dashboard)/layout.tsx and the 'Awaiting Administrator Approval' alert on /login have no test. (4) 36 of the 194 tests cover removed features (career tools, CV uploads, employer accounts); they pass because the code is still in the repo, so they should be deleted or rewritten along with that code. Phones and screen readers (WCAG/responsive) were checked by hand per the test plan; Playwright + axe-core are planned.");
  }
};
