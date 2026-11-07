const fs = require("fs");

const lines = fs
  .readFileSync("data/function_calls_daily.csv", "utf8")
  .trim()
  .split(/\r?\n/)
  .slice(1);

const rows = lines.map((line) => {
  const [date, actions, contracts, top5] = line.split(",");
  return {
    date,
    functionCallActions: Number(actions),
    distinctContracts: Number(contracts),
    top5Calls: Number(top5),
  };
});

fs.writeFileSync("data/function_calls_daily.json", JSON.stringify(rows, null, 2));
console.log("Wrote data/function_calls_daily.json with", rows.length, "rows");