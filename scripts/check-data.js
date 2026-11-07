const fs = require("fs");

const text = fs.readFileSync("data/daily_metrics.csv", "utf8").trim();
const lines = text.split(/\r?\n/);
const header = lines[0];
const rows = lines.slice(1).map((line) => {
  const [date, tx, signers] = line.split(",");
  return { date, tx: Number(tx), signers: Number(signers) };
});

console.log("Header:", header);
console.log("Total data rows:", rows.length);

// 1. Missing dates
const start = new Date(rows[0].date + "T00:00:00Z");
const end = new Date(rows[rows.length - 1].date + "T00:00:00Z");
const have = new Set(rows.map((r) => r.date));
const missing = [];
for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
  const iso = d.toISOString().slice(0, 10);
  if (!have.has(iso)) missing.push(iso);
}
console.log("First date:", rows[0].date, "| Last date:", rows[rows.length - 1].date);
console.log("Missing dates:", missing.length === 0 ? "none" : missing.join(", "));

// 2. Duplicate dates
console.log("Duplicate dates:", have.size === rows.length ? "none" : "FOUND");

// 3. Bad values
const bad = rows.filter(
  (r) => !Number.isFinite(r.tx) || !Number.isFinite(r.signers) || r.tx <= 0 || r.signers <= 0
);
console.log("Rows with zero/negative/invalid values:", bad.length);

// 4. Signers should never exceed transactions
const odd = rows.filter((r) => r.signers > r.tx);
console.log("Rows where signers > transactions:", odd.length);

// 5. Min and max, so we can eyeball outliers
const minTx = rows.reduce((a, b) => (b.tx < a.tx ? b : a));
const maxTx = rows.reduce((a, b) => (b.tx > a.tx ? b : a));
const minSg = rows.reduce((a, b) => (b.signers < a.signers ? b : a));
const maxSg = rows.reduce((a, b) => (b.signers > a.signers ? b : a));
console.log("Lowest transactions:", minTx.date, minTx.tx);
console.log("Highest transactions:", maxTx.date, maxTx.tx);
console.log("Lowest signers:", minSg.date, minSg.signers);
console.log("Highest signers:", maxSg.date, maxSg.signers);