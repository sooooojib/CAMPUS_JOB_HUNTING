const T = require("./theme_config");
const { HEX, TINTS, W, M, CW, GUT, header, card, num } = T;
const U = require("./uml");
const SEC = "Chapter 3 — System Diagrams";

function strip(pres, s, items, y = 6.28) {
  const w = (CW - 2 * GUT) / 3;
  items.forEach((t, i) => {
    const x = M + i * (w + GUT);
    s.addText([{ text: `${String(i + 1).padStart(2, "0")}  `, options: { bold: true, color: HEX.accent1 } }, { text: t, options: { color: HEX.dk1 } }], { x, y, w, h: 0.42, fontSize: 15, margin: 0, valign: "middle", isTextBox: true });
  });
}
function tag(s, text, y = 0.62) {
  s.addText(text, { x: W - M - 3.2, y, w: 3.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
}

module.exports = function ch3(pres) {
  pres.addSection({ title: SEC });

  // ---------- 15: Index ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Our system in ", "four UML views");
    const items = [
      ["Use case", "Who does what"],
      ["Sequence", "What happens when you apply"],
      ["Class", "How the data fits together"],
      ["Activity", "A job's journey, step by step"],
    ];
    const w = (CW - 3 * GUT) / 4;
    items.forEach((it, i) => {
      const x = M + i * (w + GUT), y = 1.7;
      card(pres, s, x, y, w, 4.6, `Diagram ${i + 1}`, TINTS[i % 3]);
      num(s, i + 1, x + 0.3, y + 0.3);
      s.addText(it[0], { x: x + 0.3, y: y + 0.85, w: w - 0.6, h: 0.5, fontSize: 26, bold: true, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true });
      s.addText(it[1], { x: x + 0.3, y: y + 1.5, w: w - 0.6, h: 0.9, fontSize: 18, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
    });
    // tiny notation hints
    const hy = 1.7 + 3.0;
    U.actor(pres, s, M + w / 2, hy, "", 0.8);
    U.lifeline(pres, s, M + (w + GUT) + w / 2, hy, hy + 1.2, ":Server", { w: 1.3 });
    U.klass(pres, s, M + 2 * (w + GUT) + 0.55, hy, w - 1.1, "Job", ["- title"], ["+ close()"]);
    U.startNode(pres, s, M + 3 * (w + GUT) + w / 2, hy + 0.15);
    U.act(pres, s, M + 3 * (w + GUT) + w / 2, hy + 0.75, 1.6, 0.42, "Apply");
    U.ln(pres, s, M + 3 * (w + GUT) + w / 2, hy + 0.27, M + 3 * (w + GUT) + w / 2, hy + 0.54, { end: "arrow" });
    s.addNotes("The four UML diagrams required by the course: Use Case (requirements), Sequence (time order of messages), Class (static structure), Activity (process flow with swimlanes). Each has a full overview slide followed by zoomed detail slides. Editable source files (PlantUML / Mermaid) are in presentation/deck_src/uml/.");
  }

  // ---------- 16: Use case overview ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Use case diagram: ", "overview");
    U.boundary(pres, s, 2.4, 1.4, 8.05, 5.35, "UniCareer Community");
    const A = ["Register Account", "Log In", "Submit Membership Proof", "Search & Filter Jobs", "Save Job", "Apply to Job", "Post Job", "Post in Feed", "Respond to Referral", "Request Referral"];
    const ax = 2.65, aw = 2.3, ah = 0.4, ay = (i) => 1.85 + i * 0.48;
    const g = A.map((t, i) => U.uc(pres, s, ax, ay(i), aw, ah, t, { fontSize: 11 }));
    const member = U.actor(pres, s, 1.35, 2.15, "Member");
    const alum = U.actor(pres, s, 1.9, 4.2, "Alumnus", 0.9);
    const stud = U.actor(pres, s, 0.95, 4.9, "Student", 0.9);
    U.gen(pres, s, 1.9, 4.2, 1.45, 3.62);
    U.gen(pres, s, 0.95, 4.9, 1.25, 3.62);
    for (let i = 0; i < 8; i++) U.ln(pres, s, member.right + 0.02, member.mid + 0.05, g[i].l, g[i].cy, { width: 1 });
    U.ln(pres, s, alum.right, alum.mid + 0.1, g[8].l, g[8].cy, { width: 1 });
    U.ln(pres, s, stud.right, stud.mid + 0.1, g[9].l, g[9].cy, { width: 1 });
    // include / extend column
    const bx = 5.65, bw = 2.0;
    const ve = U.uc(pres, s, bx, ay(0), bw, ah, "Verify Email", { fontSize: 11 });
    const gr = U.uc(pres, s, bx, ay(4), bw, ah, "Get Deadline Reminder", { fontSize: 10 });
    const ra = U.uc(pres, s, bx, ay(5) + 0.06, bw, ah, "Record Application", { fontSize: 11 });
    const rp = U.uc(pres, s, bx, ay(7), bw, ah, "Report Post", { fontSize: 11 });
    U.stereo(pres, s, g[0].r, g[0].cy, ve.l, ve.cy, "«include»", { dy: -0.02 });
    U.stereo(pres, s, gr.l, gr.cy, g[4].r, g[4].cy, "«extend»", { dy: -0.02 });
    U.stereo(pres, s, g[5].r, g[5].cy, ra.l, ra.cy, "«include»", { dy: 0.0 });
    U.stereo(pres, s, rp.l, rp.cy, g[7].r, g[7].cy, "«extend»", { dy: -0.02 });
    // admin column
    const C = ["Review Membership", "Verify CGPA", "Moderate Job Post", "Resolve Reports", "Suspend Account", "View Audit Log"];
    const cx = 7.95, cw = 2.25;
    const c = C.map((t, i) => U.uc(pres, s, cx, 1.95 + i * 0.6, cw, 0.42, t, { fontSize: 11 }));
    const admin = U.actor(pres, s, 11.45, 2.9, "Admin");
    c.forEach((e) => U.ln(pres, s, admin.left - 0.02, admin.mid + 0.05, e.r, e.cy, { width: 1 }));
    s.addNotes("Primary actors: Member (generalised into Student and Alumnus, placed below their parent) on the left, Admin on the right. Every member use case is inherited by both Student and Alumnus; Request Referral is Student-only and Respond to Referral is Alumnus-only. «include» = always happens as part of the base use case (registering always sends a verification email; applying always records the application). «extend» = optional extra behaviour (a reminder only if the job is saved and the deadline is near; a report only if a member flags a post). Secondary actors are shown on the detail slides.");
  }

  // ---------- 17: Use case detail - members ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Use cases: ", "students and alumni");
    tag(s, "Detail 1 of 2");
    U.boundary(pres, s, 2.6, 1.4, 7.6, 4.75, "UniCareer Community");
    const A = ["Register Account", "Search & Filter Jobs", "Save Job", "Apply to Job", "Post in Feed", "Respond to Referral", "Request Referral"];
    const ax = 2.95, aw = 2.75, ah = 0.5, ay = (i) => 1.88 + i * 0.6;
    const g = A.map((t, i) => U.uc(pres, s, ax, ay(i), aw, ah, t, { fontSize: 13 }));
    const member = U.actor(pres, s, 1.4, 1.95, "Member", 1.1);
    const alum = U.actor(pres, s, 1.95, 4.05, "Alumnus", 1.0);
    const stud = U.actor(pres, s, 0.95, 4.7, "Student", 1.0);
    U.gen(pres, s, 1.95, 4.05, 1.5, 3.6);
    U.gen(pres, s, 0.95, 4.7, 1.3, 3.6);
    for (let i = 0; i < 5; i++) U.ln(pres, s, member.right + 0.02, member.mid + 0.05, g[i].l, g[i].cy, { width: 1 });
    U.ln(pres, s, alum.right, alum.mid + 0.1, g[5].l, g[5].cy, { width: 1 });
    U.ln(pres, s, stud.right, stud.mid + 0.1, g[6].l, g[6].cy, { width: 1 });
    const bx = 7.05, bw = 2.8;
    const ve = U.uc(pres, s, bx, ay(0), bw, ah, "Verify Email", { fontSize: 13 });
    const gr = U.uc(pres, s, bx, ay(2), bw, ah, "Get Deadline Reminder", { fontSize: 12 });
    const ra = U.uc(pres, s, bx, ay(3), bw, ah, "Record Application", { fontSize: 13 });
    const rp = U.uc(pres, s, bx, ay(4), bw, ah, "Report Post", { fontSize: 13 });
    U.stereo(pres, s, g[0].r, g[0].cy, ve.l, ve.cy, "«include»", { fontSize: 11 });
    U.stereo(pres, s, gr.l, gr.cy, g[2].r, g[2].cy, "«extend»", { fontSize: 11 });
    U.stereo(pres, s, g[3].r, g[3].cy, ra.l, ra.cy, "«include»", { fontSize: 11 });
    U.stereo(pres, s, rp.l, rp.cy, g[4].r, g[4].cy, "«extend»", { fontSize: 11 });
    // secondary actors (right)
    const mail = U.actor(pres, s, 11.4, 1.55, "Email Service", 0.95);
    const sch = U.actor(pres, s, 11.4, 3.25, "Scheduler", 0.95);
    U.ln(pres, s, mail.left, mail.mid + 0.05, ve.r, ve.cy, { width: 1 });
    U.ln(pres, s, sch.left, sch.mid + 0.05, gr.r, gr.cy, { width: 1 });
    strip(pres, s, ["Students and alumni are members", "«include» = always", "«extend» = only sometimes"]);
    s.addNotes("Secondary actors (right): Email Service = Gmail SMTP via Nodemailer, sends the verification link; Scheduler = /api/cron/reminders, scans saved/applied jobs closing within 72 hours. Log In, Submit Membership Proof and Post Job are on the overview slide and work the same way (Member association).");
  }

  // ---------- 18: Use case detail - admin ----------
  {
    const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SEC });
    header(s, "Use cases: ", "admin");
    tag(s, "Detail 2 of 2");
    U.boundary(pres, s, 2.6, 1.4, 7.6, 4.75, "UniCareer Community");
    const A = ["Review Membership", "Verify CGPA", "Moderate Job Post", "Resolve Reports", "Suspend Account", "View Audit Log"];
    const ax = 2.95, aw = 2.75, ah = 0.5, ay = (i) => 1.9 + i * 0.68;
    const g = A.map((t, i) => U.uc(pres, s, ax, ay(i), aw, ah, t, { fontSize: 13 }));
    const admin = U.actor(pres, s, 1.4, 3.0, "Admin", 1.15);
    g.forEach((e) => U.ln(pres, s, admin.right + 0.02, admin.mid + 0.05, e.l, e.cy, { width: 1 }));
    const bx = 7.05, bw = 2.8;
    const nm = U.uc(pres, s, bx, 2.05, bw, ah, "Notify Member", { fontSize: 13 });
    const al = U.uc(pres, s, bx, 4.0, bw, ah, "Write Audit Log", { fontSize: 13 });
    U.stereo(pres, s, g[0].r, g[0].cy, nm.l, nm.cy - 0.08, "", {});
    U.stereo(pres, s, g[2].r, g[2].cy, nm.l, nm.cy + 0.08, "", {});
    [0, 2, 3, 4].forEach((i, k) => U.stereo(pres, s, g[i].r, g[i].cy, al.l, al.cy - 0.15 + k * 0.1, "", {}));
    U.tx(s, "«include»", nm.l - 0.05, nm.t - 0.3, 1.2, 0.24, { fontSize: 11, italic: true, color: U.GREY });
    U.tx(s, "«include»", al.l - 0.05, al.b + 0.05, 1.2, 0.24, { fontSize: 11, italic: true, color: U.GREY });
    const mail = U.actor(pres, s, 11.4, 1.7, "Email Service", 0.95);
    U.ln(pres, s, mail.left, mail.mid + 0.05, nm.r, nm.cy, { width: 1 });
    strip(pres, s, ["Every change is logged", "Rejections come with a reason", "No self-suspension"]);
    s.addNotes("Write Audit Log is included by every admin change (member decisions, job moderation, report resolution, suspensions) and stores admin, action (16 types), target, reason and IP address in admin_audit_logs. Notify Member: rejecting a membership or a job post requires a reason (at least 5 characters) that is sent to the member in-app and by email. Self-suspension is blocked on the server.");
  }
  require('./ch3_more')(pres, SEC);
};
