import Link from "next/link";

const links = [
  { href: "/", label: "Overview" },
  { href: "/network-pulse", label: "Network Pulse" },
  { href: "/ask", label: "Ask NEAR AI" },
  { href: "/reports", label: "Research Reports" },
  { href: "/explorer", label: "Data Explorer" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  return (
    <header className="border-b border-slate-800 bg-[#060b18]">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
        <Link href="/" className="font-semibold text-white">
          NEARPulse <span className="text-cyan-300">AI</span>
        </Link>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-300">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-cyan-300">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
