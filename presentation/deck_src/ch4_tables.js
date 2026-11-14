// Chapter 4 table slides: database tables drawn as cards (name, columns, PK/FK/UQ),
// links between cards on the same slide, and a hidden "zoom" slide per card that
// shows every column. Clicking a card jumps to its zoom slide (Morph), clicking again returns.
const T = require("./theme_config");
const { HEX, W, H, M, CW, header } = T;
const U = require("./uml");
const SCHEMA = require("./data/schema.json").models;
const TABLES = {};
Object.values(SCHEMA).forEach((m) => { TABLES[m.table] = m; });

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
function uqLine(table, full) {
  const u = TABLES[table].uniques;
  if (!u.length) return null;
  const cols = u[0].split(",");
  const txt = `UQ (${cols.join(" + ")})`;
  return full || txt.length <= 34 ? txt : `UQ (${cols.length} columns together)`;
}

const HDR = 0.32, RH = 0.2, PAD = 0.08;
function cardHeight(nRows, hasUq) { return HDR + nRows * RH + (hasUq ? RH : 0) + PAD; }

// Draw a card. o: {name, ghost, legacy, rh, hdr, fs, twoCol, link}
function drawCard(pres, s, table, rows, x, y, w, o = {}) {
  const rh = o.rh || RH, hdr = o.hdr || HDR, fs = o.fs || 10, uq = uqLine(table, o.fullUq);
  const cols = o.twoCol ? 2 : 1, per = Math.ceil(rows.length / cols);
  const h = hdr + per * rh + (uq ? rh : 0) + PAD * (rh / RH);
  const id = o.name || table;
  const hdrFill = o.ghost ? "9AA5B4" : o.legacy ? "8A94A6" : HEX.accent2;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.lt1 }, line: { color: o.ghost ? "C5CDD8" : HEX.accent6, width: 1, dashType: o.ghost ? "dash" : "solid" }, objectName: `!!${id}_body` });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: hdr, fill: { color: hdrFill }, line: { color: hdrFill, width: 0.5 }, objectName: `!!${id}_hdr` });
  s.addText(table, { x: x + 0.08 * (rh / RH), y, w: w - 0.16 * (rh / RH), h: hdr, fontSize: fs + 1, bold: true, color: HEX.lt1, margin: 0, valign: "middle", isTextBox: true, objectName: `!!${id}_title` });
  const colW = w / cols;
  for (let c = 0; c < cols; c++) {
    const part = rows.slice(c * per, (c + 1) * per);
    if (!part.length) continue;
    const names = [], info = [];
    part.forEach((r, i) => {
      const br = i < part.length - 1;
      names.push({ text: r.name, options: { bold: r.tag === "PK", color: o.ghost ? "6B7280" : HEX.dk1, breakLine: br } });
      const tagColor = r.tag === "PK" ? HEX.accent1 : r.tag === "FK" ? HEX.accent2 : "6B7280";
      info.push({ text: r.type + (r.tag ? "  " : ""), options: { color: "6B7280", breakLine: !r.tag && br } });
      if (r.tag === "FK" && r.fk) {
        info.push({ text: "FK ", options: { bold: true, color: tagColor } });
        info.push({ text: r.fk, options: { color: "5B7BA6", breakLine: br } });
      } else if (r.tag) info.push({ text: r.tag, options: { bold: true, color: tagColor, breakLine: br } });
    });
    const tx0 = x + c * colW, ty = y + hdr + 0.03 * (rh / RH);
    const lsp = rh * 72;
    s.addText(names, { x: tx0 + 0.08 * (rh / RH), y: ty, w: colW * 0.46, h: part.length * rh, fontSize: fs, margin: 0, valign: "top", lineSpacing: lsp, isTextBox: true, objectName: `!!${id}_names${c}` });
    s.addText(info, { x: tx0 + colW * 0.46, y: ty, w: colW * 0.54 - 0.08 * (rh / RH), h: part.length * rh, fontSize: fs - 1, margin: 0, valign: "top", align: "right", lineSpacing: lsp, isTextBox: true, objectName: `!!${id}_info${c}` });
  }
  if (uq) s.addText(uq, { x: x + 0.08 * (rh / RH), y: y + hdr + per * rh + 0.03 * (rh / RH), w: w - 0.16 * (rh / RH), h: rh, fontSize: fs - 1, italic: true, color: HEX.accent1, margin: 0, valign: "middle", isTextBox: true, objectName: `!!${id}_uq` });
  if (o.legacy && o.zoomed) s.addText("no longer used", { x: x + w - 1.3 * (rh / RH) - 0.05, y, w: 1.25 * (rh / RH), h: hdr, fontSize: fs - 1, italic: true, color: HEX.lt1, align: "right", valign: "middle", margin: 0, isTextBox: true, objectName: `!!${id}_legacy` });
  const rowY = (name) => { const i = rows.findIndex((r) => r.name === name); return y + hdr + 0.03 + (i + 0.5) * rh; };
  return { x, y, w, h, l: x, r: x + w, t: y, b: y + h, rowY };
}

