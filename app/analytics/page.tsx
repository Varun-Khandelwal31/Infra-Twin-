'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Award,
  Layers,
  Download,
  Calendar,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { downloadCSV } from '@/lib/exportUtils';

const NATIONAL_PCI_DATA_SETS: Record<string, Array<{ month: string; col1: number; col2: number; col3: number; col4: number }>> = {
  '1M': [
    { month: 'Week 1', col1: 76, col2: 74, col3: 71, col4: 79 },
    { month: 'Week 2', col1: 75, col2: 73, col3: 70, col4: 78 },
    { month: 'Week 3', col1: 73, col2: 71, col3: 69, col4: 77 },
    { month: 'Week 4', col1: 72, col2: 70, col3: 67, col4: 75 },
  ],
  '3M': [
    { month: 'Apr', col1: 77, col2: 75, col3: 72, col4: 80 },
    { month: 'May', col1: 74, col2: 72, col3: 70, col4: 78 },
    { month: 'Jun', col1: 72, col2: 70, col3: 67, col4: 75 },
  ],
  '6M': [
    { month: 'Jan', col1: 83, col2: 81, col3: 79, col4: 86 },
    { month: 'Feb', col1: 81, col2: 79, col3: 77, col4: 84 },
    { month: 'Mar', col1: 79, col2: 77, col3: 75, col4: 82 },
    { month: 'Apr', col1: 77, col2: 75, col3: 72, col4: 80 },
    { month: 'May', col1: 74, col2: 72, col3: 70, col4: 78 },
    { month: 'Jun', col1: 72, col2: 70, col3: 67, col4: 75 },
  ],
  '1Y': [
    { month: 'Q1 (Jul)', col1: 89, col2: 87, col3: 84, col4: 91 },
    { month: 'Q2 (Oct)', col1: 86, col2: 84, col3: 81, col4: 89 },
    { month: 'Q3 (Jan)', col1: 83, col2: 81, col3: 79, col4: 86 },
    { month: 'Q4 (Apr)', col1: 77, col2: 75, col3: 72, col4: 80 },
  ],
};

const NCR_PCI_DATA_SETS: Record<string, Array<{ month: string; col1: number; col2: number; col3: number; col4: number }>> = {
  '1M': [
    { month: 'Week 1', col1: 75, col2: 67, col3: 72, col4: 78 },
    { month: 'Week 2', col1: 74, col2: 66, col3: 71, col4: 77 },
    { month: 'Week 3', col1: 73, col2: 64, col3: 70, col4: 75 },
    { month: 'Week 4', col1: 72, col2: 62, col3: 68, col4: 74 },
  ],
  '3M': [
    { month: 'Apr', col1: 75, col2: 68, col3: 71, col4: 78 },
    { month: 'May', col1: 74, col2: 65, col3: 70, col4: 76 },
    { month: 'Jun', col1: 72, col2: 62, col3: 68, col4: 74 },
  ],
  '6M': [
    { month: 'Jan', col1: 82, col2: 74, col3: 78, col4: 85 },
    { month: 'Feb', col1: 80, col2: 72, col3: 76, col4: 83 },
    { month: 'Mar', col1: 78, col2: 70, col3: 74, col4: 80 },
    { month: 'Apr', col1: 75, col2: 68, col3: 71, col4: 78 },
    { month: 'May', col1: 74, col2: 65, col3: 70, col4: 76 },
    { month: 'Jun', col1: 72, col2: 62, col3: 68, col4: 74 },
  ],
  '1Y': [
    { month: 'Q1 (Jul)', col1: 88, col2: 80, col3: 82, col4: 90 },
    { month: 'Q2 (Oct)', col1: 85, col2: 77, col3: 79, col4: 88 },
    { month: 'Q3 (Jan)', col1: 82, col2: 74, col3: 78, col4: 85 },
    { month: 'Q4 (Apr)', col1: 75, col2: 68, col3: 71, col4: 78 },
  ],
};

const DISTRESS_DISTRIBUTION = [
  { name: 'Water-Bound Potholes', value: 42, color: '#ef4444' },
  { name: 'Alligator Cracking', value: 28, color: '#f59e0b' },
  { name: 'Longitudinal Rutting', value: 18, color: '#3b82f6' },
  { name: 'Transverse Thermal Cracks', value: 12, color: '#10b981' },
];

