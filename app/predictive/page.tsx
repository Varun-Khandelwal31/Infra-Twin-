'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Activity,
  Sliders,
  ExternalLink,
  Download,
  CheckCircle2,
  CloudRain,
  Truck,
  X,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { downloadCSV } from '@/lib/exportUtils';

const BASE_PREDICTIVE_DATA = [
  { id: 'p-1', name: 'Outer Ring Road (IIT Flyover)', x: 9400, y: 5.2, z: 92, risk: 'Critical', ward: 'Ward 12 - South Delhi', zone: 'North', state: 'Delhi', baseDays: 14, costNowPerM: 0.48, costLaterPerM: 3.2, sampleId: 'sample-2', distressType: 'Severe Structural Void & Sub-base Fatigue' },
  { id: 'p-2', name: 'Purvanchal Expressway (Km 42)', x: 8200, y: 3.4, z: 88, risk: 'Critical', ward: 'Lucknow Division - UP PWD', zone: 'North', state: 'Uttar Pradesh', baseDays: 18, costNowPerM: 0.42, costLaterPerM: 2.8, sampleId: 'sample-lucknow', distressType: 'High-Speed Pothole Cavity & Sub-base Settlement' },
  { id: 'p-3', name: 'Western Express Highway (Andheri)', x: 12400, y: 5.8, z: 90, risk: 'Critical', ward: 'Andheri West - MMRDA', zone: 'West', state: 'Maharashtra', baseDays: 16, costNowPerM: 0.55, costLaterPerM: 3.6, sampleId: 'sample-mumbai', distressType: 'Monsoon Alligator Cracking & Asphalt Stripping' },
  { id: 'p-4', name: 'Outer Ring Road (Bellandur Tech Corridor)', x: 10800, y: 4.5, z: 86, risk: 'Critical', ward: 'Mahadevapura - BBMP', zone: 'South', state: 'Karnataka', baseDays: 20, costNowPerM: 0.46, costLaterPerM: 2.95, sampleId: 'sample-bengaluru', distressType: 'Pothole & Surface Bleeding (Heavy Freight)' },
  { id: 'p-5', name: 'NH-66 Coastal Corridor (Edappally)', x: 7900, y: 4.1, z: 78, risk: 'Warning', ward: 'Ernakulam - Kerala PWD', zone: 'South', state: 'Kerala', baseDays: 38, costNowPerM: 0.44, costLaterPerM: 2.7, sampleId: 'sample-5', distressType: 'Sub-grade Shear & Moisture Infiltration' },
  { id: 'p-6', name: 'NH-27 East-West Corridor (Jalukbari)', x: 6200, y: 3.8, z: 72, risk: 'Warning', ward: 'Guwahati - Assam PWD', zone: 'East', state: 'Assam', baseDays: 48, costNowPerM: 0.38, costLaterPerM: 2.4, sampleId: 'sample-4', distressType: 'Transverse Thermal Cracking & Shoulder Ravelling' },
  { id: 'p-7', name: 'Samruddhi Mahamarg (Km 88 Interchange)', x: 8900, y: 2.1, z: 65, risk: 'Warning', ward: 'Nagpur Rural - MSRDC', zone: 'West', state: 'Maharashtra', baseDays: 62, costNowPerM: 0.36, costLaterPerM: 2.1, sampleId: 'sample-3', distressType: 'Longitudinal Rutting & Bitumen Stripping' },
  { id: 'p-8', name: 'Barakhamba Road Arterial', x: 6800, y: 4.8, z: 85, risk: 'Critical', ward: 'Ward 34 - NDMC', zone: 'North', state: 'Delhi', baseDays: 22, costNowPerM: 0.35, costLaterPerM: 2.45, sampleId: 'sample-4', distressType: 'Alligator Cracking & Moisture Infiltration' },
  { id: 'p-9', name: 'NH-48 Mahipalpur Stretch', x: 11200, y: 3.6, z: 68, risk: 'Warning', ward: 'Ward 14 - Airport Zone', zone: 'North', state: 'Delhi', baseDays: 45, costNowPerM: 0.52, costLaterPerM: 3.5, sampleId: 'sample-5', distressType: 'Longitudinal Rutting & Bitumen Stripping' },
  { id: 'p-10', name: 'Connaught Place Outer Circle', x: 4200, y: 4.1, z: 62, risk: 'Warning', ward: 'Ward 34 - NDMC', zone: 'North', state: 'Delhi', baseDays: 58, costNowPerM: 0.28, costLaterPerM: 1.82, sampleId: 'sample-1', distressType: 'Pothole & Surface Ravelling' },
  { id: 'p-11', name: 'Tonk Road Sub-arterial', x: 5100, y: 2.6, z: 32, risk: 'Low', ward: 'Jaipur Zone 3 - Rajasthan PWD', zone: 'North', state: 'Rajasthan', baseDays: 140, costNowPerM: 0.18, costLaterPerM: 1.1, sampleId: 'sample-3', distressType: 'Surface Weathering & Fine Hairline Cracks' },
  { id: 'p-12', name: 'Dwarka Expressway Sec 21', x: 5600, y: 0.9, z: 15, risk: 'Low', ward: 'Ward 08 - Dwarka', zone: 'North', state: 'Delhi', baseDays: 240, costNowPerM: 0.15, costLaterPerM: 0.98, sampleId: 'sample-3', distressType: 'Good Pavement Condition' },
];

