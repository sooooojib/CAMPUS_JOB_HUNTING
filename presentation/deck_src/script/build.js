const fs = require("fs");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, HeadingLevel, PageBreak, Footer, PageNumber, LevelFormat } = D;
const parts = require("./content.js");

const NAVY = "1F2A44", ORANGE = "D9531E", GREY = "6B7280", PALE = "EEF3F8", FONT = "Calibri";
const WPM = 130;
const words = (s) => s.replace(/\[click:[^\]]*\]/g, "").split(/\s+/).filter(Boolean).length;
const partWords = (p) => p.items.reduce((a, it) => a + it.say.reduce((b, s) => b + words(s), 0), 0) + (p.handoff ? words(p.handoff) : 0);
const mins = (w) => w / WPM;
const fmt = (m) => { const s = Math.round(m * 60); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

// Turn "[click: x]" into orange cue runs
function runs(text, opts = {}) {
  const out = [];
  const re = /\[click:\s*([^\]]*)\]/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: FONT, size: 24, ...opts }));
    out.push(new TextRun({ text: `▶ CLICK (${m[1]}) `, font: FONT, size: 18, bold: true, color: ORANGE }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: FONT, size: 24, ...opts }));
  return out;
}

const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thin = { style: BorderStyle.SINGLE, size: 4, color: "D5DCE6" };
const cell = (txt, w, o = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: 90, bottom: 90, left: 140, right: 140 },
  borders: { top: thin, bottom: thin, left: thin, right: thin },
  children: [new Paragraph({ alignment: o.align, children: [new TextRun({ text: txt, font: FONT, size: 21, bold: o.bold, color: o.color || "1F2937" })] })],
});

const children = [];
// ---- Cover / plan
children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "SOFTWARE ENGINEERING PROJECT · JAGANNATH UNIVERSITY", font: FONT, size: 18, bold: true, color: ORANGE, characterSpacing: 20 })] }));
children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: "UniCareer Community", font: FONT })] }));
children.push(new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: "Presentation script, slide by slide", font: FONT, size: 28, color: GREY })] }));

const total = parts.reduce((a, p) => a + mins(partWords(p)), 0);
children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Who says what")] }));
const W = [900, 3400, 2300, 1500, 1260];
const rows = [new TableRow({ tableHeader: true, children: ["Part", "Topic", "Speaker", "Slides", "Time"].map((h, i) => cell(h, W[i], { fill: NAVY, bold: true, color: "FFFFFF" })) })];
parts.forEach((p, i) => rows.push(new TableRow({ children: [
  cell(String(i + 1), W[0], { align: AlignmentType.CENTER, bold: true, color: ORANGE }), cell(p.part, W[1]), cell(`Speaker ${p.speaker}: __________`, W[2]),
  cell(p.slides, W[3]), cell("~" + fmt(mins(partWords(p))), W[4]) ] })));
rows.push(new TableRow({ children: [cell("", W[0], { fill: PALE }), cell("Total", W[1], { fill: PALE, bold: true }), cell("", W[2], { fill: PALE }), cell("52 + Thank you", W[3], { fill: PALE }), cell("~" + fmt(total), W[4], { fill: PALE, bold: true })] }));
children.push(new Table({ width: { size: W.reduce((a, b) => a + b), type: WidthType.DXA }, columnWidths: W, rows }));

children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("How to use this script")] }));
[
  "Write each speaker's name in the table above, and replace [Speaker N] in the script.",
  "Plain text is what you say. Orange ▶ CLICK marks tell you when to click (mostly zoom-ins in the App UI part).",
  "Times are at a calm pace of about 130 words a minute. Don't read word for word; know the points and say them in your own words.",
  "Each part ends with a hand-off line and a few “if asked” facts for questions.",
].forEach((t) => children.push(new Paragraph({ numbering: { reference: "dots", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: t, font: FONT, size: 22 })] })));

// ---- Parts
parts.forEach((p, i) => {
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `PART ${i + 1}  ·  SPEAKER ${p.speaker}  ·  SLIDES ${p.slides.toUpperCase()}  ·  ~${fmt(mins(partWords(p)))} MIN`, font: FONT, size: 18, bold: true, color: ORANGE, characterSpacing: 10 })] }));
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(p.part)] }));
  p.items.forEach((it) => {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D5DCE6", space: 3 } },
      children: [new TextRun({ text: it.n === "—" ? "End  " : `Slide ${it.n}  `, color: ORANGE }), new TextRun({ text: it.t })] }));
    it.say.forEach((s) => children.push(new Paragraph({ spacing: { after: 120, line: 300 }, children: runs(s) })));
  });
  if (p.handoff) children.push(new Paragraph({ spacing: { before: 120, after: 200 }, shading: { type: ShadingType.CLEAR, color: "auto", fill: "FDEFE8" },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ORANGE, space: 8 } },
    children: [new TextRun({ text: "Hand-off:  ", font: FONT, size: 22, bold: true, color: ORANGE }), new TextRun({ text: p.handoff, font: FONT, size: 24, italics: true })] }));
  children.push(new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "IF ASKED", font: FONT, size: 18, bold: true, color: NAVY, characterSpacing: 20 })] }));
  p.tips.forEach((t) => children.push(new Paragraph({ numbering: { reference: "dots", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: t, font: FONT, size: 20, color: "374151" })] })));
});

const doc = new Document({
  creator: "UniCareer team", title: "UniCareer Community: presentation script",
  styles: {
    default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { font: FONT, size: 56, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 60 }, keepNext: true } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 200 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 28, bold: true, color: NAVY }, paragraph: { spacing: { before: 320, after: 140 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 25, bold: true, color: NAVY }, paragraph: { spacing: { before: 260, after: 100 }, keepNext: true, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: "dots", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }] },
  sections: [{
    properties: { page: { margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
      new TextRun({ text: "UniCareer Community · Presentation script    ", font: FONT, size: 16, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: GREY })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then((b) => { fs.writeFileSync(process.argv[2], b); console.log("total", fmt(total), parts.map((p) => fmt(mins(partWords(p)))).join(" ")); });
