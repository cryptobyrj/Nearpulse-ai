import { buildReport } from "@/lib/report";

export default function ReportsPage() {
  const report = buildReport();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm text-slate-500">Research report</p>
      <h1 className="mt-1 text-3xl font-semibold text-white">{report.title}</h1>
      <p className="mt-2 text-slate-400">
        Analysis date: {report.analysisDate}. Historical snapshots, not live data.
      </p>

      <a
        href="/api/report"
        download
        className="mt-5 inline-block rounded-lg border border-cyan-400/60 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10"
      >
        Download as Markdown
      </a>

      {report.sections.map((s) => (
        <section
          key={s.title}
          className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <h2 className="text-lg font-medium text-white">{s.title}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p} className="mt-3 text-sm leading-relaxed text-slate-300">
              {p}
            </p>
          ))}
          {s.bullets && (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}