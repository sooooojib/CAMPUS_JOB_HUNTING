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
  console.log("wrote", out);
})();
