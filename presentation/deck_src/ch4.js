// Chapter 4 — Database (v5 theme, simple): overview grid, blank ER slide, 5 table slides with key
// columns and tidy links (+ hidden real-data slides), life of a member, and 4 "how it works" slides.
const T = require("./theme_config");
const { HEX, W, M, CW, GUT, header, card, num, pill } = T;
const U = require("./uml");
const { tableSlide, bus, direct } = require("./ch4_tables");
const SEC = "Chapter 5 — Database";
const K = (g) => T.setChapter(4, g ? `05 · DATABASE  ·  ${g.toUpperCase()}` : "05 · DATABASE");
const SH = () => ({ type: "outer", color: "1E3A5F", opacity: 0.12, blur: 12, offset: 2, angle: 90 });
const GREY = "5B6577", GREY2 = "8A94A6", LINE = "D3DDE8";

function box(pres, s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: o.r || 0.1, fill: { color: o.fill || HEX.lt1 }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash ? "dash" : "solid" } : { type: "none" }, shadow: o.flat ? undefined : SH(), objectName: o.name || "Box" });
}
function txt(s, t, x, y, w, h, o = {}) {
  s.addText(t, Object.assign({ x, y, w, h, fontSize: 14, color: HEX.dk1, margin: 0, valign: "middle" }, o));
}
const slide = (pres, g, a, b) => { K(g); const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC }); header(s, a, b); return s; };
const ARW = (pres, s, pts, color) => U.poly(pres, s, pts, { end: "triangle", width: 2, color: color || HEX.accent2 });

// table card columns
const CWD = 2.55, GAP = (CW - 4 * CWD) / 3;
const cx = (i) => M + i * (CWD + GAP);

