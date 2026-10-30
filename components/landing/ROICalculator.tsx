'use client';

import React, { useState } from 'react';
import { IndianRupee, ShieldCheck, Leaf, Clock, Calculator, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ROICalculator() {
  const [roadKm, setRoadKm] = useState(500); // default 500 km

  // Calculations based on actual municipal benchmark metrics
  const budgetSavedLakhs = (roadKm * 0.082).toFixed(1); // ~8.2 Lakhs saved per 100km
  const fraudBlockedLakhs = (roadKm * 0.048).toFixed(1);
  const carbonSavedTons = Math.round(roadKm * 0.72); // ~0.72 tons CO2 saved per km through optimized repairs
  const daysSaved = Math.round(roadKm * 0.35); // 35 days saved per 100km

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-md relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium shadow-xs">
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart City Municipal ROI Calculator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Calculate Municipal Savings for Your City
          </h2>
          <p className="text-slate-600 text-sm">
            Adjust the road network size to project municipal budget savings, prevented contractor over-billing, and reduced carbon footprint.
          </p>
        </div>

        {/* Interactive Slider */}
        <div className="max-w-2xl mx-auto bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-4 mb-10 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-600">Total City Road Stretch Length:</span>
            <span className="text-lg font-bold text-cyan-700 font-display">{roadKm} km</span>
          </div>

          <input
            type="range"
            min={50}
            max={2500}
            step={25}
            value={roadKm}
            onChange={(e) => setRoadKm(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>50 km (Ward Level)</span>
            <span>1,000 km (Tier-2 Smart City)</span>
            <span>2,500 km (Mega Metro)</span>
          </div>
        </div>

        {/* Calculated Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 text-center space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              ₹{budgetSavedLakhs} Lakhs
            </div>
            <div className="text-xs font-semibold text-emerald-700">Municipal Budget Saved</div>
            <p className="text-[11px] text-slate-500">Via early preventive patch maintenance</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-200/80 text-center space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              ₹{fraudBlockedLakhs} Lakhs
            </div>
            <div className="text-xs font-semibold text-amber-700">Fraudulent Claims Blocked</div>
            <p className="text-[11px] text-slate-500">Through 3D volumetric audit rules</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-cyan-200/80 text-center space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 mx-auto shadow-xs">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {carbonSavedTons} Tons
            </div>
            <div className="text-xs font-semibold text-cyan-700">CO2 Emissions Avoided</div>
            <p className="text-[11px] text-slate-500">Reduced raw asphalt production</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-purple-200/80 text-center space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-display">
              {daysSaved} Days
            </div>
            <div className="text-xs font-semibold text-purple-700">Inspection Time Saved</div>
            <p className="text-[11px] text-slate-500">Drone AI vs manual PWD teams</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:shadow-cyan-glow transition-all"
          >
            <span>Deploy InfraTwin AI in Your Municipality</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
