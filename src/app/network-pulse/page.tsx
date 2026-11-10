import TrendChart from "@/components/TrendChart";
import FunctionCallChart from "@/components/FunctionCallChart";
import { dailyRows, functionCallRows, meta } from "@/lib/data";
import { compareWindows, type Comparison } from "@/lib/metrics";

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
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
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      {c ? (
        <>
          <p className="mt-2 text-3xl font-semibold text-white">
            {fmt(c.currentAvg)}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {c.changePct === null
              ? "No comparison available"
              : `${c.changePct >= 0 ? "+" : ""}${c.changePct.toFixed(1)}% vs previous ${days} days`}
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
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">Network Pulse</h1>
      <p className="mt-2 text-slate-400">
        Historical snapshot, not live data. Snapshot taken {meta.snapshot_date},
        covering {meta.date_range_start} to {meta.date_range_end}. Source:{" "}
        {meta.source}.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ComparisonCard
          title="Avg daily transactions, last 7 days"
          days={7}
          c={compareWindows(dailyRows, "transactionCount", 7)}
        />
        <ComparisonCard
          title="Avg daily distinct signers, last 7 days"
          days={7}
          c={compareWindows(dailyRows, "distinctSigners", 7)}
        />
        <ComparisonCard
          title="Avg daily transactions, last 30 days"
          days={30}
          c={compareWindows(dailyRows, "transactionCount", 30)}
        />
        <ComparisonCard
          title="Avg daily distinct signers, last 30 days"
          days={30}
          c={compareWindows(dailyRows, "distinctSigners", 30)}
        />
      </div>

      <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">Daily trend</h2>
        <TrendChart rows={dailyRows} />
                <p className="mt-3 text-sm text-slate-400">
          Each point is one day. The cyan line (left axis) is the number of
          transactions. The violet line (right axis) is the number of distinct
          accounts that signed at least one transaction that day, which is not
          the same as unique users.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-medium text-white">
          Function-call actions and distinct receiver contracts
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Source: receipt_actions (action_kind = FUNCTION_CALL). One transaction
          can produce several actions, so this is not comparable to the
          transaction count above.
        </p>
        <FunctionCallChart rows={functionCallRows} />
                <p className="mt-3 text-sm text-slate-400">
          Each point is one day. The cyan line (left axis, in millions) is the
          number of function-call actions. The violet line (right axis) is the
          number of distinct receiver contracts. On 10, 11 and 15 October a few
          receiver accounts took most of the actions while the number of
          distinct contracts did not rise. The cause is not verified.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <h2 className="text-lg font-medium text-white">Metric definitions</h2>
        <p className="mt-3">
          <strong>Transactions:</strong> {meta.metric_definitions.transaction_count}
        </p>
        <p className="mt-2">
          <strong>Distinct signers:</strong> {meta.metric_definitions.distinct_signers}
        </p>
      </section>
    </main>
  );
}