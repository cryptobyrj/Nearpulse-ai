"use client";

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

const MARKS = ["2026-10-10", "2026-10-11", "2026-10-15"];

export default function ShareChart({ rows }: { rows: FunctionCallRow[] }) {
  if (rows.length === 0) {
    return <p className="text-slate-400">No data available.</p>;
  }
  const data = rows.map((r) => ({
    date: r.date,
    share: Number(((r.top5Calls / r.functionCallActions) * 100).toFixed(1)),
  }));
  const sorted = data.map((d) => d.share).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const med =
    sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 22, right: 16, left: 0, bottom: 0 }}>
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
              value: `median ${med.toFixed(1)}%`,
              position: "insideTopLeft",
              fill: "#94a3b8",
              fontSize: 11,
            }}
          />
          {MARKS.map((d) => (
            <ReferenceLine
              key={d}
              x={d}
              stroke="#fb7185"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{ value: d.slice(5), position: "top", fill: "#fb7185", fontSize: 10 }}
            />
          ))}
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
  );
}