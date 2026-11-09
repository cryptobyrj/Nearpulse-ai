import { dailyRows, functionCallRows, meta } from "./data";
import fcMeta from "../../data/function_calls_meta.json";
import { compareWindows } from "./metrics";
import { answerFallback, type Answer } from "./ask";
import { allowAiCall } from "./ratelimit";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function rankedDays(
  label: string,
  items: { date: string; v: number }[],
  n: number,
  highest: boolean
) {
  const s = [...items]
    .sort((a, b) => (highest ? b.v - a.v : a.v - b.v))
    .slice(0, n);
  return `${label}: ${s.map((x) => `${x.date}=${fmt(x.v)}`).join(", ")}`;
}

function buildFacts(): string {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;
  const medShare = median(
    functionCallRows.map((r) => (r.top5Calls / r.functionCallActions) * 100)
  );

  const signers = dailyRows.map((r) => ({ date: r.date, v: r.distinctSigners }));
  const txs = dailyRows.map((r) => ({ date: r.date, v: r.transactionCount }));
  const fcs = functionCallRows.map((r) => ({
    date: r.date,
    v: r.functionCallActions,
  }));

  return [
    `DATA TYPE: historical snapshots, NOT live data. Covers ${meta.date_range_start} to ${meta.date_range_end}. Transactions/signers snapshot taken ${meta.snapshot_date}; function calls snapshot taken ${fcMeta.snapshot_date}.`,
    `LAST 7 DAYS (${tx7.currentRange}) vs previous 7 days (${tx7.previousRange}): avg daily transactions ${fmt(tx7.previousAvg)} -> ${fmt(tx7.currentAvg)} (${pct(tx7.changePct)}); avg daily distinct signers ${fmt(sg7.previousAvg)} -> ${fmt(sg7.currentAvg)} (${pct(sg7.changePct)}).`,
    `LAST 30 DAYS (${tx30.currentRange}) vs previous 30 days (${tx30.previousRange}): avg daily transactions ${fmt(tx30.previousAvg)} -> ${fmt(tx30.currentAvg)} (${pct(tx30.changePct)}); avg daily distinct signers ${fmt(sg30.previousAvg)} -> ${fmt(sg30.currentAvg)} (${pct(sg30.changePct)}).`,
    `SNAPSHOT MEDIANS: ${fmt(median(txs.map((r) => r.v)))} transactions/day; ${fmt(median(signers.map((r) => r.v)))} distinct signers/day; ${fmt(median(fcs.map((r) => r.v)))} function-call actions/day; ${fmt(median(functionCallRows.map((r) => r.distinctContracts)))} distinct receiver contracts/day; top-5 receiver share ${medShare.toFixed(1)}%.`,
    rankedDays("TOP 5 DAYS BY DISTINCT SIGNERS", signers, 5, true),
    rankedDays("LOWEST 3 DAYS BY DISTINCT SIGNERS", signers, 3, false),
    rankedDays("TOP 5 DAYS BY TRANSACTIONS", txs, 5, true),
    rankedDays("LOWEST 3 DAYS BY TRANSACTIONS", txs, 3, false),
    rankedDays("TOP 5 DAYS BY FUNCTION-CALL ACTIONS", fcs, 5, true),
    `METRIC DEFINITIONS: Transactions: ${meta.metric_definitions.transaction_count} Distinct signers: ${meta.metric_definitions.distinct_signers} Function-call actions: ${fcMeta.metric_definitions.function_call_actions} Distinct receiver contracts: ${fcMeta.metric_definitions.distinct_contracts} Top-5 calls: ${fcMeta.metric_definitions.top5_calls}`,
    `SOURCES: transactions come from ${meta.source}; function calls from ${fcMeta.source}.`,
    `OBSERVATIONS (causes NOT verified): ${[...meta.known_observations, ...fcMeta.known_observations].join(" | ")}`,
    `LIMITATIONS: Only 91 days. The 7-day signer rise depends on 2026-11-03 and 2026-11-04; the other days of that window averaged below the previous 7 days. Function-call actions are actions, not transactions. No contract-by-contract ranking is stored. No price data is stored.`,
    `RESEARCH HYPOTHESIS: NEAR mainnet usage is broadening when transactions, distinct signers and function-call activity are considered together. Status: neither confirmed nor rejected.`,
  ].join("\n");
}

