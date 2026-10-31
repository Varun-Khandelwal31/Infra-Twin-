'use client';

import React from 'react';
import VengenceCard from '@/components/ui/VengenceCard';

interface RoadHealthGaugeProps {
  score?: number; // 0 to 100
}

export default function RoadHealthGauge({ score = 74 }: RoadHealthGaugeProps) {
  const radius = 70;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = 'stroke-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let statusText = 'Fair - Action Needed in Critical Corridors';

  if (score < 50) {
    scoreColor = 'stroke-rose-600';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    statusText = 'Critical Infrastructure Deficit';
  } else if (score < 75) {
    scoreColor = 'stroke-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    statusText = 'Fair Condition (Moderate Distress)';
  }

  return (
    <VengenceCard glowColor="cyan" className="p-6 flex flex-col items-center justify-between h-full relative overflow-hidden bg-[#111726]/90 border border-slate-800/90 shadow-2xl">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-display">Pan-India Pavement Condition Index</h3>
          <p className="text-[11px] text-slate-400">National Highways &amp; Urban Corridors (IRC:82-2023)</p>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
          Real-Time Audit
        </span>
      </div>

      {/* SVG Circular Gauge */}
      <div className="relative my-2 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#e2e8f0"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className={`transition-all duration-1000 ease-out ${scoreColor}`}
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute text-center">
          <div className="text-4xl font-extrabold text-slate-900 font-display tracking-tight">{score}</div>
          <div className="text-[10px] font-mono uppercase text-slate-500 font-medium">Out of 100</div>
        </div>
      </div>

      <div className="w-full text-center mt-2 pt-3 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-800">{statusText}</div>
        <p className="text-[11px] text-slate-500 mt-0.5">1,840+ km Scanned • 28 States &amp; 8 UTs Telemetry</p>
      </div>
    </VengenceCard>
  );
}
