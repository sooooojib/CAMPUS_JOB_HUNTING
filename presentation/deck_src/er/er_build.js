// Full ER diagram (all 30 tables, keys only) drawn natively on a 20 x 10 in canvas.
// Output: er_canvas.pptx -> exported to PDF (vector) and PNG (for the slide).
const pptxgen = require("pptxgenjs");
const path = require("path");
const T = require("../theme_config");
const { HEX } = T;
const SCHEMA = require("../data/schema.json").models;
const TB = {}; Object.values(SCHEMA).forEach((m) => (TB[m.table] = m));

const pres = new pptxgen();
pres.defineLayout({ name: "ER", width: 20, height: 10 });
pres.layout = "ER";
pres.theme = { headFontFace: "Inter", bodyFontFace: "Inter" };
const s = pres.addSlide();
s.background = { color: "FFFFFF" };

const INK = HEX.accent2, ORANGE = HEX.accent1, GREY = "8A94A6", USERC = "B45309";
const HDR = 0.3, RH = 0.22, CW = 2.15;
const G = {};
const LEG = new Set(["resumes", "application_status_history", "company_members"]);

function rows(t) { return TB[t].fields.filter((f) => f.pk || f.fk); }
function cardH(t) { return HDR + rows(t).length * RH + 0.06; }
function cardT(t, x, y, w = CW) {
  const r = rows(t), h = cardH(t), legacy = LEG.has(t);
  const hc = legacy ? GREY : INK;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: "FFFFFF" }, line: { color: "B8C4D4", width: 0.75, dashType: legacy ? "dash" : "solid" } });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: HDR, fill: { color: hc }, line: { color: hc, width: 0.5 } });
  s.addText(t, { x: x + 0.07, y, w: w - 0.1, h: HDR, fontSize: 11, bold: true, color: "FFFFFF", margin: 0, valign: "middle" });
  const ry = {};
  r.forEach((f, i) => {
    const yy = y + HDR + 0.03 + i * RH;
    ry[f.name] = yy + RH / 2;
    s.addText(f.name, { x: x + 0.07, y: yy, w: w * 0.8, h: RH, fontSize: 9.5, bold: !!f.pk, color: HEX.dk1, margin: 0, valign: "middle" });
    const user = f.fk === "users";
    s.addText(f.pk ? "PK" : user ? "FK users" : "FK", { x: x + w * 0.55, y: yy, w: w * 0.45 - 0.07, h: RH, fontSize: 8.5, bold: true, color: f.pk ? ORANGE : user ? USERC : INK, align: "right", margin: 0, valign: "middle" });
  });
  G[t] = { x, y, w, h, l: x, r: x + w, t: y, b: y + h, cx: x + w / 2, ry };
  return G[t];
}
function line(pts, o = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.0001), h: Math.max(Math.abs(y2 - y1), 0.0001), flipH: x2 < x1, flipV: y2 < y1,
      line: { color: o.color || INK, width: o.width || 1.1, dashType: o.dash ? "dash" : "solid" } });
  }
}
function lab(text, x, y, o = {}) { s.addText(text, { x: x - 0.12, y: y - 0.12, w: 0.24, h: 0.24, fontSize: o.fs || 10, bold: true, color: o.color || HEX.dk1, align: "center", valign: "middle", margin: 0 }); }
function cluster(name, x, y, w, h, fill, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.15, fill: { color: fill }, line: { color: o.line || fill, width: 1, dashType: o.dash ? "dash" : "solid" } });
  s.addText(name, { x: x + 0.15, y: y + 0.06, w: w - 0.3, h: 0.32, fontSize: 14, bold: true, color: o.color || INK, margin: 0, valign: "middle" });
}

// ---------- clusters ----------
cluster("People and login", 0.25, 0.2, 19.5, 2.55, "E0E9F4");
cluster("Community and referrals", 0.25, 3.05, 7.0, 6.1, "E2EDF0");
cluster("Jobs and applications", 12.75, 3.05, 7.0, 4.15, "FCEADC");
cluster("Left over (no longer used)", 12.75, 7.4, 7.0, 1.75, "F3F4F6", { line: "B8C0CC", dash: true, color: "6B7280" });
cluster("Alerts and calendar", 7.55, 5.15, 4.9, 2.55, "EDE9F6");
cluster("Admin", 7.55, 7.9, 4.9, 1.25, "F3F4F6");

