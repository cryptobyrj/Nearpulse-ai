"use client";

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

export default function TrendChart({ rows }: { rows: DailyRow[] }) {
  if (rows.length === 0) {
    return <p className="text-slate-400">No data available.</p>;
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
            stroke="#a78bfa"
            fontSize={12}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
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
          />
          <Line
            yAxisId="signers"
            type="monotone"
            dataKey="distinctSigners"
            name="Distinct signers"
            stroke="#a78bfa"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}