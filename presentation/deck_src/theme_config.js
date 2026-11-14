// Shared theme_config for the UniCareer defense deck (v4: light, high-contrast).
// Mix of the two Slidesgo templates the user supplied:
//  - Modern Business Proposal: two-tone titles, numbered 01/02 labels, lots of whitespace, one red highlight
//  - Cycle Diagrams: soft rounded white cards, navy labels, soft colour tints to group things
// Rules (user preferences): light theme only, near-black text on white, big readable sizes,
// plain everyday wording on slides (technical detail goes in speaker notes), no ring diagrams.

const THEME = {
  name: "UniCareer Light",
  headFontFace: "Inter",
  bodyFontFace: "Inter",
  colors: {
    dk1: "111111", // main text
    lt1: "FFFFFF", // cards
    dk2: "4A4A4A", // secondary text
    lt2: "F7F6F3", // canvas (warm off-white)
    accent1: "B3121B", // red highlight
    accent2: "2E556D", // navy labels
    accent3: "E3EDF3", // soft blue tint
    accent4: "F6E8E5", // soft rose tint
    accent5: "E6EFEF", // soft sage tint
    accent6: "E5E2DC", // card border
    hlink: "2E556D",
    folHlink: "1E3A4C",
  },
};
const OPTS = {
  mint: { lt2: "EEF6F3", accent1: "0F766E", accent2: "1E3A5F", accent3: "E0EAF4", accent4: "DCEFE9", accent5: "E4EEF2", accent6: "D5E4DE" },
  blue: { lt2: "EEF3F8", accent1: "C2410C", accent2: "1E3A5F", accent3: "E0E9F4", accent4: "FCEADC", accent5: "E2EDF0", accent6: "D6E0EA" },
  lavender: { lt2: "F3F1F8", accent1: "6B2C7A", accent2: "334155", accent3: "E5E8F4", accent4: "F0E3F3", accent5: "E4EDEF", accent6: "DDD8EA" },
  white: { lt2: "FFFFFF", accent1: "047857", accent2: "1E3A5F", accent3: "E3ECF5", accent4: "DCF1E7", accent5: "E6EFEE", accent6: "E5E7EB", card: "F3F4F6" },
};
const OPT = process.env.THEME_OPT || "blue";
if (OPTS[OPT]) Object.assign(THEME.colors, OPTS[OPT]);
const HEX = Object.assign({}, THEME.colors);
HEX.card = HEX.card || HEX.lt1;
const TINTS = [HEX.accent4, HEX.accent3, HEX.accent5];
const MONO = "IBM Plex Mono"; // reserved for database / code slides only

const W = 13.333, H = 7.5;
const M = 0.7;
const CW = W - 2 * M;
const GUT = 0.3;
const TOP = 1.75;

// Font sizes (minimums agreed with the user)
const FS = { title: 34, body: 18, small: 15, note: 14, big: 44 };

function defineLayouts(pres) {
  const C = pres.SchemeColor;
  pres.defineSlideMaster({ title: "COVER", background: { color: HEX.lt2 }, objects: [] });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: HEX.lt2 },
    margin: [0.5, M, 0.6, M],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 0.5, w: CW, h: 0.7, fontSize: FS.title, bold: true, color: C.text1, margin: 0, valign: "top", align: "left", charSpacing: -0.5 }, text: "" } },
      { text: { text: "UniCareer Community", options: { x: M, y: 6.98, w: 5, h: 0.25, fontSize: 10, color: HEX.dk2, margin: 0, valign: "middle" } } },
    ],
  });
}

// Two-tone title: plain words + red highlight
function header(slide, plain, accent) {
  const runs = [{ text: plain, options: {} }];
  if (accent) runs.push({ text: accent, options: { color: HEX.accent1 } });
  slide.addText(runs, { placeholder: "title" });
}
// Optional one-line intro under the title
function intro(slide, text, y = 1.18) {
  slide.addText(text, { x: M, y, w: CW, h: 0.4, fontSize: FS.small, color: HEX.dk2, margin: 0, valign: "top", isTextBox: true });
}

function card(pres, slide, x, y, w, h, name, fill) {
  const f = fill || HEX.card;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: f }, line: { color: fill || HEX.card !== HEX.lt1 ? f : HEX.accent6, width: 0.75 }, objectName: name || "Card" });
}

// Numbered label "01"
function num(slide, n, x, y, color) {
  slide.addText(String(n).padStart(2, "0"), { x, y, w: 0.7, h: 0.4, fontSize: 16, bold: true, color: color || HEX.accent1, margin: 0, valign: "top", isTextBox: true });
}

// Status / input-output tags (plain words)
const BADGE = {
  BUILT: { fill: HEX.accent5, color: HEX.accent2, label: "Built" },
  PLANNED: { fill: HEX.accent4, color: HEX.accent1, label: "Planned" },
  INPUT: { fill: HEX.accent3, color: HEX.accent2, label: "What you enter" },
  OUTPUT: { fill: HEX.accent4, color: HEX.accent1, label: "What you get" },
};
function badge(pres, slide, kind, x, y, w = 1.6) {
  const b = BADGE[kind];
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.34, rectRadius: 0.17, fill: { color: b.fill }, line: { color: b.fill, width: 0 }, objectName: `Tag ${b.label}` });
  slide.addText(b.label, { x, y, w, h: 0.34, fontSize: 12, bold: true, color: b.color, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

// Small pill used inside app mock-ups
function pill(pres, slide, text, x, y, w, fill, color, size = 12) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.32, rectRadius: 0.16, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: `Pill ${text}` });
  slide.addText(text, { x, y, w, h: 0.32, fontSize: size, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true });
}

module.exports = { THEME, HEX, TINTS, MONO, W, H, M, CW, GUT, TOP, FS, defineLayouts, header, intro, card, num, badge, pill };
