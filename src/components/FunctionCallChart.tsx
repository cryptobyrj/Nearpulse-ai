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
import type { FunctionCallRow } from "@/lib/data";
import RangeTabs, { type Range } from "./RangeTabs";

const MARKS = ["2026-10-10", "2026-10-11", "2026-10-15"];

export default function FunctionCallChart({ rows }: { rows: FunctionCallRow[] }) {
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
              yAxisId="actions"
              stroke="#22d3ee"
              fontSize={12}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            />
            <YAxis
              yAxisId="contracts"
              orientation="right"
              stroke="#00ec97"
              fontSize={12}
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
                yAxisId="actions"
                x={d}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={
                  d === "2026-10-11"
                    ? undefined
                    : {
                        value: d === "2026-10-10" ? "10-10 / 10-11" : d.slice(5),
                        position: "top",
                        fill: "#94a3b8",
                        fontSize: 10,
                      }
                }
              />
            ))}
            <Line
              yAxisId="actions"
              type="monotone"
              dataKey="functionCallActions"
              name="Function-call actions"
              stroke="#22d3ee"
              dot={false}
              strokeWidth={2}
              animationDuration={700}
            />
            <Line
              yAxisId="contracts"
              type="monotone"
              dataKey="distinctContracts"
              name="Distinct receiver contracts"
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
          Dashed lines mark the three largest function-call spikes (10-10, 10-11,
          10-15). On each of those days one receiver account took the largest
          share; why is not verified.
        </p>
      )}
    </div>
  );
}