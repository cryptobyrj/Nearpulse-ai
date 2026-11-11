"use client";

import { useEffect, useRef, useState } from "react";

type Turn = {
  id: number;
  q: string;
  a?: string;
  mode?: "ai" | "fallback";
  error?: string;
};

const EXAMPLES = [
  "Is NEAR network activity increasing?",
  "What happened to transaction activity in the last 30 days?",
  "Which day had the highest signers?",
  "Explain this chart in simple English.",
  "What evidence supports our research hypothesis?",
  "What are the weaknesses in this data?",
];

function parseSections(raw: string) {
  const foot = raw.match(/\n*(?:Based on|Answered from) stored snapshots[\s\S]*$/);
  const footer = foot ? foot[0].trim() : null;
  const text = foot ? raw.slice(0, foot.index ?? raw.length).trim() : raw.trim();
  const matches = [
    ...text.matchAll(/(?:^|\n)\s*(Short answer|Evidence|Caveat):\s*/g),
  ];
  if (matches.length === 0) {
    return { sections: [{ label: null as string | null, body: text }], footer };
  }
  const sections: { label: string | null; body: string }[] = [];
  const first = matches[0].index ?? 0;
  if (first > 0 && text.slice(0, first).trim()) {
    sections.push({ label: null, body: text.slice(0, first).trim() });
  }
  matches.forEach((m, i) => {
    const start = (m.index ?? 0) + m[0].length;
    const end =
      i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    sections.push({ label: m[1], body: text.slice(start, end).trim() });
  });
  return { sections, footer };
}

function labelColor(label: string) {
  if (label === "Short answer") return "text-[#00ec97]";
  if (label === "Evidence") return "text-cyan-300";
  return "text-amber-300";
}

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\d{4}-\d{2}-\d{2}|[+-]?\d[\d,]*(?:\.\d+)?%?)/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          /^\d{4}-\d{2}-\d{2}$/.test(p) ? (
            <span key={i} className="rounded bg-cyan-400/10 px-1 text-cyan-200">
              {p}
            </span>
          ) : (
            <span key={i} className="font-medium text-white">
              {p}
            </span>
          )
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function AskBox({ period }: { period: string }) {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const nextId = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (turns.length === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "nearest",
    });
  }, [turns]);

  async function ask(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    const id = nextId.current++;
    setTurns((prev) => [...prev, { id, q: text }].slice(-8));
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      setTurns((prev) =>
        prev.map((t) =>
          t.id !== id
            ? t
            : res.ok
              ? { ...t, a: data.answer, mode: data.mode }
              : { ...t, error: data.error ?? "Something went wrong. Please try again." }
        )
      );
    } catch {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, error: "Could not reach the server. Please try again." }
            : t
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const last = [...turns].reverse().find((t) => t.mode);
  const status = loading
    ? "Reading the verified metrics..."
    : last
      ? last.mode === "ai"
        ? "Last answer: written by the AI model from verified metrics"
        : "Last answer: built-in explanation (no AI model used)"
      : "Ready. Answers use only the stored snapshot.";

  return (
    <div>
      <div className="glass flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300">
        <span
          aria-hidden="true"
          className={
            "h-2 w-2 rounded-full " +
            (loading
              ? "animate-pulse bg-[#00ec97]"
              : last?.mode === "ai"
                ? "bg-[#00ec97]"
                : "bg-slate-500")
          }
        />
        <span>{status}</span>
        <span className="ml-auto hidden text-slate-500 sm:inline">
          Snapshot {period}
        </span>
      </div>

      <div
        aria-live="polite"
        className="mt-5 space-y-5"
      >
        {turns.length === 0 && (
          <p className="text-sm text-slate-400">
            Ask anything about the stored data, in English or Hinglish. Try one
            of the questions below.
          </p>
        )}
        {turns.map((t) => {
          const parsed = t.a ? parseSections(t.a) : null;
          return (
            <div key={t.id} className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-[#00ec97]/25 bg-[#00ec97]/10 px-4 py-2 text-sm text-slate-100">
                  {t.q}
                </div>
              </div>
              <div className="glass p-4">
                {t.error ? (
                  <p role="alert" className="text-sm text-red-300">
                    {t.error}
                  </p>
                ) : !parsed ? (
                  <div className="flex items-center gap-1.5 py-1" aria-label="Thinking">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      {t.mode === "ai"
                        ? "AI-written from verified metrics"
                        : "Built-in explanation from verified metrics (no AI model used)"}
                    </p>
                    {parsed.sections.map((s, i) => (
                      <div
                        key={i}
                        className="fade-in mt-3"
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        {s.label && (
                          <p className={"text-xs font-semibold " + labelColor(s.label)}>
                            {s.label}
                          </p>
                        )}
                        <div className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                          <Rich text={s.body} />
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-xs text-slate-500">
                      <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-cyan-200">
                        Snapshot {period}
                      </span>
                      <span>Historical data, not a live query.</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="mt-6">
        <label htmlFor="question" className="text-sm text-slate-300">
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(question);
            }
          }}
          maxLength={500}
          rows={3}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-slate-100 focus:border-[#00ec97] focus:outline-none"
          placeholder="Ask about NEAR activity in the stored snapshot..."
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => ask(question)}
            disabled={loading || !question.trim()}
            className="rounded-lg bg-[#00ec97] px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-40"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
          <span className="text-xs text-slate-500">
            {question.length}/500 · Enter to send, Shift+Enter for a new line
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => ask(ex)}
              disabled={loading}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-[#00ec97]/60 hover:text-white disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}