const SYSTEM_PROMPT = `You are the research assistant of NEARPulse AI. Use ONLY the verified facts below.

Accuracy rules:
- Never invent or estimate numbers, dates, contract names or causes. Copy numbers exactly as written in the facts. Do not round them and do not calculate new ones.
- If the facts do not contain the answer, say clearly that you do not have enough data, and say what you do have.
- Always state the time period a number refers to.
- The data is a historical snapshot, NOT live data. Never say you queried live data.
- Never call distinct signers "users" or "all active accounts".
- Never predict or discuss token price.
- Causes of spikes are not verified. Say so; do not guess.
- Do not call a day "high" or "low" unless you compare it with the snapshot median.
- Whenever you mention the 7-day change in distinct signers, also say that it depends on 2026-11-03 and 2026-11-04, and that the other days of that window averaged below the previous 7 days.

Style rules:
- Explain like a clear teacher talking to a smart beginner, but stay technically correct.
- Use this layout: "Short answer:" (one or two sentences that directly answer the question), then "Evidence:" (2 to 4 short lines, each with the exact number and its period), then "Caveat:" (one sentence).
- Explain a technical term in brackets the first time you use it. Example: distinct signers (the number of different accounts that signed at least one transaction that day, not unique people).
- If the user asks how a number was calculated, name the source table and the definition from the facts.
- Reply in the same language and script the user wrote in (for example English, Hindi in Devanagari, or Hinglish in Roman letters). Keep all numbers, dates and metric names exactly as given in the facts, and keep the terms "distinct signers", "transactions" and "function-call actions" in English.
- Keep the answer under 220 words.

VERIFIED FACTS:
`;

const PRICE_PATTERN = /(price|invest|buy|sell|worth|moon|pump)/i;

function languageHint(question: string): string {
  if (/[\u0900-\u097F]/.test(question)) {
    return "Reply in Hindi using Devanagari script.";
  }
  const words = question.toLowerCase().match(/[a-z]+/g) ?? [];
  const hinglish = [
    "kya", "kyun", "kyu", "kaise", "kitna", "kitne", "itne", "ko", "ka",
    "ki", "ke", "hai", "tha", "thi", "mein", "pe", "par", "bata", "batao",
    "hua", "hue", "nahi", "aur", "se", "raha", "rha",
  ];
  const hits = words.filter((w) => hinglish.includes(w)).length;
  if (hits >= 2) {
    return "Reply in Hinglish (Hindi written in Roman letters), not in English.";
  }
  return "";
}

function numberTokens(text: string): string[] {
  return (text.match(/\d[\d,]*(?:\.\d+)?/g) ?? []).map((t) =>
    t.replace(/,/g, "")
  );
}

// Every number in the answer must appear in the facts (one- and two-digit numbers are allowed).
function numbersAreGrounded(answer: string, facts: string): boolean {
  const allowed = new Set(numberTokens(facts));
  return numberTokens(answer).every(
    (t) => allowed.has(t) || /^\d{1,2}$/.test(t)
  );
}

async function askModel(question: string): Promise<string | null> {
  const key = process.env.NEARAI_API_KEY;
  const model = process.env.NEARAI_MODEL;
  const baseUrl = process.env.NEARAI_BASE_URL || "https://cloud-api.near.ai/v1";
  if (!key || !model) return null;

  const facts = buildFacts();
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 700,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + facts },
                { role: "user", content: question + "\n\n" + languageHint(question) },
      
      ],
    }),
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) return null;

  const answer = text.trim();
  return numbersAreGrounded(answer, facts) ? answer : null;
}

export async function answerQuestion(
  question: string,
  ip: string = "unknown"
): Promise<Answer> {
  if (PRICE_PATTERN.test(question)) return answerFallback(question);
  if (!process.env.NEARAI_API_KEY || !process.env.NEARAI_MODEL) {
    return answerFallback(question);
  }
  if (!allowAiCall(ip)) return answerFallback(question);

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