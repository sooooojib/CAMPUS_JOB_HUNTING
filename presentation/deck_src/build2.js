// Builder for theme v5 chapters. Usage: OUT=file.pptx CH=reports node build2.js
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const fs = require("fs");
const T2 = require("./theme2");

(async () => {
  const pres = new pptxgen();
  T2.setup(pres);
  pres.title = "UniCareer Community — SWE Project Defense";
  require(`./${process.env.CH}.js`)(pres);
  const out = process.env.OUT;
  await pres.writeFile({ fileName: out });
  // post-process: remove stray <a:pPr> pptxgenjs puts between runs (PowerPoint "repair" warning)
  const zip = await JSZip.loadAsync(fs.readFileSync(out));
  const morph = new Set(pres._morph || []);
  const TR = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="slow" p14:dur="1200" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
  for (const f of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    let x = await zip.file(f).async("string");
    x = x.replace(/<\/a:r><a:pPr[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, "</a:r>");
    let prev;
    do { prev = x; x = x.replace(/(<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>))<a:pPr[^>]*?(?:\/>|>(?:(?!<a:pPr)[\s\S])*?<\/a:pPr>)/g, "$1"); } while (x !== prev);
    if (morph.has(+f.match(/slide(\d+)\.xml/)[1])) x = x.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + TR);
    zip.file(f, x);
  }
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(out, buf);
  console.log("wrote", out);
})();
