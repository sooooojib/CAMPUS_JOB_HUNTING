// Chapter 4 table slides (v5): every column of every table, one-line purpose, live row count,
// and tidy links: children sit next to their parent and join one straight "bus" line per side.
// Clicking a table opens a hidden slide with real rows (dataGrid).
const T = require("./theme_config");
const { HEX, W, H, M, CW, header } = T;
const U = require("./uml");
const SCHEMA = require("./data/schema.json").models;
const TABLES = {};
Object.values(SCHEMA).forEach((m) => { TABLES[m.table] = m; });
const COUNTS = (() => { try { const t = require("./data/table_samples.json").tables; const o = {}; for (const k in t) o[k] = t[k].count; return o; } catch (e) { return {}; } })();

const DESC = {
  users: "Every member's account", profiles: "Department, ID, CGPA, bio and links", membership_requests: "Join requests the admin reviews",
  academic_records: "GPA and credits for each semester", sessions: "Who is logged in, on which device", accounts: "Login method and hashed password",
  verifications: "Email-link and password-reset codes", departments: "List of JnU departments", skills: "List of skills members can pick",
  opportunities: "Job posts shared by members", companies: "Companies that jobs belong to", opportunity_bookmarks: "Jobs a member saved",
  opportunity_comments: "Questions under a job post", applications: "\"I applied\" records for UniCareer jobs", application_status_history: "Every status change of an application",
  manual_applications: "Jobs a member tracks from outside", posts: "Community feed posts", comments: "Comments and threaded replies",
  post_reactions: "Likes on posts", post_bookmarks: "Posts a member saved", content_reports: "Reports of bad posts or comments",
  connections: "Member-to-member connections", referral_requests: "Referral asks from students to alumni", notifications: "In-app alerts",
  notification_preferences: "Alert on/off switches for each member", career_calendar_events: "Reminders members add to the calendar",
  deadline_reminder_logs: "Deadline alerts already sent", admin_audit_logs: "Every admin action: who, what, why",
  resumes: "CV uploads (removed)", company_members: "Company accounts (removed)",
};

const BUILTIN = { String: "text", Int: "int", Float: "float", Boolean: "bool", DateTime: "timestamp", Json: "json" };
function typeLabel(t) {
  const list = t.endsWith("[]"), base = t.replace(/[?\[\]]/g, "");
  const b = BUILTIN[base] || "enum";
  return list ? `${b}[]` : b;
}
function rowsFor(table, cols) {
  const m = TABLES[table];
  if (!m) throw new Error("no table " + table);
  const pick = cols ? cols.map((c) => { const f = m.fields.find((x) => x.name === c); if (!f) throw new Error(`${table}.${c}`); return f; }) : m.fields;
  return pick.map((f) => ({ name: f.name, type: typeLabel(f.type), tag: f.pk ? "PK" : f.fk ? "FK" : f.uq ? "UQ" : "", fk: f.fk }));
}
function uqLine(table) {
  const u = TABLES[table].uniques;
  if (!u.length) return null;
  const cols = u[0].split(",");
  return cols.length > 3 ? `UQ (${cols.length} columns together)` : `UQ (${cols.join(" + ")})`;
}

const HDR = 0.4, DSC = 0, RH = 0.215, PAD = 0.08;
const SH = () => ({ type: "outer", color: "1E3A5F", opacity: 0.12, blur: 10, offset: 2, angle: 90 });
function cardHeight(table, o = {}) {
  const n = o.cols ? o.cols.length : TABLES[table].fields.length, per = Math.ceil(n / (o.twoCol ? 2 : 1));
  return HDR + (o.anchor ? 0 : DSC) + per * RH + ((!o.cols || o.uq) && uqLine(table) ? RH : 0) + PAD;
}

