const fs = require("fs");
const lines = fs.readFileSync("data/daily_metrics.csv", "utf8").trim().split(/\r?\n/).slice(1);
const rows = lines.map((l) => l.split(",")).map(([d, t, s]) => ({ d, t: +t, s: +s }));

function avg(arr, key) {
  return arr.reduce((a, r) => a + r[key], 0) / arr.length;
}

for (const days of [7, 30]) {
  const cur = rows.slice(-days);
  const prev = rows.slice(-days * 2, -days);
  for (const [label, key] of [["transactions", "t"], ["signers", "s"]]) {
    const c = avg(cur, key);
    const p = avg(prev, key);
    console.log(
      `${days}d ${label}: current ${Math.round(c)}, previous ${Math.round(p)}, change ${(((c - p) / p) * 100).toFixed(1)}%`
    );
  }
}