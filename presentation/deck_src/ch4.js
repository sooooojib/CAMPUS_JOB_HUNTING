const T = require("./theme_config");
const { HEX, W, M, CW, GUT, header, card, num, pill } = T;
const U = require("./uml");
const { tableSlide, TABLES } = require("./ch4_tables");
const SEC = "Chapter 4 — How the Data Works";

const CWD = 2.74, GAP = (CW - 4 * CWD) / 3;
const cx = (i) => M + i * (CWD + GAP);

// state box for flow slides
function stateBox(pres, s, x, y, w, h, title, sub, o = {}) {
  const fill = o.fill || HEX.lt1, line = o.line || HEX.accent6;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 1.25 }, objectName: `State ${title}` });
  s.addText(title, { x, y: y + 0.1, w, h: h * 0.55, fontSize: o.fs || 18, bold: true, color: o.color || HEX.dk1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  if (sub) s.addText(sub, { x, y: y + h * 0.58, w, h: h * 0.34, fontSize: 12, color: "6B7280", align: "center", valign: "top", margin: 0, isTextBox: true });
  return { l: x, r: x + w, t: y, b: y + h, cx: x + w / 2, cy: y + h / 2 };
}
function arrowLabel(s, text, x, y, w, o = {}) {
  s.addText(text, { x: x - w / 2, y, w, h: 0.3, fontSize: o.fs || 13, italic: true, color: o.color || HEX.accent2, align: "center", valign: "middle", margin: 0, isTextBox: true, fill: { color: HEX.lt2 } });
}
const A = (pres, s, pts, color) => U.poly(pres, s, pts, { end: "triangle", width: 1.75, color: color || HEX.accent2 });

module.exports = function ch4(pres) {
  pres.addSection({ title: SEC });
  pres._morph = pres._morph || [];

  // ---------- 1: Overview ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "30 tables, ", "6 groups");
    const groups = [
      ["Jobs and applications", 6, "opportunities, opportunity_bookmarks, opportunity_comments, companies, applications, manual_applications"],
      ["Community and referrals", 7, "posts, comments, post_reactions, post_bookmarks, content_reports, connections, referral_requests"],
      ["Alerts and calendar", 4, "notifications, notification_preferences, career_calendar_events, deadline_reminder_logs"],
      ["Admin", 1, "admin_audit_logs"],
      ["Left over (no longer used)", 3, "resumes, application_status_history, company_members"],
    ];
    // People box (hub)
    const px = M, py = 1.55, pw = 3.6, ph = 4.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px, y: py, w: pw, h: ph, rectRadius: 0.12, fill: { color: HEX.accent2 }, line: { color: HEX.accent2, width: 0 }, objectName: "Group People" });
    s.addText("People and login", { x: px + 0.3, y: py + 0.3, w: pw - 0.6, h: 0.45, fontSize: 22, bold: true, color: HEX.lt1, margin: 0, isTextBox: true });
    s.addText("9 tables", { x: px + 0.3, y: py + 0.78, w: pw - 0.6, h: 0.35, fontSize: 15, bold: true, color: "F2A77F", margin: 0, isTextBox: true });
    s.addText(["users", "profiles", "membership_requests", "departments", "academic_records", "skills", "sessions", "accounts", "verifications"].map((t, i, a) => ({ text: t, options: { breakLine: i < a.length - 1 } })),
      { x: px + 0.3, y: py + 1.3, w: pw - 0.6, h: 3.3, fontSize: 15, color: HEX.lt1, margin: 0, valign: "top", lineSpacing: 23, isTextBox: true });
    const gx = px + pw + 1.0, gw = W - M - gx, gh = 0.88, gg = (ph - 5 * gh) / 4;
    groups.forEach((g, i) => {
      const y = py + i * (gh + gg), legacy = i === 4;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gx, y, w: gw, h: gh, rectRadius: 0.1, fill: { color: legacy ? "EEF0F3" : HEX.lt1 }, line: { color: legacy ? "B8C0CC" : HEX.accent6, width: 1, dashType: legacy ? "dash" : "solid" }, objectName: `Group ${g[0]}` });
      s.addText([{ text: g[0], options: { bold: true, color: legacy ? "6B7280" : HEX.dk1 } }, { text: `   ${g[1]} ${g[1] === 1 ? "table" : "tables"}`, options: { bold: true, color: legacy ? "8A94A6" : HEX.accent1 } }],
        { x: gx + 0.25, y: y + 0.08, w: gw - 0.5, h: 0.36, fontSize: 17, margin: 0, valign: "middle", isTextBox: true });
      s.addText(g[2], { x: gx + 0.25, y: y + 0.44, w: gw - 0.5, h: 0.4, fontSize: 10.5, color: "6B7280", margin: 0, valign: "middle", isTextBox: true });
      U.ln(pres, s, px + pw, y + gh / 2, gx, y + gh / 2, { width: 1.5, color: legacy ? "B8C0CC" : HEX.accent2, dash: legacy });
    });
    s.addText("Every group links back to users", { x: px + pw + 0.05, y: 6.5, w: 4, h: 0.3, fontSize: 12, italic: true, color: "6B7280", margin: 0, isTextBox: true });
    s.addText([{ text: "27", options: { bold: true, color: HEX.accent1 } }, { text: " in use   ", options: { color: HEX.dk1 } }, { text: "3", options: { bold: true, color: "8A94A6" } }, { text: " left over", options: { color: HEX.dk1 } }],
      { x: W - M - 4, y: 0.62, w: 4, h: 0.35, fontSize: 15, align: "right", margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("Source: prisma/schema.prisma (30 models mapped with @@map to 30 PostgreSQL tables on Neon; 328 columns, 28 enums). member_skills and opportunity_skills were dropped on 9 Nov for 3NF, so 30 is current. Usage was checked in the code: 27 tables are read or written by today's pages and APIs. 3 are left over from removed features: resumes (CV uploads), application_status_history (employer applicant pipeline) and company_members (company accounts); their code is still in lib/services but no current screen uses them. sessions, accounts and verifications are the Better Auth login tables. departments and skills are lookup lists; profiles store department and skills as text.");
  }

  // ---------- 1b: Full ER diagram (image of the native 20x10 drawing in deck_src/er) ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "The full ", "ER diagram");
    s.addText("30 tables · 48 links", { x: W - M - 4, y: 0.62, w: 4, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
    const ar = 5925 / 2928, ih = 6.2, iw = ih * ar, ix = (W - iw) / 2, iy = 1.15;
    s.addImage({ path: "img/er_full_crop.png", x: ix, y: iy, w: iw, h: ih, altText: "Full ER diagram of all 30 tables with primary and foreign keys" });
    s.addNotes("All 30 tables with only their keys: PK (primary key) and FK (foreign key) columns. Orange 'FK users' rows link to the users table; to keep the picture readable each group's user links are joined into one thick orange line into users. Blue lines are the other links, marked 1 and * (one-to-many). Grey dashed tables and lines are the 3 left-over tables. Every table's full column list is on the group slides that follow and in UniCareer_Database_Tables.pdf. A large copy of this diagram is in UniCareer_ER_Diagram.pdf.");
  }

  // ---------- 2-6: Table slides ----------
  tableSlide(pres, {
    sec: SEC, title: "People and ", accent: "login", phase: "9 tables",
    cards: [
      { t: "departments", cols: ["id", "code", "name", "faculty"], x: cx(0), y: 1.4, w: CWD },
      { t: "skills", cols: ["id", "name", "category"], x: cx(0), y: 2.85, w: CWD },
      { t: "verifications", cols: ["id", "identifier", "value", "expiresAt"], x: cx(0), y: 4.1, w: CWD },
      { t: "profiles", cols: ["id", "userId", "department", "studentId", "currentCgpa", "isCgpaVerified"], x: cx(1), y: 1.4, w: CWD },
      { t: "membership_requests", cols: ["id", "userId", "reviewerId", "status", "institutionalId", "rejectionReason"], x: cx(1), y: 3.15, w: CWD },
      { t: "academic_records", cols: ["id", "userId", "semester", "gpa", "credits"], x: cx(1), y: 4.9, w: CWD },
      { t: "users", cols: ["id", "email", "name", "membershipType", "systemRole", "verificationStatus", "accountStatus", "emailVerified"], x: cx(2), y: 2.9, w: CWD },
      { t: "sessions", cols: ["id", "userId", "token", "expiresAt", "ipAddress"], x: cx(3), y: 1.9, w: CWD },
      { t: "accounts", cols: ["id", "userId", "providerId", "password"], x: cx(3), y: 4.0, w: CWD },
    ],
    links: [["profiles", "userId", "users", { one: true }], ["membership_requests", "userId", "users"], ["academic_records", "userId", "users"], ["sessions", "userId", "users"], ["accounts", "userId", "users"]],
    note: "users is the centre of the whole database: every other group links to users.id. profiles is one-to-one (userId is unique). membership_requests also has reviewerId (the admin who decided). academic_records stores each semester's GPA and credits; a student can't have the same semester twice. sessions, accounts and verifications belong to Better Auth: accounts.password holds the hashed password, verifications holds email-link and reset tokens. departments and skills are lookup lists with no foreign keys.",
  });

  tableSlide(pres, {
    sec: SEC, title: "Jobs and ", accent: "applications", phase: "6 tables",
    cards: [
      { t: "manual_applications", cols: ["id", "userId", "companyName", "roleTitle", "status", "appliedDate"], x: cx(0), y: 2.6, w: CWD },
      { t: "companies", cols: ["id", "createdById", "name", "slug", "isVerified", "isSuspended"], x: cx(1), y: 1.4, w: CWD },
      { t: "applications", cols: ["id", "opportunityId", "applicantId", "method", "status", "externalAppliedAt"], x: cx(1), y: 3.75, w: CWD },
      { t: "opportunities", cols: ["id", "posterId", "companyId", "title", "type", "status", "deadline", "externalUrl"], x: cx(2), y: 2.45, w: CWD },
      { t: "opportunity_bookmarks", cols: ["id", "userId", "opportunityId"], x: cx(3), y: 1.7, w: CWD },
      { t: "opportunity_comments", cols: ["id", "opportunityId", "authorId", "content"], x: cx(3), y: 4.0, w: CWD },
    ],
    links: [["opportunities", "companyId", "companies", { mx: cx(2) - GAP * 0.3 }], ["applications", "opportunityId", "opportunities", { mx: cx(2) - GAP * 0.7 }],
      ["opportunity_bookmarks", "opportunityId", "opportunities"], ["opportunity_comments", "opportunityId", "opportunities"]],
    note: "opportunities is the job post: posterId is the member who shared it, companyId is optional, externalUrl is the company's own apply page. applications records 'I applied on the company site' and has a unique rule on (opportunityId, applicantId), so each member has one record per job. opportunity_bookmarks is the saved-jobs list (unique per user and job). manual_applications lets a member track jobs found outside UniCareer. companies is managed by admins (verify or suspend).",
  });

  tableSlide(pres, {
    sec: SEC, title: "Community and ", accent: "referrals", phase: "7 tables",
    cards: [
      { t: "connections", cols: ["id", "senderId", "receiverId", "status"], x: cx(0), y: 1.5, w: CWD },
      { t: "referral_requests", cols: ["id", "requesterId", "recipientId", "companyName", "roleTitle", "status"], x: cx(0), y: 3.5, w: CWD },
      { t: "post_reactions", cols: ["id", "postId", "userId", "type"], x: cx(1), y: 1.6, w: CWD },
      { t: "post_bookmarks", cols: ["id", "postId", "userId"], x: cx(1), y: 4.0, w: CWD },
      { t: "posts", cols: ["id", "authorId", "title", "content", "postType", "status", "likesCount", "commentsCount"], x: cx(2), y: 2.45, w: CWD },
      { t: "comments", cols: ["id", "postId", "authorId", "parentId", "content", "status"], x: cx(3), y: 1.4, w: CWD },
      { t: "content_reports", cols: ["id", "reporterId", "postId", "commentId", "reason", "status"], x: cx(3), y: 3.75, w: CWD },
    ],
    links: [["post_reactions", "postId", "posts", { mx: cx(2) - GAP * 0.35 }], ["post_bookmarks", "postId", "posts", { mx: cx(2) - GAP * 0.65 }],
      ["comments", "postId", "posts", { mx: cx(3) - GAP * 0.65 }], ["content_reports", "postId", "posts", { mx: cx(3) - GAP * 0.35 }],
      ["content_reports", "commentId", "comments", { side: "rightLoop" }]],
    note: "posts holds feed posts (type: discussion, referral or achievement). comments has parentId pointing to another comment, which gives threaded replies. post_reactions has a unique rule on (postId, userId, type) so a like can't be counted twice; post_bookmarks is unique per user and post. content_reports can point at a post or a comment; 3 or more reports flag the post. connections is unique per (senderId, receiverId). referral_requests links a student to an alumnus and can also point to a company and a job (companyId, opportunityId).",
  });

  tableSlide(pres, {
    sec: SEC, title: "Alerts and ", accent: "calendar", phase: "4 tables",
    cards: [
      { t: "users", cols: ["id"], x: (W - 2.2) / 2, y: 1.35, w: 2.2, ghost: true },
      { t: "notifications", cols: ["id", "recipientId", "type", "title", "isRead", "createdAt"], x: cx(0), y: 2.95, w: CWD },
      { t: "notification_preferences", cols: ["id", "userId", "remindersInApp", "remindersEmail", "communityInApp"], x: cx(1), y: 2.95, w: CWD },
      { t: "career_calendar_events", cols: ["id", "userId", "title", "eventType", "startDate", "isAllDay"], x: cx(2), y: 2.95, w: CWD },
      { t: "deadline_reminder_logs", cols: ["id", "userId", "opportunityId", "reminderType", "channel", "sentAt"], x: cx(3), y: 2.95, w: CWD },
    ],
    extras: (pres, s, geo) => {
      const u = geo.users, bus = 2.5;
      ["notifications", "notification_preferences", "career_calendar_events", "deadline_reminder_logs"].forEach((t) => {
        const g = geo[t], x = g.x + g.w / 2;
        U.poly(pres, s, [[x, g.t], [x, bus], [u.x + u.w / 2, bus], [u.x + u.w / 2, u.b]], { width: 1.25, color: HEX.accent2 });
        U.lbl(s, t === "notification_preferences" ? "1" : "*", x + 0.06, g.t - 0.25, 10, { bg: "none" });
      });
      U.lbl(s, "1", u.x + u.w / 2 + 0.06, u.b + 0.02, 10, { bg: "none" });
      s.addText("users is shown on the People slide", { x: u.x + u.w + 0.2, y: u.y + 0.1, w: 3.5, h: 0.3, fontSize: 11, italic: true, color: "6B7280", margin: 0, isTextBox: true });
    },
    note: "All four tables belong to one user. notifications are the in-app alerts (approval, referral replies, deadlines). notification_preferences is one row per user (userId unique) with on/off switches per alert type and channel. career_calendar_events holds reminders the user adds. deadline_reminder_logs remembers which reminder was already sent: unique on (userId, opportunityId, reminderType, channel), so nobody gets the same reminder twice.",
  });

  tableSlide(pres, {
    sec: SEC, title: "Admin and ", accent: "left-over tables", phase: "1 + 3 tables",
    cards: [
      { t: "admin_audit_logs", cols: ["id", "adminId", "action", "targetType", "targetId", "reason", "ipAddress", "createdAt"], x: cx(0), y: 1.95, w: CWD },
      { t: "resumes", cols: ["id", "userId", "fileName", "storageKey"], x: cx(1), y: 1.95, w: CWD, legacy: true },
      { t: "application_status_history", cols: ["id", "applicationId", "status", "changedById"], x: cx(2), y: 1.95, w: CWD, legacy: true },
      { t: "company_members", cols: ["id", "companyId", "userId", "role"], x: cx(3), y: 1.95, w: CWD, legacy: true },
    ],
    extras: (pres, s) => {
      s.addText("Admin", { x: cx(0), y: 1.45, w: CWD, h: 0.35, fontSize: 15, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
      s.addText("Left over from features we removed", { x: cx(1), y: 1.45, w: 3 * CWD + 2 * GAP, h: 0.35, fontSize: 15, bold: true, color: "6B7280", margin: 0, isTextBox: true });
      const lines = [["resumes", "CV uploads"], ["application_status_history", "applicant review by employers"], ["company_members", "company accounts"]];
      lines.forEach((l, i) => s.addText([{ text: "Was for: ", options: { bold: true, color: "6B7280" } }, { text: l[1], options: { color: HEX.dk1 } }], { x: cx(i + 1), y: 3.35 + (i === 2 ? 0.2 : 0), w: CWD, h: 0.35, fontSize: 13, margin: 0, isTextBox: true }));
      s.addText("Every admin action writes one row: who did it, what, to which record, why, and from which IP address.", { x: cx(0), y: 4.15, w: CWD, h: 1.2, fontSize: 13, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
    },
    note: "admin_audit_logs is append-only: adminId, action (16 kinds, e.g. MEMBERSHIP_APPROVED, ACCOUNT_SUSPENDED, OPPORTUNITY_CLOSED), targetType and targetId, optional reason and details, IP address and time. The three grey tables are still in the schema and the database, and their service code is still in lib/services (resume.ts, application.ts, company.ts), but no page uses them after CV uploads, employer applicant review and company accounts were removed. They could be dropped in a future clean-up.",
  });

  // ---------- 7: Life of a member ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Life of a ", "member");
    const bw = 2.45, bh = 1.05, y1 = 2.05, gap = (CW - 4 * bw) / 3;
    const X = (i) => M + i * (bw + gap);
    const a = stateBox(pres, s, X(0), y1, bw, bh, "Signed up", "email not confirmed");
    const b = stateBox(pres, s, X(1), y1, bw, bh, "Email confirmed", "request sent to admin");
    const c = stateBox(pres, s, X(2), y1, bw, bh, "Waiting", "PENDING");
    const d = stateBox(pres, s, X(3), y1, bw, bh, "Approved", "VERIFIED · can log in", { fill: HEX.accent4, line: HEX.accent1, color: HEX.accent1 });
    A(pres, s, [[a.r, a.cy], [b.l, b.cy]]); arrowLabel(s, "clicks the email link", (a.r + b.l) / 2, a.t - 0.45, 2.6);
    A(pres, s, [[b.r, b.cy], [c.l, c.cy]]); arrowLabel(s, "joins the queue", (b.r + c.l) / 2, b.t - 0.45, 2.2);
    A(pres, s, [[c.r, c.cy], [d.l, d.cy]]); arrowLabel(s, "admin approves", (c.r + d.l) / 2, c.t - 0.45, 2.2);
    const y2 = 4.35;
    const e = stateBox(pres, s, X(2), y2, bw, bh, "Rejected", "REJECTED · with a reason", { fill: "F3F4F6" });
    const f = stateBox(pres, s, X(3), y2, bw, bh, "Suspended", "account SUSPENDED", { fill: "F3F4F6" });
    A(pres, s, [[c.cx - 0.35, c.b], [e.cx - 0.35, e.t]]); arrowLabel(s, "admin rejects", c.cx - 0.35, (c.b + e.t) / 2 - 0.15, 1.7);
    A(pres, s, [[e.cx + 0.35, e.t], [c.cx + 0.35, c.b]]); arrowLabel(s, "sends again", c.cx + 0.35 + 0.95, (c.b + e.t) / 2 - 0.15, 1.5, { color: "6B7280" });
    A(pres, s, [[d.cx - 0.35, d.b], [f.cx - 0.35, f.t]]); arrowLabel(s, "admin suspends", d.cx - 0.35, (d.b + f.t) / 2 - 0.15, 1.9);
    A(pres, s, [[f.cx + 0.35, f.t], [d.cx + 0.35, d.b]]); arrowLabel(s, "restores", d.cx + 0.35 + 0.75, (d.b + f.t) / 2 - 0.15, 1.1, { color: "6B7280" });
    s.addText([{ text: "Email sent ", options: { bold: true, color: HEX.accent1 } }, { text: "when the admin approves or rejects", options: { color: HEX.dk1 } }], { x: M, y: 4.55, w: 5.2, h: 0.4, fontSize: 16, margin: 0, isTextBox: true });
    s.addText([{ text: "Login only works ", options: { bold: true, color: HEX.accent1 } }, { text: "in the Approved box", options: { color: HEX.dk1 } }], { x: M, y: 5.05, w: 5.2, h: 0.4, fontSize: 16, margin: 0, isTextBox: true });
    s.addNotes("Stored in the users table: emailVerified (false → true on the email link), verificationStatus (PENDING, VERIFIED, REJECTED) and accountStatus (ACTIVE or SUSPENDED). The email click runs Better Auth's afterEmailVerification hook, which creates a membership_requests row with status PENDING. The admin's decision sets status APPROVED/REJECTED on the request (with rejectionReason) and VERIFIED/REJECTED on the user, sends the approval or rejection email, adds a notification and writes admin_audit_logs. A rejected member can send the request again (resubmission). Suspend and restore change accountStatus and are logged; admins can't suspend themselves.");
  }

  // ---------- 8: Life of a job post ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Life of a ", "job post");
    const bh = 1.05;
    const dr = stateBox(pres, s, M, 3.0, 2.5, bh, "Draft", "DRAFT · only you see it", { fill: "F3F4F6" });
    const lv = stateBox(pres, s, M + 4.0, 3.0, 2.6, bh, "Live", "APPROVED · everyone sees it", { fill: HEX.accent4, line: HEX.accent1, color: HEX.accent1 });
    A(pres, s, [[dr.r, dr.cy], [lv.l, lv.cy]]); arrowLabel(s, "Submit", (dr.r + lv.l) / 2, dr.t - 0.45, 1.3);
    const ex = M + CW - 3.9, ends = [["Expired", "deadline passed (automatic)"], ["Closed", "closed by the poster or an admin"], ["Rejected", "removed by an admin, with a reason"]];
    ends.forEach((e, i) => {
      const y = 1.6 + i * 1.6;
      const b = stateBox(pres, s, ex, y, 3.9, bh, e[0], e[1], { fill: HEX.lt1 });
      A(pres, s, [[lv.r, lv.cy], [lv.r + 0.7, lv.cy], [lv.r + 0.7, b.cy], [b.l, b.cy]]);
    });
    s.addText([{ text: "Goes live right away. ", options: { bold: true, color: HEX.accent1 } }, { text: "Admins check posts after they are live.", options: { color: HEX.dk1 } }], { x: M, y: 5.6, w: CW, h: 0.4, fontSize: 17, margin: 0, isTextBox: true });
    s.addNotes("Stored in opportunities.status (enum OpportunityStatus). The posting form's 'Save as Draft' stores DRAFT; 'Submit Opportunity' stores APPROVED immediately (instant publishing; only verified students and alumni can post — canPostOpportunity). expireOverdueOpportunities() moves APPROVED jobs past their deadline to EXPIRED. Closing sets CLOSED (poster from My Postings, or an admin). An admin rejection needs a reason of at least 5 characters (rejectionReason) and is written to admin_audit_logs. The enum still has a PENDING value from the old review queue; today's form doesn't use it.");
  }

  // ---------- 9: One click ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "One click, ", "step by step");
    s.addText("You press “Save to My Applications”", { x: M, y: 1.35, w: CW, h: 0.4, fontSize: 17, bold: true, color: HEX.accent2, margin: 0, isTextBox: true });
    const steps = [["Logged in?", "Session is checked", "No: refused"], ["Not too many?", "Max 30 saves an hour", "Too many: wait"], ["Job is live?", "Status must be Live", "Closed or expired: refused"], ["Saved before?", "One record per job", "Duplicate: blocked"], ["Saved", "Row added to applications", "Shows in My Applications"]];
    const n = steps.length, bw = 2.15, gap = (CW - n * bw) / (n - 1), y = 2.0, bh = 1.45;
    steps.forEach((st, i) => {
      const x = M + i * (bw + gap), last = i === n - 1;
      card(pres, s, x, y, bw, bh, `Step ${i + 1}`, last ? HEX.accent4 : undefined);
      num(s, i + 1, x + 0.2, y + 0.18);
      s.addText(st[0], { x: x + 0.2, y: y + 0.55, w: bw - 0.3, h: 0.4, fontSize: 16, bold: true, color: last ? HEX.accent1 : HEX.dk1, margin: 0, isTextBox: true });
      s.addText(st[1], { x: x + 0.2, y: y + 0.95, w: bw - 0.35, h: 0.4, fontSize: 13, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
      if (i < n - 1) U.ln(pres, s, x + bw + 0.05, y + bh / 2, x + bw + gap - 0.05, y + bh / 2, { end: "triangle", width: 2, color: HEX.accent1 });
      // failure path
      if (!last) {
        U.ln(pres, s, x + bw / 2, y + bh, x + bw / 2, y + bh + 0.45, { end: "triangle", width: 1.25, color: "9AA5B4", dash: true });
        s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: y + bh + 0.5, w: bw, h: 0.62, rectRadius: 0.08, fill: { color: "F3F4F6" }, line: { color: "D1D5DB", width: 0.75 }, objectName: `Fail ${i + 1}` });
        s.addText(st[2], { x: x + 0.1, y: y + bh + 0.5, w: bw - 0.2, h: 0.62, fontSize: 12, color: "4B5563", align: "center", valign: "middle", margin: 0, isTextBox: true });
      } else {
        s.addText(st[2], { x, y: y + bh + 0.5, w: bw, h: 0.62, fontSize: 13, bold: true, color: HEX.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      }
    });
    s.addText([{ text: "The last check is done by the database itself: ", options: { bold: true, color: HEX.dk1 } }, { text: "even if two clicks arrive at once, only one record is kept.", options: { color: HEX.dk2 } }], { x: M, y: 5.55, w: CW, h: 0.45, fontSize: 16, margin: 0, isTextBox: true });
    s.addNotes("POST /api/applications: (1) auth.api.getSession — no session returns 401 UNAUTHORIZED; member pages are also blocked for unapproved accounts by app/(dashboard)/layout.tsx. (2) checkRateLimit: 30 per hour per user and IP, otherwise HTTP 429. (3) recordExternalApplication refuses if the opportunity status is not APPROVED. (4) It refuses a second record for the same job, and the database enforces @@unique([opportunityId, applicantId]) on applications, so a race between two requests still keeps one row. (5) The row is created with method EXTERNAL and status SUBMITTED, plus the optional personal notes; it then appears in /applications and feeds the calendar and deadline reminders.");
  }

  // ---------- 10: Reminder robot ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "The reminder ", "robot");
    const steps = [["Find jobs closing soon", "deadline in the next 72 hours", "opportunities"], ["Find who cares", "members who saved or applied", "opportunity_bookmarks + applications"], ["Already reminded?", "if yes, skip that person", "deadline_reminder_logs"], ["Send the alert", "and remember it was sent", "notifications"]];
    const n = steps.length, bw = 2.6, gap = (CW - n * bw) / (n - 1), y = 1.8, bh = 2.1;
    steps.forEach((st, i) => {
      const x = M + i * (bw + gap), last = i === n - 1;
      card(pres, s, x, y, bw, bh, `Robot step ${i + 1}`, last ? HEX.accent4 : undefined);
      num(s, i + 1, x + 0.25, y + 0.2);
      s.addText(st[0], { x: x + 0.25, y: y + 0.6, w: bw - 0.45, h: 0.75, fontSize: 19, bold: true, color: last ? HEX.accent1 : HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(st[1], { x: x + 0.25, y: y + 1.35, w: bw - 0.45, h: 0.6, fontSize: 14, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
      pill(pres, s, st[2], x, y + bh + 0.2, bw, HEX.accent3, HEX.accent2, 11);
      if (i < n - 1) U.ln(pres, s, x + bw + 0.05, y + bh / 2, x + bw + gap - 0.05, y + bh / 2, { end: "triangle", width: 2, color: HEX.accent1 });
    });
    s.addText("Table used at each step", { x: M, y: y + bh + 0.6, w: 4, h: 0.3, fontSize: 12, italic: true, color: "6B7280", margin: 0, isTextBox: true });
    const ty = 5.25;
    card(pres, s, M, ty, (CW - GUT) / 2, 0.85, "Two reminders");
    s.addText([{ text: "Two reminders per job: ", options: { bold: true, color: HEX.dk1 } }, { text: "3 days before and 1 day before", options: { color: HEX.dk2 } }], { x: M + 0.3, y: ty, w: (CW - GUT) / 2 - 0.6, h: 0.85, fontSize: 15, margin: 0, valign: "middle", isTextBox: true });
    card(pres, s, M + (CW + GUT) / 2, ty, (CW - GUT) / 2, 0.85, "Never twice");
    s.addText([{ text: "Never the same one twice: ", options: { bold: true, color: HEX.dk1 } }, { text: "the log table has a unique rule", options: { color: HEX.dk2 } }], { x: M + (CW + GUT) / 2 + 0.3, y: ty, w: (CW - GUT) / 2 - 0.6, h: 0.85, fontSize: 15, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("lib/services/reminder.ts, run by GET /api/cron/reminders (protected by Authorization: Bearer CRON_SECRET). It looks 72 hours ahead; reminderType is DEADLINE_24_HOURS when 24 hours or less remain, otherwise DEADLINE_72_HOURS. Targets are members who bookmarked the job or have an application that is not withdrawn or rejected. deadline_reminder_logs is unique on (userId, opportunityId, reminderType, channel), so repeated runs never resend. Note for questions: the endpoint must be called by a scheduler (Vercel Cron, GitHub Actions — see DEPLOYMENT_GUIDE); there is no vercel.json schedule in the repository yet.");
  }

  // ---------- 11: Keeping data safe ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Keeping data ", "safe");
    const items = [
      ["Passwords are scrambled", "Stored only as a hash, never as plain text", "accounts.password"],
      ["Private details stay private", "Student ID and phone are hidden from other members", "profiles.studentId, profiles.phone"],
      ["No double records", "The database refuses duplicates", "8 unique rules"],
      ["Every admin action is logged", "Who, what, why and when", "admin_audit_logs"],
    ];
    const w = (CW - GUT) / 2, h = 1.85;
    items.forEach((it, i) => {
      const x = M + (i % 2) * (w + GUT), y = 1.5 + Math.floor(i / 2) * (h + GUT);
      card(pres, s, x, y, w, h, `Safety ${i + 1}`);
      num(s, i + 1, x + 0.35, y + 0.28);
      s.addText(it[0], { x: x + 0.35, y: y + 0.7, w: w - 0.7, h: 0.45, fontSize: 21, bold: true, color: HEX.dk1, margin: 0, isTextBox: true });
      s.addText(it[1], { x: x + 0.35, y: y + 1.17, w: w - 0.7, h: 0.4, fontSize: 15, color: HEX.dk2, margin: 0, isTextBox: true });
      s.addText(it[2], { x: x + w - 3.6, y: y + 0.28, w: 3.3, h: 0.32, fontSize: 11, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
    });
    s.addText([{ text: "Why PostgreSQL: ", options: { bold: true, color: HEX.accent1 } }, { text: "links and unique rules are enforced by the database itself, not just by our code.", options: { color: HEX.dk1 } }], { x: M, y: 5.95, w: CW, h: 0.45, fontSize: 17, margin: 0, valign: "middle", isTextBox: true });
    s.addNotes("1: Better Auth hashes passwords with scrypt; auth.test.ts checks that no plain-text password is stored. 2: getPublicProfile redacts studentId and phone (and the email unless showEmail is on) unless the viewer is the owner or an admin; tested in membership-and-profiles.test.ts. 3: the schema has 8 composite unique rules: applications (opportunityId, applicantId), opportunity_bookmarks (userId, opportunityId), post_reactions (postId, userId, type), post_bookmarks (postId, userId), connections (senderId, receiverId), academic_records (userId, semester), deadline_reminder_logs (userId, opportunityId, reminderType, channel), company_members (companyId, userId); plus single unique columns like users.email and sessions.token. 4: admin_audit_logs stores adminId, action, target, reason and IP. PostgreSQL 16 on Neon with Prisma 7 also enforces every foreign key, so a record can't point to a user or job that doesn't exist.");
  }
};
