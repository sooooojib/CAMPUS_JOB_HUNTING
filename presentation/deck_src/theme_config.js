// Shared theme_config for the UniCareer defense deck. Every chapter imports this file
// so canvas, fonts, grid, header/footer and badge styles stay identical.

const THEME = {
  name: "UniCareer Swiss",
  headFontFace: "IBM Plex Sans",
  bodyFontFace: "IBM Plex Sans",
  colors: {
    dk1: "0F172A", // slate text
    lt1: "FFFFFF", // surface
    dk2: "334155", // secondary text
    lt2: "F8FAFC", // canvas
    accent1: "1D4ED8", // primary
    accent2: "DBEAFE", // primary tint
    accent3: "B45309", // PROPOSED text
    accent4: "FEF3C7", // PROPOSED tint
    accent5: "64748B", // muted
    accent6: "E2E8F0", // border
    hlink: "1D4ED8",
    folHlink: "1E40AF",
  },
};

const HEX = THEME.colors; // for hex-only options (table borders, lines)
const MONO = "IBM Plex Mono";

// Canvas and grid (LAYOUT_WIDE = 13.333 x 7.5 in)
const W = 13.333, H = 7.5;
const M = 0.6; // outer margin
const CW = W - 2 * M; // content width
const GUT = 0.3; // gutter
const TOP = 1.75; // content top
const BOTTOM = 6.75; // content bottom
const col = (n, total = 12) => (CW - GUT * (total - 1)) / total * n + GUT * (n - 1);
const colX = (i, total = 12) => M + i * ((CW - GUT * (total - 1)) / total + GUT);

const FOOTER = "UniCareer Community  ·  Software Engineering Project Defense";

function defineLayouts(pres) {
  const C = pres.SchemeColor;

  pres.defineSlideMaster({
    title: "COVER",
    background: { color: HEX.dk1 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: M, y: 0.7, w: 8, h: 0.35, fontFace: MONO, fontSize: 12, color: C.accent2, bold: true, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: M, y: 1.45, w: 8.2, h: 1.3, fontSize: 54, bold: true, color: C.background1, margin: 0, valign: "top", align: "left", charSpacing: -0.5 }, text: "" } },
      { placeholder: { options: { name: "subtitle", type: "body", x: M, y: 2.85, w: 7.6, h: 0.95, fontSize: 20, color: C.accent6, margin: 0, valign: "top" }, text: "" } },
    ],
  });

  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: HEX.lt2 },
    margin: [0.5, M, 0.6, M],
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: M, y: 0.42, w: 9, h: 0.3, fontFace: MONO, fontSize: 11, bold: true, color: C.accent1, margin: 0, valign: "top" }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: M, y: 0.74, w: CW, h: 0.75, fontSize: 30, bold: true, color: C.text1, margin: 0, valign: "top", align: "left", charSpacing: -0.5 }, text: "" } },
      { text: { text: FOOTER, options: { x: M, y: 7.02, w: 8, h: 0.28, fontSize: 9, color: C.accent5, margin: 0, valign: "middle" } } },
    ],
    slideNumber: { x: W - M - 0.6, y: 7.02, w: 0.6, h: 0.28, fontFace: MONO, fontSize: 9, color: HEX.accent5, align: "right" },
  });
}

// Badge: DESIGNED / PROPOSED / INPUT / OUTPUT
const BADGE = {
  DESIGNED: { fill: HEX.accent2, color: HEX.accent1 },
  PROPOSED: { fill: HEX.accent4, color: HEX.accent3 },
  INPUT: { fill: HEX.dk1, color: HEX.lt1 },
  OUTPUT: { fill: HEX.accent1, color: HEX.lt1 },
};
function badge(pres, slide, kind, x, y, w = 1.15) {
  const b = BADGE[kind];
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.28, fill: { color: b.fill }, line: { color: b.fill }, rectRadius: 0.04, objectName: `Badge ${kind}` });
  slide.addText(kind, { x, y, w, h: 0.28, fontFace: MONO, fontSize: 9, bold: true, color: b.color, align: "center", valign: "middle", margin: 0, isTextBox: true, charSpacing: 1 });
}

// Card: white surface, hairline border, no edge stripes
function card(pres, slide, x, y, w, h, name) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.lt1 }, line: { color: HEX.accent6, width: 1 }, objectName: name || "Card" });
}

// Header fill for a content slide
function header(slide, kicker, title) {
  slide.addText(kicker, { placeholder: "kicker" });
  slide.addText(title, { placeholder: "title" });
}

// 3-point bottom callout strip
function calloutStrip(pres, slide, items, y = 6.0, h = 0.7) {
  const w = (CW - 2 * GUT) / 3;
  items.forEach((t, i) => {
    const x = M + i * (w + GUT);
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: HEX.accent2 }, line: { color: HEX.accent2 }, objectName: `Callout ${i + 1}` });
    slide.addText([
      { text: `${String(i + 1).padStart(2, "0")}  `, options: { fontFace: MONO, bold: true, color: HEX.accent1 } },
      { text: t, options: { color: HEX.dk1 } },
    ], { x: x + 0.18, y, w: w - 0.36, h, fontSize: 12, valign: "middle", margin: 0, isTextBox: true });
  });
}

// Standard table styling
function tableOpts(extra = {}) {
  return Object.assign({
    x: M, y: TOP, w: CW, fontSize: 12, color: HEX.dk1, valign: "middle",
    border: { type: "solid", pt: 0.75, color: HEX.accent6 }, fill: { color: HEX.lt1 },
    margin: [0.06, 0.1, 0.06, 0.1],
  }, extra);
}
const TH = (text, o = {}) => ({ text, options: Object.assign({ bold: true, fontFace: MONO, fontSize: 10, color: HEX.lt1, fill: { color: HEX.dk1 } }, o) });

module.exports = { THEME, HEX, MONO, W, H, M, CW, GUT, TOP, BOTTOM, col, colX, defineLayouts, badge, card, header, calloutStrip, tableOpts, TH };
