import { dailyRows, functionCallRows, meta } from "./data";
import fcMeta from "../../data/function_calls_meta.json";
import { compareWindows } from "./metrics";
import { answerFallback, type Answer } from "./ask";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function buildFacts(): string {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;
  const medShare = median(
    functionCallRows.map((r) => (r.top5Calls / r.functionCallActions) * 100)
  );

  return [
    `DATA TYPE: historical snapshots, NOT live data. Covers ${meta.date_range_start} to ${meta.date_range_end}. Transactions/signers snapshot taken ${meta.snapshot_date}; function calls snapshot taken ${fcMeta.snapshot_date}.`,
    `LAST 7 DAYS (${tx7.currentRange}) vs previous 7 days (${tx7.previousRange}): avg daily transactions ${fmt(tx7.previousAvg)} -> ${fmt(tx7.currentAvg)} (${pct(tx7.changePct)}); avg daily distinct signers ${fmt(sg7.previousAvg)} -> ${fmt(sg7.currentAvg)} (${pct(sg7.changePct)}).`,
    `LAST 30 DAYS (${tx30.currentRange}) vs previous 30 days (${tx30.previousRange}): avg daily transactions ${fmt(tx30.previousAvg)} -> ${fmt(tx30.currentAvg)} (${pct(tx30.changePct)}); avg daily distinct signers ${fmt(sg30.previousAvg)} -> ${fmt(sg30.currentAvg)} (${pct(sg30.changePct)}).`,
    `SNAPSHOT MEDIANS: ${fmt(median(dailyRows.map((r) => r.transactionCount)))} transactions/day; ${fmt(median(dailyRows.map((r) => r.distinctSigners)))} distinct signers/day; ${fmt(median(functionCallRows.map((r) => r.functionCallActions)))} function-call actions/day; ${fmt(median(functionCallRows.map((r) => r.distinctContracts)))} distinct receiver contracts/day; top-5 receiver share ${medShare.toFixed(1)}%.`,
    `METRIC DEFINITIONS: Transactions: ${meta.metric_definitions.transaction_count} Distinct signers: ${meta.metric_definitions.distinct_signers} Function-call actions: ${fcMeta.metric_definitions.function_call_actions} Distinct receiver contracts: ${fcMeta.metric_definitions.distinct_contracts} Top-5 calls: ${fcMeta.metric_definitions.top5_calls}`,
    `OBSERVATIONS (causes NOT verified): ${[...meta.known_observations, ...fcMeta.known_observations].join(" | ")}`,
    `LIMITATIONS: Only 91 days. The 7-day signer rise depends on 2026-11-03 and 2026-11-04; the other days of that window averaged below the previous 7 days. Function-call actions are actions, not transactions. No contract-by-contract ranking is stored. No price data is stored.`,
    `RESEARCH HYPOTHESIS: NEAR mainnet usage is broadening when transactions, distinct signers and function-call activity are considered together. Status: neither confirmed nor rejected.`,
  ].join("\n");
}

const SYSTEM_PROMPT = `You are the research assistant of NEARPulse AI. Use ONLY the verified facts provided below. Rules:
- Never invent numbers, dates, contract names, or causes. If the facts do not contain the answer, say you do not have enough data.
- Always mention the time period a number refers to.
- The data is a historical snapshot, not live data. Never say you queried live data.
- Never describe distinct signers as unique users or all active accounts.
- Never predict or discuss token price.
- State uncertainty: causes of spikes are not verified.
- Answer in simple English, under 200 words.

VERIFIED FACTS:
`;

const PRICE_PATTERN = /(price|invest|buy|sell|worth|moon|pump)/i;

async function askModel(question: string): Promise<string | null> {
  const key = process.env.NEARAI_API_KEY;
  const model = process.env.NEARAI_MODEL;
  const baseUrl = process.env.NEARAI_BASE_URL || "https://cloud-api.near.ai/v1";
  if (!key || !model) return null;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + buildFacts() },
        { role: "user", content: question },
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

export async function answerQuestion(question: string): Promise<Answer> {
  if (PRICE_PATTERN.test(question)) return answerFallback(question);

  try {
    const text = await askModel(question);
    if (text) {
      return {
        mode: "ai",
        answer: `${text}\n\nBased on stored snapshots covering ${meta.date_range_start} to ${meta.date_range_end} (historical data, not a live query).`,
      };
    }
  } catch {
    // Any failure (network, timeout, bad response) falls back below.
  }
  return answerFallback(question);
}