"use client";

const OPTIONS = [7, 30, 91] as const;
export type Range = (typeof OPTIONS)[number];

export default function RangeTabs({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Date range"
      className="inline-flex rounded-lg border border-white/10 p-0.5 text-xs"
    >
      {OPTIONS.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className={
            "rounded-md px-3 py-1 transition-colors " +
            (value === o
              ? "bg-[#00ec97]/15 text-[#00ec97]"
              : "text-slate-400 hover:text-white")
          }
        >
          {o === 91 ? "All 91 days" : `Last ${o} days`}
        </button>
      ))}
    </div>
  );
}