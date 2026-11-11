import DayPicker from "@/components/DayPicker";
import FunctionCallChart from "@/components/FunctionCallChart";
import Reveal from "@/components/Reveal";
import TrendChart from "@/components/TrendChart";
import { dailyRows, functionCallRows, meta } from "@/lib/data";
import { compareWindows, type Comparison } from "@/lib/metrics";
import fcMeta from "../../../data/function_calls_meta.json";
import spikeRows from "../../../data/spike_days_top5.json";

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function ComparisonCard({
  title,
  days,
  c,
}: {
  title: string;
  days: number;
  c: Comparison | null;
}) {
  const change = c?.changePct ?? null;
  const up = (change ?? 0) >= 0;
  return (
    <div className="glass h-full p-5">
      <p className="text-sm text-slate-400">{title}</p>
      {c ? (
        <>
          <p className="mt-2 text-3xl font-semibold text-white">
            {fmt(c.currentAvg)}
          </p>
          <p
            className={
              "mt-1 text-sm " +
              (change === null
                ? "text-slate-300"
                : up
                  ? "text-[#00ec97]"
                  : "text-rose-300")
            }
          >
            {change === null
              ? "No comparison available"
              : `${up ? "▲" : "▼"} ${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs previous ${days} days`}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Previous average: {fmt(c.previousAvg)}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Current: {c.currentRange}
            <br />
            Previous: {c.previousRange}
          </p>
        </>
      ) : (
        <p className="mt-2 text-slate-400">Not enough data.</p>
      )}
    </div>
  );
}

export default function NetworkPulsePage() {
  const fcByDate = new Map(functionCallRows.map((r) => [r.date, r]));
  const days = dailyRows.map((r) => {
    const f = fcByDate.get(r.date);
    return {
      date: r.date,
      transactionCount: r.transactionCount,
      distinctSigners: r.distinctSigners,
      functionCallActions: f?.functionCallActions ?? 0,
      distinctContracts: f?.distinctContracts ?? 0,
      top5Calls: f?.top5Calls ?? 0,
    };
  });
  const medians = {
    transactionCount: median(days.map((d) => d.transactionCount)),
    distinctSigners: median(days.map((d) => d.distinctSigners)),
    functionCallActions: median(days.map((d) => d.functionCallActions)),
    distinctContracts: median(days.map((d) => d.distinctContracts)),
    top5Share: median(
      days.map((d) =>
        d.functionCallActions > 0 ? (d.top5Calls / d.functionCallActions) * 100 : 0
      )
    ),
  };
  const topAccounts = Object.fromEntries(
    spikeRows
      .filter((r) => r.rank === 1)
      .map((r) => [r.date, { account: r.account, sharePct: r.sharePct }])
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-white">Network Pulse</h1>
          <p className="mt-2 text-slate-400">
            Historical snapshot, not live data. Snapshot taken {meta.snapshot_date},
            covering {meta.date_range_start} to {meta.date_range_end}. Source:{" "}
            {meta.source}.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <ComparisonCard
              title="Avg daily transactions, last 7 days"
              days={7}
              c={compareWindows(dailyRows, "transactionCount", 7)}
            />
          </Reveal>
          <Reveal delay={80}>
            <ComparisonCard
              title="Avg daily distinct signers, last 7 days"
              days={7}
              c={compareWindows(dailyRows, "distinctSigners", 7)}
            />
          </Reveal>
          <Reveal delay={160}>
            <ComparisonCard
              title="Avg daily transactions, last 30 days"
              days={30}
              c={compareWindows(dailyRows, "transactionCount", 30)}
            />
          </Reveal>
          <Reveal delay={240}>
            <ComparisonCard
              title="Avg daily distinct signers, last 30 days"
              days={30}
              c={compareWindows(dailyRows, "distinctSigners", 30)}
            />
          </Reveal>
        </div>

        <Reveal>
          <section className="glass p-5">
            <h2 className="text-lg font-medium text-white">Daily trend</h2>
            <div className="mt-3">
              <TrendChart rows={dailyRows} />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Each point is one day. The cyan line (left axis) is the number of
              transactions. The green line (right axis) is the number of distinct
              accounts that signed at least one transaction that day, which is not
              the same as unique users.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="glass p-5">
            <h2 className="text-lg font-medium text-white">
              Function-call actions and distinct receiver contracts
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Source: receipt_actions (action_kind = FUNCTION_CALL). One transaction
              can produce several actions, so this is not comparable to the
              transaction count above.
            </p>
            <div className="mt-3">
              <FunctionCallChart rows={functionCallRows} />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Each point is one day. The cyan line (left axis, in millions) is the
              number of function-call actions. The green line (right axis) is the
              number of distinct receiver contracts. On 10, 11 and 15 October a few
              receiver accounts took most of the actions while the number of
              distinct contracts did not rise. The cause is not verified.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="glass p-5">
            <h2 className="text-lg font-medium text-white">Explore a single day</h2>
            <p className="mt-1 text-sm text-slate-400">
              Pick any date in the snapshot to see its numbers next to the
              91-day median.
            </p>
            <div className="mt-4">
              <DayPicker days={days} medians={medians} topAccounts={topAccounts} />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="glass p-5 text-sm text-slate-300">
            <h2 className="text-lg font-medium text-white">Metric definitions</h2>
            <p className="mt-3">
              <strong>Transactions:</strong> {meta.metric_definitions.transaction_count}
            </p>
            <p className="mt-2">
              <strong>Distinct signers:</strong> {meta.metric_definitions.distinct_signers}
            </p>
            <p className="mt-2">
              <strong>Function-call actions:</strong>{" "}
              {fcMeta.metric_definitions.function_call_actions}
            </p>
            <p className="mt-2">
              <strong>Distinct receiver contracts:</strong>{" "}
              {fcMeta.metric_definitions.distinct_contracts}
            </p>
          </section>
        </Reveal>
      </div>
    </main>
  );
}