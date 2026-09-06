import { useId } from "react";
import type { PerfumeCategory } from "../../types/product";

type Variant = PerfumeCategory | "hero";

const palettes: Record<Variant, [string, string, string]> = {
  arabe: ["#1a1024", "#7c2fc9", "#0a0a0a"],
  disenador: ["#efe3f7", "#7c2fc9", "#f8f5fa"],
  nicho: ["#2b1a3d", "#c29cf0", "#1a1024"],
  hero: ["#2b1a3d", "#c29cf0", "#0a0a0a"],
};

interface BottlePlaceholderProps {
  variant: Variant;
  className?: string;
}

export function BottlePlaceholder({ variant, className }: BottlePlaceholderProps) {
  const id = useId();
  const [from, accent, to] = palettes[variant];

  return (
    <svg
      className={className}
      viewBox="0 0 240 400"
      role="img"
      aria-label="Perfume ilustrado"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <linearGradient id={`${id}-glow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="200" rx="95" ry="95" fill={`url(#${id}-glow)`} opacity="0.5" />

      <rect x="98" y="40" width="44" height="34" rx="4" fill={accent} opacity="0.9" />
      <rect x="106" y="20" width="28" height="26" rx="3" fill={to} stroke={accent} strokeWidth="1.5" />

      <rect
        x="62"
        y="74"
        width="116"
        height="230"
        rx="14"
        fill={`url(#${id}-body)`}
        stroke={accent}
        strokeWidth="1"
      />
      <rect x="80" y="94" width="80" height="150" rx="2" fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1" />

      <rect x="70" y="86" width="10" height="200" rx="5" fill="#ffffff" opacity="0.12" />

      <rect x="62" y="304" width="116" height="18" rx="4" fill={accent} opacity="0.85" />
    </svg>
  );
}
