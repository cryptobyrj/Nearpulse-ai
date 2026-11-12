import Link from "next/link";
import CountUp from "@/components/CountUp";
import HeroLine from "@/components/HeroLine";
import Reveal from "@/components/Reveal";
import { dailyRows, meta } from "@/lib/data";
import { compareWindows } from "@/lib/metrics";

const pct = (n: number | null) =>
  n === null ? "n/a" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

export default function OverviewPage() {
  const tx7 = compareWindows(dailyRows, "transactionCount", 7)!;
  const sg7 = compareWindows(dailyRows, "distinctSigners", 7)!;
  const tx30 = compareWindows(dailyRows, "transactionCount", 30)!;
  const sg30 = compareWindows(dailyRows, "distinctSigners", 30)!;

  const cards = [
    { label: "Avg daily transactions", period: "last 7 days", days: 7, c: tx7 },
    { label: "Avg daily distinct signers", period: "last 7 days", days: 7, c: sg7 },
    { label: "Avg daily transactions", period: "last 30 days", days: 30, c: tx30 },
    { label: "Avg daily distinct signers", period: "last 30 days", days: 30, c: sg30 },
  ];

  const links = [
    { href: "/explorer", title: "Data Explorer", text: "Every metric with its SQL, source table and definition, so anyone can reproduce it." },
    { href: "/reports", title: "Research", text: "Evidence for and against the hypothesis, limitations, and what would change the conclusion." },
    { href: "/ask", title: "Ask NEAR AI", text: "Questions answered only from the verified snapshot, with the time period stated." },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="space-y-14">
          <section className="relative">
          <div aria-hidden="true" className="hero-mark" />
          <p className="text-sm tracking-wide text-[#00ec97]">
            The intelligence layer for the NEAR ecosystem
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-white md:text-7xl">
            NEARPulse <span className="text-[#00ec97]">AI</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Is NEAR usage really broadening, or is it a few busy days? This
            site tests that question with real mainnet data, and shows the SQL
            behind every number.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/ask"
              className="rounded-lg bg-[#00ec97] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Ask NEAR AI
            </Link>
            <Link
              href="/reports"
              className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-slate-100 transition hover:border-[#00ec97]/60"
            >
              Read the research
            </Link>
            <Link
              href="/explorer"
              className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-slate-100 transition hover:border-[#00ec97]/60"
            >
              Open the SQL
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-white">Key network metrics</h2>
          <p className="mt-1 text-sm text-slate-400">
            Historical snapshot, not live data. Covers {meta.date_range_start} to{" "}
            {meta.date_range_end}; snapshot taken {meta.snapshot_date}.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((k, i) => {
              const up = (k.c.changePct ?? 0) >= 0;
              return (
                <Reveal key={k.label + k.period} delay={i * 90}>
                  <div className="glass h-full p-5">
                    <p className="text-sm text-slate-400">{k.label}</p>
                    <p className="text-xs text-slate-500">{k.period}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      <CountUp value={Math.round(k.c.currentAvg)} />
                    </p>
                    <p className={"mt-1 text-sm " + (up ? "text-[#00ec97]" : "text-rose-300")}>
                      {up ? "▲" : "▼"} {pct(k.c.changePct)} vs previous {k.days} days
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            The 7-day changes depend on 2026-11-03 and 2026-11-04, when signers
            jumped for a reason that is not verified. See the research report.
          </p>
        </section>

        <Reveal>
          <section className="glass p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-medium text-white">91 days at a glance</h2>
              <Link href="/network-pulse" className="text-sm text-[#00ec97] hover:underline">
                Open Network Pulse
              </Link>
            </div>
            <div className="mt-4">
              <HeroLine rows={dailyRows} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Distinct signers is not unique users and not all active accounts.
            </p>
          </section>
        </Reveal>

        <section className="grid gap-4 md:grid-cols-3">
          {links.map((x, i) => (
            <Reveal key={x.href} delay={i * 90}>
              <Link href={x.href} className="glass glass-hover block h-full p-5">
                <h3 className="font-medium text-white">{x.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{x.text}</p>
              </Link>
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}