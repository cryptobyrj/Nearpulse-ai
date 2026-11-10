import Link from "next/link";
import { dailyRows, meta } from "@/lib/data";
import { compareWindows } from "@/lib/metrics";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export default function AboutPage() {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">About NEARPulse AI</h1>
      <p className="mt-3 text-slate-300">
        One question, tested with real NEAR data: is mainnet usage broadening,
        or is it just a few busy days? Everything on this site traces back to
        a SQL query you can run yourself.
      </p>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">What the data says right now</h2>
        <p className="mt-1 text-sm text-slate-400">
          Historical snapshot, {meta.date_range_start} to {meta.date_range_end}. Not live data.
        </p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li>
            Latest 7 days against the 7 before: transactions {pct(tx7.changePct)} (
            {fmt(tx7.previousAvg)} to {fmt(tx7.currentAvg)} per day), distinct signers{" "}
            {pct(sg7.changePct)} ({fmt(sg7.previousAvg)} to {fmt(sg7.currentAvg)} per day).
            Both rises lean on 2026-11-03 and 2026-11-04, and the cause of that jump is not verified.
          </li>
          <li>
            Latest 30 days against the 30 before: transactions {pct(tx30.changePct)}, distinct
            signers {pct(sg30.changePct)}.
          </li>
          <li>
            On 10, 11 and 15 October, a handful of receiver accounts took most function-call
            actions while the number of distinct contracts did not rise.
          </li>
        </ul>
        <p className="mt-3 text-sm text-slate-300">
          Verdict so far: <strong className="text-white">mixed</strong>. Neither confirmed nor
          rejected. The full write-up is on the{" "}
          <Link href="/reports" className="text-cyan-300 hover:underline">Research Reports</Link>{" "}
          page.
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">Check it yourself in two minutes</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Open{" "}
            <Link href="/explorer" className="text-cyan-300 hover:underline">Data Explorer</Link>{" "}
            and copy one of the two SQL queries.
          </li>
          <li>
            Paste it into the BigQuery console (the free sandbox is enough), read the
            &quot;This query will process&quot; estimate, then run it.
          </li>
          <li>Compare the rows with the CSV files in the data folder of the GitHub repository.</li>
          <li>
            Ask{" "}
            <Link href="/ask" className="text-cyan-300 hover:underline">Ask NEAR AI</Link>{" "}
            which day had the highest signers. The answer should be 2026-10-04 with 177,196.
          </li>
        </ol>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">What this cannot tell you</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Distinct signers is not unique users and not all active accounts. One person can control many accounts, and one account can be a bot.</li>
          <li>Function-call actions are actions, not transactions. One transaction can create several.</li>
          <li>Only 91 days are covered, and the data is a snapshot, not a live feed.</li>
          <li>The causes of the October and early-November jumps were not investigated, so nothing here explains them.</li>
          <li>Nothing here is about token price, and it is not investment advice.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">How Ask NEAR AI stays honest</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>The model only receives the verified metrics stored in this app.</li>
          <li>After it answers, the app checks that every number in the answer exists in those metrics. If one does not, the answer is dropped and a built-in explanation is shown instead.</li>
          <li>Price questions never reach the model.</li>
          <li>Each answer is labelled with the mode that produced it. The model can still word things imperfectly, so check important numbers against the report.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">Built with</h2>
        <p className="mt-3 text-sm text-slate-300">
          Data from the public NEAR dataset in Google BigQuery. Next.js, TypeScript, Tailwind CSS,
          Recharts and Vitest. Answers come from an OpenAI-compatible model on NEAR AI Cloud. Built
          by one person with an AI coding assistant (Claude by Anthropic); the queries were run and
          the results checked by the author. Built for NEAR Hackathon 2026, Investment Thesis track.
        </p>
        <p className="mt-3 text-sm text-slate-300">
          Code and thesis:{" "}
          <a
            href="https://github.com/cryptobyrj/Nearpulse-ai"
            className="text-cyan-300 hover:underline"
          >
            github.com/cryptobyrj/Nearpulse-ai
          </a>
        </p>
      </section>
    </main>
  );
}