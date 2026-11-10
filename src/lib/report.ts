import { dailyRows, functionCallRows, meta } from "./data";
import fcMeta from "../../data/function_calls_meta.json";
import { compareWindows } from "./metrics";

export type ReportSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Report = {
  title: string;
  analysisDate: string;
  sections: ReportSection[];
};

const REPORT_DATE = "2026-11-06";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
const absPct = (n: number | null) =>
  n === null ? "n/a" : `${Math.abs(n).toFixed(1)}%`;

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function fcRow(date: string) {
  const r = functionCallRows.find((x) => x.date === date);
  if (!r) throw new Error(`Missing function-call row for ${date}`);
  return r;
}

function dayRow(date: string) {
  const r = dailyRows.find((x) => x.date === date);
  if (!r) throw new Error(`Missing daily row for ${date}`);
  return r;
}

function top5Share(date: string) {
  const r = fcRow(date);
  return (r.top5Calls / r.functionCallActions) * 100;
}

function contractRange(start: string, end: string) {
  const rows = functionCallRows.filter((r) => r.date >= start && r.date <= end);
  const values = rows.map((r) => r.distinctContracts);
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function buildReport(): Report {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;

  const medTx = median(dailyRows.map((r) => r.transactionCount));
  const medSg = median(dailyRows.map((r) => r.distinctSigners));
  const medFc = median(functionCallRows.map((r) => r.functionCallActions));
  const medShare = median(
    functionCallRows.map((r) => (r.top5Calls / r.functionCallActions) * 100)
  );

  const earlyAug = contractRange("2026-08-06", "2026-08-13");
  const lateOct = contractRange("2026-10-16", "2026-10-31");

  const last7Early = dailyRows.slice(-7).filter((r) => r.date < "2026-11-03");
  const last7EarlyAvg =
    last7Early.reduce((s, r) => s + r.distinctSigners, 0) / last7Early.length;
      const last7EarlyTxAvg =
    last7Early.reduce((s, r) => s + r.transactionCount, 0) / last7Early.length;

  const spikeDates = ["2026-10-10", "2026-10-11", "2026-10-15"];
  const spikeText = spikeDates
    .map(
      (d) =>
        `${d}: ${fmt(fcRow(d).functionCallActions)} actions, top 5 receivers held ${top5Share(d).toFixed(1)}%, ${fmt(fcRow(d).distinctContracts)} distinct receiver contracts`
    )
    .join("; ");

  const sgDates = ["2026-10-03", "2026-10-04", "2026-10-07"];
  const sgText = sgDates
    .map((d) => `${d} (${fmt(dayRow(d).distinctSigners)})`)
    .join(", ");

  return {
    title: "Is NEAR mainnet usage broadening? A snapshot-based investigation",
    analysisDate: REPORT_DATE,
    sections: [
      {
        title: "Executive summary",
        paragraphs: [
          `This report tests a hypothesis, it does not assume one: NEAR mainnet usage is broadening when transaction counts, distinct transaction signers and contract function-call activity are considered together. It uses two historical snapshots covering ${meta.date_range_start} to ${meta.date_range_end}. This is not live data.`,
          `Result: mixed. In the latest 7 days, average daily distinct signers changed ${pct(sg7.changePct)} and transactions ${pct(tx7.changePct)} against the previous 7 days, but that rise depends on the last two days of the window. In the latest 30 days, signers changed ${pct(sg30.changePct)} and transactions ${pct(tx30.changePct)} against the previous 30 days. Function-call activity was highly concentrated on three days in October. On this evidence the hypothesis is neither confirmed nor rejected.`,
        ],
      },
      {
        title: "Research hypothesis",
        paragraphs: [
          "NEAR mainnet usage is broadening when transaction counts, distinct transaction signers, and contract function-call activity are considered together.",
          "This is a hypothesis to investigate, not a conclusion that must be proven.",
        ],
      },
      {
        title: "Evidence supporting the hypothesis",
        bullets: [
          `Latest week: average daily distinct signers rose ${absPct(sg7.changePct)} (${fmt(sg7.previousAvg)} to ${fmt(sg7.currentAvg)}), faster than transactions (${pct(tx7.changePct)}), comparing ${sg7.currentRange} with ${sg7.previousRange}. This rise depends on the last two days of the window; see Data limitations.`,
          `Distinct receiver contracts with at least one function-call action were between ${earlyAug.min} and ${earlyAug.max} per day from 2026-08-06 to 2026-08-13, and between ${lateOct.min} and ${lateOct.max} per day from 2026-10-16 to 2026-10-31. The reason for the rise is not verified.`,
          `Transactions and distinct signers both rose in the latest week (${pct(tx7.changePct)} and ${pct(sg7.changePct)}), but both rises depend on 2026-11-03 and 2026-11-04. Without those two days, the other ${last7Early.length} days averaged ${fmt(last7EarlyTxAvg)} transactions per day against ${fmt(tx7.previousAvg)} in the previous 7 days.`,        ],
      },
      {
        title: "Evidence against the hypothesis",
        bullets: [
          `Latest 30 days: average daily transactions fell ${absPct(tx30.changePct)} (${fmt(tx30.previousAvg)} to ${fmt(tx30.currentAvg)}) and average daily distinct signers fell ${absPct(sg30.changePct)} (${fmt(sg30.previousAvg)} to ${fmt(sg30.currentAvg)}).`,
          `The latest 7-day averages are below the 91-day medians: signers ${fmt(sg7.currentAvg)} against a median of ${fmt(medSg)}, transactions ${fmt(tx7.currentAvg)} against a median of ${fmt(medTx)}.`,
          `Concentration: on three days the top 5 receiver accounts took most function-call actions, and distinct receiver contracts did not rise on those days. ${spikeText}. Snapshot medians: ${fmt(medFc)} actions per day, top-5 share ${medShare.toFixed(1)}%.`,
          `Distinct signers were unusually high on several days in early October, for example ${sgText}, against a snapshot median of ${fmt(medSg)}. The cause is not verified, so it is unknown whether this reflects broader participation.`,
        ],
      },
      {
        title: "Metric explanations",
        bullets: [
          `Transactions: ${meta.metric_definitions.transaction_count}`,
          `Distinct signers: ${meta.metric_definitions.distinct_signers}`,
          `Function-call actions: ${fcMeta.metric_definitions.function_call_actions}`,
          `Distinct receiver contracts: ${fcMeta.metric_definitions.distinct_contracts}`,
          `Top-5 calls: ${fcMeta.metric_definitions.top5_calls}`,
          `7-day and 30-day comparisons: the average of the most recent N days against the average of the N days immediately before them. Windows end on ${meta.date_range_end}.`,
        ],
      },
      {
        title: "Data limitations",
        bullets: [
          "Historical snapshots, not live data. Transactions and signers: snapshot taken " +
            meta.snapshot_date +
            ". Function calls: snapshot taken " +
            fcMeta.snapshot_date +
            ".",
          "Only 91 days are covered. A longer history could change the picture.",
          `The latest 7-day window includes 2026-11-03 and 2026-11-04, when distinct signers jumped (${fmt(dayRow("2026-11-02").distinctSigners)} on 11-02, ${fmt(dayRow("2026-11-03").distinctSigners)} on 11-03, ${fmt(dayRow("2026-11-04").distinctSigners)} on 11-04). The other ${last7Early.length} days of that window averaged ${fmt(last7EarlyAvg)} signers per day, against ${fmt(sg7.previousAvg)} in the previous 7 days. The cause of the jump is not verified, so the ${pct(sg7.changePct)} change should be read with caution.`,
          "Distinct signers is not unique users and not all active accounts. One person can control many accounts, and one account can be an automated program.",
          "Function-call actions count actions, not transactions. One transaction can create several actions, so the two counts are not directly comparable.",
          "The causes of the October signer elevation and of the 10, 11 and 15 October function-call spikes were not investigated. Nothing here explains them.",
          "Window comparisons depend on the chosen dates. The 30-day windows contain the unexplained high days, which can move the averages.",
          "The final day of the snapshot is " +
            meta.date_range_end +
            ". Later days were excluded because a day in progress is incomplete.",
          "This report makes no statement about token price.",
        ],
      },
      {
        title: "What would change the conclusion",
        bullets: [
          "Evidence that the October signer elevation and the October function-call spikes came from a small number of automated accounts or one application would weaken the broadening reading for those periods.",
          "A longer history in which signers, transactions and distinct receiver contracts rise together over several months would strengthen the hypothesis.",
          "Top-5 receiver share staying near the snapshot median while total actions grow would support broadening. Repeated spikes dominated by a few receivers would weaken it.",
          "Measuring how many signers are new or returning, which this snapshot cannot do, would test participation directly.",
        ],
      },
      {
        title: "Sources",
        bullets: [
          "NEAR public dataset in Google BigQuery: bigquery-public-data.crypto_near_mainnet_us (documentation: https://docs.near.org/data-infrastructure/big-query).",
          `Tables used: ${meta.source} and ${fcMeta.source}.`,
          `SQL: ${meta.sql_file} and ${fcMeta.sql_file}. See the Data Explorer page to reproduce.`,
        ],
      },
    ],
  };
}

export function toMarkdown(report: Report): string {
  const lines: string[] = [
    `# ${report.title}`,
    "",
    `Analysis date: ${report.analysisDate}`,
    "",
  ];
  for (const s of report.sections) {
    lines.push(`## ${s.title}`, "");
    for (const p of s.paragraphs ?? []) lines.push(p, "");
    for (const b of s.bullets ?? []) lines.push(`- ${b}`);
    if (s.bullets?.length) lines.push("");
  }
  return lines.join("\n");
}