const REGION_OPTIONS = [
  { label: 'All India (Pan-India)', value: 'ALL' },
  { label: 'North (Delhi / UP / Rajasthan)', value: 'North' },
  { label: 'West (Maharashtra / Gujarat)', value: 'West' },
  { label: 'South (Karnataka / Kerala)', value: 'South' },
  { label: 'East / NE (Assam / West Bengal)', value: 'East' },
];

const HORIZON_OPTIONS = [
  { label: '6 Months', value: 6 },
  { label: '12 Months', value: 12 },
  { label: '24 Months', value: 24 },
  { label: '36 Months', value: 36 },
];

export default function PredictivePage() {
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedRoadIdx, setSelectedRoadIdx] = useState<number | null>(null);
  const [monsoonFactor, setMonsoonFactor] = useState<number>(1.2);
  const [trafficGrowth, setTrafficGrowth] = useState<number>(10);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Recalculate risk and costs based on time horizon & simulation factors
  const predictiveData = useMemo(() => {
    const filtered = BASE_PREDICTIVE_DATA.filter(
      (r) => selectedRegion === 'ALL' || r.zone === selectedRegion
    );
    return filtered.map((road) => {
      const weatherMultiplier = monsoonFactor;
      const trafficMultiplier = 1 + trafficGrowth / 100;
      const effectiveHorizon = horizonMonths / 12;

      // Accelerated degradation days
      const scaledDays = Math.max(
        1,
        Math.round((road.baseDays / (weatherMultiplier * trafficMultiplier)) * (1 / effectiveHorizon))
      );

      let risk: 'Critical' | 'Warning' | 'Low' = 'Low';
      if (scaledDays < 30) risk = 'Critical';
      else if (scaledDays < 90) risk = 'Warning';

      const costNow = Number((road.costNowPerM * 10 * effectiveHorizon * weatherMultiplier).toFixed(1));
      const costLater = Number((road.costLaterPerM * 10 * effectiveHorizon * weatherMultiplier * trafficMultiplier).toFixed(1));

      return {
        ...road,
        x: Math.round(road.x * trafficMultiplier),
        daysToFailure: scaledDays,
        risk,
        costNow,
        costLater,
        z: Math.min(100, Math.round(road.z * (1 / effectiveHorizon) * weatherMultiplier)),
      };
    });
  }, [horizonMonths, monsoonFactor, trafficGrowth]);

  // Aggregate budget from selected or all critical/warning roads
  const budgetData = useMemo(() => {
    const critical = predictiveData.filter((r) => r.risk === 'Critical' || r.risk === 'Warning');
    const totalNow = critical.reduce((sum, r) => sum + r.costNow, 0);
    const totalLater = critical.reduce((sum, r) => sum + r.costLater, 0);
    const savings = totalNow > 0 ? (totalLater / totalNow).toFixed(1) : '0';
    return { totalNow: totalNow.toFixed(1), totalLater: totalLater.toFixed(1), savings };
  }, [predictiveData]);

  const handleExportCSV = () => {
    const headers = ['Road Segment', 'State', 'Division / Ward', 'Traffic (PCU/day)', 'Road Age (Yrs)', 'Distress Risk', 'Predicted Days to Failure', 'Preventative Cost (Lakhs)', 'Deferred Failure Cost (Lakhs)', 'IRC:82 Treatment'];
    const rows = predictiveData.map((r) => [
      r.name,
      r.state,
      r.ward,
      r.x,
      r.y,
      r.risk,
      r.daysToFailure,
      `₹${r.costNow}L`,
      `₹${r.costLater}L`,
      r.distressType,
    ]);
    downloadCSV(`InfraTwin_Predictive_Budget_${horizonMonths}M_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage(`✓ Predictive Maintenance Forecast exported for ${horizonMonths}-Month Horizon!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeSelectedRoad = selectedRoadIdx !== null ? predictiveData[selectedRoadIdx] : null;

  return (
    <div className="flex h-screen bg-[#edf2f7] text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  Predictive Maintenance &amp; Multi-Year Budget Allocation
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Traffic Load vs. Road Age Degradation Scatter Model • Preventative Cost Optimization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Budget Plan (CSV)</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Time Horizon & What-If Simulation Sliders */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 font-mono">
                <Sliders className="w-4 h-4" />
                <span>PAN-INDIA PREDICTION HORIZON &amp; CLIMATIC SIMULATOR</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">Forecast Horizon:</span>
                {HORIZON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHorizonMonths(opt.value)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all shadow-xs',
                      horizonMonths === opt.value
                        ? 'bg-purple-50 text-purple-700 border-purple-300'
                        : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Regional Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
              <span className="text-xs font-mono text-slate-500">Jurisdiction Filter:</span>
              {REGION_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setSelectedRegion(r.value);
                    setSelectedRoadIdx(null);
                  }}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-mono transition-all border shadow-xs',
                    selectedRegion === r.value
                      ? 'bg-cyan-50 text-cyan-700 border-cyan-300 font-semibold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Simulation Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Monsoon Intensity Multiplier:</span>
                  </span>
                  <span className="font-bold text-cyan-700">{monsoonFactor.toFixed(1)}x Rainfall</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={2.5}
                  step={0.1}
                  value={monsoonFactor}
                  onChange={(e) => setMonsoonFactor(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1.0x (Normal)</span>
                  <span>1.5x (Above Average)</span>
                  <span>2.5x (Flash Flood Stress)</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Heavy Commercial Axle Load Growth:</span>
                  </span>
                  <span className="font-bold text-amber-700">+{trafficGrowth}% Traffic</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={5}
                  value={trafficGrowth}
                  onChange={(e) => setTrafficGrowth(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>+0% (Current MSA)</span>
                  <span>+20% (Urban Expansion)</span>
                  <span>+40% (Freight Corridor)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Scatter Plot Chart Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-display">
                  Traffic Volume vs. Pavement Age Scatter Matrix ({horizonMonths}-Month Forecast)
                </h2>
                <p className="text-xs text-slate-500">
                  Bubble size represents Distress Risk Index. Click any bubble or table row to inspect recommended treatment.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Critical (&lt;30 days)
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Warning (30-90 days)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk (&gt;90 days)
                </span>
              </div>
            </div>

            {/* Recharts Scatter Plot */}
            <div className="w-full h-80 bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Traffic Load"
                    unit=" PCU/day"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Road Age"
                    unit=" Yrs"
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <ZAxis type="number" dataKey="z" range={[100, 800]} name="Risk Index" />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xl text-xs space-y-1">
                          <div className="font-bold text-slate-900">{d.name}</div>
                          <div className="text-slate-500">Ward: {d.ward}</div>
                          <div className="text-cyan-700 font-mono">Traffic: {d.x.toLocaleString()} PCU/day</div>
                          <div className="text-slate-600 font-mono">Age: {d.y} Years</div>
                          <div className="text-rose-600 font-mono font-bold">
                            Predicted Failure: in {d.daysToFailure} Days
                          </div>
                          <div className="text-emerald-700 font-mono font-medium">
                            Fix Now: ₹{d.costNow}L • Fix Later: ₹{d.costLater}L
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Road Segments" data={predictiveData}>
                    {predictiveData.map((entry, index) => {
                      let fill = '#10b981';
                      if (entry.risk === 'Critical') fill = '#ef4444';
                      else if (entry.risk === 'Warning') fill = '#f59e0b';
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={fill}
                          opacity={selectedRoadIdx === index ? 1 : 0.8}
                          stroke={selectedRoadIdx === index ? '#0284c7' : '#fff'}
                          strokeWidth={selectedRoadIdx === index ? 2.5 : 1}
                          onClick={() => setSelectedRoadIdx(index)}
                          cursor="pointer"
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Interactive Road Segment Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-mono">
                  <tr>
                    <th className="p-3">Road Segment</th>
                    <th className="p-3">State / Division</th>
                    <th className="p-3">Risk</th>
                    <th className="p-3">Days to Failure</th>
                    <th className="p-3">Fix Now</th>
                    <th className="p-3">Fix Later</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {predictiveData.map((road, idx) => {
                    const isSelected = selectedRoadIdx === idx;
                    let riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                    if (road.risk === 'Critical') riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
                    else if (road.risk === 'Warning') riskColor = 'text-amber-700 bg-amber-50 border-amber-200';

                    return (
                      <tr
                        key={idx}
                        onClick={() => setSelectedRoadIdx(idx)}
                        className={cn(
                          'cursor-pointer transition-colors',
                          isSelected
                            ? 'bg-cyan-50/60 border-l-2 border-l-cyan-600'
                            : 'hover:bg-slate-50'
                        )}
                      >
                        <td className="p-3 font-semibold text-slate-900 font-sans">
                          {road.name}
                          <div className="text-[10px] text-cyan-700 font-mono font-medium">{road.state}</div>
                        </td>
                        <td className="p-3 text-slate-500">{road.ward}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shadow-xs ${riskColor}`}>
                            {road.risk}
                          </span>
                        </td>
                        <td className={`p-3 font-bold ${road.daysToFailure < 30 ? 'text-rose-600' : road.daysToFailure < 90 ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {road.daysToFailure} days
                        </td>
                        <td className="p-3 text-emerald-700 font-semibold">₹{road.costNow}L</td>
                        <td className="p-3 text-rose-600 font-semibold">₹{road.costLater}L</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/audit?sample=${road.sampleId}`}
                              className="px-2 py-1 rounded bg-white text-cyan-700 border border-slate-200 text-[10px] font-bold hover:bg-cyan-50 transition-colors flex items-center gap-1 shadow-xs"
                            >
                              Audit <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                            <Link
                              href={`/copilot?sample=${road.sampleId}`}
                              className="px-2 py-1 rounded bg-white text-blue-700 border border-slate-200 text-[10px] font-bold hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-xs"
                            >
                              BOQ <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preventative Budget Allocation — Dynamic */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Preventative Budget Allocation ({horizonMonths}-Month Forecast)
                  </h3>
                  <p className="text-xs text-slate-500">AI Recommendation Engine • Computed from {predictiveData.filter(r => r.risk !== 'Low').length} at-risk segments</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold shadow-xs">
                Save {budgetData.savings}x Budget
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-emerald-200 space-y-3 shadow-xs">
                <div className="text-xs uppercase font-mono font-bold text-emerald-700">
                  Option A: Preventative Patching Now (Next {horizonMonths} Months)
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-display">₹{budgetData.totalNow} Lakhs</div>
                <p className="text-xs text-slate-600">
                  Full-depth micro-patching of all at-risk segments before monsoon moisture infiltration.
                </p>
                <div className="text-[11px] font-mono text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Extends pavement life by 4+ years</span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-rose-200 space-y-3 shadow-xs">
                <div className="text-xs uppercase font-mono font-bold text-rose-700">
                  Option B: Deferred Full Reconstruction (After Failure)
                </div>
                <div className="text-3xl font-extrabold text-rose-700 font-display">₹{budgetData.totalLater} Lakhs</div>
                <p className="text-xs text-slate-600">
                  Complete sub-base milling, DBM overlay, traffic diversion costs, and emergency contractor tenders.
                </p>
                <div className="text-[11px] font-mono text-rose-700 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Causes {budgetData.savings}x higher municipal budget strain</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/copilot"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <span>Generate Preventative Maintenance Work Orders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Road Inspection Detail Drawer */}
          {activeSelectedRoad && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                  <span className="font-bold text-slate-900 font-sans text-sm">{activeSelectedRoad.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({activeSelectedRoad.ward})</span>
                </div>
                <button
                  onClick={() => setSelectedRoadIdx(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Predicted Failure</div>
                  <div className="text-rose-600 font-bold font-sans text-sm">{activeSelectedRoad.daysToFailure} Days</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Traffic Loading</div>
                  <div className="text-cyan-700 font-bold font-sans text-sm">{activeSelectedRoad.x.toLocaleString()} PCU/day</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Preventative Cost</div>
                  <div className="text-emerald-700 font-bold font-sans text-sm">₹{activeSelectedRoad.costNow} Lakhs</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                  <div className="text-slate-500 text-[10px]">Deferred Cost</div>
                  <div className="text-rose-600 font-bold font-sans text-sm">₹{activeSelectedRoad.costLater} Lakhs</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 text-[11px]">
                  <strong>Recommended IRC Treatment:</strong> {activeSelectedRoad.distressType} (IRC:82-2023 Cl 4.3)
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/audit?sample=${activeSelectedRoad.sampleId}`}
                    className="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold hover:bg-cyan-100 transition-colors shadow-xs"
                  >
                    Open in AI Audit Studio
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
