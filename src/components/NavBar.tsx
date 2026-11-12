"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import PulseLogo from "./PulseLogo";

const links = [
  { href: "/", label: "Overview" },
  { href: "/network-pulse", label: "Network Pulse" },
  { href: "/ask", label: "Ask NEAR AI" },
  { href: "/reports", label: "Research" },
  { href: "/explorer", label: "Data Explorer" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function measure() {
      const list = listRef.current;
      if (!list) return;
      const el = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!el || el.offsetWidth === 0) {
        setBar(null);
        return;
      }
      setBar({ left: el.offsetLeft, width: el.offsetWidth });
    }
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b0d]/75 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <PulseLogo />
          <span>
            NEARPulse <span className="text-[#00ec97]">AI</span>
          </span>
        </Link>

        <ul ref={listRef} className="relative ml-4 hidden gap-1 text-sm md:flex">
          {bar && (
            <>
              <span
                aria-hidden="true"
                className="absolute top-0 h-full rounded-md bg-[#00ec97]/10 transition-all duration-300 ease-out motion-reduce:transition-none"
                style={{ left: bar.left, width: bar.width }}
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-px h-0.5 rounded bg-[#00ec97] shadow-[0_0_12px_rgba(0,236,151,0.7)] transition-all duration-300 ease-out motion-reduce:transition-none"
                style={{ left: bar.left, width: bar.width }}
              />
            </>
          )}
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded-md px-3 py-1.5 transition-colors " +
                    (active
                      ? "text-[#00ec97] [text-shadow:0_0_14px_rgba(0,236,151,0.45)]"
                      : "text-slate-300 hover:text-white")
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://docs.near.org/data-infrastructure/big-query"
            target="_blank"
            rel="noopener noreferrer"
            title="Where this data comes from: NEAR BigQuery dataset docs"
            className="flex items-center gap-2 text-xs text-slate-400 transition-colors hover:text-[#00ec97]"
          >
            <span className="near-halo">
              <Image src="/near-logo.svg" alt="NEAR logo" width={22} height={22} />
            </span>
            <span className="hidden lg:inline">Built on NEAR data</span>
            <span className="sr-only">(opens NEAR BigQuery docs in a new tab)</span>
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-white/10 p-2 text-slate-200 md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-nav"
          className="mx-auto max-w-6xl space-y-1 border-t border-white/10 px-4 py-3 text-sm md:hidden"
        >
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded-md px-3 py-2 " +
                    (active
                      ? "bg-[#00ec97]/10 text-[#00ec97]"
                      : "text-slate-300")
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}