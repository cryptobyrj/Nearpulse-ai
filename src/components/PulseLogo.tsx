export default function PulseLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="NEARPulse AI logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="none" stroke="url(#pulseGrad)" strokeWidth="1.5" opacity="0.55" />
      <circle className="pulse-ring" cx="20" cy="20" r="17" fill="none" stroke="#22d3ee" strokeWidth="1" />
      <path
        className="pulse-line"
        d="M6 21 H14 L18 11 L23 30 L27 21 H34"
        fill="none"
        stroke="url(#pulseGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}