// ---------- People row ----------
const py = 0.7;
let px = 0.45;
["departments", "skills", "verifications"].forEach((t) => { cardT(t, px, py, 1.75); px += 1.9; });
px = 6.4;
["profiles", "membership_requests", "academic_records", "sessions", "accounts"].forEach((t) => { cardT(t, px, py); px += 2.65; });
// users hub
const u = { x: 8.6, y: 3.5, w: 2.8, h: 0.95 };
s.addShape(pres.shapes.RECTANGLE, { x: u.x, y: u.y, w: u.w, h: u.h, fill: { color: "FFFFFF" }, line: { color: ORANGE, width: 2 } });
s.addShape(pres.shapes.RECTANGLE, { x: u.x, y: u.y, w: u.w, h: 0.4, fill: { color: ORANGE }, line: { color: ORANGE, width: 0.5 } });
s.addText("users", { x: u.x + 0.1, y: u.y, w: u.w - 0.2, h: 0.4, fontSize: 15, bold: true, color: "FFFFFF", margin: 0, valign: "middle" });
s.addText([{ text: "id", options: { bold: true, color: HEX.dk1 } }], { x: u.x + 0.1, y: u.y + 0.45, w: 1.2, h: 0.4, fontSize: 12, margin: 0, valign: "middle" });
s.addText("PK", { x: u.x + u.w - 0.6, y: u.y + 0.45, w: 0.5, h: 0.4, fontSize: 11, bold: true, color: ORANGE, align: "right", margin: 0, valign: "middle" });
const ucx = u.x + u.w / 2, ucy = u.y + u.h / 2;

// People -> users bus (each card's userId row drops to a trunk)
const trunkY = 2.95;
["profiles", "membership_requests", "academic_records", "sessions", "accounts"].forEach((t) => {
  const g = G[t];
  line([[g.cx, g.b], [g.cx, trunkY]], { color: USERC });
  lab(t === "profiles" ? "1" : "*", g.cx + 0.14, g.b + 0.13, { color: USERC });
});
line([[G.profiles.cx, trunkY], [G.accounts.cx, trunkY]], { color: USERC });
line([[ucx, trunkY], [ucx, u.y]], { color: USERC, width: 1.8 });

// ---------- Community ----------
const c1 = 0.45, c2 = 2.75, c3 = 5.0, cw2 = 2.05;
cardT("connections", c1, 3.6, cw2);
cardT("referral_requests", c1, 5.0, cw2);
cardT("post_reactions", c2, 3.6, cw2);
cardT("post_bookmarks", c2, 4.95, cw2);
cardT("comments", c2, 6.4, cw2);
cardT("posts", c3, 4.3, cw2);
cardT("content_reports", c3, 6.15, cw2);
function hlink(child, col, parent, mx, o = {}) {
  const c = G[child], p = G[parent], cy = c.ry[col], pyy = p.ry.id;
  const leftToRight = c.r <= p.l + 0.01;
  const cx = leftToRight ? c.r : c.l, pxx = leftToRight ? p.l : p.r;
  line([[cx, cy], [mx, cy], [mx, pyy], [pxx, pyy]], o);
  lab(o.one ? "1" : "*", leftToRight ? cx + 0.12 : cx - 0.12, cy - 0.15, { color: o.color });
  lab("1", leftToRight ? pxx - 0.12 : pxx + 0.12, pyy - 0.15, { color: o.color });
}
hlink("post_reactions", "postId", "posts", 4.9);
hlink("post_bookmarks", "postId", "posts", 4.9);
hlink("comments", "postId", "posts", 4.9);
hlink("content_reports", "commentId", "comments", 4.9 - 0.0);
// content_reports.postId -> posts (right side loop)
{ const c = G.content_reports, p = G.posts, xo = c.r + 0.12; line([[c.r, c.ry.postId], [xo, c.ry.postId], [xo, p.ry.id], [p.r, p.ry.id]]); lab("*", c.r + 0.08, c.ry.postId - 0.15); lab("1", p.r + 0.08, p.ry.id - 0.15); }
// comments.parentId self loop (left)
{ const c = G.comments, xo = c.l - 0.14; line([[c.l, c.ry.parentId], [xo, c.ry.parentId], [xo, c.ry.id], [c.l, c.ry.id]]); }
// Community -> users bus
line([[7.25, ucy], [u.x, ucy]], { color: USERC, width: 1.8 });

