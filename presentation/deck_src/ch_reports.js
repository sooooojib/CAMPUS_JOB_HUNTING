const T = require("./theme2");
const { C, FONT, HFONT, W, M, CW } = T;
const DATA = require("./data/table_samples.json");
const SEC = "Chapter 6 — Reports and Closing";
const CH = 5; // position in the chapter progress bar
const K = "06 · REPORTS";
const DATE = DATA.exportedAt.slice(0, 10);

module.exports = function reports(pres) {
  pres.addSection({ title: SEC });

  // ---------- 1: What our database holds today ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["What our database ", "holds today"], chapter: CH });
    const t = DATA.tables, n = (k) => t[k].count;
    const kpis = [[n("users"), "accounts"], [n("opportunities"), "job posts"], [n("companies"), "companies"], [n("posts"), "community posts"], [n("referral_requests"), "referral requests"]];
    const kw = (CW - 4 * 0.25) / 5;
    kpis.forEach((k, i) => {
      const x = M + i * (kw + 0.25);
      T.card(pres, s, x, 1.75, kw, 1.05);
      s.addText(String(k[0]), { x: x + 0.25, y: 1.82, w: kw - 0.5, h: 0.55, fontFace: HFONT, fontSize: 32, bold: true, color: i === 0 ? C.orange : C.ink, margin: 0, valign: "middle" });
      s.addText(k[1], { x: x + 0.25, y: 2.35, w: kw - 0.5, h: 0.35, fontFace: FONT, fontSize: 15, color: C.grey, margin: 0, valign: "middle" });
    });
    const top = Object.entries(t).filter(([, v]) => v.count > 0).sort((a, b) => b[1].count - a[1].count).slice(0, 8).reverse();
    const p = T.chartPanel(pres, s, M, 3.05, 7.7, 3.55, "Rows in the 8 busiest tables");
    s.addChart(pres.charts.BAR, [{ name: "Rows", labels: top.map((e) => e[0]), values: top.map((e) => e[1].count) }], T.chartOpts({ x: p.x, y: p.y, w: p.w, h: p.h, barDir: "bar", catAxisLabelFontSize: 11, dataLabelFontSize: 12, barGapWidthPct: 30, catAxisLabelFrequency: 1 }));
    const px = M + 7.95, pw = CW - 7.95;
    T.card(pres, s, px, 3.05, pw, 3.55);
    s.addText("How a report is made", { x: px + 0.3, y: 3.25, w: pw - 0.6, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: C.ink, margin: 0 });
    const steps = [["Tables", "rows the app saves", false], ["Summary query", "count and group", false], ["Admin dashboard", "Overview, Analytics", false], ["Export", "CSV / PDF (planned)", true]];
    steps.forEach((st, i) => {
      const y = 3.8 + i * 0.68;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px + 0.3, y, w: pw - 0.6, h: 0.5, rectRadius: 0.08, fill: { color: st[2] ? C.white : i === 2 ? C.orangeL : C.blueL }, line: st[2] ? { color: C.grey2, width: 1, dashType: "dash" } : { type: "none" }, objectName: `Report step ${i + 1}` });
      s.addText([{ text: st[0], options: { bold: true, color: st[2] ? C.grey : C.ink } }, { text: "   " + st[1], options: { color: C.grey } }], { x: px + 0.45, y, w: pw - 0.9, h: 0.5, fontFace: FONT, fontSize: 13.5, margin: 0, valign: "middle" });
      if (i < steps.length - 1) s.addShape(pres.shapes.DOWN_ARROW, { x: px + pw / 2 - 0.08, y: y + 0.5, w: 0.16, h: 0.18, fill: { color: C.orange }, line: { type: "none" }, objectName: "Step arrow" });
    });
    T.source(s, `Live Neon database, read-only export on ${DATE}. Seeded with realistic JnU students, alumni, companies and posts for the demo.`);
    s.addNotes(`Numbers come from scripts/export-table-samples.mjs, run read-only against our Neon PostgreSQL database on ${DATE}; they are the same counts the admin Overview tab shows. The database was cleaned and seeded on 14 Nov 2026 with scripts/clean-and-flood-real-data.ts (real JnU departments, real company names, realistic members, jobs and posts), so these are demo numbers, not months of real use. admin_audit_logs is the largest table because every admin action is logged. CSV/PDF export is planned, not built.`);
  }

  // ---------- 2: Who is on UniCareer right now ----------
  const S = DATA.summary;
  if (S) {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["Who is on UniCareer ", "right now"], chapter: CH });
    const get = (arr, k) => (arr.find((r) => r.k === k) || { n: 0 }).n;
    const members = S.usersByRole.reduce((a, r) => a + r.n, 0);
    const pills = [[members, "members"], [get(S.usersByRole, "STUDENT"), "students"], [get(S.usersByRole, "ALUMNI"), "alumni"], [get(S.usersByStatus, "VERIFIED"), "approved"], [get(S.usersByStatus, "PENDING"), "waiting for approval"]];
    const pw0 = (CW - 4 * 0.2) / 5;
    pills.forEach((pp, i) => {
      const x = M + i * (pw0 + 0.2);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: pw0, h: 0.62, rectRadius: 0.31, fill: { color: i === 0 ? C.navy : C.white }, line: i === 0 ? { type: "none" } : { color: C.line, width: 0.75 }, objectName: `Pill ${pp[1]}` });
      s.addText([{ text: String(pp[0]) + "  ", options: { bold: true, color: i === 0 ? C.white : i === 4 ? C.orange : C.ink, fontSize: 20 } }, { text: pp[1], options: { color: i === 0 ? "C9D6E6" : C.grey, fontSize: 14 } }],
        { x, y: 1.75, w: pw0, h: 0.62, fontFace: FONT, align: "center", valign: "middle", margin: 0 });
    });
    const nice = (k) => ({ FULL_TIME: "Full-time", INTERNSHIP: "Internship", PART_TIME: "Part-time", CONTRACT: "Contract", HYBRID: "Hybrid", REMOTE: "Remote", ON_SITE: "On-site" }[k] || k);
    const dept = S.membersByDepartment.map((r) => ({ k: r.k.replace("Computer Science & Engineering", "CSE").replace("Electrical & Electronic Engineering", "EEE"), n: r.n })).reverse();
    const panels = [[`Members by department (${S.membersByDepartment.reduce((t, r) => t + r.n, 0)} profiles)`, dept, "bar", C.navy, 4.6], ["Job posts by type", S.jobsByType, "col", C.orange, 3.55], ["Where the jobs are", S.jobsByWorkplace, "col", C.navy, 3.18]];
    let x = M;
    panels.forEach((pn) => {
      const w = pn[4];
      const p = T.chartPanel(pres, s, x, 2.6, w, 4.0, pn[0]);
      s.addChart(pres.charts.BAR, [{ name: pn[0], labels: pn[1].map((r) => nice(r.k)), values: pn[1].map((r) => r.n) }],
        T.chartOpts({ x: p.x, y: p.y, w: p.w, h: p.h, barDir: pn[2], chartColors: [pn[3]], catAxisLabelFontSize: 12, dataLabelFontSize: 13, catAxisLabelFrequency: 1 }));
      x += w + 0.3;
    });
    T.source(s, `Live Neon database, read-only export on ${DATE} (seeded demo data). Members exclude admin accounts.`);
    s.addNotes(`Grouped counts (GROUP BY) from the same export, matching the admin Analytics tab. Members (non-admin users): ${members}, of which ${get(S.usersByRole, "STUDENT")} students and ${get(S.usersByRole, "ALUMNI")} alumni; ${get(S.usersByStatus, "VERIFIED")} approved and ${get(S.usersByStatus, "PENDING")} still waiting for admin approval. Departments come from profiles (4 profiles have no department yet). Job posts by type: ${S.jobsByType.map((r) => nice(r.k) + " " + r.n).join(", ")}. Workplace: ${S.jobsByWorkplace.map((r) => nice(r.k) + " " + r.n).join(", ")}.`);
  }

  // ---------- 3: Degrees don't guarantee jobs ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["Degrees don't ", "guarantee jobs"], chapter: CH });
    const p1 = T.chartPanel(pres, s, M, 1.75, 3.9, 4.85, "Graduate unemployment rate");
    s.addChart(pres.charts.BAR, [{ name: "%", labels: ["2016-17", "2022", "2024"], values: [11.2, 12.0, 13.5] }],
      T.chartOpts({ x: p1.x, y: p1.y, w: p1.w, h: p1.h, barDir: "col", dataLabelFormatCode: "0.0\"%\"", valAxisMinVal: 0, valAxisMaxVal: 15.5, chartColors: [C.navy, C.navy, C.orange] }));
    const p2 = T.chartPanel(pres, s, M + 4.15, 1.75, 3.9, 4.85, "Graduates without a job (lakh, latest 2023)");
    s.addChart(pres.charts.BAR, [{ name: "Lakh", labels: ["2016-17", "2022", "2023"], values: [4.0, 8.0, 9.06] }],
      T.chartOpts({ x: p2.x, y: p2.y, w: p2.w, h: p2.h, barDir: "col", dataLabelFormatCode: "0.0", valAxisMaxVal: 10.5 }));
    T.meansPanel(pres, s, M + 8.3, 1.75, CW - 8.3, 4.85, "What this means for UniCareer", ["1 in 3 graduates waited up to 2 years for a job (2024)", "Graduates without jobs more than doubled", "JnU students need a direct path to real jobs, shared by their own alumni"]);
    T.source(s, "Source: Bangladesh Bureau of Statistics, Labour Force Surveys 2016-17, 2022, 2023, 2024 (via The Daily Star, Dhaka Tribune, Asia News Network).");
    s.addNotes("Graduate (tertiary) unemployment rate: 11.2% in 2016-17 and 12% in 2022 (LFS 2022, The Daily Star 26 Oct 2023), 13.5% in 2024 (BBS-based estimate reported via The Daily Star/IANS, Jun 2026). Unemployed graduates: about 4 lakh in FY2016-17, nearly 8 lakh in 2022, 9.06 lakh in LFS 2023 (Dhaka Tribune). LFS 2024 (released Sep 2025): about one in three university graduates stayed unemployed for up to two years while looking for work (Asia News Network / The Daily Star).");
  }

  // ---------- 4: How people in Bangladesh find jobs ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["How people in Bangladesh ", "find jobs"], chapter: CH });
    const p = T.chartPanel(pres, s, M, 1.75, 5.6, 4.85, "How job seekers look for work (% of unemployed, 2024)");
    s.addChart(pres.charts.BAR, [{ name: "%", labels: ["Other ways", "Apply directly", "Newspaper ads", "Relatives and friends"], values: [28.7, 9.7, 25.8, 35.8] }],
      T.chartOpts({ x: p.x, y: p.y, w: p.w, h: p.h, barDir: "bar", dataLabelFormatCode: "0.0\"%\"", chartColors: [C.grey2, C.navy, C.navy, C.orange], valAxisMaxVal: 42 }));
    const cx = M + 5.85, cw = 2.3;
    T.card(pres, s, cx, 1.75, cw, 4.85);
    s.addText("1 in 3", { x: cx, y: 2.3, w: cw, h: 1.2, fontFace: HFONT, fontSize: 54, bold: true, color: C.orange, align: "center", margin: 0, valign: "middle" });
    s.addText("more than 1 in 3 unemployed people look for work through someone they know", { x: cx + 0.25, y: 3.6, w: cw - 0.5, h: 1.5, fontFace: FONT, fontSize: 16, color: C.ink, align: "center", margin: 0, valign: "top" });
    s.addText("the most common way", { x: cx, y: 5.35, w: cw, h: 0.4, fontFace: FONT, fontSize: 14, bold: true, color: C.grey, align: "center", margin: 0 });
    T.meansPanel(pres, s, M + 8.4, 1.75, CW - 8.4, 4.85, "What this means for UniCareer", ["Knowing the right person still matters most", "Students without contacts are left out", "UniCareer makes JnU alumni that contact, through referrals in the app or by email"]);
    T.source(s, "Source: Bangladesh Bureau of Statistics, Labour Force Survey 2024 (via bdnews24.com, 28 Sep 2025). \"Other ways\" = the remaining 28.7%.");
    s.addNotes("BBS Labour Force Survey 2024: unemployed people looked for work through relatives or friends (35.8%), newspaper advertisements (25.8%) and by applying directly to organisations (9.7%; 8.8% rural, 11.8% urban). The article does not break down the remaining 28.7% (online and other methods), so it is shown as 'Other ways'. This is why UniCareer has referral requests (in-app form or the new 'Mail Me for Referral' email option).");
  }

  // ---------- 5: Fake job offers in Bangladesh ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["Fake job offers ", "in Bangladesh"], chapter: CH });
    const cases = [
      ["2022", "Tk 2 crore+", "Fake government job letters, about 90 job seekers", "CID · The Daily Star"],
      ["2023", "Tk 100 crore", "Fake \"Amazon jobs\" ads on Facebook and Telegram", "DB police · TBS News"],
      ["2023", "Tk 3.4 lakh", "One woman, fake online job from \"Amazon / Google\"", "DB Cyber · Daily Messenger"],
      ["2026", "Tk 94 lakh", "Telegram job offer from a fake jewellery company", "CID · bdnews24.com"],
    ];
    const lx = M, lw = 8.15;
    T.card(pres, s, lx, 1.75, lw, 4.85);
    s.addText("Reported cases, money lost", { x: lx + 0.3, y: 1.95, w: lw - 0.6, h: 0.4, fontFace: FONT, fontSize: 16, bold: true, color: C.ink, margin: 0 });
    cases.forEach((c, i) => {
      const y = 2.5 + i * 0.98;
      if (i) s.addShape(pres.shapes.LINE, { x: lx + 0.3, y: y - 0.1, w: lw - 0.6, h: 0, line: { color: C.line, width: 0.75 } });
      s.addText(c[0], { x: lx + 0.3, y, w: 0.8, h: 0.8, fontFace: FONT, fontSize: 14, bold: true, color: C.grey, margin: 0, valign: "middle" });
      s.addText(c[1], { x: lx + 1.1, y, w: 2.4, h: 0.8, fontFace: HFONT, fontSize: 26, bold: true, color: i === 1 ? C.orange : C.navy, margin: 0, valign: "middle" });
      s.addText(c[2], { x: lx + 3.55, y, w: lw - 3.85, h: 0.5, fontFace: FONT, fontSize: 15, color: C.ink, margin: 0, valign: "bottom" });
      s.addText(c[3], { x: lx + 3.55, y: y + 0.5, w: lw - 3.85, h: 0.3, fontFace: FONT, fontSize: 11.5, color: C.grey2, margin: 0, valign: "top" });
    });
    T.meansPanel(pres, s, M + 8.4, 1.75, CW - 8.4, 4.85, "What this means for UniCareer", ["Only approved JnU members can post a job", "Every post shows who shared it", "You apply on the company's own website, never by paying anyone"]);
    T.source(s, "No national job-scam statistics exist; these are police cases reported in the news. The pattern is the same each time: a fake company, small paid tasks, then pay to earn more, and the money is gone.");
    s.addNotes("Documented Bangladesh cases (amounts as reported): (1) Jan 2022, CID Dhaka Metro arrested three men who used forged ministerial letters to take at least Tk 2 crore from about 90 job seekers (The Daily Star, 18 Jan 2022). (2) Aug 2023, DMP Detective Branch arrested four people (two Chinese nationals) in a fake 'Amazon jobs' and investment scheme; police said about Tk 100 crore was taken (TBS News, 3 Aug 2023). (3) Nov 2023, a woman lost about Tk 3.36 lakh to a fake online job impersonating Amazon/Google, paid via bKash and City Bank (Daily Messenger, 29 Nov 2023). (4) Sep 2026, CID arrested two men in a Telegram job scam where a victim lost Tk 9.42 million (Tk 94 lakh) after a job offer from a fake jewellery company (bdnews24.com, 18 Sep 2026). Bangladesh does not publish national job-scam totals, so we show reported cases instead of a national trend.");
  }

  // ---------- 6: Problem -> evidence -> our answer ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: K, title: ["From problem ", "to answer"], chapter: CH });
    const cols = [["THE PROBLEM", 3.4], ["THE EVIDENCE", 4.0], ["UNICAREER'S ANSWER", CW - 3.4 - 4.0 - 0.6]];
    let hx = M;
    cols.forEach((c) => { s.addText(c[0], { x: hx + 0.25, y: 1.75, w: c[1] - 0.3, h: 0.35, fontFace: FONT, fontSize: 13, bold: true, color: C.navy, charSpacing: 2, margin: 0 }); hx += c[1] + 0.3; });
    const rows = [
      ["Graduates can't find work", "13.5% graduate unemployment; 1 in 3 wait up to 2 years", "Job leads shared by JnU alumni, for JnU students"],
      ["Jobs come through people", "35.8% find work through relatives and friends", "Referrals: ask an alumnus in the app or by email"],
      ["Fake job offers", "From Tk 3.4 lakh to about Tk 100 crore lost in reported cases", "Approved members only; apply on the company's own site"],
    ];
    rows.forEach((r, i) => {
      const y = 2.25 + i * 1.45;
      let x = M;
      r.forEach((t, k) => {
        const w = cols[k][1], last = k === 2;
        T.card(pres, s, x, y, w, 1.2, { fill: last ? C.orangeL : C.white, noLine: last });
        s.addText(t, { x: x + 0.3, y, w: w - 0.55, h: 1.2, fontFace: k === 0 ? HFONT : FONT, fontSize: k === 0 ? 19 : 16, bold: k !== 1, color: last ? C.orange : C.ink, margin: 0, valign: "middle" });
        if (k < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + w + 0.05, y: y + 0.5, w: 0.2, h: 0.2, fill: { color: C.orange }, line: { type: "none" }, objectName: `Arrow ${i}-${k}` });
        x += w + 0.3;
      });
    });
    T.source(s, "Sources as on the previous slides: BBS Labour Force Surveys 2022–2024; police cases reported in The Daily Star, TBS News, bdnews24.com.");
    s.addNotes("This slide ties each report to a feature. Graduate unemployment (13.5% in 2024, 1 in 3 jobless for up to 2 years) → community-shared job leads from verified JnU alumni. 35.8% of job seekers rely on relatives and friends → referral requests (in-app dossier or 'Mail Me for Referral'). Reported job-scam cases from Tk 2 crore to about Tk 100 crore → only approved members can post, every post shows its poster, and students apply on the company's official site.");
  }

  // ================= CLOSING =================
  const KC = "06 · CLOSING";
  const STOPS = [
    ["img/j1.jpg", "Joins and gets approved"],
    ["img/j2.jpg", "Finds a trusted job"],
    ["img/j3.jpg", "Asks an alumnus for a referral"],
    ["img/j5.jpg", "Applies on the company site"],
    ["img/j4.jpg", "Deadline saved on his calendar"],
  ];
  const shot = (s, i, x, y, w, h, rotate = 0) => s.addImage({ path: STOPS[i][0], x, y, w, h, rotate, altText: `Screenshot: ${STOPS[i][1]}`,
    objectName: `!!j${i + 1}`, shadow: { type: "outer", color: "1E3A5F", opacity: 0.2, blur: 12, offset: 3, angle: 90 } });

  // ---------- 7: Tanvir's journey ----------
  {
    const s = T.slide(pres, { sec: SEC, kicker: KC, title: ["Tanvir's journey, ", "start to finish"], chapter: CH });
    const lineY = 4.05, tw = 1.8, th = 1.35, x0 = 3.75, step = 1.55;
    // Before card (problems crossed out)
    T.card(pres, s, M, 2.35, 1.95, 3.4, { name: "Before card" });
    s.addText("BEFORE", { x: M + 0.25, y: 2.55, w: 1.5, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.grey2, charSpacing: 2, margin: 0 });
    ["Fake posts", "No referrals", "Missed deadlines"].forEach((t, i) => s.addText(t, { x: M + 0.25, y: 3.05 + i * 0.8, w: 1.6, h: 0.6, fontFace: FONT, fontSize: 16, bold: true, color: C.grey2, strike: "sngStrike", margin: 0, valign: "middle" }));
    // After card
    const ax = x0 + 4 * step + tw / 2 + 0.25, aw = W - M - ax;
    T.card(pres, s, ax, 2.35, aw, 3.4, { fill: C.orangeL, noLine: true, name: "After card" });
    s.addText("AFTER", { x: ax + 0.2, y: 2.55, w: aw - 0.4, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.orange, charSpacing: 2, margin: 0 });
    s.addText("Applied on time, and tracked", { x: ax + 0.2, y: 3.0, w: aw - 0.35, h: 2.4, fontFace: HFONT, fontSize: 21, bold: true, color: C.orange, margin: 0, valign: "middle" });
    // path line through the stops
    s.addShape(pres.shapes.LINE, { x: M + 1.95, y: lineY, w: ax - M - 1.95, h: 0, line: { color: C.orangeM, width: 2, dashType: "dash" }, objectName: "Journey line" });
    STOPS.forEach((st, i) => {
      const cx = x0 + i * step, up = i % 2 === 0;
      const ty = up ? lineY - 0.55 - th : lineY + 0.55;
      s.addShape(pres.shapes.LINE, { x: cx, y: up ? ty + th : lineY, w: 0, h: 0.55, line: { color: C.orangeM, width: 1.5 }, objectName: `Stem ${i + 1}` });
      s.addShape(pres.shapes.OVAL, { x: cx - 0.2, y: lineY - 0.2, w: 0.4, h: 0.4, fill: { color: C.orange }, line: { color: C.white, width: 2 }, objectName: `Stop ${i + 1}` });
      s.addText(String(i + 1), { x: cx - 0.2, y: lineY - 0.2, w: 0.4, h: 0.4, fontFace: FONT, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
      shot(s, i, cx - tw / 2, ty, tw, th);
      s.addText(st[1], { x: cx - 1.0, y: up ? ty - 0.62 : ty + th + 0.06, w: 2.0, h: 0.56, fontFace: FONT, fontSize: 14, bold: true, color: C.ink, align: "center", valign: up ? "bottom" : "top", margin: 0 });
    });
    // what's left
    s.addText([{ text: "Next:  ", options: { bold: true, color: C.orange } }, { text: "real-browser tests and a load test", options: { color: C.grey } }],
      { x: M, y: 6.6, w: 6, h: 0.32, fontFace: FONT, fontSize: 14, margin: 0, valign: "middle" });
    s.addNotes("Closing story: one student, Tanvir, from start to finish. Before UniCareer he faced fake posts, no referrals and missed deadlines. (1) He signs up with his university email, confirms it, and an admin approves him. (2) He finds a job shared by a verified member, e.g. bKash's Junior Backend Engineer. (3) He asks an alumnus at Chaldal for a referral, in the app or with the ready-made Mail Me email. (4) He applies on the company's own careers site and saves it to My Applications. (5) The deadline shows on his calendar and the reminder job alerts him 72 hours before it closes. After: he has applied on time and can track it. What's still to do: real-browser (end-to-end) tests and a load test.");
  }

  // ---------- 8: Thank you (split layout + screenshot collage; Morph from the journey) ----------
  {
    const s = pres.addSlide({ sectionTitle: SEC });
    s.background = { color: C.bg };
    s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0, w: W - 7.2, h: 7.5, fill: { color: C.bg2 }, line: { type: "none" }, objectName: "Right panel" });
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.62, w: 0.32, h: 0.05, fill: { color: C.orange }, line: { type: "none" }, objectName: "Kicker bar" });
    s.addText("UNICAREER COMMUNITY · JAGANNATH UNIVERSITY", { x: M + 0.42, y: 1.5, w: 6, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.orange, charSpacing: 2, margin: 0, valign: "middle" });
    s.addText([{ text: "Thank ", options: { color: C.navy } }, { text: "you", options: { color: C.orange } }],
      { x: M - 0.05, y: 1.9, w: 6.4, h: 1.5, fontFace: HFONT, fontSize: 88, bold: true, margin: 0, valign: "middle" });
    s.addText("Questions?", { x: M, y: 3.4, w: 6, h: 0.6, fontFace: HFONT, fontSize: 30, color: C.grey, margin: 0, valign: "middle" });
    s.addText("TRY IT LIVE", { x: M, y: 4.35, w: 4, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.navy, charSpacing: 2, margin: 0 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.72, w: 4.9, h: 0.72, rectRadius: 0.36, fill: { color: C.orange }, line: { type: "none" }, shadow: { ...T.SH }, objectName: "Live link pill" });
    s.addText("jnujobhunting.vercel.app", { x: M, y: 4.72, w: 4.9, h: 0.72, fontFace: FONT, fontSize: 22, bold: true, color: C.white, align: "center", valign: "middle", margin: 0, hyperlink: { url: "https://jnujobhunting.vercel.app" } });
    s.addText("Presented by", { x: M, y: 5.95, w: 2, h: 0.3, fontFace: FONT, fontSize: 13, bold: true, color: C.grey2, margin: 0 });
    s.addText("Group-1", { x: M, y: 6.2, w: 5.6, h: 0.38, fontFace: FONT, fontSize: 20, bold: true, color: C.ink || "111111", margin: 0, valign: "bottom" });
    s.addShape(pres.shapes.LINE, { x: M, y: 6.6, w: 5.6, h: 0, line: { color: C.line, width: 1.25 }, objectName: "Team names line" });
    // collage (same objects as the journey thumbnails, so Morph flies them in)
    const tiles = [ // x, y, w, rotate (4:3 tiles)
      [7.75, 0.55, 3.0, -5], [10.25, 0.95, 2.6, 4], [8.25, 2.65, 3.6, -2], [7.6, 4.9, 2.7, 4], [10.35, 4.55, 2.6, -4],
    ];
    [0, 1, 3, 4, 2].forEach((i) => { const t = tiles[i]; shot(s, i, t[0], t[1], t[2], t[2] * 0.75, t[3]); });
    s.addNotes("Thank you. UniCareer Community is live at jnujobhunting.vercel.app; we are happy to take questions or give a live demo. The screenshots on the right are the same five steps of Tanvir's journey: sign in, find a job, ask for a referral, apply, and the saved deadline.");
    (pres._morph || (pres._morph = [])).push(s._slideNum);
    (pres._morphSlow || (pres._morphSlow = [])).push(s._slideNum);
    s._noNum = true;
  }
};
