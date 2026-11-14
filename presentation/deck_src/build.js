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
  if (pres._morph && pres._morph.length) {
    const JSZip = require("jszip"), fs = require("fs");
    const zip = await JSZip.loadAsync(fs.readFileSync(out));
    const TR = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="slow" p14:dur="900" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
    for (const n of pres._morph) {
      const f = `ppt/slides/slide${n}.xml`;
      let x = await zip.file(f).async("string");
      x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + TR);
      zip.file(f, x);
    }
    fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
    console.log("morph slides:", pres._morph.join(","));
  }
  console.log("wrote", out);
})();