// o: {cols (subset, for anchor cards), twoCol, anchor (slim parent shown for context), legacy, hi: [fk cols to highlight]}
function drawCard(pres, s, table, x, y, w, o = {}) {
  const rows = rowsFor(table, o.cols), uq = (!o.cols || o.uq) ? uqLine(table) : null;
  const ncol = o.twoCol ? 2 : 1, per = Math.ceil(rows.length / ncol);
  const h = cardHeight(table, o), dsc = o.anchor ? 0 : DSC;
  const hdrFill = o.anchor ? "8FA3BB" : o.legacy ? "9AA5B4" : HEX.accent2;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: o.legacy ? "F7F8FA" : HEX.lt1 }, line: { color: o.anchor || o.legacy ? "C5CDD8" : "D3DDE8", width: 0.75, dashType: o.anchor || o.legacy ? "dash" : "solid" }, shadow: o.anchor ? undefined : SH(), objectName: `Table ${table}` });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: HDR, fill: { color: hdrFill }, line: { type: "none" }, objectName: `Header ${table}` });
  const cnt = COUNTS[table];
  s.addText([{ text: table, options: { bold: true, color: HEX.lt1 } }], { x: x + 0.12, y, w: w - 0.2, h: HDR, fontSize: 13, margin: 0, valign: "middle" });
  if (o.count && cnt != null) s.addText(`${cnt} ${cnt === 1 ? "row" : "rows"}`, { x: x + w - 1.1, y, w: 1.0, h: HDR, fontSize: 10, bold: true, color: o.legacy ? "EEF0F3" : "F2A77F", align: "right", margin: 0, valign: "middle" });
  if (o.anchor && o.anchorNote) s.addText("on another slide", { x: x + 0.1, y, w: w - 0.2, h: HDR, fontSize: 9, italic: true, color: "EEF3F8", align: "right", margin: 0, valign: "middle" });
  if (dsc) s.addText(DESC[table] || "", { x: x + 0.1, y: y + HDR, w: w - 0.2, h: dsc, fontSize: 10, italic: true, color: "5B6577", margin: 0, valign: "middle" });
  const colW = w / ncol, ty = y + HDR + dsc;
  (o.hi || []).forEach((c) => {
    const i = rows.findIndex((r) => r.name === c); if (i < 0) return;
    const col = Math.floor(i / per), k = i % per;
    s.addShape(pres.shapes.RECTANGLE, { x: x + col * colW + 0.03, y: ty + k * RH, w: colW - 0.06, h: RH, fill: { color: HEX.accent4 }, line: { type: "none" }, objectName: `Link row ${table}.${c}` });
  });
  for (let c = 0; c < ncol; c++) {
    const part = rows.slice(c * per, (c + 1) * per);
    if (!part.length) continue;
    const names = [], info = [];
    part.forEach((r, i) => {
      const br = i < part.length - 1;
      names.push({ text: r.name, options: { bold: r.tag === "PK", color: o.legacy ? "6B7280" : HEX.dk1, breakLine: br } });
      const tagColor = r.tag === "PK" ? HEX.accent1 : r.tag === "FK" ? HEX.accent2 : "6B7280";
      info.push({ text: r.type + (r.tag ? "  " : ""), options: { color: "8A94A6", breakLine: !r.tag && br } });
      if (r.tag === "FK" && r.fk) { info.push({ text: "FK ", options: { bold: true, color: tagColor } }); info.push({ text: r.fk, options: { color: "5B7BA6", breakLine: br } }); }
      else if (r.tag) info.push({ text: r.tag, options: { bold: true, color: tagColor, breakLine: br } });
    });
    const tx0 = x + c * colW;
    s.addText(names, { x: tx0 + 0.12, y: ty + 0.02, w: colW * 0.64, h: part.length * RH, fontSize: 11, margin: 0, valign: "top", lineSpacing: RH * 72, fit: "none" });
    s.addText(info, { x: tx0 + colW * 0.36, y: ty + 0.02, w: colW * 0.64 - 0.12, h: part.length * RH, fontSize: 9.5, margin: 0, valign: "top", align: "right", lineSpacing: RH * 72, fit: "none" });
  }
  if (uq) s.addText(uq, { x: x + 0.12, y: ty + per * RH + 0.02, w: w - 0.2, h: RH, fontSize: 10, italic: true, color: HEX.accent1, margin: 0, valign: "middle" });
  const rowY = (name) => { const i = rows.findIndex((r) => r.name === name); if (i < 0) throw new Error(`${table}.${name} not on card`); return ty + 0.02 + (i % per + 0.5) * RH; };
  return { x, y, w, h, l: x, r: x + w, t: y, b: y + h, cx: x + w / 2, rowY };
}

const LINE = { width: 1.5, color: HEX.accent2 };
function many(s, x, y, right) { U.lbl(s, "many", right ? x + 0.02 : x - 0.39, y - 0.21, 8.5, { bg: "none", color: HEX.accent1, italic: true }); }
function one(s, x, y, right) { U.lbl(s, "1", right ? x + 0.05 : x - 0.15, y - 0.2, 9, { bg: "none", color: HEX.accent1, bold: true }); }
function dot(pres, s, x, y) { s.addShape(pres.shapes.OVAL, { x: x - 0.045, y: y - 0.045, w: 0.09, h: 0.09, fill: { color: HEX.accent2 }, line: { type: "none" }, objectName: "Junction" }); }

