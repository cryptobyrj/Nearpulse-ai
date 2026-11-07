import AskBox from "@/components/AskBox";

export default function AskPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white">Ask NEAR AI</h1>
      <p className="mt-2 text-slate-400">
        Answers use only the verified metrics stored in this app. They come from
        historical snapshots, not live queries, and make no price predictions.
      </p>
      <div className="mt-8">
        <AskBox />
      </div>
    </main>
  );
}