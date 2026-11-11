import type { DailyRow } from "@/lib/metrics";

function toPath(values: number[], w: number, h: number, pad: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((v - min) / span) * (h - 2 * pad);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HeroLine({ rows }: { rows: DailyRow[] }) {
  if (rows.length < 2) {
    return <p className="text-slate-400">No data available.</p>;
  }
  const w = 800;
  const h = 220;
  const pad = 12;
  const signers = toPath(rows.map((r) => r.distinctSigners), w, h, pad);
  const txs = toPath(rows.map((r) => r.transactionCount), w, h, pad);

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label="Daily transactions and distinct signers, 91 days, each line scaled to its own range"
        className="w-full"
      >
        <style>{`
          .hero-line {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: heroDraw 2.6s ease-out forwards;
          }
          .hero-line-b { animation-delay: 0.4s; }
          @keyframes heroDraw { to { stroke-dashoffset: 0; } }
          @media (prefers-reduced-motion: reduce) {
            .hero-line { animation: none; stroke-dashoffset: 0; }
          }
        `}</style>
        <path
          d={txs}
          pathLength="1"
          className="hero-line hero-line-b"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d={signers}
          pathLength="1"
          className="hero-line"
          fill="none"
          stroke="#00ec97"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>{rows[0].date}</span>
        <span className="flex flex-wrap gap-4">
          <span className="text-[#00ec97]">Distinct signers</span>
          <span className="text-cyan-300">Transactions</span>
        </span>
        <span>{rows[rows.length - 1].date}</span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Each line is scaled to its own lowest and highest day, so this shows the
        shape of the trend, not the size. Real values are on Network Pulse.
      </p>
    </div>
  );
}