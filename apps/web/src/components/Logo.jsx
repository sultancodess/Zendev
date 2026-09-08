import React from 'react';

export function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Glowing Neon Icon Container */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden group cursor-default"
        style={{ width: size, height: size }}
      >
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-black to-teal-900/20 border border-emerald-500/40 shadow-[0_0_24px_rgba(34,197,94,0.3)]" />

        {/* SVG Logo */}
        <svg
          viewBox="0 0 100 100"
          className="relative w-[80%] h-[80%] drop-shadow-[0_0_10px_rgba(74,222,128,0.9)] transition-transform duration-300 group-hover:scale-110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Organic C-Curved shape */}
          <path
            d="M58 14 C33 14 14 33 14 58 C14 83 33 94 54 94 C72 94 88 83 88 68
               C88 60 81 56 75 58 C69 60 65 67 60 71 C55 75 48 76 43 74
               C34 71 28 62 29 53 C30 43 38 35 48 35 C56 35 63 39 66 45
               C69 51 76 53 81 50 C86 47 87 40 83 34 C76 22 68 14 58 14 Z"
            fill="#22c55e"
          />
          {/* Inner Highlight */}
          <path
            d="M58 20 C38 20 21 36 21 58 C21 78 38 88 54 88 C68 88 82 77 82 66
               C82 61 77 58 72 60 C67 62 63 69 59 72 C55 75 49 76 45 74
               C37 71 33 63 34 54 C35 45 42 37 51 37 C58 37 64 41 67 47
               C70 53 76 54 80 52 C84 49 84 43 81 37 C75 25 67 20 58 20 Z"
            fill="#4ade80"
          />
          {/* Center Node */}
          <circle cx="50" cy="55" r="9"  fill="#22c55e" />
          <circle cx="50" cy="55" r="5.5" fill="#86efac" />
          <circle cx="50" cy="55" r="2.5" fill="white" opacity="0.9" />
        </svg>

        {/* Live Indicator Dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-dark-950" />
        </span>
      </div>

      {/* Brand Wordmark & Tagline */}
      {showText && (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-[15px] tracking-tight text-white leading-none">
              Evil
              <span
                className="text-emerald-400"
                style={{ textShadow: '0 0 12px rgba(74,222,128,0.6)' }}
              >
                Chat
              </span>
            </span>
            <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 tracking-widest uppercase leading-none">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 tracking-wide leading-none">
            Autonomous WhatsApp AI Ops
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
