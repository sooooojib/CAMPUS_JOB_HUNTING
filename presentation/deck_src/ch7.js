const T = require("./theme_config");
const { HEX, W, M, CW, GUT, header, card, num, pill } = T;
const U = require("./uml");
const SEC = "Chapter 7 — How We Built It and Closing";

module.exports = function ch7(pres) {
  pres.addSection({ title: SEC });

  // ---------- 2: Design decisions ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Big choices ", "we made");
    const items = [
      ["One account for everyone", "A student can later post jobs as an alumnus"],
      ["Apply on the company's own site", "No CV files for us to store or leak"],
      ["Email check, then admin approval", "Only real JnU people get in"],
      ["Real emails through Gmail", "Free email tools only sent mail to our own inbox"],
    ];
    const w = (CW - GUT) / 2, h = 2.4;
    items.forEach((it, i) => {
      const x = M + (i % 2) * (w + GUT), y = 1.55 + Math.floor(i / 2) * (h + GUT);
      card(pres, s, x, y, w, h, `Decision ${i + 1}`);
      num(s, i + 1, x + 0.35, y + 0.3);
      s.addText(it[0], { x: x + 0.35, y: y + 0.75, w: w - 0.7, h: 0.9, fontSize: 22, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText([{ text: "Why: ", options: { bold: true, color: HEX.accent1 } }, { text: it[1], options: { color: HEX.dk2 } }], { x: x + 0.35, y: y + 1.6, w: w - 0.7, h: 0.6, fontSize: 18, margin: 0, valign: "top", isTextBox: true });
    });
    s.addNotes("From docs/DECISIONS.md (Architecture Decision Records). 1 = ADR-001 unified account (membershipType STUDENT/ALUMNI, systemRole ADMIN). 2 = ADR-002 all jobs COMMUNITY_SHARED with external apply; resume uploads and magic-bytes parsing removed. 3 = ADR-007 verification-first gate (requireEmailVerification, autoSignIn false) + ADR-011 two-stage verification with admin approval and approval email. 4 = ADR-008 Nodemailer + Gmail SMTP with an app password, because Resend's free tier only delivers to the account owner. Not on the slide but ready for questions: ADR-004 Next.js App Router with Server Components by default (faster pages, secrets stay on the server); ADR-003 four job states APPROVED, EXPIRED, CLOSED, REJECTED. Other ADRs: 005 Prisma 7 with pg driver adapter, 006 React 19 useSyncExternalStore, 009 CGPA verified separately, 010 plain institutional design.");
  }

  // ---------- Scorecard ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "What we promised, ", "what we delivered");
    const rows = [
      ["FR-1", "Sign up", "Ch 5: Sign up"],
      ["FR-2", "Email check", "Ch 5: Sign up"],
      ["FR-3", "Member approval", "Ch 5: Sign up"],
      ["FR-4", "Post a job", "Ch 5: Share a job"],
      ["FR-5", "Find jobs", "Ch 5: Find & apply"],
      ["FR-6", "Apply and track", "Ch 5: Find & apply"],
      ["FR-7", "Community feed", "Ch 5: Feed"],
      ["FR-8", "Report posts", "Ch 5: Admin"],
      ["FR-9", "Referrals", "In the app"],
      ["FR-10", "Reminders", "Ch 5: Calendar"],
      ["FR-11", "Admin tools", "Ch 5: Admin"],
      ["FR-12", "Activity log", "Ch 6: Safety rules"],
    ];
    const cw = (CW - GUT) / 2, rh = 0.62, gap = 0.12;
    rows.forEach((r, i) => {
      const col = Math.floor(i / 6), x = M + col * (cw + GUT), y = 1.5 + (i % 6) * (rh + gap);
      card(pres, s, x, y, cw, rh, `Requirement ${r[0]}`);
      s.addText(r[0], { x: x + 0.2, y, w: 0.8, h: rh, fontSize: 13, bold: true, color: HEX.accent1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(r[1], { x: x + 0.95, y, w: 2.0, h: rh, fontSize: 16, bold: true, color: HEX.dk1, margin: 0, valign: "middle", isTextBox: true });
      s.addText(r[2], { x: x + 2.95, y, w: cw - 4.1, h: rh, fontSize: 13, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
      pill(pres, s, "Done", x + cw - 1.1, y + (rh - 0.32) / 2, 0.9, HEX.accent5, HEX.accent2, 12);
    });
    s.addText([{ text: "12 of 12 built.  ", options: { bold: true, color: HEX.accent1 } }, { text: "Still to do: real-browser tests and a load test (Chapter 6).", options: { color: HEX.dk1 } }],
      { x: M, y: 6.1, w: CW, h: 0.45, fontSize: 18, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("Requirements are FR-1 to FR-12 from Chapter 2. Each one is live on jnujobhunting.vercel.app; the right column says where we showed it. Referrals (FR-9) were built in Stage 10 (/referrals, request from a member profile, accept/decline, mark completed) but we did not give them a screen slide. Reminders: /api/cron/reminders alerts for saved or applied jobs closing within 72 hours, and deadlines show on /calendar. Activity log: AdminAuditLog records admin, action, target, reason and IP. Honest gaps from Chapter 6: no Playwright browser tests yet, no load test, and tests need a re-run after the 14 Nov approval change.");
  }

  // ---------- Thank you ----------
  {
    const s = pres.addSlide({ masterName: "COVER", sectionTitle: SEC });
    s.addText([{ text: "Thank ", options: { color: HEX.dk1 } }, { text: "you", options: { color: HEX.accent1 } }], { x: M, y: 1.7, w: CW, h: 1.3, fontSize: 66, bold: true, align: "center", margin: 0, valign: "middle", isTextBox: true, charSpacing: -1 });
    s.addText("UniCareer Community: jobs, people and referrals for Jagannath University", { x: M, y: 3.1, w: CW, h: 0.5, fontSize: 20, color: HEX.dk2, align: "center", margin: 0, valign: "middle", isTextBox: true });
    const lw = 7.0, lx = (W - lw) / 2;
    card(pres, s, lx, 4.05, lw, 1.35, "Live link");
    s.addText("Try it live", { x: lx, y: 4.2, w: lw, h: 0.35, fontSize: 14, bold: true, color: HEX.accent1, align: "center", margin: 0, isTextBox: true });
    s.addText("jnujobhunting.vercel.app", { x: lx, y: 4.58, w: lw, h: 0.6, fontSize: 30, bold: true, color: HEX.accent2, align: "center", margin: 0, valign: "middle", isTextBox: true, hyperlink: { url: "https://jnujobhunting.vercel.app" } });
    s.addNotes("Questions welcome. The link opens https://jnujobhunting.vercel.app. To demo live: sign up with a JnU email, click the verification link, then an admin approves the request before login works.");
  }
};
