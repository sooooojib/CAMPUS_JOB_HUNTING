// Theme v5 ("premium light"): pale blue canvas, orange highlight, navy accents, Aptos,
// soft shadows, kicker label above titles, chapter progress bar instead of slide numbers.
const C = {
  bg: "EEF3F8", bg2: "E3EBF4", navy: "1E3A5F", orange: "C2410C", orangeL: "FCEADC", orangeM: "F2A77F",
  ink: "111827", grey: "5B6577", grey2: "8A94A6", line: "D3DDE8", white: "FFFFFF",
  green: "1F7A4D", greenL: "E3F2EA", red: "B42318", redL: "FBE7E1", blueL: "E0E9F4",
};
const FONT = "Calibri", HFONT = "Calibri";
const W = 13.333, H = 7.5, M = 0.7, CW = W - 2 * M;
const SH = { type: "outer", color: "1E3A5F", opacity: 0.14, blur: 14, offset: 3, angle: 90 };
const CHAPTERS = ["Problem", "Requirements", "UML", "Database", "App UI", "Reports & Closing"];

function setup(pres) {
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: HFONT, bodyFontFace: FONT };
}
function progress(pres, s, active) {
  const y = 7.08, n = CHAPTERS.length, w = (W - 2 * M - (n - 1) * 0.08) / n;
  CHAPTERS.forEach((c, i) => {
    const x = M + i * (w + 0.08);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.05, fill: { color: i === active ? C.orange : i < active ? "9FB3C8" : C.line }, line: { type: "none" }, objectName: `Progress ${c}` });
    s.addText(c, { x, y: 7.13, w, h: 0.25, fontFace: FONT, fontSize: 9, bold: i === active, color: i === active ? C.orange : C.grey2, margin: 0, valign: "top" });
  });
}
function slide(pres, o) {
  const s = pres.addSlide({ sectionTitle: o.sec });
  s.background = { color: C.bg };
  if (o.kicker) {
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: 0.52, w: 0.32, h: 0.05, fill: { color: C.orange }, line: { type: "none" }, objectName: "Kicker bar" });
    s.addText(o.kicker, { x: M + 0.42, y: 0.4, w: 8, h: 0.3, fontFace: FONT, fontSize: 12, bold: true, color: C.orange, charSpacing: 2, margin: 0, valign: "middle" });
  }
  if (o.title) s.addText([{ text: o.title[0], options: { color: C.ink } }, { text: o.title[1] || "", options: { color: C.orange } }],
    { x: M, y: 0.75, w: CW, h: 0.8, fontFace: HFONT, fontSize: 34, bold: true, margin: 0, valign: "middle" });
  if (o.chapter != null) progress(pres, s, o.chapter);
  return s;
}
function card(pres, s, x, y, w, h, o = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: o.r || 0.12, fill: { color: o.fill || C.white }, line: o.noLine ? { type: "none" } : { color: o.line || C.line, width: 0.75 }, shadow: o.flat ? undefined : SH, objectName: o.name || "Card" });
}
function divider(pres, o) {
  const s = pres.addSlide({ sectionTitle: o.sec });
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: 0, w: W - 7.9, h: H, fill: { color: C.bg2 }, line: { type: "none" }, objectName: "Right panel" });
  s.addText(o.num, { x: M - 0.1, y: 0.35, w: 5, h: 2.6, fontFace: HFONT, fontSize: 170, bold: true, color: C.orange, margin: 0, valign: "top", charSpacing: -6 });
  s.addText(`CHAPTER ${parseInt(o.num, 10)}`, { x: M, y: 3.2, w: 6, h: 0.35, fontFace: FONT, fontSize: 14, bold: true, color: C.navy, charSpacing: 3, margin: 0 });
  s.addText(o.title, { x: M, y: 3.55, w: 7, h: 1.0, fontFace: HFONT, fontSize: 48, bold: true, color: C.ink, margin: 0, valign: "top" });
  s.addText(o.sub, { x: M, y: 4.55, w: 6.8, h: 0.5, fontFace: FONT, fontSize: 18, color: C.grey, margin: 0 });
  o.items.forEach((t, i) => {
    const y = 5.35 + i * 0.4;
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: y + 0.12, w: 0.1, h: 0.1, fill: { color: C.orange }, line: { type: "none" } });
    s.addText(t, { x: M + 0.25, y, w: 6, h: 0.34, fontFace: FONT, fontSize: 15, color: C.ink, margin: 0, valign: "middle" });
  });
  if (o.visual) o.visual(s);
  progress(pres, s, o.chapter);
  if (o.note) s.addNotes(o.note);
  return s;
}
// standard bar/column chart styling
function chartOpts(extra) {
  return Object.assign({
    chartColors: [C.navy], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.ink, dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelFontFace: FONT,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 13, catAxisLabelFontFace: FONT, catAxisLabelRotate: 0, valAxisHidden: true,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisLineShow: true, catAxisLineColor: C.line, showLegend: false,
    showTitle: false, barGapWidthPct: 45,
  }, extra || {});
}
// chart panel with a heading
function chartPanel(pres, s, x, y, w, h, heading) {
  card(pres, s, x, y, w, h);
  s.addText(heading, { x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.4, fontFace: FONT, fontSize: 15, bold: true, color: C.ink, margin: 0, valign: "middle" });
  return { x: x + 0.15, y: y + 0.65, w: w - 0.3, h: h - 0.8 };
}
// "What this means" navy panel
function meansPanel(pres, s, x, y, w, h, heading, lines) {
  card(pres, s, x, y, w, h, { fill: C.navy, noLine: true });
  s.addText(heading.toUpperCase(), { x: x + 0.35, y: y + 0.3, w: w - 0.7, h: 0.35, fontFace: FONT, fontSize: 12, bold: true, color: C.orangeM, charSpacing: 2, margin: 0 });
  lines.forEach((l, i) => {
    const ly = y + 0.85 + i * ((h - 1.1) / lines.length);
    s.addShape(pres.shapes.RECTANGLE, { x: x + 0.35, y: ly + 0.12, w: 0.1, h: 0.1, fill: { color: C.orangeM }, line: { type: "none" } });
    s.addText(l, { x: x + 0.6, y: ly, w: w - 0.95, h: (h - 1.1) / lines.length, fontFace: FONT, fontSize: 15, color: C.white, margin: 0, valign: "top" });
  });
}
function source(s, text) {
  s.addText(text, { x: M, y: 6.72, w: CW, h: 0.28, fontFace: FONT, fontSize: 10, italic: true, color: C.grey2, margin: 0, valign: "middle" });
}

module.exports = { C, FONT, HFONT, W, H, M, CW, SH, CHAPTERS, setup, slide, card, divider, progress, chartOpts, chartPanel, meansPanel, source };
