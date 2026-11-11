"use client";

import { useState } from "react";

export type Day = {
  date: string;
  transactionCount: number;
  distinctSigners: number;
  functionCallActions: number;
  distinctContracts: number;
  top5Calls: number;
};

export type Medians = {
  transactionCount: number;
  distinctSigners: number;
  functionCallActions: number;
  distinctContracts: number;
  top5Share: number;
};

type TopAccounts = Record<string, { account: string; sharePct: number }>;

const ROWS: {
  key: "transactionCount" | "distinctSigners" | "functionCallActions" | "distinctContracts";
  label: string;
}[] = [
  { key: "transactionCount", label: "Transactions" },
  { key: "distinctSigners", label: "Distinct signers" },
  { key: "functionCallActions", label: "Function-call actions" },
  { key: "distinctContracts", label: "Distinct receiver contracts" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function vsMedian(v: number, med: number) {
  if (med === 0) return "n/a";
  const p = ((v - med) / med) * 100;
  return `${p >= 0 ? "+" : ""}${p.toFixed(1)}% vs snapshot median`;
}

export default function DayPicker({
  days,
  medians,
  topAccounts,
}: {
  days: Day[];
  medians: Medians;
  topAccounts: TopAccounts;
}) {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const [date, setDate] = useState(last);
  const idx = days.findIndex((d) => d.date === date);
  const day = idx >= 0 ? days[idx] : null;

  function go(delta: number) {
    const next = days[idx + delta];
    if (next) setDate(next.date);
  }

  const share =
    day && day.functionCallActions > 0
      ? (day.top5Calls / day.functionCallActions) * 100
      : null;
  const top = day ? topAccounts[day.date] : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="day-picker" className="block text-sm text-slate-300">
            Pick a day
          </label>
          <input
            id="day-picker"
            type="date"
            min={first}
            max={last}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-slate-100 focus:border-[#00ec97] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={!day || idx === 0}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-[#00ec97]/60 disabled:opacity-40"
        >
          Previous day
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={!day || idx === days.length - 1}
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-[#00ec97]/60 disabled:opacity-40"
        >
          Next day
        </button>
      </div>

      {!day ? (
        <p role="alert" className="mt-4 text-sm text-amber-300">
          Please pick a date between {first} and {last}.
        </p>
      ) : (
        <div aria-live="polite">
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ROWS.map((r) => {
              const rank = 1 + days.filter((d) => d[r.key] > day[r.key]).length;
              return (
                <div key={r.key} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-slate-400">{r.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {fmt(day[r.key])}
                  </p>
                  <p className="mt-1 text-xs text-cyan-200">
                    {vsMedian(day[r.key], medians[r.key])}
                  </p>
                  <p className="text-xs text-slate-500">
                    Rank {rank} of {days.length} (1 = highest)
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Top-5 receiver share of function-call actions:{" "}
            <strong className="text-white">
              {share === null ? "n/a" : `${share.toFixed(1)}%`}
            </strong>{" "}
            (snapshot median {medians.top5Share.toFixed(1)}%).
          </p>
          {top && (
            <p className="mt-2 text-sm text-slate-300">
              Largest receiver account that day:{" "}
              <strong className="text-white">{top.account}</strong> with{" "}
              {top.sharePct}% of function-call actions. What this account is, and
              why it received so many calls, was not investigated.
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Historical snapshot, not live data. Medians are over the 91 days in the
        snapshot. Distinct signers is not unique users.
      </p>
    </div>
  );
}