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
    <VengenceCard glowColor="rose" className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-sm font-bold text-slate-900 font-display">Live AI Distress Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-medium">
          Auto Stream
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 max-h-[340px]">
        {ALERTS.map((alert) => {
          let badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
          let Icon = AlertTriangle;

          if (alert.severity === 'High') {
            badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200';
            Icon = AlertCircle;
          } else if (alert.severity === 'Moderate') {
            badgeStyle = 'bg-cyan-50 text-cyan-700 border-cyan-200';
            Icon = Info;
          }

          return (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:bg-slate-100/80 hover:border-cyan-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${badgeStyle} shrink-0 mt-0.5 shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                      {alert.road}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${badgeStyle}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{alert.type}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-mono">
                    <span>{alert.ward}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  href={alert.actionLink}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-cyan-50 text-cyan-700 border border-slate-200 hover:border-cyan-300 text-[11px] font-semibold transition-all flex items-center gap-1 shadow-xs"
                >
                  <span>Audit</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <Link
                  href={alert.boqLink}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Bot className="w-3 h-3" />
                  <span>BOQ</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </VengenceCard>
  );
}