// ---------- Jobs ----------
const j1 = 12.95, j2 = 15.25, j3 = 17.55, jw = 2.0;
cardT("opportunity_bookmarks", j1, 3.95, jw + 0.1);
cardT("opportunity_comments", j1, 5.35, jw + 0.1);
cardT("opportunities", j2 + 0.1, 3.95, jw);
cardT("applications", j2 + 0.1, 5.55, jw);
cardT("companies", j3 + 0.05, 3.95, jw);
cardT("manual_applications", j3 + 0.05, 5.4, jw);
hlink("opportunity_bookmarks", "opportunityId", "opportunities", 15.2);
hlink("opportunity_comments", "opportunityId", "opportunities", 15.2);
hlink("opportunities", "companyId", "companies", 17.5);
// applications.opportunityId -> opportunities (right side loop)
{ const c = G.applications, p = G.opportunities, xo = c.r + 0.1; line([[c.r, c.ry.opportunityId], [xo, c.ry.opportunityId], [xo, p.ry.id], [p.r, p.ry.id]]); lab("*", c.r + 0.07, c.ry.opportunityId - 0.15); lab("1", p.r + 0.07, p.ry.id + 0.15); }
// Jobs -> users bus
line([[12.75, ucy], [u.x + u.w, ucy]], { color: USERC, width: 1.8 });

// ---------- Cross-group links ----------
// posts.attachedOpportunityId -> opportunities (over the top lane)
{
  const p = G.posts, o = G.opportunities, yRow = p.ry.attachedOpportunityId, lane = 3.25, xg = 7.42;
  line([[p.r, yRow], [xg, yRow], [xg, lane], [o.cx - 0.3, lane], [o.cx - 0.3, o.t]]);
  lab("*", p.r + 0.1, yRow - 0.15); lab("1", o.cx - 0.15, o.t - 0.15);
}
// referral_requests.companyId / opportunityId -> companies / opportunities (bottom lane)
{
  const r = G.referral_requests, laneY1 = 9.35, laneY2 = 9.5, xr = 12.6;
  const co = G.companies, op = G.opportunities;
  line([[r.l, r.ry.companyId], [0.35, r.ry.companyId], [0.35, laneY2], [19.85, laneY2], [19.85, co.ry.id], [co.r, co.ry.id]], { color: "5B7BA6" });
  line([[r.l, r.ry.opportunityId], [0.38 + 0.12, r.ry.opportunityId]], { color: "5B7BA6" });
  line([[0.5, r.ry.opportunityId], [0.5, laneY1], [xr, laneY1], [xr, 3.4], [op.cx + 0.3, 3.4], [op.cx + 0.3, op.t]], { color: "5B7BA6" });
  lab("*", r.l - 0.1, r.ry.companyId - 0.15); lab("1", co.r + 0.12, co.ry.id - 0.15);
}

// ---------- Alerts + Admin ----------
cardT("notifications", 7.7, 5.6, 2.25);
cardT("notification_preferences", 10.1, 5.6, 2.25);
cardT("career_calendar_events", 7.7, 6.6, 2.25);
cardT("deadline_reminder_logs", 10.1, 6.6, 2.25);
cardT("admin_audit_logs", 8.95, 8.3, 2.25);
line([[ucx, 5.15], [ucx, u.y + u.h]], { color: USERC, width: 1.8 });
line([[7.6, 8.55], [7.45, 8.55], [7.45, 4.25], [u.x, 4.25]], { color: USERC });
line([[8.95, 8.55], [7.6, 8.55]], { color: USERC });

// ---------- Left over ----------
cardT("application_status_history", 12.95, 7.85, 2.3);
cardT("resumes", 15.45, 7.85, 1.75);
cardT("company_members", 17.4, 7.85, 2.2);
{ const a = G.application_status_history, ap = G.applications; line([[a.cx, a.t], [a.cx, 7.55], [15.29, 7.55], [15.29, ap.ry.id + 0.05], [ap.l, ap.ry.id + 0.05]], { color: GREY, dash: true }); }
{ const rr = G.resumes, ap = G.applications; line([[ap.l + 0.3, ap.b], [ap.l + 0.3, 7.65], [rr.cx, 7.65], [rr.cx, rr.t]], { color: GREY, dash: true }); }
{ const cm = G.company_members, co = G.companies; line([[cm.r, cm.ry.companyId], [19.7, cm.ry.companyId], [19.7, co.ry.id + 0.1], [co.r, co.ry.id + 0.1]], { color: GREY, dash: true }); }

// legend
s.addText([
  { text: "PK", options: { bold: true, color: ORANGE } }, { text: " primary key    ", options: { color: HEX.dk2 } },
  { text: "FK", options: { bold: true, color: INK } }, { text: " link to another table    ", options: { color: HEX.dk2 } },
  { text: "FK users", options: { bold: true, color: USERC } }, { text: " link to users (one thick line per group)    ", options: { color: HEX.dk2 } },
  { text: "1  *", options: { bold: true, color: HEX.dk1 } }, { text: " one to many", options: { color: HEX.dk2 } },
], { x: 7.55, y: 9.55, w: 12.2, h: 0.35, fontSize: 11, margin: 0, valign: "middle" });

pres.writeFile({ fileName: path.join(__dirname, "er_canvas.pptx") }).then(() => console.log("ok"));
