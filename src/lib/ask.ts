import { dailyRows, functionCallRows, meta } from "./data";
import fcMeta from "../../data/function_calls_meta.json";
import { compareWindows } from "./metrics";

export type Answer = { answer: string; mode: "fallback" | "ai" };

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const NOTE = `Answered from stored snapshots covering ${meta.date_range_start} to ${meta.date_range_end} (historical data, not a live query).`;

function windows() {
  return {
    tx7: compareWindows(dailyRows, "transactionCount", 7)!,
    sg7: compareWindows(dailyRows, "distinctSigners", 7)!,
    tx30: compareWindows(dailyRows, "transactionCount", 30)!,
    sg30: compareWindows(dailyRows, "distinctSigners", 30)!,
  };
}

function trendAnswer(): string {
  const { tx7, sg7, tx30, sg30 } = windows();
  return [
    `Mixed picture.`,
    `Last 7 days (${tx7.currentRange}) against the 7 days before: average daily transactions ${pct(tx7.changePct)} (${fmt(tx7.previousAvg)} to ${fmt(tx7.currentAvg)}), average daily distinct signers ${pct(sg7.changePct)} (${fmt(sg7.previousAvg)} to ${fmt(sg7.currentAvg)}).`,
    `Last 30 days (${tx30.currentRange}) against the 30 days before: transactions ${pct(tx30.changePct)} (${fmt(tx30.previousAvg)} to ${fmt(tx30.currentAvg)}), distinct signers ${pct(sg30.changePct)} (${fmt(sg30.previousAvg)} to ${fmt(sg30.currentAvg)}).`,
    `Caution: the 7-day rise includes 2026-11-03 and 2026-11-04, when distinct signers jumped for a reason that is not verified. The 30-day windows include unexplained high days in late September and October.`,
    NOTE,
  ].join("\n\n");
}

function contractsAnswer(): string {
  const medContracts = median(functionCallRows.map((r) => r.distinctContracts));
  const medShare = median(
    functionCallRows.map((r) => (r.top5Calls / r.functionCallActions) * 100)
  );
  return [
    `This snapshot does not store a contract-by-contract ranking, so I cannot name the top contracts from it. It stores, per day, total function-call actions, the number of distinct receiver contracts, and the combined actions of the top 5 receivers.`,
    `What it does show: a median of ${fmt(median(functionCallRows.map((r) => r.functionCallActions)))} function-call actions per day, a median of ${fmt(medContracts)} distinct receiver contracts per day, and a median top-5 share of ${medShare.toFixed(1)}%. On 2026-10-10, 2026-10-11 and 2026-10-15 the top 5 receivers held 69.5%, 87.4% and 91.4% of actions.`,
    `Definition: ${fcMeta.metric_definitions.function_call_actions}`,
    NOTE,
  ].join("\n\n");
}

function hypothesisAnswer(): string {
  const { sg7, tx30, sg30 } = windows();
  return [
    `Hypothesis: NEAR mainnet usage is broadening when transactions, distinct signers and function-call activity are considered together. It is being investigated, not assumed.`,
    `Evidence supporting: distinct signers ${pct(sg7.changePct)} over the latest 7 days, although that depends on the last two days of the window; distinct receiver contracts per day were higher in late October than in early August.`,
    `Evidence against: over the latest 30 days transactions ${pct(tx30.changePct)} and distinct signers ${pct(sg30.changePct)}; function-call actions were heavily concentrated in a few receivers on 10, 11 and 15 October.`,
    `Conclusion: neither confirmed nor rejected. See the Research Reports page for the full write-up and limitations.`,
    NOTE,
  ].join("\n\n");
}

function limitationsAnswer(): string {
  return [
    `Main weaknesses of this data:`,
    `1. Only 91 days are covered.`,
    `2. Distinct signers is not unique users and not all active accounts.`,
    `3. Function-call actions count actions, not transactions, so they cannot be compared directly with the transaction count.`,
    `4. The causes of the early-October signer elevation, the 10, 11 and 15 October function-call spikes, and the jump on 3 and 4 November were not investigated.`,
    `5. Window comparisons depend on the chosen dates.`,
    `6. These are historical snapshots, not live data.`,
    NOTE,
  ].join("\n");
}

function chartAnswer(): string {
  return [
    `Daily trend chart: the cyan line is daily transactions (left axis) and the violet line is daily distinct signers (right axis). Both are counted per block date. Distinct signers is not unique users.`,
    `Function-call chart: the cyan line is function-call actions per day (left axis, in millions) and the violet line is distinct receiver contracts per day (right axis). The large spikes on 10, 11 and 15 October come from a few receiver accounts; the number of distinct contracts did not rise on those days.`,
    NOTE,
  ].join("\n\n");
}

function priceAnswer(): string {
  return `I do not make token price predictions or comment on price. NEARPulse AI only covers on-chain activity counts from the stored snapshots. ${NOTE}`;
}

function helpAnswer(): string {
  return [
    `I can only answer from the verified snapshots in this app, and I do not have enough data to answer that question.`,
    `Try asking about: the recent trend in transactions or signers, function-call activity and concentration, what the charts show, the research hypothesis, or the weaknesses of the data.`,
  ].join("\n\n");
}

export function answerFallback(question: string): Answer {
  const q = question.toLowerCase();
  let answer: string;

  if (/(price|invest|buy|sell|worth|moon|pump)/.test(q)) answer = priceAnswer();
  else if (/(contract|function|concentrat|top 5|top five|highest)/.test(q))
    answer = contractsAnswer();
  else if (/(hypothesis|evidence|thesis|broaden)/.test(q)) answer = hypothesisAnswer();
  else if (/(weak|limit|caveat|reliab|trust|problem)/.test(q)) answer = limitationsAnswer();
  else if (/(chart|graph|explain|plot)/.test(q)) answer = chartAnswer();
  else if (/(increas|decreas|trend|activity|transaction|signer|30|7 day|week|month|grow|declin|fall)/.test(q))
    answer = trendAnswer();
  else answer = helpAnswer();

  return { answer, mode: "fallback" };
}