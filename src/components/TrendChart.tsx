"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyRow } from "@/lib/metrics";
import RangeTabs, { type Range } from "./RangeTabs";

export default function TrendChart({ rows }: { rows: DailyRow[] }) {
  const [range, setRange] = useState<Range>(91);

  if (rows.length === 0) {
    return <p className="text-slate-400">No data available.</p>;
  }

  const shown = rows.slice(-range);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <RangeTabs value={range} onChange={setRange} />
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={shown} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
    </div>
  );
}