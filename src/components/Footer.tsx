import Image from "next/image";

const GITHUB = "https://github.com/cryptobyrj/Nearpulse-ai";
const X_PROFILE = "https://x.com/NEARPulseAI";
// After you publish the demo post, paste its link between the quotes.
const DEMO_POST = "https://x.com/NEARPulseAI/status/2121131118510719360";

export default function Footer() {
  const links = [
    { label: "GitHub", href: GITHUB },
    { label: "Documentation", href: GITHUB + "#readme" },
    { label: "Thesis", href: GITHUB + "/blob/main/THESIS.md" },
    { label: "X (@NEARPulseAI)", href: X_PROFILE },
    ...(DEMO_POST ? [{ label: "Demo post", href: DEMO_POST }] : []),
  ];

  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <Image src="/near-logo.svg" alt="NEAR logo" width={24} height={24} />
          <span>
            Built on NEAR data. Historical snapshots, not live data. Independent
            project for NEAR Hackathon 2026.
          </span>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#00ec97]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}