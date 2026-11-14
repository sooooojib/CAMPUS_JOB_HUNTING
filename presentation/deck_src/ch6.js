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
    header(s, "193 tests, ", "0 failures");
    // left: big numbers
    const stats = [["193 / 193", "automated tests passed"], ["16", "test files"], ["0", "code errors in the final build"]];
    stats.forEach((st, i) => {
      const y = 1.6 + i * 1.5;
      card(pres, s, M, y, 3.6, 1.3, `Stat ${i + 1}`, TINTS[i]);
      s.addText(st[0], { x: M + 0.3, y: y + 0.15, w: 3.0, h: 0.65, fontSize: 34, bold: true, color: i === 0 ? HEX.accent1 : HEX.dk1, margin: 0, valign: "middle", isTextBox: true, charSpacing: -0.5 });
      s.addText(st[1], { x: M + 0.3, y: y + 0.8, w: 3.0, h: 0.38, fontSize: 15, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    // right: native bar chart (tests per area)
    const data = [
      ["Full user journeys", 23], ["Community feed", 22], ["Skills and matching", 20], ["Companies and jobs", 17],
      ["Applications", 17], ["Membership and profiles", 15], ["Job search and posting", 14], ["Admin and moderation", 13],
      ["Referrals and connections", 12], ["Alerts and calendar", 12], ["Login and accounts", 8], ["Page protection", 8],
      ["Setup checks", 5], ["Navigation", 4], ["Design system", 2], ["Database link", 1],
    ].reverse();
    card(pres, s, M + 3.9, 1.6, CW - 3.9, 4.2, "Chart card");
    s.addChart(pres.charts.BAR, [{ name: "Tests", labels: data.map((d) => d[0]), values: data.map((d) => d[1]) }], {
      x: M + 4.05, y: 1.68, w: CW - 4.2, h: 4.05, barDir: "bar",
      chartColors: [HEX.accent2], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 12, dataLabelFontFace: "+mn-lt",
      catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false,
      showTitle: true, title: "Tests per area", titleFontSize: 13, titleColor: HEX.dk1, titleFontFace: "+mn-lt", barGapWidthPct: 45,
    });
    s.addText("Last full run recorded on 5 Nov 2026 (Vitest). Re-run before the defense: npm test", { x: M, y: 6.1, w: CW, h: 0.35, fontSize: 13, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("Source: docs/FINAL_TEST_REPORT.md and docs/TEST_RESULTS.md (Stage 14, 2026-11-05): 16 Vitest files, 193 tests, all passing in about 109 seconds. tsc --noEmit: 0 errors; eslint: 0 errors; next build: 68 routes compiled. Counting the it() cases in tests/unit today still gives 193. Important: the code changed after 5 Nov (external-only applications, career tools removed), so run npm test again before presenting and update this slide if any number changes.");
  }

  // ---------- 2: Four journeys ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Four real journeys, ", "tested end to end");
    const j = [
      ["Student", "10 steps", ["Sign up and get approved", "Search, save and apply", "Second apply is blocked"]],
      ["Alumnus", "4 steps", ["Get verified", "Share a job lead", "Accept a referral request"]],
      ["Job poster", "4 steps", ["Get posting rights", "Add a company and a job", "Can't see others' applications"]],
      ["Admin", "6 steps", ["Approve or reject members", "Remove spam, suspend users", "Every action is logged"]],
    ];
    const w = (CW - 3 * GUT) / 4;
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
    strip(pres, s, ["Real database, real rules", "Every step must pass", "23 journey checks in total"]);
    s.addNotes("tests/unit/complete-user-workflows.test.ts (23 tests). Workflow A Student: registration and email verification, registrar approval, profile, search and filter, eligibility, bookmark, external application tracking, duplicate blocked by the database, notification, community post and comments. Workflow B Alumni: verification, COMMUNITY_SHARED lead with external link, connection request accepted, referral accepted with a note. Workflow C Partner: posting clearance, company 'Vercel Labs', job with salary and deadline, anti-IDOR check. Workflow D Admin: systemRole ADMIN check, verification queue, job moderation, report resolution, suspension and restore with AdminAuditLog, live KPIs. The report's Workflow C still describes an admin approval step from before instant publishing; check this test after the latest changes.");
  }

  // ---------- 3: Safety checks ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Safety rules we ", "proved with tests");
    const rows = [
      ["Login gate", "Login before confirming email", "Blocked"],
      ["Spam limit", "More than 30 applications in an hour", "Blocked"],
      ["No duplicates", "Applying to the same job twice", "Blocked"],
      ["Private records", "Viewing someone else's applications", "Blocked"],
      ["Admin only", "A normal member opening admin tools", "Blocked"],
      ["Safe links", "Posting a harmful job link", "Rejected"],
      ["Audit trail", "Any admin action", "Logged"],
    ];
    s.addText("RULE", { x: M + 0.3, y: 1.45, w: 3.0, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("WHAT WE TRIED", { x: M + 3.6, y: 1.45, w: 5.5, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    s.addText("RESULT", { x: M + CW - 2.1, y: 1.45, w: 1.8, h: 0.3, fontSize: 13, bold: true, color: HEX.accent2, margin: 0, align: "center", isTextBox: true });
    rows.forEach((r, i) => {
      const y = 1.85 + i * 0.62;
      card(pres, s, M, y, CW, 0.52, `Rule ${i + 1}`);
      s.addText(r[0], { x: M + 0.3, y, w: 3.2, h: 0.52, fontSize: 18, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(r[1], { x: M + 3.6, y, w: 6.0, h: 0.52, fontSize: 17, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
      pill(pres, s, r[2], M + CW - 2.0, y + 0.1, 1.6, r[2] === "Logged" ? HEX.accent3 : HEX.accent4, r[2] === "Logged" ? HEX.accent2 : HEX.accent1, 14);
    });
    s.addNotes("Where each rule is tested: Login gate → auth.test.ts (EMAIL_NOT_VERIFIED, 403). Spam limit → applications.test.ts #15 (HTTP 429). No duplicates → applications.test.ts #8 and workflow A (unique opportunityId + applicantId). Private records → applications.test.ts #12–13 and workflow C (anti-IDOR). Admin only → admin-and-moderation.test.ts (systemRole ADMIN, 403 otherwise). Safe links → applications.test.ts #16 (open-redirect sanitising). Audit trail → admin-and-moderation.test.ts and workflow D (AdminAuditLog).");
  }

  // ---------- 4: What the data means ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "From evidence ", "to design");
    const rows = [
      ["906,000 graduates out of work (2023)", "Students need trusted, focused job leads", "A JnU-only, checked community"],
      ["Referrals: 1 in 16 hired vs 1 in 152", "Who you know matters more than mass applying", "Built-in alumni referrals"],
      ["Fake job offers target students", "Strangers shouldn't get your CV", "Verified posters, apply on company sites"],
      ["193 / 193 tests and 4 journeys pass", "The core flows work as designed", "Ready to demo the main features"],
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
    s.addNotes("Sources: BBS Labour Force Survey 2023 via Dhaka Tribune (906,000 unemployed graduates); Lever hiring data via SHRM, Oct 2016 (referrals 1 in 16 vs job boards 1 in 152); The Business Standard, 22 Sep 2023 (CID warnings about fake work-from-home offers to students); docs/FINAL_TEST_REPORT.md (193/193, four persona workflows). Each design choice maps to ADR-001 (single verified account), ADR-002 (community leads with external apply) and ADR-007 (verify email first).");
  }

  // ---------- 5: What we haven't tested yet ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What we ", "still need to test");
    const items = [
      ["Click-through browser tests", "Tests run on the code, not in a real browser yet", "PLANNED"],
      ["Many users at once", "No load test yet; the spam limit counts per server", "PLANNED"],
      ["Latest changes", "Re-run all tests after the new admin-approval login", "PLANNED"],
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
    s.addNotes("Honest gaps: (1) AGENTS.md asks for Playwright end-to-end browser tests, but Playwright is not installed; the 'journeys' run in Vitest against the real services and database. (2) No load/performance test; the rate limiter is in memory per server instance (KNOWN_ISSUES suggests Redis/Upstash). (3) The last recorded full test run is 5 Nov 2026. On 14 Nov login was changed to need admin approval, with approval and rejection emails; the changelog says these were tested, but no test in tests/ checks the approval emails or the pending_admin_approval redirect yet. (4) WCAG/responsive checks were manual per the test plan (Playwright + axe-core planned).");
  }
};
