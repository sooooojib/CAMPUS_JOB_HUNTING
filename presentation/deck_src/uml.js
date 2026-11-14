// Native UML drawing helpers (editable PowerPoint shapes), styled after the
// course's UML lecture slides: stick-figure actors, system boundary box,
// ellipse use cases, dashed «include»/«extend» arrows, hollow-triangle
// generalization, sequence lifelines with activation bars and alt frames,
// 3-compartment class boxes with multiplicities, activity swimlanes with
// initial/final nodes, decision diamonds and fork/join bars.
const { HEX, M } = require("./theme_config");

const INK = HEX.accent2; // navy lines
const GREY = "6B7280";

function ln(pres, s, x1, y1, x2, y2, o = {}) {
  const line = { color: o.color || INK, width: o.width || 1.25 };
  if (o.dash) line.dashType = "dash";
  if (o.end) line.endArrowType = o.end;
  if (o.begin) line.beginArrowType = o.begin;
  s.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.0001), h: Math.max(Math.abs(y2 - y1), 0.0001),
    flipH: x2 < x1, flipV: y2 < y1, line, objectName: o.name || "Line",
  });
}
// polyline: arrow only on last segment
function poly(pres, s, pts, o = {}) {
  for (let i = 0; i < pts.length - 1; i++) {
    const last = i === pts.length - 2;
    ln(pres, s, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], Object.assign({}, o, { end: last ? o.end : undefined }));
  }
}
function tw(text, fs) { return text.length * fs * 0.0088 + 0.14; }
// tight label with white background so lines behind it are hidden
function lbl(s, text, x, y, fs, o = {}) {
  const w = tw(text, fs), h = fs / 72 + 0.07;
  const left = o.align === "right" ? x - w : o.align === "center" ? x - w / 2 : x;
  s.addText(text, { x: left, y, w, h, fontSize: fs, color: o.color || HEX.dk1, italic: !!o.italic, bold: !!o.bold, align: "center", valign: "middle", margin: 0, isTextBox: true, ...(o.bg === "none" ? {} : { fill: { color: o.bg || HEX.lt1 } }) });
  return { l: left, r: left + w, t: y, b: y + h };
}
function tx(s, text, x, y, w, h, o = {}) {
  s.addText(text, Object.assign({ x, y, w, h, fontSize: 12, color: HEX.dk1, margin: 0, valign: "middle", align: "center", isTextBox: true }, o));
}

// Hollow triangle arrow (generalization), from child (x1,y1) to parent tip (x2,y2)
function gen(pres, s, x1, y1, x2, y2, size = 0.2) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const bx = x2 - ux * size, by = y2 - uy * size;
  ln(pres, s, x1, y1, bx, by, { name: "Generalization" });
  const cx = x2 - (ux * size) / 2, cy = y2 - (uy * size) / 2;
  s.addShape(pres.shapes.ISOSCELES_TRIANGLE, { x: cx - size / 2, y: cy - size / 2, w: size, h: size, rotate: (Math.atan2(dx, -dy) * 180) / Math.PI, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: "Generalization head" });
}

// Stick-figure actor; returns anchor points
function o_bg() { return undefined; }
function actor(pres, s, cx, top, name, sc = 1) {
  const hd = 0.3 * sc;
  s.addShape(pres.shapes.OVAL, { x: cx - hd / 2, y: top, w: hd, h: hd, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.5 }, objectName: `Actor ${name} head` });
  const neck = top + hd, hip = top + hd + 0.38 * sc, foot = hip + 0.32 * sc;
  ln(pres, s, cx, neck, cx, hip, { width: 1.5 });
  ln(pres, s, cx - 0.24 * sc, neck + 0.12 * sc, cx + 0.24 * sc, neck + 0.12 * sc, { width: 1.5 });
  ln(pres, s, cx, hip, cx - 0.2 * sc, foot, { width: 1.5 });
  ln(pres, s, cx, hip, cx + 0.2 * sc, foot, { width: 1.5 });
  if (name) lbl(s, name, cx, foot + 0.03, Math.round(12 * Math.min(sc, 1.15)), { align: "center", bold: true, bg: "none" });
  return { top, head: top, mid: neck + 0.15 * sc, bottom: foot + 0.33, left: cx - 0.26 * sc, right: cx + 0.26 * sc, cx };
}

// Use-case ellipse; returns geometry
function uc(pres, s, x, y, w, h, label, o = {}) {
  s.addShape(pres.shapes.OVAL, { x, y, w, h, fill: { color: o.fill || HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: `Use case ${label}` });
  tx(s, label, x + 0.08, y, w - 0.16, h, { fontSize: o.fontSize || 12 });
  return { x, y, w, h, l: x, r: x + w, cy: y + h / 2, cx: x + w / 2, t: y, b: y + h };
}
function boundary(pres, s, x, y, w, h, name) {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.5 }, objectName: "System boundary" });
  tx(s, name, x + 0.15, y + 0.06, w - 0.3, 0.3, { fontSize: 13, bold: true, align: "left" });
}
// dashed stereotype arrow with label
function stereo(pres, s, x1, y1, x2, y2, label, o = {}) {
  ln(pres, s, x1, y1, x2, y2, { dash: true, end: "arrow", name: label });
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  tx(s, label, mx - 0.6 + (o.dx || 0), my - 0.26 + (o.dy || 0), 1.2, 0.22, { fontSize: o.fontSize || 9, color: GREY, italic: true });
}

