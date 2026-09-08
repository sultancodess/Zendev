import React from 'react';

export function Logo({ size = 32, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="shrink-0 rounded-xl overflow-hidden"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="Derma Logo"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {showText && (
        <span
          className="font-bold text-white leading-none"
          style={{ fontSize: 15, letterSpacing: '-0.02em' }}
        >
          derma
          <span className="text-green-500" style={{ textShadow: '0 0 10px rgba(34,197,94,0.4)' }}>.ai</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
