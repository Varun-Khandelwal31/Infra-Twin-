'use client';

import React from 'react';

export default function VengenceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#dbe3eb]">
      {/* Ambient Engineering Optical Sweeps */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[850px] h-[850px] rounded-full bg-cyan-500/[0.18] blur-[140px] animate-ray-sweep"
        style={{ animationDuration: '24s' }}
      />
      <div
        className="absolute top-[35%] -right-[15%] w-[750px] h-[750px] rounded-full bg-amber-400/[0.12] blur-[150px] animate-ray-sweep"
        style={{ animationDelay: '-8s', animationDuration: '26s' }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-blue-500/[0.14] blur-[150px] animate-ray-sweep"
        style={{ animationDelay: '-16s', animationDuration: '30s' }}
      />

      {/* Visible Civil Engineering CAD Blueprint Survey Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Minor 24px millimeter survey grid */}
          <pattern id="cad-bp-minor" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(100, 116, 139, 0.22)"
              strokeWidth="0.8"
            />
          </pattern>
          {/* Major 120px structural grid with precision crosshairs */}
          <pattern id="cad-bp-major" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#cad-bp-minor)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgba(14, 165, 233, 0.35)"
              strokeWidth="1.4"
            />
            {/* Survey Crosshair at intersections */}
            <path
              d="M -6 0 L 6 0 M 0 -6 L 0 6"
              fill="none"
              stroke="rgba(2, 132, 199, 0.70)"
              strokeWidth="1.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cad-bp-major)" />
      </svg>

      {/* Subtle CAD Blueprint Coordinate Watermark */}
      <div className="absolute bottom-3 right-5 flex items-center gap-3 text-[10px] font-mono font-bold text-slate-600/90 tracking-wider">
        <span>INFRATWIN // CIVIL SPATIAL TWIN</span>
        <span>•</span>
        <span>IRC:82-2023 SPEC</span>
        <span>•</span>
        <span>WGS84 DATUM</span>
      </div>
    </div>
  );
}
