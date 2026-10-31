'use client';

import React from 'react';

export default function VengenceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0b0f19]">
      {/* Subtle Unified Single-Tone Cyan Glow */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] rounded-full bg-cyan-500/[0.06] blur-[160px] animate-ray-sweep"
        style={{ animationDuration: '28s' }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-cyan-500/[0.04] blur-[160px] animate-ray-sweep"
        style={{ animationDelay: '-14s', animationDuration: '32s' }}
      />

      {/* Single-Tone Precision CAD Spatial Survey Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Minor 24px grid */}
          <pattern id="cad-bp-minor" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(148, 163, 184, 0.05)"
              strokeWidth="0.75"
            />
          </pattern>
          {/* Major 120px structural grid */}
          <pattern id="cad-bp-major" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#cad-bp-minor)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgba(6, 182, 212, 0.10)"
              strokeWidth="1"
            />
            {/* Survey Crosshair at intersections */}
            <path
              d="M -4 0 L 4 0 M 0 -4 L 0 4"
              fill="none"
              stroke="rgba(6, 182, 212, 0.30)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cad-bp-major)" />
      </svg>

      {/* Coordinate Watermark */}
      <div className="absolute bottom-3 right-5 flex items-center gap-3 text-[10px] font-mono text-slate-500/40 tracking-wider">
        <span>INFRATWIN // CIVIL SPATIAL TWIN</span>
        <span>•</span>
        <span>IRC:82-2023 SPEC</span>
      </div>
    </div>
  );
}
