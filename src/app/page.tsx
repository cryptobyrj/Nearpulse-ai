import Link from "next/link";
import TrendChart from "@/components/TrendChart";
import { dailyRows, meta } from "@/lib/data";
import { compareWindows } from "@/lib/metrics";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export default function OverviewPage() {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;

  const cards = [
    { label: "Avg daily transactions, last 7 days", value: fmt(tx7.currentAvg), change: `${pct(tx7.changePct)} vs previous 7 days` },
    { label: "Avg daily distinct signers, last 7 days", value: fmt(sg7.currentAvg), change: `${pct(sg7.changePct)} vs previous 7 days` },
    { label: "Avg daily transactions, last 30 days", value: fmt(tx30.currentAvg), change: `${pct(tx30.changePct)} vs previous 30 days` },
    { label: "Avg daily distinct signers, last 30 days", value: fmt(sg30.currentAvg), change: `${pct(sg30.changePct)} vs previous 30 days` },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section>
        <p className="text-sm text-cyan-300">The intelligence layer for the NEAR ecosystem</p>
        <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">
          NEARPulse AI
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          An evidence-first research platform. It turns real NEAR mainnet data
          into dashboards, plain-English explanations and reproducible SQL, and
          it tests a hypothesis instead of assuming one: is NEAR usage
          broadening when transactions, distinct signers and function-call
          activity are considered together?
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/ask"
            className="rounded-lg border border-cyan-400/60 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-100 hover:bg-cyan-400/20"
          >
            Ask NEAR AI
          </Link>
          <Link
            href="/reports"
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-200 hover:border-slate-500"
          >
            Read the research report
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-medium text-white">Key network metrics</h2>
        <p className="mt-1 text-sm text-slate-400">
          Historical snapshot, not live data. Covers {meta.date_range_start} to{" "}
          {meta.date_range_end}; snapshot taken {meta.snapshot_date}.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-400">{c.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{c.value}</p>
              <p className="mt-1 text-sm text-slate-300">{c.change}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-medium text-white">Daily transactions and distinct signers</h2>
          <Link href="/network-pulse" className="text-sm text-cyan-300 hover:underline">
            Open Network Pulse
          </Link>
        </div>
        <TrendChart rows={dailyRows} />
        <p className="mt-2 text-xs text-slate-500">
          Distinct signers is not unique users and not all active accounts.
        </p>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { href: "/explorer", title: "Data Explorer", text: "Every metric with its SQL, source table and definition, so anyone can reproduce it." },
          { href: "/reports", title: "Research Reports", text: "Evidence for and against the hypothesis, limitations, and what would change the conclusion." },
          { href: "/ask", title: "Ask NEAR AI", text: "Questions answered only from the verified snapshot, with the time period stated." },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-400/50">
            <h3 className="font-medium text-white">{x.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{x.text}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}