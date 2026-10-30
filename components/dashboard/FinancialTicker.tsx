'use client';

import React from 'react';
import { IndianRupee, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

export default function FinancialTicker() {
  return (
    <VengenceCard glowColor="emerald" className="p-6 flex flex-col justify-between h-full bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-mono font-bold text-cyan-700 tracking-wider">
            Financial Impact
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
            +18.4% vs Q1
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 font-display">₹48.5 Lakhs</div>
            <div className="text-xs font-semibold text-emerald-700">Municipal Budget Saved This Quarter</div>
          </div>
        </div>

        <p className="text-slate-600 text-xs mt-2 leading-relaxed">
          Prevented contractor over-billing through AI 3D volume verification and early preventive patch maintenance.
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Fraudulent Over-billing Blocked
          </span>
          <span className="font-mono font-bold text-amber-600">₹26.2 Lakhs</span>
        </div>
        <div className="flex items-center justify-between text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Early Preventive Maintenance
          </span>
          <span className="font-mono font-bold text-emerald-600">₹22.3 Lakhs</span>
        </div>
      </div>
    </VengenceCard>
  );
}
