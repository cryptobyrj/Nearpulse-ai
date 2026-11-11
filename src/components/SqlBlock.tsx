"use client";

import { useState } from "react";

const KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "GROUP", "BY", "ORDER", "WITH", "AS", "AND", "OR",
  "IN", "BETWEEN", "DATE", "COUNT", "DISTINCT", "SUM", "IF", "ROW_NUMBER",
  "OVER", "PARTITION", "DESC", "ASC", "ROUND", "LIMIT", "ON", "JOIN",
]);

type Tok = { text: string; cls?: string };

function tokenize(sql: string): Tok[] {
  const re =
    /(--[^\n]*)|('[^']*')|(`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([\s\S])/g;
  const out: Tok[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    if (m[1]) out.push({ text: m[1], cls: "sql-cm" });
    else if (m[2]) out.push({ text: m[2], cls: "sql-str" });
    else if (m[3]) out.push({ text: m[3], cls: "sql-id" });
    else if (m[4]) out.push({ text: m[4], cls: "sql-num" });
    else if (m[5])
      out.push({
        text: m[5],
        cls: KEYWORDS.has(m[5].toUpperCase()) ? "sql-kw" : undefined,
      });
    else out.push({ text: m[6] });
  }
  return out;
}

export default function SqlBlock({
  sql,
  label,
}: {
  sql: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const tokens = tokenize(sql);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label ?? "SQL"} query`}
        className="absolute right-2 top-2 rounded-md border border-white/15 bg-black/50 px-2.5 py-1 text-xs text-slate-200 transition hover:border-[#00ec97]/60 hover:text-[#00ec97]"
      >
        {copied ? "Copied" : "Copy query"}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 pt-10 text-xs leading-relaxed text-slate-200">
        <code>
          {tokens.map((t, i) =>
            t.cls ? (
              <span key={i} className={t.cls}>
                {t.text}
              </span>
            ) : (
              <span key={i}>{t.text}</span>
            )
          )}
        </code>
      </pre>
      <span aria-live="polite" className="sr-only">
        {copied ? "Query copied" : ""}
      </span>
    </div>
  );
}