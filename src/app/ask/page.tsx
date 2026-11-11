import AskBox from "@/components/AskBox";
import { meta } from "@/lib/data";

export default function AskPage() {
  const period = `${meta.date_range_start} to ${meta.date_range_end}`;
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Ask NEAR AI</h1>
          <p className="mt-2 text-slate-400">
            Answers use only the verified metrics stored in this app. They come
            from historical snapshots, not live queries, and make no price
            predictions.
          </p>
        </div>
        <AskBox period={period} />
      </div>
    </main>
  );
}