"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FunctionCallRow } from "@/lib/data";
import RangeTabs, { type Range } from "./RangeTabs";

const MARKS = ["2026-10-10", "2026-10-11", "2026-10-15"];

function median(values: number[]) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export default function ShareChart({ rows }: { rows: FunctionCallRow[] }) {
  const [range, setRange] = useState<Range>(91);

  if (rows.length === 0) {
    return <p className="text-slate-400">No data available.</p>;
  }

  const all = rows.map((r) => ({
    date: r.date,
    share: Number(((r.top5Calls / r.functionCallActions) * 100).toFixed(1)),
  }));
  const med = median(all.map((d) => d.share));
  const shown = all.slice(-range);
  const rangeMed = median(shown.map((d) => d.share));
  const marks = MARKS.filter((d) => shown.some((r) => r.date === d));

  function labelFor(d: string): string | undefined {
    if (d === "2026-10-11" && marks.includes("2026-10-10")) return undefined;
    if (d === "2026-10-10" && marks.includes("2026-10-11")) return "10-10 / 10-11";
    return d.slice(5);
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <RangeTabs value={range} onChange={setRange} />
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={shown} margin={{ top: 22, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} minTickGap={32} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(7,11,13,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
              }}
              formatter={(value) => `${value}%`}
            />
            <ReferenceLine
              y={med}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `91-day median ${med.toFixed(1)}%`,
                position: "insideTopLeft",
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            {marks.map((d) => {
              const text = labelFor(d);
              return (
                <ReferenceLine
                  key={d}
                  x={d}
                  stroke="#fb7185"
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                  label={
                    text
                      ? { value: text, position: "top", fill: "#fb7185", fontSize: 10 }
                      : undefined
                  }
                />
              );
            })}
            <Line
              type="monotone"
              dataKey="share"
              name="Top-5 receiver share"
              stroke="#00ec97"
              dot={false}
              strokeWidth={2}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Median top-5 share in this view: {rangeMed.toFixed(1)}% (91-day median:{" "}
        {med.toFixed(1)}%).
        {marks.length > 0 &&
          " Red dashed lines mark the three spike days, when one receiver account took the largest share."}
      </p>
    </div>
  );
}