// One bus per side: every child FK row runs straight across to a vertical bus, the bus enters the parent at its id row.
// side: "left" (children on the left of the parent) | "right"
function bus(pres, s, parent, kids, side, o = {}) {
  const left = side === "left";
  const bx = o.x != null ? o.x : left ? parent.l - (o.gap || 0.2) : parent.r + (o.gap || 0.2);
  const py = parent.rowY("id"), pe = left ? parent.l : parent.r;
  const ys = [py];
  kids.forEach(([g, col, isOne]) => {
    const y = g.rowY(col), ce = left ? g.r : g.l;
    U.ln(pres, s, ce, y, bx, y, LINE);
    if (isOne) one(s, ce, y, left); else many(s, ce, y, left);
    if (Math.abs(y - py) > 0.01) dot(pres, s, bx, y);
    ys.push(y);
  });
  U.ln(pres, s, bx, Math.min(...ys), bx, Math.max(...ys), LINE);
  U.ln(pres, s, bx, py, pe, py, LINE);
  one(s, pe, py, !left);
}
// Direct link child.col -> parent.id when they sit side by side
function direct(pres, s, child, col, parent, isOne) {
  const y1 = child.rowY(col), y2 = parent.rowY("id");
  const childLeft = child.r <= parent.l;
  const x1 = childLeft ? child.r : child.l, x2 = childLeft ? parent.l : parent.r, mx = (x1 + x2) / 2;
  U.poly(pres, s, [[x1, y1], [mx, y1], [mx, y2], [x2, y2]], LINE);
  if (isOne) one(s, x1, y1, childLeft); else many(s, x1, y1, childLeft);
  one(s, x2, y2, !childLeft);
}

/* spec = { title:[plain,accent], group, cards:[{t,x,y,w,twoCol,anchor,cols,legacy,hi}], draw(pres,s,geo), note } */
function tableSlide(pres, spec) {
  const MORPH = pres._morph || (pres._morph = []);
  T.setChapter(4, `05 · DATABASE  ·  ${spec.group.toUpperCase()}`);
  const base = pres.addSlide({ masterName: "CONTENT", sectionTitle: spec.sec });
  const baseNum = base._slideNum;
  header(base, spec.title[0], spec.title[1]);
  const geo = {};
  spec.cards.forEach((c) => { geo[c.t] = drawCard(pres, base, c.t, c.x, c.y, c.w, c); });
  if (spec.draw) spec.draw(pres, base, geo);
  base.addText([{ text: spec.count || "", options: { bold: true, color: HEX.accent2 } }, { text: (spec.count ? "   ·   " : "") + "click a table to see real rows", options: { italic: true, color: "8A94A6" } }], { x: W - M - 5, y: 0.62, w: 5, h: 0.3, fontSize: 11, italic: true, color: "8A94A6", align: "right", margin: 0, valign: "middle" });
  base.addNotes(spec.note);
  const zoomables = spec.cards.filter((c) => !c.anchor);
  zoomables.forEach((c, i) => {
    const g = geo[c.t];
    base.addShape(pres.shapes.RECTANGLE, { x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: "FFFFFF", transparency: 100 }, line: { type: "none" }, hyperlink: { slide: baseNum + 1 + i, tooltip: `Show rows in ${c.t}` }, objectName: `Click ${c.t}` });
  });
  zoomables.forEach((c) => {
    const z = pres.addSlide({ masterName: "CONTENT", sectionTitle: spec.sec });
    z.hidden = !process.env.SHOW_HIDDEN;
    dataGrid(pres, z, c.t, c.legacy);
    z.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: "FFFFFF", transparency: 100 }, line: { type: "none" }, hyperlink: { slide: baseNum, tooltip: "Back" }, objectName: "Click back" });
    MORPH.push(z._slideNum);
  });
  return base;
}

