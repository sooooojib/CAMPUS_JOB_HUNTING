// Builds the full defense deck as ONE file: chapters 01-06 in order, slide numbers on every
// main slide (not on the cover, the thank-you slide, the App UI zoom slides or the hidden data
// slides), Morph where it was designed, and a soft fade between all other slides.
// Usage: OUT=UniCareer_Full_Presentation.pptx node merge.js
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const fs = require("fs");
const T = require("./theme_config");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "UniCareer Community — SWE Project Defense";
  pres.theme = { headFontFace: T.THEME.headFontFace, bodyFontFace: T.THEME.bodyFontFace };
  T.defineLayouts(pres);
  for (const c of ["1", "2", "3", "4", "5"]) require(`./ch${c}.js`)(pres);
  require("./ch_reports.js")(pres);

  // ---- slide numbers: main slides only, counted 1..N in the order they are shown ----
  const slides = pres._slides;
  const last = slides[slides.length - 1];
  let n = 0;
  const numbered = [];
  slides.forEach((s, i) => {
    if (s.hidden || s._noNum) return;
    n += 1;
    if (i === 0 || s === last) return; // cover and thank-you slide: counted, but no number shown
    s.addText(String(n), { x: T.W - 0.62, y: 7.0, w: 0.42, h: 0.3, fontSize: 11, bold: true, color: "8A94A6", align: "right", valign: "middle", margin: 0, objectName: "Slide number" });
    numbered.push([s._slideNum, n]);
  });

  const out = process.env.OUT;
  await pres.writeFile({ fileName: out });
  await applyTheme(out, T.THEME);

  // ---- post-process: pPr clean-up (PowerPoint repair), transitions ----
  const zip = await JSZip.loadAsync(fs.readFileSync(out));
  const morph = new Set(pres._morph || []), slow = new Set(pres._morphSlow || []);
  const MORPH = (dur, spd) => `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="${spd}" p14:dur="${dur}" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;
  const FADE = `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p14"><p:transition spd="med" p14:dur="500"><p:fade/></p:transition></mc:Choice><mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;
  const hidden = new Set(slides.filter((s) => s.hidden).map((s) => s._slideNum));
  let fixed = 0, nm = 0, nf = 0;
  for (const f of Object.keys(zip.files).filter((x) => /^ppt\/slides\/slide\d+\.xml$/.test(x))) {
    let x = await zip.file(f).async("string");
    const before = x.length;
    x = x.replace(/<\/a:r><a:pPr[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, "</a:r>");
    let prev;
    do { prev = x; x = x.replace(/(<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>))<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>)/g, "$1"); } while (x !== prev);
    if (x.length !== before) fixed++;
    const num = +f.match(/slide(\d+)\.xml/)[1];
    if (!x.includes("<p:transition") && !x.includes("p159:morph")) {
      if (morph.has(num)) { x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + (slow.has(num) ? MORPH(1200, "slow") : MORPH(700, "med"))); nm++; }
      else if (!hidden.has(num)) { x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + FADE); nf++; }
    }
    zip.file(f, x);
  }
  fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  fs.writeFileSync(out.replace(/\.pptx$/, "_numbers.json"), JSON.stringify({ total: slides.length, mainSlides: n, numbered }, null, 0));
  console.log(`slides ${slides.length}, main ${n}, morph ${nm}, fade ${nf}, pPr fixed in ${fixed}`);
})();