// Link child.fk row -> parent.id row. side: "h" (horizontal elbow) | "rightLoop"
function link(pres, s, child, childCol, parent, o = {}) {
  const cy = child.rowY(childCol), py = parent.rowY("id");
  const color = HEX.accent2;
  if (o.side === "rightLoop") {
    const xo = Math.max(child.r, parent.r) + 0.18;
    U.poly(pres, s, [[child.r, cy], [xo, cy], [xo, py], [parent.r, py]], { width: 1.25, color });
    U.lbl(s, "*", child.r + 0.04, cy - 0.2, 10, { bg: "none", color: HEX.dk1 });
    U.lbl(s, "1", parent.r + 0.04, py - 0.2, 10, { bg: "none", color: HEX.dk1 });
    return;
  }
  const childLeft = child.l > parent.r - 0.01;
  const cx = childLeft ? child.l : child.r, px = childLeft ? parent.r : parent.l;
  const mx = o.mx != null ? o.mx : (cx + px) / 2;
  U.poly(pres, s, [[cx, cy], [mx, cy], [mx, py], [px, py]], { width: 1.25, color });
  const many = o.one ? "1" : "*";
  U.lbl(s, many, childLeft ? cx - 0.13 : cx + 0.04, cy - 0.21, 10, { bg: "none", color: HEX.dk1 });
  U.lbl(s, "1", childLeft ? px + 0.04 : px - 0.13, py - 0.21, 10, { bg: "none", color: HEX.dk1 });
}

/*
 * spec = { title, accent, sec, cards: [{t, cols, x, y, w, ghost, legacy}], links: [[childT, col, parentT, opts]],
 *          extras: fn(pres, s, geo), note }
 * Builds base slide + one hidden zoom slide per (non-ghost) card.
 */
