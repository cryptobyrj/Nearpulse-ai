const fs = require("fs");
const lines = fs.readFileSync("data/daily_metrics.csv", "utf8").trim().split(/\r?\n/).slice(1);
const rows = lines.map((l) => l.split(",")).map(([d, t, s]) => ({ d, t: +t, s: +s }));

const bySigners = [...rows].sort((a, b) => b.s - a.s).slice(0, 5);
const byTx = [...rows].sort((a, b) => b.t - a.t).slice(0, 5);
const median = (arr) => {
  const x = [...arr].sort((a, b) => a - b);
  return x[Math.floor(x.length / 2)];
};

console.log("Top 5 days by signers:", bySigners.map((r) => `${r.d}=${r.s}`).join(", "));
console.log("Top 5 days by transactions:", byTx.map((r) => `${r.d}=${r.t}`).join(", "));
console.log("Median daily signers:", median(rows.map((r) => r.s)));
console.log("Median daily transactions:", median(rows.map((r) => r.t)));