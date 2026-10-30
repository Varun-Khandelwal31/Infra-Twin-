'use client';

import React from 'react';

export default function VengenceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Ambient Radial Engineering Beams on Light Slate */}
      <div className="absolute -top-[20%] -left-[10%] w-[750px] h-[750px] rounded-full bg-cyan-400/12 blur-[130px] animate-ray-sweep" />
      <div className="absolute top-[35%] -right-[15%] w-[650px] h-[650px] rounded-full bg-indigo-500/10 blur-[150px] animate-ray-sweep" style={{ animationDelay: '-6s' }} />
      <div className="absolute -bottom-[20%] left-[25%] w-[600px] h-[600px] rounded-full bg-teal-400/10 blur-[140px] animate-ray-sweep" style={{ animationDelay: '-12s' }} />

      {/* Modern Civil Engineering CAD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}
