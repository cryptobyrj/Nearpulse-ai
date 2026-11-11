"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyRow } from "@/lib/metrics";
import RangeTabs, { type Range } from "./RangeTabs";

const MARKS = ["2026-09-27", "2026-10-04", "2026-11-03"];

export default function TrendChart({ rows }: { rows: DailyRow[] }) {
  const [range, setRange] = useState<Range>(91);

  if (rows.length === 0) {
    return <p className="text-slate-400">No data available.</p>;
  }

  const shown = rows.slice(-range);
  const marks = MARKS.filter((d) => shown.some((r) => r.date === d));

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <RangeTabs value={range} onChange={setRange} />
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={shown} margin={{ top: 22, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} minTickGap={32} />
            <YAxis
              yAxisId="tx"
              stroke="#22d3ee"
              fontSize={12}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <YAxis
              yAxisId="signers"
              orientation="right"
              stroke="#00ec97"
              fontSize={12}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(7,11,13,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
              }}
              formatter={(value) => Number(value).toLocaleString("en-US")}
            />
            <Legend />
            {marks.map((d) => (
              <ReferenceLine
                key={d}
                yAxisId="tx"
                x={d}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={{ value: d.slice(5), position: "top", fill: "#94a3b8", fontSize: 10 }}
              />
            ))}
            <Line
              yAxisId="tx"
              type="monotone"
              dataKey="transactionCount"
              name="Transactions"
              stroke="#22d3ee"
              dot={false}
              strokeWidth={2}
              animationDuration={700}
            />
            <Line
              yAxisId="signers"
              type="monotone"
              dataKey="distinctSigners"
              name="Distinct signers"
              stroke="#00ec97"
              dot={false}
              strokeWidth={2}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {marks.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Dashed lines mark days with unexplained spikes: the highest transaction
          day (09-27), the highest distinct-signers day (10-04) and the jump in
          signers (11-03). The causes are not verified.
        </p>
      )}
    </div>
  );
}