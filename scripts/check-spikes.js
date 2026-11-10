const fs = require("fs");
const spikes = JSON.parse(fs.readFileSync("data/spike_days_top5.json", "utf8"));
const daily = JSON.parse(fs.readFileSync("data/function_calls_daily.json", "utf8"));
let ok = true;
for (const date of [...new Set(spikes.map((r) => r.date))]) {
  const rows = spikes.filter((r) => r.date === date);
  const top5 = rows.reduce((s, r) => s + r.calls, 0);
  const d = daily.find((x) => x.date === date);
  const match = top5 === d.top5Calls && rows[0].dayTotal === d.functionCallActions;
  if (!match) ok = false;
  console.log(date, "rows:", rows.length, "top5 sum:", top5, "daily file top5:", d.top5Calls, match ? "OK" : "MISMATCH");
}
console.log(ok ? "All spike rows match the daily snapshot." : "MISMATCH FOUND");