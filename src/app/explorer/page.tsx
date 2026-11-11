import fs from "node:fs";
import path from "node:path";
import { meta } from "@/lib/data";
import fcMeta from "../../../data/function_calls_meta.json";
import spikeRows from "../../../data/spike_days_top5.json";

function readSql(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function Box({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
      {children}
    </section>
  );
}

export default function ExplorerPage() {
  const sqlTx = readSql(meta.sql_file);
  const sqlFc = readSql(fcMeta.sql_file);
    const sqlSpike = readSql("sql/spike_days_top5.sql");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">Data Explorer</h1>
      <p className="mt-2 text-slate-400">
        Every number in NEARPulse AI comes from one of the two queries below.
        Historical snapshots, not live data.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-white">
        Dataset 1: transactions and distinct signers
      </h2>
      <Box>
        <dl className="grid gap-2 md:grid-cols-2">
          <div><dt className="text-slate-500">Snapshot date</dt><dd>{meta.snapshot_date}</dd></div>
          <div><dt className="text-slate-500">Date range</dt><dd>{meta.date_range_start} to {meta.date_range_end}</dd></div>
          <div><dt className="text-slate-500">Source table</dt><dd className="break-all">{meta.source}</dd></div>
          <div><dt className="text-slate-500">Rows</dt><dd>{meta.row_count}</dd></div>
          <div><dt className="text-slate-500">Estimated bytes processed</dt><dd>{meta.estimated_bytes_processed}</dd></div>
          <div><dt className="text-slate-500">Data file</dt><dd>data/daily_metrics.csv</dd></div>
        </dl>
      </Box>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-lg font-medium text-white">SQL ({meta.sql_file})</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-cyan-200">{sqlTx}</pre>
      </section>
      <Box>
        <h3 className="text-lg font-medium text-white">Metric definitions</h3>
        <p className="mt-3"><strong>Transactions:</strong> {meta.metric_definitions.transaction_count}</p>
        <p className="mt-2"><strong>Distinct signers:</strong> {meta.metric_definitions.distinct_signers}</p>
      </Box>
      <Box>
        <h3 className="text-lg font-medium text-white">Known observations (unverified causes)</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {meta.known_observations.map((o) => (<li key={o}>{o}</li>))}
        </ul>
      </Box>

      <h2 className="mt-12 text-xl font-semibold text-white">
        Dataset 2: function-call actions and receiver contracts
      </h2>
      <Box>
        <dl className="grid gap-2 md:grid-cols-2">
          <div><dt className="text-slate-500">Snapshot date</dt><dd>{fcMeta.snapshot_date}</dd></div>
          <div><dt className="text-slate-500">Date range</dt><dd>{fcMeta.date_range_start} to {fcMeta.date_range_end}</dd></div>
          <div><dt className="text-slate-500">Source table</dt><dd className="break-all">{fcMeta.source}</dd></div>
          <div><dt className="text-slate-500">Rows</dt><dd>{fcMeta.row_count}</dd></div>
          <div><dt className="text-slate-500">Estimated bytes processed</dt><dd>{fcMeta.estimated_bytes_processed}</dd></div>
          <div><dt className="text-slate-500">Data file</dt><dd>data/function_calls_daily.csv</dd></div>
        </dl>
      </Box>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-lg font-medium text-white">SQL ({fcMeta.sql_file})</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-cyan-200">{sqlFc}</pre>
      </section>
      <Box>
        <h3 className="text-lg font-medium text-white">Metric definitions</h3>
        <p className="mt-3"><strong>Function-call actions:</strong> {fcMeta.metric_definitions.function_call_actions}</p>
        <p className="mt-2"><strong>Distinct receiver contracts:</strong> {fcMeta.metric_definitions.distinct_contracts}</p>
        <p className="mt-2"><strong>Top-5 calls:</strong> {fcMeta.metric_definitions.top5_calls}</p>
      </Box>
      <Box>
        <h3 className="text-lg font-medium text-white">Known observations (unverified causes)</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {fcMeta.known_observations.map((o) => (<li key={o}>{o}</li>))}
        </ul>
      </Box>
      <h2 className="mt-12 text-xl font-semibold text-white">
        Dataset 3: top receiver accounts on the three spike days
      </h2>
      <Box>
        <dl className="grid gap-2 md:grid-cols-2">
          <div><dt className="text-slate-500">Source table</dt><dd className="break-all">bigquery-public-data.crypto_near_mainnet_us.receipt_actions</dd></div>
          <div><dt className="text-slate-500">Days</dt><dd>2026-10-10, 2026-10-11, 2026-10-15</dd></div>
          <div><dt className="text-slate-500">Rows</dt><dd>15</dd></div>
          <div><dt className="text-slate-500">Data file</dt><dd>data/spike_days_top5.json</dd></div>
        </dl>
      </Box>
      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-lg font-medium text-white">SQL (sql/spike_days_top5.sql)</h3>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-cyan-200">{sqlSpike}</pre>
      </section>
      <Box>
        <h3 className="text-lg font-medium text-white">Result: five most-called receiver accounts per day</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-500">
              <tr>
                <th className="py-1 pr-4">Date</th>
                <th className="py-1 pr-4">Rank</th>
                <th className="py-1 pr-4">Receiver account</th>
                <th className="py-1 pr-4">Actions</th>
                <th className="py-1">Share of day</th>
              </tr>
            </thead>
            <tbody>
              {spikeRows.map((r) => (
                <tr key={`${r.date}-${r.rank}`} className="border-t border-slate-800">
                  <td className="py-1 pr-4">{r.date}</td>
                  <td className="py-1 pr-4">{r.rank}</td>
                  <td className="py-1 pr-4 break-all">{r.account}</td>
                  <td className="py-1 pr-4">{r.calls.toLocaleString("en-US")}</td>
                  <td className="py-1">{r.sharePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-400">
          What these accounts are, and why they received so many calls, was not investigated.
        </p>
      </Box>
      <Box>
        <h2 className="text-lg font-medium text-white">How to reproduce</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Open console.cloud.google.com/bigquery (the free sandbox is enough).</li>
          <li>Paste one of the SQL queries above into a new query tab.</li>
          <li>Check the &quot;This query will process&quot; estimate, then click Run.</li>
          <li>Compare the result with the matching CSV file in the data folder of the repository.</li>
        </ol>
      </Box>
    </main>
  );
}