import Reveal from "@/components/Reveal";
import { buildReport } from "@/lib/report";

function accent(title: string) {
  if (title.startsWith("Evidence supporting"))
    return { bar: "bg-[#00ec97]", tag: "Evidence for", tagCls: "bg-[#00ec97]/10 text-[#00ec97]" };
  if (title.startsWith("Evidence against"))
    return { bar: "bg-rose-400", tag: "Evidence against", tagCls: "bg-rose-400/10 text-rose-300" };
  if (title.startsWith("Data limitations"))
    return { bar: "bg-amber-400", tag: "Limitations", tagCls: "bg-amber-400/10 text-amber-300" };
  return null;
}

export default function ReportsPage() {
  const report = buildReport();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-[#00ec97]">Research report</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">{report.title}</h1>
          <p className="mt-2 text-slate-400">
            Analysis date: {report.analysisDate}. Historical snapshots, not live data.
          </p>
          <a
            href="/api/report"
            download
            className="mt-5 inline-block rounded-lg border border-[#00ec97]/60 px-4 py-2 text-sm text-[#00ec97] transition hover:bg-[#00ec97]/10"
          >
            Download as Markdown
          </a>
        </div>

        {report.sections.map((s) => {
          const a = accent(s.title);
          return (
            <Reveal key={s.title}>
              <section className="glass relative overflow-hidden p-5 pl-6">
                {a && (
                  <span
                    aria-hidden="true"
                    className={"absolute inset-y-0 left-0 w-1 " + a.bar}
                  />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-medium text-white">{s.title}</h2>
                  {a && (
                    <span className={"rounded px-2 py-0.5 text-xs " + a.tagCls}>
                      {a.tag}
                    </span>
                  )}
                </div>
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
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}