// ---------- Sequence ----------
function lifeline(pres, s, cx, top, bottom, label, o = {}) {
  if (o.actor) {
    actor(pres, s, cx, top - 0.05, label, 0.75);
  } else {
    const w = o.w || 1.55, h = 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x: cx - w / 2, y: top, w, h, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: `Lifeline ${label}` });
    tx(s, label, cx - w / 2, top, w, h, { fontSize: o.fontSize || 11, underline: { style: "sng" } });
  }
  const start = o.actor ? top + 0.95 : top + 0.42;
  ln(pres, s, cx, start, cx, bottom, { dash: true, color: GREY, width: 1, name: `Lifeline ${label} line` });
}
function activation(pres, s, cx, y1, y2) {
  s.addShape(pres.shapes.RECTANGLE, { x: cx - 0.07, y: y1, w: 0.14, h: y2 - y1, fill: { color: HEX.accent3 }, line: { color: INK, width: 1 }, objectName: "Activation" });
}
function msg(pres, s, x1, x2, y, label, o = {}) {
  const ret = o.ret;
  ln(pres, s, x1, y, x2, y, { dash: ret, end: ret ? "arrow" : "triangle", color: ret ? GREY : INK, width: 1.25, name: `Message ${label}` });
  if (label) { const fs = o.fontSize || 10; lbl(s, label, (x1 + x2) / 2, y - fs / 72 - 0.11, fs, { align: "center", italic: !!ret, color: ret ? GREY : HEX.dk1 }); }
}
function selfMsg(pres, s, x, y, label, o = {}) {
  const w = 0.32, h = o.h || 0.18, fs = o.fontSize || 10;
  poly(pres, s, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { end: "triangle", width: 1.25 });
  lbl(s, label, x + w + 0.06, y + h / 2 - (fs / 72 + 0.07) / 2, fs, {});
}
// combined fragment: guards = [{y, text, x, divider}]
function frame(pres, s, x, y, w, h, kind, guards = [], o = {}) {
  const col = o.color || HEX.accent1, fs = o.fontSize || 10;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { type: "none" }, line: { color: col, width: 1.25 }, objectName: `Frame ${kind}` });
  const tw0 = kind.length * 0.09 + 0.3;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: tw0, h: 0.24, fill: { color: col }, line: { color: col, width: 0 }, objectName: `Frame ${kind} tag` });
  tx(s, kind, x, y, tw0, 0.24, { fontSize: 10, bold: true, color: HEX.lt1 });
  guards.forEach((g) => {
    if (g.divider) ln(pres, s, x, g.y, x + w, g.y, { dash: true, color: col, width: 1 });
    lbl(s, g.text, g.x ?? x + 0.08, g.gy ?? g.y + 0.03, fs, { italic: true, color: col });
  });
  if (o.ref) tx(s, o.ref, x + tw0, y, w - tw0, h, { fontSize: fs + 1, bold: true });
}

