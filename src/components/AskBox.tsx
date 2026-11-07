"use client";

import { useState } from "react";

const EXAMPLES = [
  "Is NEAR network activity increasing?",
  "What happened to transaction activity in the last 30 days?",
  "Which contracts have the highest function-call activity?",
  "Explain this chart in simple English.",
  "What evidence supports our research hypothesis?",
  "What are the weaknesses in this data?",
];

export default function AskBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    const text = q.trim();
    if (!text) {
      setError("Please type a question.");
      return;
    }
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setAnswer(data.answer);
        setMode(data.mode);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor="question" className="text-sm text-slate-300">
        Your question
      </label>
      <textarea
        id="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        maxLength={500}
        rows={3}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
        placeholder="Ask about NEAR activity in the stored snapshot..."
      />
      <button
        type="button"
        onClick={() => ask(question)}
        disabled={loading}
        className="mt-3 rounded-lg border border-cyan-400/60 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-400/10 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setQuestion(ex);
              ask(ex);
            }}
            disabled={loading}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400 disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-5 text-sm text-red-300">
          {error}
        </p>
      )}

      {answer && (
        <section
          aria-live="polite"
          className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-5"
        >
          <p className="text-xs text-slate-500">
            Mode: {mode === "ai" ? "AI-written from verified metrics" : "Built-in explanation from verified metrics (no AI model used)"}
          </p>
          <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
            {answer}
          </div>
        </section>
      )}
    </div>
  );
}