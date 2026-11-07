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
import type { FunctionCallRow } from "@/lib/data";

export default function FunctionCallChart({ rows }: { rows: FunctionCallRow[] }) {
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
            yAxisId="actions"
            stroke="#22d3ee"
            fontSize={12}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
          />
          <YAxis
            yAxisId="contracts"
            orientation="right"
            stroke="#a78bfa"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
            formatter={(value) => Number(value).toLocaleString("en-US")}
          />
          <Legend />
          <Line
            yAxisId="actions"
            type="monotone"
            dataKey="functionCallActions"
            name="Function-call actions"
            stroke="#22d3ee"
            dot={false}
            strokeWidth={2}
          />
          <Line
            yAxisId="contracts"
            type="monotone"
            dataKey="distinctContracts"
            name="Distinct receiver contracts"
            stroke="#a78bfa"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}