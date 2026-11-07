const fs = require("fs");

const text = fs.readFileSync("data/daily_metrics.csv", "utf8").trim();
const lines = text.split(/\r?\n/).slice(1);

const rows = lines.map((line) => {
  const [date, tx, signers] = line.split(",");
  return {
    date,
    transactionCount: Number(tx),
    distinctSigners: Number(signers),
  };
});

fs.writeFileSync("data/daily_metrics.json", JSON.stringify(rows, null, 2));
console.log("Wrote data/daily_metrics.json with", rows.length, "rows");