interface ContractorItem {
  name: string;
  totalOrders: number;
  verifiedSla: string;
  status: string;
  escrowStatus: string;
  contactPerson: string;
  totalBilled: string;
  ratingScore: number;
  coverage: string;
}

const CONTRACTOR_LEADERBOARD: ContractorItem[] = [
  {
    name: 'Larsen & Toubro Heavy Civil Infra',
    totalOrders: 38,
    verifiedSla: '99.2%',
    status: 'National Tier-1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'K. S. Narayanan (+91 98200 44102)',
    totalBilled: '₹142.0 Lakhs',
    ratingScore: 99,
    coverage: 'NHAI National Corridors & Expressways',
  },
  {
    name: 'Greenline Pavements Pvt Ltd',
    totalOrders: 14,
    verifiedSla: '98.5%',
    status: 'Tier 1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'Harsh Vardhan (+91 98112 34500)',
    totalBilled: '₹42.8 Lakhs',
    ratingScore: 98,
    coverage: 'Delhi NCR & Northern PWDs',
  },
  {
    name: 'Apex Infraworks Pvt Ltd',
    totalOrders: 22,
    verifiedSla: '94.2%',
    status: 'Tier 1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'Sunil Aggarwal (+91 98710 88219)',
    totalBilled: '₹68.5 Lakhs',
    ratingScore: 94,
    coverage: 'UP PWD & NCR Arterial Networks',
  },
  {
    name: 'Navayuga Roadworks Corp',
    totalOrders: 19,
    verifiedSla: '91.8%',
    status: 'Tier 1 Certified',
    escrowStatus: 'ACTIVE_DISBURSEMENT',
    contactPerson: 'M. S. Reddy (+91 98480 33419)',
    totalBilled: '₹58.2 Lakhs',
    ratingScore: 92,
    coverage: 'South Zone (BBMP Bengaluru & Kerala PWD)',
  },
  {
    name: 'Buildcon Highways Ltd',
    totalOrders: 18,
    verifiedSla: '48.5%',
    status: 'Under Investigation (Fraud)',
    escrowStatus: 'ESCROW_PAYMENT_FROZEN',
    contactPerson: 'Ramanathan Iyer (+91 98402 11990)',
    totalBilled: '₹54.0 Lakhs',
    ratingScore: 48,
    coverage: 'Western & Northern Highways',
  },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [scope, setScope] = useState<'NATIONAL' | 'NCR'>('NATIONAL');
  const [selectedContractor, setSelectedContractor] = useState<ContractorItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentChartData = useMemo(() => {
    const set = scope === 'NATIONAL' ? NATIONAL_PCI_DATA_SETS : NCR_PCI_DATA_SETS;
    return set[timeRange] || set['6M'];
  }, [scope, timeRange]);

  const handleExportCSV = () => {
    const headers = scope === 'NATIONAL'
      ? ['Time Period', 'North Zone (Delhi/UP)', 'West Zone (Mumbai/Pune)', 'South Zone (Bengaluru/Kochi)', 'East & Central (Kolkata/Indore)']
      : ['Time Period', 'Zone 4 (NDMC)', 'Zone 1 (South Delhi)', 'Zone 8 (Dwarka)', 'Zone 14 (Airport)'];
    const pciRows = currentChartData.map((d) => [d.month, d.col1, d.col2, d.col3, d.col4]);

    const contractorHeaders = ['Contractor Name', 'Completed Orders', 'Verified SLA Rate', 'Tier Rating', 'Escrow Status', 'Total Billed'];
    const contractorRows = CONTRACTOR_LEADERBOARD.map((c) => [
      c.name,
      c.totalOrders,
      c.verifiedSla,
      c.status,
      c.escrowStatus,
      c.totalBilled,
    ]);

    downloadCSV(
      `InfraTwin_Analytics_PCI_Report_${scope}_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`,
      [...pciRows, ['', '', '', '', ''], contractorHeaders, ...contractorRows],
      headers
    );

    setToastMessage(`✓ Infrastructure Analytics & PCI Report (${scope} • ${timeRange}) exported as CSV!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-white font-display">
                  Infrastructure Telemetry Analytics &amp; PCI Trends
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Multi-Ward Pavement Degradation Curves • Distress Severity Distribution • Contractor Audit Ratings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl text-slate-300 text-xs font-semibold hover:text-cyan-400 hover:border-cyan-500/40 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Analytics CSV</span>
              </button>
            </div>
          </div>

          {/* Toast Feedback */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Historical PCI Trend Line Chart */}
          <div className="p-6 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white font-display">
                  Pavement Condition Index (PCI) Degradation Trends
                </h2>
                <p className="text-xs text-slate-500">Quarterly PCI trajectories across national road networks</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scope selector */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setScope('NATIONAL')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      scope === 'NATIONAL'
                        ? 'bg-[#111726] text-cyan-300 font-bold border border-slate-800 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Pan-India Corridors
                  </button>
                  <button
                    onClick={() => setScope('NCR')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      scope === 'NCR'
                        ? 'bg-[#111726] text-cyan-300 font-bold border border-slate-800 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Delhi NCR Wards
                  </button>
                </div>

                {/* Time Range selector */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-800 text-xs font-mono">
                  {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        timeRange === range
                          ? 'bg-[#111726] text-cyan-300 font-bold border border-slate-800 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-80 bg-slate-900/60/80 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#0f172a',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="col1"
                    name={scope === 'NATIONAL' ? 'North Zone (Delhi/UP)' : 'Zone 4 (NDMC)'}
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="col2"
                    name={scope === 'NATIONAL' ? 'West Zone (Mumbai/Pune)' : 'Zone 1 (South Delhi)'}
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="col3"
                    name={scope === 'NATIONAL' ? 'South Zone (Bengaluru/Kochi)' : 'Zone 8 (Dwarka)'}
                    stroke="#d97706"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="col4"
                    name={scope === 'NATIONAL' ? 'East & Central (Kolkata/Indore)' : 'Zone 14 (Airport)'}
                    stroke="#059669"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Grid: Distress Pie Chart + Contractor Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Pie Chart */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-display">Distress Type Breakdown</h3>
                <p className="text-xs text-slate-500">AI Computer Vision Classification</p>
              </div>

              <div className="w-full h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DISTRESS_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {DISTRESS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderColor: '#cbd5e1',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#0f172a',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {DISTRESS_DISTRIBUTION.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-300 truncate">{d.name}</span>
                    <span className="font-bold text-slate-500 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contractor Leaderboard */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-display">Contractor SLA Compliance Audit</h3>
                  <p className="text-xs text-slate-500">Click any contractor row to view escrow hold details</p>
                </div>
                <Award className="w-5 h-5 text-amber-500" />
              </div>

              <div className="space-y-2">
                {CONTRACTOR_LEADERBOARD.map((c, i) => {
                  const isFraud = c.ratingScore < 60;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedContractor(c)}
                      className="p-3.5 rounded-xl bg-slate-900/60/80 border border-slate-800 hover:border-cyan-400 hover:bg-slate-800/60/80 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#111726]/90 border border-slate-800/90 shadow-2xl flex items-center justify-center font-mono font-bold text-cyan-400 text-xs shadow-2xs">
                          #{i + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {c.totalOrders} Orders Completed • {c.status}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                              isFraud
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {c.verifiedSla} SLA
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contractor Detail Modal */}
          {selectedContractor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
              <div className="fixed inset-0" onClick={() => setSelectedContractor(null)} />

              <div className="relative w-full max-w-md rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-2xl p-6 space-y-4 z-10 font-sans text-xs text-slate-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">{selectedContractor.name}</h3>
                      <span className="text-[10px] font-mono text-slate-500">{selectedContractor.status}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedContractor(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/60 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Verified SLA Quality</div>
                    <div className="text-cyan-400 font-bold text-base mt-0.5">{selectedContractor.verifiedSla}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Total Billed to Date</div>
                    <div className="text-emerald-700 font-bold text-base mt-0.5">{selectedContractor.totalBilled}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="text-slate-400">
                    <strong className="text-slate-200">Primary Contact:</strong> {selectedContractor.contactPerson}
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-200">PFMS / GeM Escrow Status:</strong>{' '}
                    <span
                      className={`font-bold ${
                        selectedContractor.escrowStatus === 'ESCROW_PAYMENT_FROZEN'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {selectedContractor.escrowStatus}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedContractor(null)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold hover:bg-cyan-100 cursor-pointer"
                  >
                    Close Audit Overview
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