// ---------- Class ----------
// attrs/ops: arrays of strings. Returns geometry.
function klass(pres, s, x, y, w, name, attrs, ops, o = {}) {
  const fs = o.fontSize || 10, lh = (fs * 1.45) / 72, nh = (fs + 2) * 1.6 / 72 + 0.06;
  const ah = Math.max(attrs.length, 1) * lh + 0.08, oh = Math.max(ops.length, 1) * lh + 0.08;
  const h = nh + ah + oh;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: `Class ${name}` });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: nh, fill: { color: HEX.accent3 }, line: { color: INK, width: 1.25 }, objectName: `Class ${name} name` });
  tx(s, name, x, y, w, nh, { fontSize: fs + 2, bold: true });
  ln(pres, s, x, y + nh + ah, x + w, y + nh + ah, { width: 1 });
  s.addText(attrs.map((a, i) => ({ text: a, options: { breakLine: i < attrs.length - 1 } })), { x: x + 0.08, y: y + nh + 0.04, w: w - 0.16, h: ah - 0.08, fontSize: fs, color: HEX.dk1, margin: 0, valign: "top", isTextBox: true, lineSpacingMultiple: 1.0 });
  s.addText(ops.map((a, i) => ({ text: a, options: { breakLine: i < ops.length - 1 } })), { x: x + 0.08, y: y + nh + ah + 0.04, w: w - 0.16, h: oh - 0.08, fontSize: fs, color: HEX.accent1, margin: 0, valign: "top", isTextBox: true });
  return { x, y, w, h, l: x, r: x + w, t: y, b: y + h, cx: x + w / 2, cy: y + h / 2 };
}
// association line with multiplicities at each end; o.comp = composition diamond at start
// association; e1/e2 = edge of the box each end sits on: "t","b","l","r"
function assoc(pres, s, x1, y1, x2, y2, m1, m2, o = {}) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  let sx = x1, sy = y1;
  if (o.comp) {
    const dl = 0.26, dw = 0.15, cx = x1 + ux * dl / 2, cy = y1 + uy * dl / 2;
    s.addShape(pres.shapes.DIAMOND, { x: cx - dl / 2, y: cy - dw / 2, w: dl, h: dw, rotate: (Math.atan2(dy, dx) * 180) / Math.PI, fill: { color: INK }, line: { color: INK, width: 1 }, objectName: "Composition diamond" });
    sx = x1 + ux * dl; sy = y1 + uy * dl;
  }
  ln(pres, s, sx, sy, x2, y2, { name: "Association" });
  const fs = o.fontSize || 10, lh = fs / 72 + 0.07;
  const place = (m, px, py, e, ddx, ddy, extra) => {
    if (!m) return;
    const w = tw(m, fs);
    let lx, ly;
    if (e === "t" || e === "b") {
      ly = e === "t" ? py - lh - 0.04 - (o.comp && extra ? 0.12 : 0) : py + 0.04 + (o.comp && extra ? 0.12 : 0);
      lx = ddx > 0.05 ? px - 0.06 - w : px + 0.06;
    } else {
      lx = e === "r" ? px + 0.06 + (o.comp && extra ? 0.16 : 0) : px - 0.06 - w - (o.comp && extra ? 0.16 : 0);
      ly = ddy < -0.05 || (Math.abs(ddy) <= 0.05 && e === "l") ? py + 0.05 : py - lh - 0.05;
    }
    s.addText(m, { x: lx, y: ly, w, h: lh, fontSize: fs, bold: true, color: HEX.accent1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  };
  place(m1, x1, y1, o.e1, dx, dy, true);
  place(m2, x2, y2, o.e2, -dx, -dy, false);
  if (o.label) lbl(s, o.label, (x1 + x2) / 2 + (o.ldx || 0), (y1 + y2) / 2 - fs / 72 - 0.12 + (o.ldy || 0), fs - 1, { align: "center", italic: true, color: GREY, bg: o.bg || HEX.lt2 });
}

// ---------- Activity ----------
function lanes(pres, s, x, y, w, h, names, hh = 0.38) {
  const lw = w / names.length;
  names.forEach((n, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: x + i * lw, y, w: lw, h, fill: { color: HEX.lt1 }, line: { color: INK, width: 1 }, objectName: `Swimlane ${n}` });
    s.addShape(pres.shapes.RECTANGLE, { x: x + i * lw, y, w: lw, h: hh, fill: { color: HEX.accent3 }, line: { color: INK, width: 1 }, objectName: `Swimlane ${n} header` });
    tx(s, n, x + i * lw, y, lw, hh, { fontSize: 13, bold: true });
  });
  return names.map((_, i) => x + i * lw + lw / 2);
}
function startNode(pres, s, cx, cy, d = 0.24) {
  s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: HEX.dk1 }, line: { color: HEX.dk1, width: 0 }, objectName: "Initial node" });
}
function endNode(pres, s, cx, cy, d = 0.28) {
  s.addShape(pres.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: HEX.lt1 }, line: { color: HEX.dk1, width: 1.5 }, objectName: "Final node" });
  const i = d * 0.55;
  s.addShape(pres.shapes.OVAL, { x: cx - i / 2, y: cy - i / 2, w: i, h: i, fill: { color: HEX.dk1 }, line: { color: HEX.dk1, width: 0 }, objectName: "Final node inner" });
}
function act(pres, s, cx, cy, w, h, label, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx - w / 2, y: cy - h / 2, w, h, rectRadius: Math.min(0.16, h / 2), fill: { color: o.fill || HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: `Action ${label}` });
  tx(s, label, cx - w / 2 + 0.05, cy - h / 2, w - 0.1, h, { fontSize: o.fontSize || 11 });
  return { l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2, cx, cy };
}
function decision(pres, s, cx, cy, d = 0.36) {
  s.addShape(pres.shapes.DIAMOND, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: HEX.lt1 }, line: { color: INK, width: 1.25 }, objectName: "Decision" });
  return { l: cx - d / 2, r: cx + d / 2, t: cy - d / 2, b: cy + d / 2, cx, cy };
}
function bar(pres, s, x1, x2, y) {
  s.addShape(pres.shapes.RECTANGLE, { x: x1, y: y - 0.04, w: x2 - x1, h: 0.08, fill: { color: HEX.dk1 }, line: { color: HEX.dk1, width: 0 }, objectName: "Fork/join bar" });
}
function flow(pres, s, pts, guard, o = {}) {
  poly(pres, s, pts, { end: "arrow", width: 1.25 });
  if (guard) lbl(s, guard, o.gx, o.gy, o.fontSize || 11, { italic: true, color: HEX.accent1, align: o.align || "left" });
}

module.exports = { ln, poly, tx, lbl, tw, gen, actor, uc, boundary, stereo, lifeline, activation, msg, selfMsg, frame, klass, assoc, lanes, startNode, endNode, act, decision, bar, flow, INK, GREY };
