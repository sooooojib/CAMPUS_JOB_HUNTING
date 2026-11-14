// Exports up to 5 sample rows from every table (read-only), with private values hidden,
// to presentation/table_samples.json for the defense slides.
// Run:  node scripts/export-table-samples.mjs
import "dotenv/config";
import pg from "pg";
import fs from "node:fs";

const ROWS = 5, MAXLEN = 60, SCAN = 300;
// Rows left behind by automated tests carry a 13-digit timestamp (e.g. "TechCorp Solutions 1794637771518"); skip them when possible.
const TESTROW = /\b1\d{12}\b|\bStage \d+ (Student|Recruiter|Admin)|@(test|example)\.|vitest/i;
const HIDE = /^(password|token|accesstoken|refreshtoken|idtoken|value|storagekey|proofdocumenturl|resumeurl|proofdetails)$/i;
const PARTIAL = /^(studentid|institutionalid|phone|ipaddress|useragent|targetid)$/i;
const EMAIL = /([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

function mask(col, v) {
  if (v === null || v === undefined) return null;
  if (HIDE.test(col)) return "•••• hidden";
  let s = v instanceof Date ? v.toISOString().replace("T", " ").slice(0, 19)
        : typeof v === "object" ? JSON.stringify(v) : String(v);
  if (PARTIAL.test(col)) s = s.length <= 3 ? "•••" : s.slice(0, 3) + "•".repeat(Math.min(6, s.length - 3));
  s = s.replace(EMAIL, (_, local, dom) => `${local.slice(0, 3)}…@${dom}`);
  return s.length > MAXLEN ? s.slice(0, MAXLEN - 1) + "…" : s;
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query("SET default_transaction_read_only = on");
const tables = (await client.query(
  "select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by 1")).rows.map((r) => r.table_name);
const out = { exportedAt: new Date().toISOString(), tables: {} };
for (const t of tables) {
  const cols = (await client.query(
    "select column_name, udt_name, is_nullable from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position", [t])).rows;
  const count = (await client.query(`select count(*)::int n from "${t}"`)).rows[0].n;
  const order = cols.find((c) => c.column_name === "createdAt") ? `order by "createdAt" desc` : "";
  const all = (await client.query(`select * from "${t}" ${order} limit ${SCAN}`)).rows;
  const looksTest = (r) => Object.values(r).some((v) => typeof v === "string" && TESTROW.test(v));
  const clean = all.filter((r) => !looksTest(r));
  const rows = (clean.length >= ROWS ? clean : clean.concat(all.filter(looksTest))).slice(0, ROWS);
  out.tables[t] = {
    count,
    columns: cols.map((c) => ({ name: c.column_name, type: c.udt_name, nullable: c.is_nullable === "YES" })),
    rows: rows.map((r) => Object.fromEntries(cols.map((c) => [c.column_name, mask(c.column_name, r[c.column_name])]))),
  };
  console.log(`${t.padEnd(28)} ${String(count).padStart(5)} rows`);
}
await client.end();
fs.mkdirSync("presentation", { recursive: true });
fs.writeFileSync("presentation/table_samples.json", JSON.stringify(out, null, 1));
console.log(`\nSaved presentation/table_samples.json (${tables.length} tables)`);
