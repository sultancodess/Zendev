import React from 'react';

export function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>

      {/* Real Logo Image */}
      <div
        className="relative shrink-0 rounded-2xl overflow-hidden"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 20px rgba(34,197,94,0.3), 0 0 6px rgba(34,197,94,0.15)',
        }}
      >
        <img
          src="/logo.png"
          alt="Derma Logo"
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Live pulse dot */}
        <span className="absolute top-0.5 right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="font-black text-[15px] tracking-tight text-white leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              Derma
              <span
                className="text-emerald-400"
                style={{ textShadow: '0 0 14px rgba(74,222,128,0.55)' }}
              >
                .ai
              </span>
            </span>
            <span
              className="text-[8px] font-extrabold px-1.5 py-0.5 rounded-md tracking-widest uppercase leading-none"
              style={{
                background: 'rgba(34,197,94,0.12)',
                color: '#86efac',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
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
