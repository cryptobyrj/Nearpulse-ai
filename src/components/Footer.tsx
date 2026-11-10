import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <Image src="/near-logo.svg" alt="NEAR logo" width={24} height={24} />
          <span>
            Built on NEAR data. Historical snapshots, not live data. Independent
            project for NEAR Hackathon 2026.
          </span>
        </div>
        <a
          href="https://github.com/cryptobyrj/Nearpulse-ai"
          className="transition-colors hover:text-cyan-300"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}