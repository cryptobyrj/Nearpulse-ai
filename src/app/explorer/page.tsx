import fs from "node:fs";
import path from "node:path";
import Reveal from "@/components/Reveal";
import SqlBlock from "@/components/SqlBlock";
import { meta } from "@/lib/data";
import fcMeta from "../../../data/function_calls_meta.json";
import spikeRows from "../../../data/spike_days_top5.json";

function readSql(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

function Box({ children }: { children: React.ReactNode }) {
  return <section className="glass p-5 text-sm text-slate-300">{children}</section>;
}

function Facts({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-2 md:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="text-slate-500">{k}</dt>
          <dd className="break-all">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ExplorerPage() {
  const sqlTx = readSql(meta.sql_file);
  const sqlFc = readSql(fcMeta.sql_file);
  const sqlSpike = readSql("sql/spike_days_top5.sql");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">Data Explorer</h1>
          <p className="mt-2 text-slate-400">
            Every number in NEARPulse AI comes from one of the three queries
            below. Historical snapshots, not live data. Use the Copy query
            button, paste into the BigQuery console, and compare.
          </p>
        </div>

        <h2 className="pt-4 text-xl font-semibold text-white">
          Dataset 1: transactions and distinct signers
        </h2>
        <Reveal>
          <Box>
            <Facts
              items={[
                ["Snapshot date", meta.snapshot_date],
                ["Date range", `${meta.date_range_start} to ${meta.date_range_end}`],
                ["Source table", meta.source],
                ["Rows", String(meta.row_count)],
                ["Estimated bytes processed", meta.estimated_bytes_processed],
                ["Data file", "data/daily_metrics.csv"],
              ]}
            />
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">SQL ({meta.sql_file})</h3>
            <div className="mt-3">
              <SqlBlock sql={sqlTx} label="transactions and signers" />
            </div>
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">Metric definitions</h3>
            <p className="mt-3"><strong>Transactions:</strong> {meta.metric_definitions.transaction_count}</p>
            <p className="mt-2"><strong>Distinct signers:</strong> {meta.metric_definitions.distinct_signers}</p>
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">Known observations (unverified causes)</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {meta.known_observations.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Box>
        </Reveal>

        <h2 className="pt-6 text-xl font-semibold text-white">
          Dataset 2: function-call actions and receiver contracts
        </h2>
        <Reveal>
          <Box>
            <Facts
              items={[
                ["Snapshot date", fcMeta.snapshot_date],
                ["Date range", `${fcMeta.date_range_start} to ${fcMeta.date_range_end}`],
                ["Source table", fcMeta.source],
                ["Rows", String(fcMeta.row_count)],
                ["Estimated bytes processed", fcMeta.estimated_bytes_processed],
                ["Data file", "data/function_calls_daily.csv"],
              ]}
            />
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">SQL ({fcMeta.sql_file})</h3>
            <div className="mt-3">
              <SqlBlock sql={sqlFc} label="function calls" />
            </div>
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">Metric definitions</h3>
            <p className="mt-3"><strong>Function-call actions:</strong> {fcMeta.metric_definitions.function_call_actions}</p>
            <p className="mt-2"><strong>Distinct receiver contracts:</strong> {fcMeta.metric_definitions.distinct_contracts}</p>
            <p className="mt-2"><strong>Top-5 calls:</strong> {fcMeta.metric_definitions.top5_calls}</p>
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">Known observations (unverified causes)</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {fcMeta.known_observations.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Box>
        </Reveal>

        <h2 className="pt-6 text-xl font-semibold text-white">
          Dataset 3: top receiver accounts on the three spike days
        </h2>
        <Reveal>
          <Box>
            <Facts
              items={[
                ["Source table", "bigquery-public-data.crypto_near_mainnet_us.receipt_actions"],
                ["Days", "2026-10-10, 2026-10-11, 2026-10-15"],
                ["Rows", "15"],
                ["Data file", "data/spike_days_top5.json"],
              ]}
            />
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">SQL (sql/spike_days_top5.sql)</h3>
            <div className="mt-3">
              <SqlBlock sql={sqlSpike} label="spike days" />
            </div>
          </Box>
        </Reveal>
        <Reveal>
          <Box>
            <h3 className="text-lg font-medium text-white">
              Result: five most-called receiver accounts per day
            </h3>
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
                    <tr key={`${r.date}-${r.rank}`} className="border-t border-white/10">
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
        </Reveal>

        <Reveal>
          <Box>
            <h2 className="text-lg font-medium text-white">How to reproduce</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Open console.cloud.google.com/bigquery (the free sandbox is enough).</li>
              <li>Click Copy query on one of the queries above and paste it into a new query tab.</li>
              <li>Check the &quot;This query will process&quot; estimate, then click Run.</li>
              <li>Compare the result with the matching file in the data folder of the repository.</li>
            </ol>
          </Box>
        </Reveal>
      </div>
    </main>
  );
}