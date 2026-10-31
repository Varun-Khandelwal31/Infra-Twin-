'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, ExternalLink, Bot } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

const ALERTS = [
  {
    id: 'alt-101',
    road: 'Outer Ring Road (IIT Flyover)',
    type: 'Critical Structural Pothole (Depth 18.2cm)',
    severity: 'Critical',
    time: '4 mins ago',
    ward: 'Delhi NCR - South Delhi',
    actionLink: '/audit?sample=sample-2',
    boqLink: '/copilot?sample=sample-2',
  },
  {
    id: 'alt-102',
    road: 'Western Express Highway (Andheri)',
    type: 'Monsoon Cavity & Sub-base Bleeding (17.8cm)',
    severity: 'Critical',
    time: '8 mins ago',
    ward: 'Maharashtra - Mumbai MMRDA',
    actionLink: '/audit?sample=sample-mumbai',
    boqLink: '/copilot?sample=sample-mumbai',
  },
  {
    id: 'alt-103',
    road: 'Purvanchal Expressway (Km 42)',
    type: 'High-Speed Pothole Cavity Void (16.5cm)',
    severity: 'Critical',
    time: '18 mins ago',
    ward: 'Uttar Pradesh - Lucknow UP PWD',
    actionLink: '/audit?sample=sample-lucknow',
    boqLink: '/copilot?sample=sample-lucknow',
  },
  {
    id: 'alt-104',
    road: 'Bellandur Outer Ring Road',
    type: 'High-Density Heavy Freight Cavity (15.6cm)',
    severity: 'Critical',
    time: '34 mins ago',
    ward: 'Karnataka - Bengaluru BBMP',
    actionLink: '/audit?sample=sample-bengaluru',
    boqLink: '/copilot?sample=sample-bengaluru',
  },
  {
    id: 'alt-105',
    road: 'NH-66 Coastal Corridor (Edappally)',
    type: 'Moisture Infiltration & Pavement Rutting',
    severity: 'High',
    time: '52 mins ago',
    ward: 'Kerala - Kochi Kerala PWD',
    actionLink: '/audit?sample=sample-5',
    boqLink: '/copilot?sample=sample-5',
  },
];

export default function LiveAlertFeed() {
  return (
    <VengenceCard glowColor="rose" className="p-6 flex flex-col bg-[#111726]/90 border border-slate-800/90 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-sm font-bold text-white font-display">Priority Infrastructure Distress Queue</h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/15 px-2.5 py-1 rounded-full border border-cyan-500/30 font-semibold">
          Autonomous Telemetry Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ALERTS.slice(0, 4).map((alert) => {
          let badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
          let Icon = AlertTriangle;

          if (alert.severity === 'High') {
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            Icon = AlertCircle;
          } else if (alert.severity === 'Moderate') {
            badgeStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
            Icon = Info;
          }

          return (
            <div
              key={alert.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${badgeStyle} shrink-0 mt-0.5 shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                      {alert.road}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold shrink-0 ${badgeStyle}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{alert.type}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1.5 font-mono">
                    <span className="truncate">{alert.ward}</span>
                    <span>•</span>
                    <span className="shrink-0">{alert.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Link
                  href={alert.actionLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Inspect 3D</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <Link
                  href={alert.boqLink}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 hover:border-blue-500/40 text-[11px] font-semibold transition-all flex items-center gap-1.5"
                >
                  <Bot className="w-3 h-3 text-blue-400" />
                  <span>Synthesize BOQ</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </VengenceCard>
  );
}
