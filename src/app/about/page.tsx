import { meta } from "@/lib/data";
import fcMeta from "../../../data/function_calls_meta.json";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">About NEARPulse AI</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-slate-300">
        <section>
          <h2 className="text-lg font-medium text-white">What it is</h2>
          <p className="mt-2">
            NEARPulse AI is an evidence-first research tool for the NEAR
            ecosystem. It was built for NEAR Hackathon 2026 (Investment Thesis
            track) and investigates one hypothesis with verifiable data. It is
            not a trading tool and makes no token price predictions.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-white">Where the data comes from</h2>
          <p className="mt-2">
            Two historical snapshots from the NEAR public dataset in Google
            BigQuery: {meta.source} and {fcMeta.source}. They cover{" "}
            {meta.date_range_start} to {meta.date_range_end}. They are not live
            data. The SQL for each is on the Data Explorer page.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-white">How Ask NEAR AI works</h2>
          <p className="mt-2">
            The assistant only receives metrics stored in this app. If an AI
            model is not configured or does not respond, the app falls back to
            built-in explanations written from the same verified numbers. Each
            answer shows which mode produced it.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-medium text-white">Important limits</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Distinct signers is not unique users and not all active accounts.</li>
            <li>Function-call actions are actions, not transactions.</li>
            <li>The causes of several spikes in the data have not been verified.</li>
            <li>Only 91 days are covered.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}