'use client';

import React from 'react';

export default function VengenceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#eef3f8]">
      {/* Ambient Engineering Telemetry Beams (Civil Azure, Highway Amber, Compliance Emerald) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[850px] h-[850px] rounded-full bg-cyan-400/[0.12] blur-[140px] animate-ray-sweep"
        style={{ animationDuration: '22s' }}
      />
      <div
        className="absolute top-[30%] -right-[15%] w-[750px] h-[750px] rounded-full bg-amber-400/[0.08] blur-[150px] animate-ray-sweep"
        style={{ animationDelay: '-7s', animationDuration: '25s' }}
      />
      <div
        className="absolute -bottom-[20%] left-[20%] w-[700px] h-[700px] rounded-full bg-emerald-400/[0.07] blur-[150px] animate-ray-sweep"
        style={{ animationDelay: '-14s', animationDuration: '28s' }}
      />

      {/* Precision Civil Engineering CAD & Blueprint Coordinate Grid with Survey Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Minor 24px millimeter survey grid */}
          <pattern id="cad-minor-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="rgba(100, 116, 139, 0.08)"
              strokeWidth="0.75"
            />
          </pattern>
          {/* Major 120px structural grid with precision crosshairs */}
          <pattern id="cad-major-grid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#cad-minor-grid)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="rgba(14, 165, 233, 0.16)"
              strokeWidth="1.2"
            />
            {/* Survey Crosshair at intersections */}
            <path
              d="M -5 0 L 5 0 M 0 -5 L 0 5"
              fill="none"
              stroke="rgba(2, 132, 199, 0.45)"
              strokeWidth="1.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cad-major-grid)" />
      </svg>

      {/* Subtle CAD Blueprint Coordinate Watermark (Technical Engineering Persona) */}
      <div className="absolute bottom-3 right-5 flex items-center gap-3 text-[10px] font-mono font-medium text-slate-400/80 tracking-wider">
        <span>INFRATWIN // CIVIL SPATIAL TWIN</span>
        <span>•</span>
        <span>IRC:82-2023 SPEC</span>
        <span>•</span>
        <span>WGS84 DATUM</span>
      </div>
    </div>
  );
}
