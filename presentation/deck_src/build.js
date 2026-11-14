const pptxgen = require("pptxgenjs");
const T = require("./theme_config");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "UniCareer Community — SWE Project Defense";
  pres.theme = { headFontFace: T.THEME.headFontFace, bodyFontFace: T.THEME.bodyFontFace };
  T.defineLayouts(pres);
  const chapters = (process.env.CHAPTERS || "1,2").split(",");
  for (const c of chapters) require(`./ch${c}.js`)(pres);
  const out = process.env.OUT;
  await pres.writeFile({ fileName: out });
  await applyTheme(out, T.THEME);
  {
    // Post-process: (1) remove stray <a:pPr> that pptxgenjs inserts between runs in rich-text
    // table cells (PowerPoint reports this as corrupt content); (2) add Morph transitions.
    const JSZip = require("jszip"), fs = require("fs");
    const zip = await JSZip.loadAsync(fs.readFileSync(out));
    const morph = new Set(pres._morph || []);
    const TR = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="med" p14:dur="700" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
    let fixed = 0;
    for (const f of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
      let x = await zip.file(f).async("string");
      const before = x.length;
      x = x.replace(/<\/a:r><a:pPr[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, "</a:r>");
      let prev;
      do { prev = x; x = x.replace(/(<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>))<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>)/g, "$1"); } while (x !== prev);
      if (x.length !== before) fixed++;
      const n = +f.match(/slide(\d+)\.xml/)[1];
      if (morph.has(n)) x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + TR);
      zip.file(f, x);
    }
    fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    console.log("post-processed: morph", morph.size, "slides; fixed pPr in", fixed, "slides");
  }
  console.log("wrote", out);
})();