function tableSlide(pres, spec) {
  const MORPH = pres._morph || (pres._morph = []);
  const draw = (s, zoomT) => {
    header(s, spec.title, spec.accent);
    if (spec.phase) s.addText(spec.phase, { x: W - M - 4.2, y: 0.62, w: 4.2, h: 0.35, fontSize: 13, bold: true, color: HEX.accent2, align: "right", margin: 0, valign: "middle", isTextBox: true });
    const geo = {};
    spec.cards.forEach((c) => {
      if (c.t === zoomT) return;
      geo[c.t] = drawCard(pres, s, c.t, rowsFor(c.t, c.cols), c.x, c.y, c.w, { ghost: c.ghost, legacy: c.legacy, name: c.ghost ? `ghost_${c.t}` : c.t, showTarget: true });
    });
    // geometry for zoomed card (for links) using small size
    if (zoomT) { const c = spec.cards.find((k) => k.t === zoomT); geo[zoomT] = { ...drawGeo(c) }; }
    (spec.links || []).forEach(([ch, col, par, lo]) => link(pres, s, geo[ch], col, geo[par], lo || {}));
    if (spec.extras) spec.extras(pres, s, geo);
    s.addText("Click any table to see its real data", { x: W - M - 5, y: 6.95, w: 5, h: 0.3, fontSize: 11, italic: true, color: "6B7280", align: "right", margin: 0, valign: "middle", isTextBox: true });
    return geo;
  };
  const drawGeo = (c) => {
    const rows = rowsFor(c.t, c.cols), h = cardHeight(rows.length, !!uqLine(c.t));
    const rowY = (name) => { const i = rows.findIndex((r) => r.name === name); return c.y + HDR + 0.03 + (i + 0.5) * RH; };
    return { x: c.x, y: c.y, w: c.w, h, l: c.x, r: c.x + c.w, t: c.y, b: c.y + h, rowY };
  };

  const base = pres.addSlide({ masterName: "CONTENT", sectionTitle: spec.sec });
  const baseNum = base._slideNum;
  draw(base, null);
  base.addNotes(spec.note);
  MORPH.push(baseNum);
  const zoomables = spec.cards.filter((c) => !c.ghost);
  // click areas on base slide
  zoomables.forEach((c, i) => {
    const g = drawGeo(c);
    base.addShape(pres.shapes.RECTANGLE, { x: g.x, y: g.y, w: g.w, h: g.h, fill: { color: "FFFFFF", transparency: 100 }, line: { type: "none" }, hyperlink: { slide: baseNum + 1 + i, tooltip: `Show data in ${c.t}` }, objectName: `Click ${c.t}` });
  });
  // data slides: clicking a card opens a database-console style view with real sample rows
  zoomables.forEach((c) => {
    const z = pres.addSlide({ masterName: "CONTENT", sectionTitle: spec.sec });
    z.hidden = !process.env.SHOW_HIDDEN;
    dataGrid(pres, z, c.t, c.legacy);
    z.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: "FFFFFF", transparency: 100 }, line: { type: "none" }, hyperlink: { slide: baseNum, tooltip: "Back" }, objectName: "Click back" });
    MORPH.push(z._slideNum);
  });
}

// ---------- data grid ----------
const SAMPLES = (() => { try { return require("./data/table_samples.json").tables; } catch (e) { return {}; } })();
const TESTROW = /\b1\d{12}\b|\bStage \d+ (Student|Recruiter|Admin)|@(test|example)\.|vitest/i;
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
  s.addTable([hdr, ...body], { x: tx, y: 1.55, w: tw, colW, rowH: 0.42, fontSize: FS, fontFace: "Inter", color: HEX.dk1, fill: { color: "FFFFFF" }, border: { type: "solid", pt: 0.75, color: "E1E6EE" }, margin: [0.02, 0.08, 0.02, 0.08], valign: "middle", autoPage: false });
  const sub = `${smp.count} ${smp.count === 1 ? "row" : "rows"} in the database  ·  showing ${rows.length}  ·  ${cols.length} columns${hidden > 0 ? ` (${picked.length} shown)` : ""}${legacy ? "  ·  no longer used by the app" : ""}`;
  s.addText(sub, { x: tx, y: 1.12, w: tw, h: 0.35, fontSize: 13, color: HEX.dk2, margin: 0, valign: "middle", isTextBox: true });
  s.addText("Private values are hidden (•••)  ·  click anywhere to go back", { x: W - M - 7, y: 6.95, w: 7, h: 0.3, fontSize: 11, italic: true, color: "6B7280", align: "right", margin: 0, isTextBox: true });
  s.addNotes(`Real rows from the live Neon database (read-only export on ${(require("./data/table_samples.json").exportedAt || "").slice(0, 10)}, scripts/export-table-samples.mjs). Passwords, tokens and verification values are hidden; emails, student IDs, phone numbers and IP addresses are partly masked. PK = primary key, FK = link to another table. The full column list of every table is in UniCareer_Database_Tables.pdf.`);
}

module.exports = { tableSlide, cardHeight, rowsFor, uqLine, TABLES, HDR, RH };