// ---------- data grid ----------
const SAMPLES = (() => { try { return require("./data/table_samples.json").tables; } catch (e) { return {}; } })();
const TESTROW = /\b1\d{12}\b|\bStage \d+ (Student|Recruiter|Admin)|@(test|example)\.|vitest|BUY CHEAP CRYPTO/i;
const PG = { text: "text", varchar: "varchar", int4: "int", float8: "float", bool: "bool", timestamp: "timestamp", timestamptz: "timestamptz", jsonb: "jsonb", _text: "text[]" };
function dataGrid(pres, s, table, legacy) {
  const smp = SAMPLES[table], meta = TABLES[table];
  const fkOf = {}, pkOf = {};
  const nk = (n) => n.replace(/_/g, "").toLowerCase();
  meta.fields.forEach((f) => { if (f.fk) fkOf[nk(f.name)] = f.fk; if (f.pk) pkOf[nk(f.name)] = true; });
  s.addText([{ text: table, options: { color: HEX.dk1 } }], { placeholder: "title" });
  if (!smp) { s.addText("Run scripts/export-table-samples.mjs to add sample rows.", { x: M, y: 2, w: CW, h: 0.5, fontSize: 16, color: "6B7280", isTextBox: true }); return; }
  let rows = smp.rows.filter((r) => !Object.values(r).some((v) => typeof v === "string" && TESTROW.test(v)));
  if (rows.length < Math.min(3, smp.rows.length)) rows = smp.rows; // fall back to whatever exists
  const cols = smp.columns.map((c) => ({ ...c, type: PG[c.type] || c.type }));
  const CH = 0.084, FS = 10.5, maxW = W - 2 * 0.45;
  const widthOf = (c) => {
    const vals = rows.map((r) => (r[c.name] == null ? "NULL" : String(r[c.name])).length);
    const head = (c.name.length + c.type.length + 4) * CH + 0.25;
    const idish = /^id$|Id$|_id$/.test(c.name);
    return Math.max(0.85, Math.min(idish ? 1.35 : 2.6, Math.max(head, Math.max(0, ...vals) * CH + 0.25)));
  };
  const picked = []; let used = 0;
  for (const c of cols) { const w = widthOf(c); if (used + w > maxW - 1.05 && picked.length < cols.length) break; picked.push({ ...c, w }); used += w; }
  const hidden = cols.length - picked.length;
  const fit = (v, w) => { const n = Math.max(4, Math.floor((w - 0.22) / 0.092)); return v.length > n ? v.slice(0, n - 1) + "…" : v; };
  const hdr = picked.map((c) => ({
    text: [
      ...(pkOf[nk(c.name)] || fkOf[nk(c.name)] ? [{ text: pkOf[nk(c.name)] ? "PK " : "FK ", options: { bold: true, color: pkOf[nk(c.name)] ? HEX.accent1 : HEX.accent2, fontSize: 8.5 } }] : []),
      { text: c.name, options: { bold: true, color: HEX.dk1 } },
      { text: "  " + c.type, options: { color: "8A94A6", fontSize: 9 } },
    ], options: { fill: { color: "F7F9FC" }, valign: "middle" },
  }));
  if (hidden > 0) hdr.push({ text: `+${hidden} more`, options: { italic: true, color: "8A94A6", fill: { color: "F7F9FC" }, align: "center" } });
  const body = rows.map((r) => {
    const cells = picked.map((c) => {
      const v = r[c.name];
      if (v == null) return { text: "NULL", options: { color: "B0B8C4", italic: true } };
      return { text: fit(String(v), c.w), options: { color: String(v).startsWith("••••") ? "8A94A6" : HEX.dk1 } };
    });
    if (hidden > 0) cells.push({ text: "", options: {} });
    return cells;
  });
  if (!rows.length) { const e = picked.map(() => ({ text: "", options: {} })); e[0] = { text: "No rows yet", options: { italic: true, color: "8A94A6" } }; if (hidden > 0) e.push({ text: "" }); body.push(e); }
  const colW = picked.map((c) => c.w); if (hidden > 0) colW.push(1.0);
  const tw = colW.reduce((a, b) => a + b, 0), tx = (W - tw) / 2;
  s.addTable([hdr, ...body], { x: tx, y: 1.55, w: tw, colW, rowH: rows.length > 8 ? 0.38 : 0.42, fontSize: FS, fontFace: "Calibri", color: HEX.dk1, fill: { color: "FFFFFF" }, border: { type: "solid", pt: 0.75, color: "E1E6EE" }, margin: [0.02, 0.08, 0.02, 0.08], valign: "middle", autoPage: false });
  const sub = `${smp.count} ${smp.count === 1 ? "row" : "rows"} in the database  ·  showing ${rows.length}  ·  ${cols.length} columns${hidden > 0 ? ` (${picked.length} shown)` : ""}${legacy ? "  ·  nothing writes to it any more" : ""}`;
  s.addText(sub, { x: tx, y: 1.12, w: tw, h: 0.35, fontSize: 13, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
  s.addText("Private values are hidden (•••)  ·  click anywhere to go back", { x: W - M - 7, y: 6.95, w: 7, h: 0.3, fontSize: 11, italic: true, color: "6B7280", align: "right", margin: 0, isTextBox: true });
  s.addNotes(`Real rows from the live Neon database (read-only export on ${(require("./data/table_samples.json").exportedAt || "").slice(0, 10)}, scripts/export-table-samples.mjs). Passwords, tokens and verification values are hidden; emails, student IDs, phone numbers and IP addresses are partly masked. PK = primary key, FK = link to another table. The full column list of every table is in UniCareer_Database_Tables.pdf.`);
}

module.exports = { tableSlide, drawCard, cardHeight, bus, direct, rowsFor, TABLES, COUNTS, HDR, DSC, RH };
