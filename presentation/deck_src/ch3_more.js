const T = require("./theme_config");
const { HEX, W, M, CW, GUT, header } = T;
const U = require("./uml");

function strip(pres, s, items, y = 6.3) {
  const w = (CW - 2 * GUT) / 3;
  items.forEach((t, i) => {
    const x = M + i * (w + GUT);
    s.addText([{ text: `${String(i + 1).padStart(2, "0")}  `, options: { bold: true, color: HEX.accent1 } }, { text: t, options: { color: HEX.dk1 } }], { x, y, w, h: 0.42, fontSize: 15, margin: 0, valign: "middle", isTextBox: true });
  });
}
function tag(s, text) {
  s.addText(text, { x: W - M - 3.2, y: 0.62, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
}
function sdFrame(pres, s, x, y, w, h, name) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.lt1 }, line: { color: U.INK, width: 1.25 }, objectName: "sd frame" });
  const lw = U.tw(name, 11) + 0.15;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: lw, h: 0.28, fill: { color: HEX.accent3 }, line: { color: U.INK, width: 1 }, objectName: "sd label" });
  U.tx(s, name, x + 0.08, y, lw - 0.1, 0.28, { fontSize: 11, bold: true, align: "left" });
}

module.exports = function more(pres, SEC) {
  // ================= SEQUENCE =================
  // ---------- overview ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Sequence diagram: ", "applying for a job");
    sdFrame(pres, s, M, 1.3, CW, 5.58, "sd Apply to Job");
    const X = [1.25, 2.95, 4.75, 6.5, 8.25, 10.0, 11.75];
    const names = ["Student", ":JobPage", ":ApplicationsAPI", ":RateLimiter", ":ApplicationService", ":Database", ":Notifications"];
    const bot = 6.85, fs = 10;
    names.forEach((n, i) => U.lifeline(pres, s, X[i], i === 0 ? 1.62 : 1.66, bot, n, { actor: i === 0, w: 1.62, fontSize: 10 }));
    U.activation(pres, s, X[1], 2.6, 6.8); U.activation(pres, s, X[2], 3.34, 6.58);
    U.activation(pres, s, X[4], 4.02, 6.24); U.activation(pres, s, X[5], 4.34, 4.68); U.activation(pres, s, X[5], 5.86, 5.97); U.activation(pres, s, X[6], 6.16, 6.27);
    U.msg(pres, s, X[0], X[1] - 0.07, 2.62, "clickApply()", { fontSize: fs });
    U.selfMsg(pres, s, X[1] + 0.07, 2.9, "openCompanySite(url)", { fontSize: fs });
    U.msg(pres, s, X[1] + 0.07, X[2] - 0.07, 3.36, "POST /applications", { fontSize: fs });
    // ref interaction use
    s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 3.46, w: 2.65, h: 0.32, fill: { color: HEX.lt1 }, line: { color: U.INK, width: 1.25 }, objectName: "ref frame" });
    s.addShape(pres.shapes.RECTANGLE, { x: 4.3, y: 3.46, w: 0.42, h: 0.32, fill: { color: HEX.accent3 }, line: { color: U.INK, width: 1 }, objectName: "ref tag" });
    U.tx(s, "ref", 4.3, 3.46, 0.42, 0.32, { fontSize: 10, bold: true });
    U.tx(s, "Check Request (detail 1)", 4.72, 3.46, 2.23, 0.32, { fontSize: 10 });
    U.msg(pres, s, X[2] + 0.07, X[4] - 0.07, 4.04, "recordExternalApplication()", { fontSize: fs });
    U.msg(pres, s, X[4] + 0.07, X[5] - 0.07, 4.36, "findOpportunity(id)", { fontSize: fs });
    U.msg(pres, s, X[5] - 0.07, X[4] + 0.07, 4.66, "opportunity", { ret: true, fontSize: fs });
    U.frame(pres, s, 3.15, 4.76, 9.4, 1.52, "alt", [
      { y: 4.76, text: "[already recorded]", x: 3.2, gy: 5.03 },
      { y: 5.48, text: "[else]", x: 3.2, gy: 5.51, divider: true },
    ], { fontSize: 9 });
    U.msg(pres, s, X[4] - 0.07, X[2] + 0.07, 5.4, "error: already recorded", { ret: true, fontSize: fs });
    U.msg(pres, s, X[4] + 0.07, X[5] - 0.07, 5.88, "createApplication()", { fontSize: fs });
    U.msg(pres, s, X[4] + 0.07, X[6] - 0.07, 6.18, "notify()", { fontSize: fs });
    U.msg(pres, s, X[2] - 0.07, X[1] + 0.07, 6.56, "201 Created", { ret: true, fontSize: fs });
    U.msg(pres, s, X[1] - 0.07, X[0], 6.79, "show confirmation", { ret: true, fontSize: fs });
    s.addNotes("Read top to bottom: lower = later. Solid arrows with filled heads are calls; dashed arrows are replies. Thin boxes on the lifelines = the object is busy. 'ref Check Request' points to detail 1 (login and rate-limit checks). The 'alt' frame shows the two outcomes; detail 2 adds the 'job not open' case. Code: opportunity-detail-actions.tsx opens the company site and POSTs to app/api/applications/route.ts → recordExternalApplication in lib/services/application.ts → createNotification.");
  }
  // ---------- detail 1: checks ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Sequence: ", "checks before saving");
    tag(s, "Detail 1 of 2");
    sdFrame(pres, s, M, 1.3, CW, 4.88, "sd Check Request");
    const X = [1.4, 4.0, 7.0, 10.4], fs = 12;
    ["Student", ":JobPage", ":ApplicationsAPI", ":RateLimiter"].forEach((n, i) => U.lifeline(pres, s, X[i], i === 0 ? 1.62 : 1.66, 6.12, n, { actor: i === 0, w: 2.1, fontSize: 13 }));
    U.activation(pres, s, X[1], 2.53, 6.08); U.activation(pres, s, X[2], 3.48, 6.04); U.activation(pres, s, X[3], 4.36, 5.82);
    U.msg(pres, s, X[0], X[1] - 0.07, 2.55, "clickApply()", { fontSize: fs });
    U.selfMsg(pres, s, X[1] + 0.07, 2.88, "openCompanySite(url)", { fontSize: fs, h: 0.2 });
    U.msg(pres, s, X[1] + 0.07, X[2] - 0.07, 3.5, "POST /api/applications", { fontSize: fs });
    U.selfMsg(pres, s, X[2] + 0.07, 3.78, "getSession()", { fontSize: fs, h: 0.2 });
    U.msg(pres, s, X[2] + 0.07, X[3] - 0.07, 4.38, "checkRateLimit(user)", { fontSize: fs });
    U.frame(pres, s, 3.3, 4.5, 9.2, 1.62, "alt", [
      { y: 4.5, text: "[over 30 per hour]", x: X[1] + 0.2, gy: 4.52 },
      { y: 5.42, text: "[else]", x: X[1] + 0.2, gy: 5.45, divider: true },
    ], { fontSize: 11 });
    U.msg(pres, s, X[3] - 0.07, X[2] + 0.07, 5.0, "blocked", { ret: true, fontSize: fs });
    U.msg(pres, s, X[2] - 0.07, X[1] + 0.07, 5.32, "429 Too Many Requests", { ret: true, fontSize: fs });
    U.msg(pres, s, X[3] - 0.07, X[2] + 0.07, 5.78, "allowed", { ret: true, fontSize: fs });
    U.ln(pres, s, X[2] + 0.07, 6.0, 12.5, 6.0, { end: "triangle" });
    U.lbl(s, "continues in detail 2", 12.45, 5.73, 11, { align: "right", italic: true, color: HEX.accent1 });
    strip(pres, s, ["Company site opens at once", "You must be logged in", "Max 30 applications per hour"]);
    s.addNotes("getSession() returns the logged-in user; with no session the API answers 401 before the rate check. checkRateLimit is a sliding window in lib/security/rate-limit.ts keyed by user and IP; blocked requests get HTTP 429 with Retry-After headers.");
  }
  // ---------- detail 2: saving ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Sequence: ", "saving and confirming");
    tag(s, "Detail 2 of 2");
    sdFrame(pres, s, M, 1.3, CW, 4.92, "sd Save Application");
    const X = [1.3, 3.9, 6.7, 9.3, 11.6], fs = 12;
    ["Student", ":ApplicationsAPI", ":ApplicationService", ":Database", ":Notifications"].forEach((n, i) => U.lifeline(pres, s, X[i], i === 0 ? 1.62 : 1.66, 6.18, n, { actor: i === 0, w: i === 4 ? 1.75 : 2.15, fontSize: i === 4 ? 12 : 13 }));
    U.activation(pres, s, X[1], 2.5, 6.15); U.activation(pres, s, X[2], 2.58, 5.86); U.activation(pres, s, X[3], 2.93, 3.3); U.activation(pres, s, X[3], 5.05, 5.18); U.activation(pres, s, X[4], 5.38, 5.5);
    U.msg(pres, s, X[1] + 0.07, X[2] - 0.07, 2.6, "recordExternalApplication()", { fontSize: fs });
    U.msg(pres, s, X[2] + 0.07, X[3] - 0.07, 2.95, "findOpportunity(id)", { fontSize: fs });
    U.msg(pres, s, X[3] - 0.07, X[2] + 0.07, 3.28, "opportunity", { ret: true, fontSize: fs });
    U.frame(pres, s, 2.0, 3.4, 10.5, 2.42, "alt", [
      { y: 3.4, text: "[job not open]", x: 2.08, gy: 3.67 },
      { y: 4.2, text: "[already recorded]", x: 2.08, gy: 4.23, divider: true },
      { y: 4.72, text: "[else]", x: 2.08, gy: 4.75, divider: true },
    ], { fontSize: 11 });
    U.msg(pres, s, X[2] - 0.07, X[1] + 0.07, 4.08, "error: job not open", { ret: true, fontSize: fs });
    U.msg(pres, s, X[2] - 0.07, X[1] + 0.07, 4.62, "error: already recorded", { ret: true, fontSize: fs });
    U.msg(pres, s, X[2] + 0.07, X[3] - 0.07, 5.08, "createApplication()", { fontSize: fs });
    U.msg(pres, s, X[2] + 0.07, X[4] - 0.07, 5.42, "notify()", { fontSize: fs });
    U.msg(pres, s, X[2] - 0.07, X[1] + 0.07, 5.76, "application", { ret: true, fontSize: fs });
    U.msg(pres, s, X[1] - 0.07, X[0], 6.14, "201 Created", { ret: true, fontSize: fs });
    strip(pres, s, ["Only open jobs can be tracked", "One record per job, per student", "You get a confirmation alert"]);
    s.addNotes("recordExternalApplication refuses if the opportunity is not APPROVED (closed or expired) and if this student already has a record for this job. The database also enforces @@unique([opportunityId, applicantId]), so two quick clicks cannot create duplicates. createNotification sends the in-app alert.");
  }

  // ================= CLASS =================
  // ---------- overview ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Class diagram: ", "overview");
    const cw = 1.95, X = [0.7, 3.195, 5.69, 8.185, 10.68], Y = [1.38, 3.2, 5.05], fsO = 9;
    const K = (c, r, n, a, o) => U.klass(pres, s, X[c], Y[r], cw, n, a, o, { fontSize: fsO });
    const reaction = K(0, 0, "PostReaction", ["- type : ReactionType"], ["+ toggle()"]);
    const profile = K(1, 0, "Profile", ["- department : String", "- studentId : String"], ["+ update()"]);
    const mreq = K(2, 0, "MembershipRequest", ["- status", "- proofDetails"], ["+ approve()", "+ reject()"]);
    const notif = K(3, 0, "Notification", ["- type", "- isRead : Boolean"], ["+ markRead()"]);
    const company = K(4, 0, "Company", ["- name : String", "- isVerified"], ["+ verify()"]);
    const comment = K(0, 1, "Comment", ["- content : String", "- parentId"], ["+ reply()"]);
    const post = K(1, 1, "Post", ["- content : String", "- postType"], ["+ like()", "+ report()"]);
    const user = K(2, 1, "User", ["- email : String", "- membershipType", "- systemRole"], ["+ canPostJob()"]);
    const opp = K(3, 1, "Opportunity", ["- title : String", "- deadline : Date", "- status"], ["+ close()"]);
    const bm = K(4, 1, "OpportunityBookmark", ["- createdAt : Date"], ["+ remove()"]);
    const report = K(0, 2, "ContentReport", ["- reason", "- status"], ["+ resolve()"]);
    const audit = K(1, 2, "AdminAuditLog", ["- action", "- reason : String"], ["+ record()"]);
    const ref = K(2, 2, "ReferralRequest", ["- message : String", "- status"], ["+ accept()", "+ decline()"]);
    const app = K(3, 2, "Application", ["- method : EXTERNAL", "- status"], ["+ remove()"]);
    const o = (e1, e2, extra) => Object.assign({ fontSize: 9, e1, e2 }, extra || {});
    const ry = Y[1] + 0.42; // row-1 horizontal link height
    U.assoc(pres, s, user.l + 0.3, user.t, profile.r - 0.3, profile.b, "1", "0..1", o("t", "b", { comp: true }));
    U.assoc(pres, s, user.cx, user.t, mreq.cx, mreq.b, "1", "0..*", o("t", "b"));
    U.assoc(pres, s, user.r - 0.3, user.t, notif.l + 0.3, notif.b, "1", "0..*", o("t", "b"));
    U.assoc(pres, s, user.l, ry, post.r, ry, "1", "0..*", o("l", "r"));
    U.assoc(pres, s, user.r, ry, opp.l, ry, "1", "0..*", o("r", "l"));
    U.assoc(pres, s, user.l + 0.12, user.b, audit.r - 0.3, audit.t, "1", "0..*", o("b", "t"));
    U.assoc(pres, s, user.cx - 0.22, user.b, ref.cx - 0.22, ref.t, "1", "0..*", o("b", "t"));
    U.assoc(pres, s, user.cx + 0.22, user.b, ref.cx + 0.22, ref.t, "1", "0..*", o("b", "t"));
    U.assoc(pres, s, user.r - 0.12, user.b, app.l + 0.3, app.t, "1", "0..*", o("b", "t"));
    U.assoc(pres, s, opp.cx + 0.2, opp.b, app.cx + 0.2, app.t, "1", "0..*", o("b", "t"));
    U.assoc(pres, s, opp.r - 0.3, opp.t, company.l + 0.3, company.b, "0..*", "0..1", o("t", "b"));
    U.assoc(pres, s, opp.r, ry, bm.l, ry, "1", "0..*", o("r", "l"));
    U.assoc(pres, s, post.l, ry, comment.r, ry, "1", "0..*", o("l", "r", { comp: true }));
    U.assoc(pres, s, post.l + 0.3, post.t, reaction.r - 0.3, reaction.b, "1", "0..*", o("t", "b", { comp: true }));
    U.assoc(pres, s, post.l + 0.3, post.b, report.r - 0.3, report.t, "0..1", "0..*", o("b", "t"));
    s.addNotes("14 of the 30 database models (the ones behind the active features). Box = class name / attributes (- private) / operations (+ public, mapped to service functions in lib/services). Lines are associations with multiplicities (1, 0..1, 0..*); filled diamond = composition (the part cannot exist without the whole). Detail slides add types, association names and the User links to OpportunityBookmark, Comment and PostReaction. ReferralRequest has two links to User (sender and receiver). Omitted for readability: Session, Account, Verification, Department, Skill, CompanyMember, CareerCalendarEvent, NotificationPreference, DeadlineReminderLog, ApplicationStatusHistory, Connection, PostBookmark, and legacy Resume/ManualApplication/AcademicRecord/OpportunityComment.");
  }
  // ---------- detail 1: people & accounts ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Classes: ", "people and accounts");
    tag(s, "Detail 1 of 3");
    const f = { fontSize: 12 };
    const user = U.klass(pres, s, 5.25, 1.45, 2.85, "User", ["- id : String", "- email : String", "- membershipType : Type", "- systemRole : Role", "- verificationStatus : Status"], ["+ isVerified() : Boolean", "+ canPostJob() : Boolean"], f);
    const profile = U.klass(pres, s, 0.7, 1.45, 2.95, "Profile", ["- department : String", "- studentId : String", "- phone : String", "- isCgpaVerified : Boolean"], ["+ update()"], f);
    const mreq = U.klass(pres, s, 0.7, 4.0, 2.95, "MembershipRequest", ["- status : RequestStatus", "- proofDetails : String", "- rejectionReason : String"], ["+ approve()", "+ reject(reason)"], f);
    const notif = U.klass(pres, s, 9.68, 1.45, 2.95, "Notification", ["- type : NotificationType", "- title : String", "- isRead : Boolean"], ["+ markRead()"], f);
    const audit = U.klass(pres, s, 9.68, 4.0, 2.95, "AdminAuditLog", ["- action : AuditAction", "- reason : String", "- ipAddress : String"], ["+ record()"], f);
    const ref = U.klass(pres, s, 5.25, 4.55, 2.85, "ReferralRequest", ["- message : String", "- status : ReferralStatus"], ["+ accept(note)", "+ decline()"], f);
    const o = (e1, e2, x) => Object.assign({ fontSize: 12, e1, e2 }, x || {});
    U.assoc(pres, s, user.l, user.t + 0.45, profile.r, user.t + 0.45, "1", "0..1", o("l", "r", { comp: true }));
    U.assoc(pres, s, user.l, user.b - 0.3, mreq.r, mreq.t + 0.45, "1", "0..*", o("l", "r", { label: "submits", ldx: 0.2, ldy: -0.1 }));
    U.assoc(pres, s, user.r, user.t + 0.45, notif.l, user.t + 0.45, "1", "0..*", o("r", "l", { label: "receives", ldx: 0.12, ldy: -0.04 }));
    U.assoc(pres, s, user.r, user.b - 0.3, audit.l, audit.t + 0.45, "1", "0..*", o("r", "l", { label: "admin writes", ldx: -0.1, ldy: -0.1 }));
    U.assoc(pres, s, user.cx - 0.7, user.b, user.cx - 0.7, ref.t, "1", "0..*", o("b", "t", { label: "sends", ldx: -0.75, ldy: 0.12 }));
    U.assoc(pres, s, user.cx + 0.7, user.b, user.cx + 0.7, ref.t, "1", "0..*", o("b", "t", { label: "receives", ldx: 0.28, ldy: 0.12 }));
    strip(pres, s, ["One account for every role", "Referrals link two users", "Admin actions can't be edited"]);
    s.addNotes("membershipType is STUDENT, ALUMNI or ADMIN; systemRole (MEMBER/ADMIN) controls admin power. Profile is composed into User (deleted with it). studentId and phone are hidden from other viewers. MembershipRequest also has an optional reviewer (User 0..1, not drawn). ReferralRequest has two associations to User: requester (sends) and recipient (receives); asking yourself is blocked. AdminAuditLog is append-only.");
  }
  // ---------- detail 2: jobs ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Classes: ", "jobs and applications");
    tag(s, "Detail 2 of 3");
    const f = { fontSize: 12 };
    const user = U.klass(pres, s, 0.7, 2.95, 2.6, "User", ["- id : String", "- membershipType : Type"], ["+ canPostJob() : Boolean"], f);
    const opp = U.klass(pres, s, 6.35, 2.3, 3.0, "Opportunity", ["- title : String", "- type : JobType", "- workplaceType : Workplace", "- externalUrl : String", "- deadline : Date", "- status : JobStatus"], ["+ close()", "+ expire()"], f);
    const company = U.klass(pres, s, 10.0, 2.3, 2.63, "Company", ["- name : String", "- website : String", "- isVerified : Boolean"], ["+ verify()"], f);
    const bm = U.klass(pres, s, 3.6, 1.4, 2.45, "OpportunityBookmark", ["- createdAt : Date"], ["+ remove()"], f);
    const app = U.klass(pres, s, 3.6, 4.85, 2.45, "Application", ["- method : EXTERNAL", "- status : AppStatus"], ["+ remove()"], f);
    const o = (e1, e2, x) => Object.assign({ fontSize: 12, e1, e2 }, x || {});
    const my = user.t + 0.55;
    U.assoc(pres, s, user.r, my, opp.l, my, "1", "0..*", o("r", "l", { label: "posts", ldx: 0.0, ldy: -0.04 }));
    U.assoc(pres, s, user.r - 0.4, user.t, bm.l, bm.cy, "1", "0..*", o("t", "l", { label: "saves", ldx: -0.35, ldy: -0.1 }));
    U.assoc(pres, s, bm.r, bm.cy, opp.l + 0.4, opp.t, "0..*", "1", o("r", "t"));
    U.assoc(pres, s, user.r - 0.4, user.b, app.l, app.cy, "1", "0..*", o("b", "l", { label: "applies", ldx: -0.4, ldy: 0.35 }));
    U.assoc(pres, s, app.r, app.cy, opp.l + 0.4, opp.b, "0..*", "1", o("r", "b"));
    U.assoc(pres, s, opp.r, opp.t + 0.55, company.l, opp.t + 0.55, "0..*", "0..1", o("r", "l"));
    strip(pres, s, ["Users save and apply to jobs", "One application per job", "Jobs close or expire on their own"]);
    s.addNotes("OpportunityBookmark and Application are both links between a User and an Opportunity: each has a userId/applicantId and an opportunityId, with unique pairs (@@unique([userId, opportunityId]) and @@unique([opportunityId, applicantId])). expireOverdueOpportunities() moves APPROVED jobs past their deadline to EXPIRED. Current postings use sourceType COMMUNITY_SHARED and applicationMethod EXTERNAL.");
  }
  // ---------- detail 3: community ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Classes: ", "community feed");
    tag(s, "Detail 3 of 3");
    const f = { fontSize: 12 };
    const user = U.klass(pres, s, 9.6, 1.3, 3.03, "User", ["- id : String", "- membershipType : Type"], ["+ canPostJob() : Boolean"], f);
    const post = U.klass(pres, s, 5.0, 2.0, 3.0, "Post", ["- content : String", "- postType : PostType", "- status : Moderation"], ["+ like()", "+ report(reason)"], f);
    const report = U.klass(pres, s, 0.7, 2.0, 2.95, "ContentReport", ["- reason : ReportReason", "- status : ReportStatus"], ["+ resolve()"], f);
    const comment = U.klass(pres, s, 5.0, 4.55, 3.0, "Comment", ["- content : String", "- parentId : String"], ["+ reply()"], f);
    const reaction = U.klass(pres, s, 9.6, 4.45, 3.03, "PostReaction", ["- type : LIKE"], ["+ toggle()"], f);
    const o = (e1, e2, x) => Object.assign({ fontSize: 12, e1, e2 }, x || {});
    U.assoc(pres, s, user.l, user.t + 0.5, post.r - 0.5, post.t, "1", "0..*", o("l", "t", { label: "writes", ldx: 0.15, ldy: -0.12 }));
    U.assoc(pres, s, user.cx, user.b, user.cx, reaction.t, "1", "0..*", o("b", "t", { label: "likes", ldx: 0.15, ldy: 0.1 }));
    U.assoc(pres, s, post.r, post.b - 0.35, reaction.l, reaction.t + 0.35, "1", "0..*", o("r", "l", { comp: true }));
    U.assoc(pres, s, post.cx - 0.4, post.b, post.cx - 0.4, comment.t, "1", "0..*", o("b", "t", { comp: true }));
    U.assoc(pres, s, post.l, post.t + 0.5, report.r, post.t + 0.5, "0..1", "0..*", o("l", "r"));
    U.assoc(pres, s, comment.l, comment.t + 0.4, report.r - 0.5, report.b, "0..1", "0..*", o("l", "b"));
    // self association on Comment (replies)
    const ly = comment.b + 0.28, rx = comment.r + 0.4;
    U.poly(pres, s, [[comment.r, comment.t + 0.45], [rx, comment.t + 0.45], [rx, ly], [comment.cx + 0.6, ly], [comment.cx + 0.6, comment.b]], { width: 1.25 });
    U.lbl(s, "replies", rx + 0.08, ly - 0.32, 11, { italic: true, color: U.GREY, bg: HEX.lt2 });
    s.addText("0..1", { x: comment.r + 0.04, y: comment.t + 0.1, w: 0.42, h: 0.24, fontSize: 12, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
    s.addText("0..*", { x: comment.cx + 0.66, y: comment.b + 0.0, w: 0.42, h: 0.24, fontSize: 12, bold: true, color: HEX.accent1, margin: 0, isTextBox: true });
    strip(pres, s, ["Posts own comments and likes", "3 reports flag a post", "Replies can be threaded"]);
    s.addNotes("Post composes Comment and PostReaction (they are deleted with the post). Comment has a self-association (parentId) for threaded replies. PostReaction is unique per post, user and type; the app uses LIKE only. ContentReport targets either a post or a comment (each 0..1); 3 or more reports move the post to FLAGGED. Comment authors and report authors also link to User (not drawn to keep lines clear).");
  }

  // ================= ACTIVITY =================
  const G = (pres, s, text, x, y, align) => U.lbl(s, text, x, y, 11, { italic: true, color: HEX.accent1, align });
  // ---------- overview ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Activity diagram: ", "a job's journey");
    const c = U.lanes(pres, s, M, 1.32, CW, 5.5, ["Alumnus", "Student", "UniCareer System", "Admin"]);
    const f = { fontSize: 11 }, aw = 2.1, ah = 0.42;
    U.startNode(pres, s, c[0], 1.98);
    const a1 = U.act(pres, s, c[0], 2.5, aw, ah, "Fill in job form", f);
    const a2 = U.act(pres, s, c[0], 3.1, aw, ah, "Submit post", f);
    U.flow(pres, s, [[c[0], 2.1], [c[0], a1.t]]);
    U.flow(pres, s, [[c[0], a1.b], [c[0], a2.t]]);
    const p = U.act(pres, s, c[2], 3.1, aw, ah, "Publish job", f);
    U.flow(pres, s, [[a2.r, 3.1], [p.l, 3.1]]);
    U.bar(pres, s, c[2] - 0.95, c[2] + 0.95, 3.68);
    U.flow(pres, s, [[c[2], p.b], [c[2], 3.64]]);
    const b1 = U.act(pres, s, c[1], 4.25, aw, ah, "Browse and filter jobs", f);
    const r1 = U.act(pres, s, c[3], 4.25, aw, ah, "Review live post", f);
    U.flow(pres, s, [[c[2] - 0.75, 3.72], [c[2] - 0.75, 4.25], [b1.r, 4.25]]);
    U.flow(pres, s, [[c[2] + 0.75, 3.72], [c[2] + 0.75, 4.25], [r1.l, 4.25]]);
    const b2 = U.act(pres, s, c[1], 4.9, aw, ah, "Apply on company site", f);
    U.flow(pres, s, [[c[1], b1.b], [c[1], b2.t]]);
    const rec = U.act(pres, s, c[2], 4.9, aw, ah, "Record application", f);
    U.flow(pres, s, [[b2.r, 4.9], [rec.l, 4.9]]);
    const d3 = U.decision(pres, s, c[2], 5.55);
    U.flow(pres, s, [[c[2], rec.b], [c[2], d3.t]]);
    const b3 = U.act(pres, s, c[1], 5.55, aw, ah, "See 'already tracked'", f);
    U.flow(pres, s, [[d3.l, 5.55], [b3.r, 5.55]]);
    G(pres, s, "[duplicate]", d3.l - 0.1, 5.3, "right");
    U.endNode(pres, s, c[1], 6.2);
    U.flow(pres, s, [[c[1], b3.b], [c[1], 6.06]]);
    const sv = U.act(pres, s, c[2], 6.2, aw, ah, "Save and notify", f);
    U.flow(pres, s, [[c[2], d3.b], [c[2], sv.t]]);
    G(pres, s, "[new]", c[2] + 0.1, d3.b + 0.01, "left");
    U.endNode(pres, s, c[2] + 1.25, 6.62, 0.24);
    U.flow(pres, s, [[sv.r - 0.2, sv.b], [sv.r - 0.2, 6.62], [c[2] + 1.13, 6.62]]);
    const d2 = U.decision(pres, s, c[3], 4.95);
    U.flow(pres, s, [[c[3], r1.b], [c[3], d2.t]]);
    const cl = U.act(pres, s, c[3], 5.7, aw, ah, "Close post with reason", f);
    U.flow(pres, s, [[c[3], d2.b], [c[3], cl.t]]);
    G(pres, s, "[misleading]", c[3] + 0.1, d2.b + 0.02, "left");
    U.endNode(pres, s, c[3], 6.4);
    U.flow(pres, s, [[c[3], cl.b], [c[3], 6.26]]);
    U.flow(pres, s, [[d2.r, 4.95], [c[3] + 1.3, 4.95], [c[3] + 1.3, 6.4], [c[3] + 0.14, 6.4]]);
    G(pres, s, "[fine]", d2.r + 0.08, 4.7, "left");
    s.addNotes("Swimlanes show who does each step. Black dot = start, bullseye = end, rounded box = action, diamond = decision with [guards], thick bar = fork (after publishing, students can browse the job while admins review it). Posting is instant (status APPROVED); admins moderate afterwards.");
  }
  // ---------- detail 1: posting & moderation ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Activity: ", "posting and moderation");
    tag(s, "Detail 1 of 2");
    const c = U.lanes(pres, s, M, 1.32, CW, 4.88, ["Alumnus", "UniCareer System", "Admin"]);
    const f = { fontSize: 13 }, aw = 2.6, ah = 0.46;
    U.startNode(pres, s, c[0], 1.98);
    const a1 = U.act(pres, s, c[0], 2.45, aw, ah, "Fill in job form", f);
    U.flow(pres, s, [[c[0], 2.1], [c[0], a1.t]]);
    const a2 = U.act(pres, s, c[0], 3.05, aw, ah, "Submit post", f);
    U.flow(pres, s, [[c[0], a1.b], [c[0], a2.t]]);
    const d1 = U.decision(pres, s, c[1], 3.65, 0.42);
    U.flow(pres, s, [[a2.r, 3.05], [c[1], 3.05], [c[1], d1.t]]);
    const na = U.act(pres, s, c[0], 3.65, aw, ah, "See 'not allowed'", f);
    U.flow(pres, s, [[d1.l, 3.65], [na.r, 3.65]]);
    G(pres, s, "[not verified]", d1.l - 0.1, 3.38, "right");
    U.endNode(pres, s, c[0], 4.3);
    U.flow(pres, s, [[c[0], na.b], [c[0], 4.16]]);
    const pub = U.act(pres, s, c[1], 4.45, aw, ah, "Publish job (live)", f);
    U.flow(pres, s, [[c[1], d1.b], [c[1], pub.t]]);
    G(pres, s, "[verified]", c[1] + 0.1, d1.b + 0.0, "left");
    const rv = U.act(pres, s, c[2], 4.45, aw, ah, "Review live post", f);
    U.flow(pres, s, [[pub.r, 4.45], [rv.l, 4.45]]);
    const d2 = U.decision(pres, s, c[2], 5.1, 0.42);
    U.flow(pres, s, [[c[2], rv.b], [c[2], d2.t]]);
    U.endNode(pres, s, c[2] + 1.55, 5.1);
    U.flow(pres, s, [[d2.r, 5.1], [c[2] + 1.41, 5.1]]);
    G(pres, s, "[fine]", d2.r + 0.08, 4.83, "left");
    const cl = U.act(pres, s, c[2], 5.75, aw, ah, "Close with reason", f);
    U.flow(pres, s, [[c[2], d2.b], [c[2], cl.t]]);
    G(pres, s, "[misleading]", c[2] + 0.1, d2.b + 0.0, "left");
    const nt = U.act(pres, s, c[1], 5.75, aw, ah, "Notify poster", f);
    U.flow(pres, s, [[cl.l, 5.75], [nt.r, 5.75]]);
    U.endNode(pres, s, c[1] - 1.65, 5.75);
    U.flow(pres, s, [[nt.l, 5.75], [c[1] - 1.51, 5.75]]);
    strip(pres, s, ["Only verified members can post", "Jobs go live instantly", "Admins can close bad posts"]);
    s.addNotes("canPostOpportunity is checked on the server; PENDING, REJECTED or SUSPENDED accounts are refused. Submitting sets status APPROVED. Closing or rejecting needs a reason (at least 5 characters) that is sent to the poster and written to admin_audit_logs.");
  }
  // ---------- detail 2: applying & tracking ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Activity: ", "applying and tracking");
    tag(s, "Detail 2 of 2");
    U.lanes(pres, s, M, 1.32, CW, 4.88, ["Student", "UniCareer System"]);
    const f = { fontSize: 13 }, ah = 0.44;
    const L = 2.3, F = 4.85, S = 9.1;
    U.startNode(pres, s, L, 1.9);
    const b1 = U.act(pres, s, L, 2.35, 2.7, ah, "Browse and filter jobs", f);
    U.flow(pres, s, [[L, 2.02], [L, b1.t]]);
    const b2 = U.act(pres, s, L, 2.9, 2.7, ah, "Apply on company site", f);
    U.flow(pres, s, [[L, b1.b], [L, b2.t]]);
    const s1 = U.act(pres, s, S, 2.9, 2.6, ah, "Check hourly limit", f);
    U.flow(pres, s, [[b2.r, 2.9], [s1.l, 2.9]]);
    const d1 = U.decision(pres, s, S, 3.45, 0.4);
    U.flow(pres, s, [[S, s1.b], [S, d1.t]]);
    const w1 = U.act(pres, s, F, 3.45, 2.3, ah, "Try again later", f);
    U.flow(pres, s, [[d1.l, 3.45], [w1.r, 3.45]]);
    G(pres, s, "[over 30]", d1.l - 0.1, 3.18, "right");
    U.endNode(pres, s, F - 1.5, 3.45);
    U.flow(pres, s, [[w1.l, 3.45], [F - 1.36, 3.45]]);
    const d2 = U.decision(pres, s, S, 4.05, 0.4);
    U.flow(pres, s, [[S, d1.b], [S, d2.t]]);
    G(pres, s, "[ok]", S + 0.1, d1.b + 0.0, "left");
    const w2 = U.act(pres, s, F, 4.05, 2.3, ah, "See 'already tracked'", f);
    U.flow(pres, s, [[d2.l, 4.05], [w2.r, 4.05]]);
    G(pres, s, "[duplicate]", d2.l - 0.1, 3.78, "right");
    U.endNode(pres, s, F - 1.5, 4.05);
    U.flow(pres, s, [[w2.l, 4.05], [F - 1.36, 4.05]]);
    const sv = U.act(pres, s, S, 4.65, 2.6, ah, "Save application", f);
    U.flow(pres, s, [[S, d2.b], [S, sv.t]]);
    G(pres, s, "[new]", S + 0.1, d2.b + 0.0, "left");
    U.bar(pres, s, S - 1.6, S + 1.6, 5.07);
    U.flow(pres, s, [[S, sv.b], [S, 5.03]]);
    const n1 = U.act(pres, s, S - 1.15, 5.48, 2.2, 0.38, "Add to my list", { fontSize: 12 });
    const n2 = U.act(pres, s, S + 1.15, 5.48, 2.0, 0.38, "Send alert", { fontSize: 12 });
    U.flow(pres, s, [[S - 1.15, 5.11], [S - 1.15, n1.t]]);
    U.flow(pres, s, [[S + 1.15, 5.11], [S + 1.15, n2.t]]);
    U.bar(pres, s, S - 1.6, S + 1.6, 5.9);
    U.flow(pres, s, [[S - 1.15, n1.b], [S - 1.15, 5.86]]);
    U.flow(pres, s, [[S + 1.15, n2.b], [S + 1.15, 5.86]]);
    U.endNode(pres, s, S + 2.25, 5.9, 0.24);
    U.flow(pres, s, [[S + 1.6, 5.9], [S + 2.13, 5.9]]);
    strip(pres, s, ["You apply on the company site", "Limits stop spam", "Saving and alerting run together"]);
    s.addNotes("Fork bar (after Save application) = two things happen in parallel; join bar = both finish before the flow ends: the application appears in /applications and the student gets an in-app notification. Limit = 30 tracked applications per hour (HTTP 429); duplicate = same student and same job (unique constraint).");
  }
};
