import React from 'react';

export function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Neon Icon Container */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-1.5 border border-emerald-500/30 shadow-[0_0_20px_rgba(34,197,94,0.25)] group"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(74,222,128,0.8)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Organic C-Curved Contour */}
          <path
            d="M58 14 C33 14 14 33 14 58 C14 83 33 94 54 94 C72 94 88 83 88 68 C88 60 81 56 75 58 C69 60 65 67 60 71 C55 75 48 76 43 74 C34 71 28 62 29 53 C30 43 38 35 48 35 C56 35 63 39 66 45 C69 51 76 53 81 50 C86 47 87 40 83 34 C76 22 68 14 58 14 Z"
            fill="#22c55e"
          />
          {/* Inner Highlight Layer */}
          <path
            d="M58 18 C36 18 19 35 19 58 C19 79 36 90 54 90 C70 90 84 79 84 68 C84 62 79 59 74 61 C69 63 65 69 60 72 C56 75 50 76 45 74 C37 72 32 64 33 55 C34 46 41 38 50 38 C57 38 63 42 66 47 C69 52 75 53 79 51 C83 48 84 43 81 37 C75 25 68 18 58 18 Z"
            fill="#4ade80"
          />
          {/* Center Circular Node */}
          <circle cx="50" cy="54" r="8" fill="#4ade80" />
          <circle cx="50" cy="54" r="5" fill="#86efac" />
        </svg>

        {/* Ambient Pulsing Glow in the Corner */}
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
      </div>

      {/* Brand Wordmark & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white font-sans">
              Evil<span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">Chat</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 tracking-wide">
            Autonomous AI WhatsApp Ops
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