module.exports = function ch4(pres) {
  pres.addSection({ title: SEC });
  pres._morph = pres._morph || [];

  // ================= 1: 30 tables, 6 groups =================
  {
    const s = slide(pres, null, "30 tables, ", "6 groups");
    const groups = [
      ["People and login", ["users", "profiles", "membership_requests", "academic_records", "sessions", "accounts", "verifications", "departments", "skills"]],
      ["Jobs and applications", ["opportunities", "companies", "applications", "application_status_history", "opportunity_bookmarks", "opportunity_comments", "manual_applications"]],
      ["Community and referrals", ["posts", "comments", "post_reactions", "post_bookmarks", "content_reports", "connections", "referral_requests"]],
      ["Alerts and calendar", ["notifications", "notification_preferences", "career_calendar_events", "deadline_reminder_logs"]],
      ["Admin", ["admin_audit_logs"]],
      ["Left over", ["resumes", "company_members"]],
    ];
    const gw = (CW - 2 * 0.35) / 3, gh = 2.38, hh = 0.55;
    groups.forEach(([name, tables], i) => {
      const x = M + (i % 3) * (gw + 0.35), y = 1.55 + Math.floor(i / 3) * (gh + 0.22), legacy = i === 5;
      const col = legacy ? "9AA5B4" : HEX.accent2;
      box(pres, s, x, y, gw, gh, { fill: legacy ? "F7F8FA" : HEX.lt1, line: legacy ? "C5CDD8" : undefined, dash: legacy, flat: legacy, name: `Group ${name}` });
      // header: rounded top (rounded rect + square patch over its bottom corners)
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: gw, h: hh, rectRadius: 0.1, fill: { color: col }, line: { type: "none" }, objectName: `Group header ${name}` });
      s.addShape(pres.shapes.RECTANGLE, { x, y: y + hh / 2, w: gw, h: hh / 2, fill: { color: col }, line: { type: "none" }, objectName: `Group header base ${name}` });
      txt(s, name, x + 0.22, y, gw - 1.3, hh, { fontSize: 15, bold: true, color: "FFFFFF" });
      txt(s, `${tables.length} ${tables.length === 1 ? "table" : "tables"}`, x + gw - 1.2, y, 1.0, hh, { fontSize: 13, bold: true, color: legacy ? "FFFFFF" : "F2A77F", align: "right" });
      // table names as chips, packed into rows that fit the card (longest first)
      const avail = gw - 0.4, gapc = 0.1, rowsC = [];
      tables.map((t) => ({ t, w: t.length * 0.068 + 0.28 })).sort((p, q) => q.w - p.w).forEach((c) => {
        const r = rowsC.find((r) => r.used + gapc + c.w <= avail);
        if (r) { r.items.push(c); r.used += gapc + c.w; } else rowsC.push({ items: [c], used: c.w });
      });
      rowsC.forEach((r, ri) => {
        let px = x + 0.2;
        const py = y + hh + 0.2 + ri * 0.38;
        r.items.sort((p, q) => (p.t === "users" ? -1 : q.t === "users" ? 1 : 0)).forEach(({ t, w: cw }) => {
          const hub = t === "users";
          s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: py, w: cw, h: 0.3, rectRadius: 0.15, fill: { color: hub ? HEX.accent4 : legacy ? "EEF0F3" : HEX.accent3 }, line: { type: "none" }, objectName: `Chip ${t}` });
          txt(s, t, px, py, cw, 0.3, { fontSize: 11, bold: hub, color: hub ? HEX.accent1 : legacy ? GREY2 : HEX.accent2, align: "center", wrap: false });
          px += cw + gapc;
        });
      });
    });
    txt(s, [{ text: "users", options: { bold: true, color: HEX.accent1 } }, { text: " is the centre: every group links back to it", options: { color: GREY } }], M, 6.62, CW, 0.32, { fontSize: 13 });
    s.addNotes("The database has 30 tables (prisma/schema.prisma, 30 models). They fall into 6 groups. People and login (9): users is the centre, every other group links back to it. Jobs and applications (7), Community and referrals (7), Alerts and calendar (4), Admin (1: admin_audit_logs). Left over (2): resumes and company_members, from the removed CV upload and company accounts. The next slides show each group's tables with their key columns; click any table to see real rows.");
  }

  // ================= 2: Full ER diagram (left blank for the team's own diagram) =================
  {
    const s = slide(pres, null, "The full ", "ER diagram");
    const ar = 7150 / 3630, ih = 5.45, iw = ih * ar;
    s.addImage({ path: "img/er_diagram.png", x: (W - iw) / 2, y: 1.5, w: iw, h: ih, altText: "ER diagram of all 30 UniCareer tables and 48 relationships in crow's-foot notation, grouped into 6 coloured zones around the users table" });
    s.addNotes("The full ER diagram in crow's-foot notation: all 30 tables and 48 relationships. Each table shows its primary key, foreign keys and main columns with data types; users shows every column. The 6 coloured zones are the groups from the previous slide: Jobs and applications on the left, Community and referrals on the right, Left over and Admin at the top, Alerts and calendar at the bottom, and People and login in the middle with users at the centre. Line ends: two bars = exactly one, bar and circle = zero or one, crow's foot with circle = zero or many. Every line points to the parent table's id. Where two lines cross, a small bridge shows they are not connected. A large copy is in UniCareer_ER_Diagram.png / .pdf.");
  }

  // ================= 3-7: table slides =================
  tableSlide(pres, {
    sec: SEC, group: "People and login", title: ["People and ", "login"], count: "9 tables",
    cards: [
      { t: "departments", cols: ["id", "code", "name", "faculty"], x: cx(0), y: 1.6, w: CWD },
      { t: "skills", cols: ["id", "name", "category"], x: cx(0), y: 3.15, w: CWD },
      { t: "verifications", cols: ["id", "identifier", "value", "expiresAt"], x: cx(0), y: 4.5, w: CWD },
      { t: "profiles", cols: ["id", "userId", "department", "studentId", "currentCgpa"], x: cx(1), y: 1.5, w: CWD, hi: ["userId"] },
      { t: "membership_requests", cols: ["id", "userId", "reviewerId", "status", "rejectionReason"], x: cx(1), y: 3.2, w: CWD, hi: ["userId", "reviewerId"] },
      { t: "academic_records", cols: ["id", "userId", "semester", "gpa", "credits"], x: cx(1), y: 4.9, w: CWD, hi: ["userId"], uq: true },
      { t: "users", cols: ["id", "email", "name", "membershipType", "systemRole", "verificationStatus", "accountStatus", "emailVerified"], x: cx(2), y: 2.75, w: CWD },
      { t: "sessions", cols: ["id", "userId", "token", "expiresAt", "ipAddress"], x: cx(3), y: 2.0, w: CWD, hi: ["userId"] },
      { t: "accounts", cols: ["id", "userId", "providerId", "password"], x: cx(3), y: 4.0, w: CWD, hi: ["userId"] },
    ],
    draw: (pres, s, g) => {
      bus(pres, s, g.users, [[g.profiles, "userId", true], [g.membership_requests, "userId"], [g.membership_requests, "reviewerId"], [g.academic_records, "userId"]], "left");
      bus(pres, s, g.users, [[g.sessions, "userId"], [g.accounts, "userId"]], "right");
    },
    note: "users is the centre of the whole database: every other group links to users.id. profiles is one-to-one (userId is unique). membership_requests also has reviewerId (the admin who decided), so it links to users twice. academic_records stores each semester's GPA and credits; a student can't have the same semester twice. sessions, accounts and verifications belong to Better Auth: accounts.password holds the hashed password, verifications holds email-link and reset codes. departments and skills are lookup lists with no links. Orange rows are the columns that make each link.",
  });

  tableSlide(pres, {
    sec: SEC, group: "Jobs and applications", title: ["Jobs and ", "applications"], count: "7 tables",
    cards: [
      { t: "manual_applications", cols: ["id", "userId", "companyName", "roleTitle", "status", "appliedDate"], x: cx(0), y: 1.6, w: CWD },
      { t: "application_status_history", cols: ["id", "applicationId", "status", "changedById"], x: cx(0), y: 3.75, w: CWD, hi: ["applicationId"] },
      { t: "applications", cols: ["id", "opportunityId", "applicantId", "method", "status", "externalAppliedAt"], x: cx(1), y: 1.6, w: CWD, hi: ["opportunityId"], uq: true },
      { t: "companies", cols: ["id", "createdById", "name", "slug", "isVerified", "isSuspended"], x: cx(1), y: 4.0, w: CWD },
      { t: "opportunities", cols: ["id", "posterId", "companyId", "title", "type", "status", "deadline", "externalUrl"], x: cx(2), y: 2.4, w: CWD, hi: ["companyId"] },
      { t: "opportunity_bookmarks", cols: ["id", "userId", "opportunityId"], x: cx(3), y: 1.9, w: CWD, hi: ["opportunityId"], uq: true },
      { t: "opportunity_comments", cols: ["id", "opportunityId", "authorId", "content"], x: cx(3), y: 3.9, w: CWD, hi: ["opportunityId"] },
    ],
    draw: (pres, s, g) => {
      direct(pres, s, g.applications, "opportunityId", g.opportunities);
      direct(pres, s, g.opportunities, "companyId", g.companies);
      direct(pres, s, g.application_status_history, "applicationId", g.applications);
      bus(pres, s, g.opportunities, [[g.opportunity_bookmarks, "opportunityId"], [g.opportunity_comments, "opportunityId"]], "right");
    },
    note: "opportunities is the job post: posterId is the member who shared it, companyId is optional, externalUrl is the company's own apply page. applications records 'I applied on the company site' and is unique on (opportunityId, applicantId), so each member has one record per job. application_status_history gets its first row in the same click and is shown as the timeline in My Applications. opportunity_bookmarks is the saved-jobs list (unique per member and job). manual_applications lets a member track jobs found outside UniCareer. companies is managed by admins (verify or suspend).",
  });

  tableSlide(pres, {
    sec: SEC, group: "Community and referrals", title: ["Community and ", "referrals"], count: "7 tables",
    cards: [
      { t: "connections", cols: ["id", "senderId", "receiverId", "status"], x: cx(0), y: 1.6, w: CWD, uq: true },
      { t: "referral_requests", cols: ["id", "requesterId", "recipientId", "companyName", "roleTitle", "status"], x: cx(0), y: 3.65, w: CWD },
      { t: "post_reactions", cols: ["id", "postId", "userId", "type"], x: cx(1), y: 1.8, w: CWD, hi: ["postId"], uq: true },
      { t: "post_bookmarks", cols: ["id", "postId", "userId"], x: cx(1), y: 3.9, w: CWD, hi: ["postId"], uq: true },
      { t: "posts", cols: ["id", "authorId", "title", "content", "postType", "status", "likesCount", "commentsCount"], x: cx(2), y: 2.4, w: CWD },
      { t: "comments", cols: ["id", "postId", "authorId", "parentId", "content", "status"], x: cx(3), y: 1.5, w: CWD - 0.25, hi: ["postId"] },
      { t: "content_reports", cols: ["id", "reporterId", "postId", "commentId", "reason", "status"], x: cx(3), y: 3.75, w: CWD - 0.25, hi: ["postId", "commentId"] },
    ],
    draw: (pres, s, g) => {
      bus(pres, s, g.posts, [[g.post_reactions, "postId"], [g.post_bookmarks, "postId"]], "left");
      bus(pres, s, g.posts, [[g.comments, "postId"], [g.content_reports, "postId"]], "right");
      const c = g.comments, r = g.content_reports, lx = c.r + 0.2, y1 = r.rowY("commentId"), y2 = c.rowY("id");
      U.poly(pres, s, [[r.r, y1], [lx, y1], [lx, y2], [c.r, y2]], { width: 1.5, color: HEX.accent2 });
    },
    note: "posts holds feed posts (type: discussion, referral or achievement). post_reactions has a unique rule on (postId, userId, type) so a like can't be counted twice; post_bookmarks is unique per member and post. comments has parentId pointing to another comment, which gives threaded replies. content_reports can point at a post or a comment (the line on the right); 3 or more reports flag the post. connections is unique per (senderId, receiverId). referral_requests links a student to an alumnus (both FK users) and can also point to a company and a job.",
  });

  tableSlide(pres, {
    sec: SEC, group: "Alerts and calendar", title: ["Alerts and ", "calendar"], count: "4 tables",
    cards: [
      { t: "users", cols: ["id"], x: (W - 2.2) / 2, y: 1.5, w: 2.2, anchor: true, anchorNote: true },
      { t: "notifications", cols: ["id", "recipientId", "type", "title", "isRead", "createdAt"], x: cx(0), y: 3.1, w: CWD, hi: ["recipientId"] },
      { t: "notification_preferences", cols: ["id", "userId", "remindersInApp", "remindersEmail", "communityInApp"], x: cx(1), y: 3.1, w: CWD, hi: ["userId"] },
      { t: "career_calendar_events", cols: ["id", "userId", "title", "eventType", "startDate", "isAllDay"], x: cx(2), y: 3.1, w: CWD, hi: ["userId"] },
      { t: "deadline_reminder_logs", cols: ["id", "userId", "opportunityId", "reminderType", "channel", "sentAt"], x: cx(3), y: 3.1, w: CWD, hi: ["userId"], uq: true },
    ],
    draw: (pres, s, g) => {
      const u = g.users, by = 2.65, ux = u.x + u.w / 2;
      const kids = ["notifications", "notification_preferences", "career_calendar_events", "deadline_reminder_logs"];
      kids.forEach((t) => {
        const k = g[t], x = k.x + k.w / 2;
        U.ln(pres, s, x, by, x, k.t, { width: 1.5, color: HEX.accent2 });
        U.lbl(s, t === "notification_preferences" ? "1" : "many", x + 0.05, k.t - 0.24, t === "notification_preferences" ? 9 : 8.5, { bg: "none", color: HEX.accent1, bold: t === "notification_preferences", italic: t !== "notification_preferences" });
      });
      const xs = kids.map((t) => g[t].x + g[t].w / 2);
      U.ln(pres, s, Math.min(...xs), by, Math.max(...xs), by, { width: 1.5, color: HEX.accent2 });
      U.ln(pres, s, ux, u.b, ux, by, { width: 1.5, color: HEX.accent2 });
      U.lbl(s, "1", ux + 0.05, u.b + 0.01, 9, { bg: "none", color: HEX.accent1, bold: true });
    },
    note: "All four tables belong to one member. notifications are the in-app alerts (approval, referral replies, deadlines). notification_preferences is one row per member (userId unique) with on/off switches for each alert type, in the app and by email. career_calendar_events holds reminders members add. deadline_reminder_logs remembers which reminder was already sent: unique on (userId, opportunityId, reminderType, channel), so nobody gets the same reminder twice.",
  });

  tableSlide(pres, {
    sec: SEC, group: "Admin", title: ["Admin and ", "left-over tables"], count: "1 + 2 tables",
    cards: [
      { t: "admin_audit_logs", cols: ["id", "adminId", "action", "targetType", "targetId", "reason", "ipAddress", "createdAt"], x: cx(0), y: 2.0, w: CWD },
      { t: "resumes", cols: ["id", "userId", "fileName", "storageKey"], x: cx(2), y: 2.0, w: CWD, legacy: true },
      { t: "company_members", cols: ["id", "companyId", "userId", "role"], x: cx(3), y: 2.0, w: CWD, legacy: true, uq: true },
    ],
    draw: (pres, s, g) => {
      txt(s, "Admin", cx(0), 1.5, CWD, 0.35, { fontSize: 15, bold: true, color: HEX.accent2 });
      txt(s, "Left over: nothing writes to them any more", cx(2), 1.5, 2 * CWD + GAP, 0.35, { fontSize: 15, bold: true, color: GREY2 });
      txt(s, [{ text: "One row for every admin action", options: { bold: true, color: HEX.dk1, breakLine: true } }, { text: "who did it, what, to which record, why, and from where. Rows are only added, never changed.", options: { color: GREY } }], cx(1), 2.0, CWD, 1.6, { fontSize: 14, valign: "top" });
      [["resumes", "CV uploads"], ["company_members", "company accounts"]].forEach(([t, w]) => {
        txt(s, [{ text: "Was for: ", options: { bold: true, color: GREY } }, { text: w, options: { color: HEX.dk1 } }], g[t].x, g[t].b + 0.2, CWD, 0.35, { fontSize: 13 });
      });
    },
    note: "admin_audit_logs is append-only: adminId, action (e.g. MEMBERSHIP_APPROVED, ACCOUNT_SUSPENDED, OPPORTUNITY_CLOSED), targetType and targetId, optional reason and details, IP address and time. The two grey tables are still in the schema and the database, but the screens that filled them (CV upload, company accounts) were removed, so nothing writes to them any more. The job-post page still reads company_members (getUserCompanies), which is always empty now. They could be dropped in a future clean-up.",
  });

  // ================= 8: Life of a member — watch one row change =================
  {
    const s = slide(pres, "How it works", "Life of a ", "member");
    const cols = [["Step", "", 3.0], ["Email confirmed", "users.emailVerified", 1.75], ["Member status", "users.verificationStatus", 1.95], ["Account", "users.accountStatus", 1.75], ["Join request", "membership_requests.status", 2.2], ["Can log in?", "", 1.283]];
    const X = []; let x = M; cols.forEach((c) => { X.push(x); x += c[2]; });
    const hy = 1.55, hh = 0.62;
    cols.forEach((c, i) => {
      txt(s, c[1] ? [{ text: c[0], options: { bold: true, color: HEX.dk1, breakLine: true } }, { text: c[1], options: { fontSize: 9, color: GREY2 } }] : [{ text: c[0], options: { bold: true, color: HEX.dk1 } }],
        X[i] + (i ? 0 : 0.1), hy, c[2], hh, { fontSize: 13, align: i ? "center" : "left" });
    });
    s.addShape(pres.shapes.LINE, { x: M, y: hy + hh + 0.05, w: CW, h: 0, line: { color: LINE, width: 1 }, objectName: "Header rule" });
    const rows = [
      ["Fills the sign-up form", "member", ["false", "PENDING", "ACTIVE", "no row yet", "No"], []],
      ["Clicks the email link", "member", ["true", "PENDING", "ACTIVE", "PENDING", "No"], [0, 3]],
      ["Approves the request", "admin", ["true", "VERIFIED", "ACTIVE", "APPROVED", "Yes"], [1, 3, 4]],
      ["Suspends, if needed", "admin", ["true", "VERIFIED", "SUSPENDED", "APPROVED", "No"], [2, 4]],
    ];
    const ry0 = 2.4, rh = 0.88, rg = 0.12;
    rows.forEach((r, i) => {
      const y = ry0 + i * (rh + rg);
      box(pres, s, M, y, CW, rh, { name: `Stage ${i + 1}` });
      s.addShape(pres.shapes.OVAL, { x: M + 0.18, y: y + rh / 2 - 0.2, w: 0.4, h: 0.4, fill: { color: HEX.accent1 }, line: { type: "none" }, objectName: `Num ${i + 1}` });
      txt(s, String(i + 1), M + 0.18, y + rh / 2 - 0.2, 0.4, 0.4, { fontSize: 13, bold: true, color: "FFFFFF", align: "center" });
      txt(s, [{ text: r[0], options: { bold: true, breakLine: true } }, { text: `by the ${r[1]}`, options: { fontSize: 11, color: GREY } }], M + 0.72, y, 2.25, rh, { fontSize: 15 });
      r[2].forEach((v, k) => {
        const cx = X[k + 1], cw = cols[k + 1][2], ch = r[3].includes(k), cy = y + 0.2;
        if (ch) box(pres, s, cx + 0.12, cy, cw - 0.24, rh - 0.4, { fill: HEX.accent4, flat: true, r: 0.24, name: "Changed" });
        txt(s, v, cx, cy, cw, rh - 0.4, { fontSize: v === "no row yet" ? 12 : 14, bold: ch, italic: v === "no row yet", color: ch ? HEX.accent1 : v === "no row yet" ? GREY2 : HEX.dk1, align: "center" });
      });
    });
    box(pres, s, M, 6.47, 0.5, 0.26, { fill: HEX.accent4, flat: true, r: 0.13, name: "Legend chip" });
    txt(s, "= what this step changes", M + 0.6, 6.45, 2.6, 0.3, { fontSize: 12, color: GREY });
    txt(s, [{ text: "If the admin rejects: ", options: { bold: true, color: HEX.dk1 } }, { text: "both become REJECTED with a reason, and the member can send again", options: { color: GREY } }], 3.6, 6.45, W - M - 3.6, 0.3, { fontSize: 12, align: "right" });
    s.addNotes("One member, one users row, watched over time. 1: the sign-up form creates the users row (emailVerified false, verificationStatus PENDING, accountStatus ACTIVE) and saves the locked student ID and department; there is no join request yet. 2: clicking the email link sets emailVerified = true and Better Auth's afterEmailVerification hook creates the membership_requests row with status PENDING. 3: the admin approves: the request becomes APPROVED and the user VERIFIED; an approval email and a notification go out and admin_audit_logs gets a row. Only now can the member log in. 4: an admin can later suspend the account (accountStatus SUSPENDED; logged; admins can't suspend themselves) and restore it. If the admin rejects instead, the request and the user become REJECTED with a rejectionReason, a rejection email is sent, and the member can resubmit.");
  }


  // ================= 9: Life of a job post (status diagram) =================
  {
    const s = slide(pres, "How it works", "Life of a ", "job post");
    const st = (x, y, w, h, title, sub, o = {}) => {
      box(pres, s, x, y, w, h, { fill: o.fill, line: o.line, lw: 1.5, name: `State ${title}` });
      txt(s, title, x, y + 0.12, w, h * 0.5, { fontSize: o.fs || 20, bold: true, color: o.color || HEX.dk1, align: "center" });
      txt(s, sub, x + 0.15, y + h * 0.55, w - 0.3, h * 0.38, { fontSize: 13, color: GREY, align: "center", valign: "top" });
      return { l: x, r: x + w, t: y, b: y + h, cy: y + h / 2 };
    };
    const dr = st(M, 3.05, 2.6, 1.2, "Draft", "only you see it", { fill: "F3F5F8" });
    const lv = st(4.35, 3.05, 2.9, 1.2, "Live", "everyone sees it", { fill: HEX.accent4, line: HEX.accent1, color: HEX.accent1 });
    ARW(pres, s, [[dr.r + 0.05, dr.cy], [lv.l - 0.05, lv.cy]], HEX.accent1);
    txt(s, "Submit", dr.r, dr.t - 0.05, lv.l - dr.r, 0.35, { fontSize: 14, bold: true, italic: true, color: HEX.accent1, align: "center" });
    const ex = 9.45, ew = W - M - ex;
    const ends = [["Expired", "the deadline passed (automatic)", "deadline passes"], ["Closed", "closed by the poster or an admin", "poster or admin closes"], ["Rejected", "removed by an admin, with a reason", "admin rejects"]];
    const jx = lv.r + 0.4;
    ends.forEach((e, i) => {
      const b = st(ex, 1.65 + i * 1.6, ew, 1.15, e[0], e[1]);
      ARW(pres, s, [[lv.r + 0.05, lv.cy], [jx, lv.cy], [jx, b.cy], [b.l - 0.05, b.cy]]);
      txt(s, e[2], jx + 0.08, b.cy - 0.34, ex - jx - 0.16, 0.3, { fontSize: 12, italic: true, bold: true, color: HEX.accent2, align: "center" });
    });
    box(pres, s, M, 5.75, 7.6, 0.75, { fill: HEX.accent3, flat: true, name: "Key point" });
    txt(s, [{ text: "Goes live right away.  ", options: { bold: true, color: HEX.accent1 } }, { text: "Admins check posts after they are live.", options: { color: HEX.dk1 } }], M + 0.3, 5.75, 7.2, 0.75, { fontSize: 17 });
    s.addNotes("Stored in opportunities.status. 'Save as Draft' stores DRAFT, so only the poster sees it. 'Submit Opportunity' stores APPROVED straight away (instant publishing; only verified students and alumni can post), so the post is live with no review queue. When the deadline passes, the job becomes EXPIRED automatically. The poster (from My Postings) or an admin can close it (CLOSED). An admin can also reject a post; the reason (at least 5 characters) is saved and written to admin_audit_logs.");
  }

  // ================= 10: One click, step by step =================
  {
    const s = slide(pres, "How it works", "One click, ", "step by step");
    txt(s, [{ text: "You press ", options: { color: GREY } }, { text: "\"Save to My Applications\"", options: { bold: true, color: HEX.accent2 } }], M, 1.45, CW, 0.4, { fontSize: 17 });
    const steps = [["Logged in?", "Your login is checked", "No: refused"], ["Not too many?", "Max 30 saves an hour", "Too many: wait"], ["Job is live?", "Status must be Live", "Closed or expired: refused"], ["Saved before?", "One record per job", "Duplicate: blocked"], ["Saved", "Added to applications and its history", "Shows in My Applications"]];
    const n = steps.length, bw = 2.12, gap = (CW - n * bw) / (n - 1), y = 2.1, bh = 1.75;
    steps.forEach((st, i) => {
      const x = M + i * (bw + gap), last = i === n - 1;
      card(pres, s, x, y, bw, bh, `Step ${i + 1}`, last ? HEX.accent4 : undefined);
      num(s, i + 1, x + 0.22, y + 0.2);
      txt(s, st[0], x + 0.22, y + 0.6, bw - 0.35, 0.45, { fontSize: 18, bold: true, color: last ? HEX.accent1 : HEX.dk1 });
      txt(s, st[1], x + 0.22, y + 1.08, bw - 0.4, 0.6, { fontSize: 13, color: GREY, valign: "top" });
      if (i < n - 1) U.ln(pres, s, x + bw + 0.06, y + bh / 2, x + bw + gap - 0.06, y + bh / 2, { end: "triangle", width: 2, color: HEX.accent1 });
      const fy = y + bh + 0.55;
      if (!last) {
        U.ln(pres, s, x + bw / 2, y + bh + 0.05, x + bw / 2, fy - 0.05, { end: "triangle", width: 1.25, color: "9AA5B4", dash: true });
        box(pres, s, x, fy, bw, 0.7, { fill: "F3F5F8", line: LINE, lw: 0.75, flat: true, name: `Fail ${i + 1}` });
        txt(s, st[2], x + 0.1, fy, bw - 0.2, 0.7, { fontSize: 13, color: GREY, align: "center" });
      } else {
        txt(s, st[2], x, fy, bw, 0.7, { fontSize: 14, bold: true, color: HEX.accent1, align: "center" });
      }
    });
    box(pres, s, M, 5.85, CW, 0.7, { fill: HEX.accent3, flat: true, name: "Key point" });
    txt(s, [{ text: "The last check is done by the database itself: ", options: { bold: true, color: HEX.dk1 } }, { text: "even if two clicks arrive at once, only one record is kept.", options: { color: GREY } }], M + 0.3, 5.85, CW - 0.6, 0.7, { fontSize: 16 });
    s.addNotes("POST /api/applications: (1) the session is checked; no session returns 401. (2) Rate limit: 30 per hour per member and IP, otherwise 429. (3) recordExternalApplication refuses if the job's status is not APPROVED (live). (4) It refuses a second record for the same job, and the database enforces the unique rule (opportunityId, applicantId), so even two requests at the same moment keep one row. (5) In one transaction it creates the applications row (method EXTERNAL, status SUBMITTED, optional notes) and the first application_status_history row; then a notification is sent. The record appears in My Applications and feeds the calendar and deadline reminders.");
  }

  // ================= 11: The reminder robot =================
  {
    const s = slide(pres, "How it works", "The reminder ", "robot");
    const steps = [["Find jobs closing soon", "deadline in the next 72 hours", "opportunities"], ["Find who cares", "members who saved or applied", "bookmarks + applications"], ["Already reminded?", "if yes, skip that person", "deadline_reminder_logs"], ["Send the alert", "and remember it was sent", "notifications"]];
    const n = steps.length, bw = 2.65, gap = (CW - n * bw) / (n - 1), y = 1.6, bh = 2.05;
    steps.forEach((st, i) => {
      const x = M + i * (bw + gap), last = i === n - 1;
      card(pres, s, x, y, bw, bh, `Robot step ${i + 1}`, last ? HEX.accent4 : undefined);
      num(s, i + 1, x + 0.25, y + 0.22);
      txt(s, st[0], x + 0.25, y + 0.62, bw - 0.45, 0.75, { fontSize: 19, bold: true, color: last ? HEX.accent1 : HEX.dk1, valign: "top" });
      txt(s, st[1], x + 0.25, y + 1.35, bw - 0.45, 0.6, { fontSize: 14, color: GREY, valign: "top" });
      pill(pres, s, st[2], x, y + bh + 0.22, bw, HEX.accent3, HEX.accent2, 11);
      if (i < n - 1) U.ln(pres, s, x + bw + 0.06, y + bh / 2, x + bw + gap - 0.06, y + bh / 2, { end: "triangle", width: 2, color: HEX.accent1 });
    });
    txt(s, "Table used at each step", M, y + bh + 0.62, 4, 0.3, { fontSize: 12, italic: true, color: GREY2 });
    const ty = 5.2, hw = (CW - GUT) / 2;
    [["Two reminders per job: ", "3 days before and 1 day before"], ["Never the same one twice: ", "the log table has a unique rule"]].forEach((c, i) => {
      const x = M + i * (hw + GUT);
      card(pres, s, x, ty, hw, 0.95, `Robot fact ${i + 1}`);
      txt(s, [{ text: c[0], options: { bold: true, color: HEX.dk1 } }, { text: c[1], options: { color: GREY } }], x + 0.3, ty, hw - 0.6, 0.95, { fontSize: 16 });
    });
    s.addNotes("lib/services/reminder.ts, run by GET /api/cron/reminders (protected by a CRON_SECRET bearer token). It looks 72 hours ahead for live (APPROVED) jobs. The reminder type is DEADLINE_24_HOURS when 24 hours or less remain, otherwise DEADLINE_72_HOURS. Targets are members who bookmarked the job or have an application that is not withdrawn or rejected. deadline_reminder_logs is unique on (userId, opportunityId, reminderType, channel), so repeated runs never resend. The alert is an in-app notification, also emailed if the member's reminder email switch is on.");
  }

  // ================= 12: Keeping data safe =================
  {
    const s = slide(pres, "How it works", "Keeping data ", "safe");
    const items = [
      ["Passwords are scrambled", "Stored only as a hash, never as plain text", "accounts.password"],
      ["Private details stay private", "Student ID and phone are hidden from other members", "profiles.studentId, profiles.phone"],
      ["No double records", "The database refuses duplicates", "8 unique rules"],
      ["Every admin action is logged", "Who, what, why and when", "admin_audit_logs"],
    ];
    const w = (CW - GUT) / 2, h = 1.9;
    items.forEach((it, i) => {
      const x = M + (i % 2) * (w + GUT), y = 1.55 + Math.floor(i / 2) * (h + GUT);
      card(pres, s, x, y, w, h, `Safety ${i + 1}`);
      s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.25, w: 0.08, h: h - 0.5, fill: { color: HEX.accent1 }, line: { type: "none" }, objectName: "Accent strip" });
      num(s, i + 1, x + 0.4, y + 0.3);
      txt(s, it[0], x + 0.4, y + 0.72, w - 0.8, 0.5, { fontSize: 22, bold: true });
      txt(s, it[1], x + 0.4, y + 1.22, w - 0.8, 0.45, { fontSize: 15, color: GREY });
      pill(pres, s, it[2], x + w - 3.3, y + 0.3, 3.0, HEX.accent3, HEX.accent2, 11);
    });
    box(pres, s, M, 5.95, CW, 0.7, { fill: HEX.accent3, flat: true, name: "Key point" });
    txt(s, [{ text: "Why PostgreSQL: ", options: { bold: true, color: HEX.accent1 } }, { text: "links and unique rules are enforced by the database itself, not just by our code.", options: { color: HEX.dk1 } }], M + 0.3, 5.95, CW - 0.6, 0.7, { fontSize: 16 });
    s.addNotes("1: Better Auth hashes passwords with scrypt; auth.test.ts checks that no plain-text password is stored. 2: getPublicProfile hides studentId and phone (and the email unless showEmail is on) unless the viewer is the owner or an admin. 3: the schema has 8 composite unique rules: applications (opportunityId, applicantId), opportunity_bookmarks (userId, opportunityId), post_reactions (postId, userId, type), post_bookmarks (postId, userId), connections (senderId, receiverId), academic_records (userId, semester), deadline_reminder_logs (userId, opportunityId, reminderType, channel), company_members (companyId, userId); plus unique columns like users.email and sessions.token. 4: admin_audit_logs stores adminId, action, target, reason and IP. PostgreSQL on Neon also enforces every foreign key, so a record can't point to a user or job that doesn't exist. Member pages only open for approved, active accounts; admin pages need the admin role.");
  }
};
