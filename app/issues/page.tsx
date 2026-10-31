'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import {
  AlertTriangle,
  Search,
  Download,
  Plus,
  ExternalLink,
  Bot,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import LogIssueModal, { IssueItem } from '@/components/issues/LogIssueModal';
import { downloadCSV } from '@/lib/exportUtils';

const INITIAL_ISSUES: IssueItem[] = [
  {
    id: 'ISS-801',
    title: 'Outer Ring Road (IIT Flyover)',
    distress: 'Critical Structural Pothole & Alligator Cracking',
    severity: 'Critical',
    ward: 'Delhi NCR - Ward 12 (South Delhi)',
    status: 'OPEN',
    reportedAt: '10 mins ago',
    reportedBy: 'Autonomous Drone DR-908',
    areaSqm: 4.1,
    maxDepthCm: 18.2,
    estCost: '₹3.2 Lakhs',
    sampleId: 'sample-2',
    imageUrl: '/images/indian_alligator_crack_corridor.jpg',
  },
  {
    id: 'ISS-802',
    title: 'Connaught Place Outer Circle',
    distress: 'Severe Water-Bound Pothole (Depth 15.0cm)',
    severity: 'Critical',
    ward: 'Delhi NCR - Ward 34 (NDMC)',
    status: 'IN_PROGRESS',
    reportedAt: '35 mins ago',
    reportedBy: 'Autonomous Drone DR-904',
    areaSqm: 2.5,
    maxDepthCm: 15.0,
    estCost: '₹1.8 Lakhs',
    sampleId: 'sample-1',
    imageUrl: '/images/indian_pothole_severe_before.jpg',
  },
  {
    id: 'ISS-803',
    title: 'Purvanchal Expressway (Km 42)',
    distress: 'High-Speed Pothole Cavity & Sub-base Subsidence',
    severity: 'Critical',
    ward: 'Uttar Pradesh - Lucknow Division (UP PWD)',
    status: 'OPEN',
    reportedAt: '45 mins ago',
    reportedBy: 'UPEIDA Patrol Drone DR-615',
    areaSqm: 3.8,
    maxDepthCm: 16.5,
    estCost: '₹2.85 Lakhs',
    sampleId: 'sample-lucknow',
    imageUrl: '/images/indian_pothole_severe_before.jpg',
  },
  {
    id: 'ISS-804',
    title: 'Western Express Highway (Andheri Flyover)',
    distress: 'Monsoon Heavy-Duty Pothole & Surface Bleeding',
    severity: 'Critical',
    ward: 'Maharashtra - Mumbai MMRDA (K-East Ward)',
    status: 'IN_PROGRESS',
    reportedAt: '1 hour ago',
    reportedBy: 'MMRDA Drone Unit DR-812',
    areaSqm: 4.6,
    maxDepthCm: 17.8,
    estCost: '₹3.65 Lakhs',
    sampleId: 'sample-mumbai',
    imageUrl: '/images/indian_road_rutting_closeup.jpg',
  },
  {
    id: 'ISS-805',
    title: 'Outer Ring Road (Bellandur Tech Corridor)',
    distress: 'Heavy Freight Ravelling & Cavity Void',
    severity: 'Critical',
    ward: 'Karnataka - Bengaluru BBMP (Mahadevapura)',
    status: 'OPEN',
    reportedAt: '1.5 hours ago',
    reportedBy: 'BBMP Patrol Drone DR-701',
    areaSqm: 3.2,
    maxDepthCm: 15.6,
    estCost: '₹2.60 Lakhs',
    sampleId: 'sample-bengaluru',
    imageUrl: '/images/indian_alligator_crack_corridor.jpg',
  },
  {
    id: 'ISS-806',
    title: 'Barakhamba Road Exit 2',
    distress: 'High Density Alligator Cracking & Sub-base Collapse',
    severity: 'High',
    ward: 'Delhi NCR - Ward 34 (NDMC)',
    status: 'OPEN',
    reportedAt: '2 hours ago',
    reportedBy: 'Citizen Telemetry App',
    areaSqm: 3.5,
    maxDepthCm: 16.4,
    estCost: '₹2.45 Lakhs',
    sampleId: 'sample-4',
    imageUrl: '/images/indian_flyover_joint_oblique.jpg',
  },
  {
    id: 'ISS-807',
    title: 'NH-66 Coastal Corridor (Edappally)',
    distress: 'Sub-grade Moisture Infiltration & Rutting',
    severity: 'High',
    ward: 'Kerala - Kochi Division (Kerala PWD)',
    status: 'OPEN',
    reportedAt: '2.5 hours ago',
    reportedBy: 'Kerala PWD RTK Rover',
    areaSqm: 2.8,
    maxDepthCm: 12.4,
    estCost: '₹2.10 Lakhs',
    sampleId: 'sample-5',
    imageUrl: '/images/indian_road_rutting_closeup.jpg',
  },
  {
    id: 'ISS-808',
    title: 'NH-27 East-West Corridor (Jalukbari)',
    distress: 'Shoulder Shear Failure & Transverse Cracks',
    severity: 'Moderate',
    ward: 'Assam - Guwahati Circle (Assam PWD)',
    status: 'IN_PROGRESS',
    reportedAt: '3 hours ago',
    reportedBy: 'NHAI Regional Inspection Team',
    areaSqm: 2.4,
    maxDepthCm: 9.8,
    estCost: '₹1.55 Lakhs',
    sampleId: 'sample-4',
    imageUrl: '/images/indian_flyover_joint_oblique.jpg',
  },
  {
    id: 'ISS-809',
    title: 'Dwarka Expressway Sector 21',
    distress: 'Longitudinal Rutting & Edge Bleeding',
    severity: 'Moderate',
    ward: 'Delhi NCR - Ward 08 (Dwarka)',
    status: 'RESOLVED',
    reportedAt: '4 hours ago',
    reportedBy: 'Autonomous Drone DR-912',
    areaSqm: 1.8,
    maxDepthCm: 8.5,
    estCost: '₹0.95 Lakhs',
    sampleId: 'sample-3',
    imageUrl: '/images/indian_pothole_repaired_after.jpg',
  },
  {
    id: 'ISS-810',
    title: 'Tonk Road Sub-arterial',
    distress: 'Surface Weathering & Fine Hairline Cracking',
    severity: 'Moderate',
    ward: 'Rajasthan - Jaipur Zone (Rajasthan PWD)',
    status: 'RESOLVED',
    reportedAt: '6 hours ago',
    reportedBy: 'Municipal Sensor Van',
    areaSqm: 1.4,
    maxDepthCm: 6.2,
    estCost: '₹0.75 Lakhs',
    sampleId: 'sample-3',
    imageUrl: '/images/indian_pothole_repaired_after.jpg',
  },
];

export default function IssuesPage() {
  const [issuesList, setIssuesList] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [wardFilter, setWardFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddNewIssue = (newIssue: IssueItem) => {
    setIssuesList((prev) => [newIssue, ...prev]);
    setToastMessage(`✓ New Inspection Ticket ${newIssue.id} logged for "${newIssue.title}" & dispatched to PWD Contractor!`);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleToggleStatus = (id: string) => {
    setIssuesList((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const nextStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' =
            issue.status === 'OPEN'
              ? 'IN_PROGRESS'
              : issue.status === 'IN_PROGRESS'
              ? 'RESOLVED'
              : 'OPEN';
          setToastMessage(`✓ Ticket ${issue.id} status updated to ${nextStatus}!`);
          setTimeout(() => setToastMessage(null), 3500);
          return { ...issue, status: nextStatus };
        }
        return issue;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Location', 'Distress Type', 'Severity', 'Ward', 'Status', 'Reported Time', 'Reporter', 'Area (sqm)', 'Max Depth (cm)', 'Estimated Cost'];
    const rows = issuesList.map((i) => [
      i.id,
      i.title,
      i.distress,
      i.severity,
      i.ward,
      i.status,
      i.reportedAt,
      i.reportedBy,
      i.areaSqm,
      i.maxDepthCm,
      i.estCost,
    ]);
    downloadCSV(`InfraTwin_Road_Distress_Tickets_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage('✓ Citywide Road Distress Log exported as CSV!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredIssues = issuesList.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.distress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    const matchesWard = wardFilter === 'ALL' || issue.ward.includes(wardFilter);
    return matchesSearch && matchesSeverity && matchesWard;
  });

  const criticalCount = issuesList.filter((i) => i.severity === 'Critical' && i.status !== 'RESOLVED').length;
  const inProgressCount = issuesList.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedCount = issuesList.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="flex h-screen bg-transparent text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  🇮🇳 Pan-India Road Issues &amp; Distress Command Center
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-Time AI-Detected Pavement Voids across 28 States &amp; 8 UTs • Ticket Lifecycle Management • State PWD Dispatch
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Tickets CSV</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Road Distress</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-cyan-800 text-xs font-mono font-bold shadow-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Total Logged Tickets</div>
                <div className="text-2xl font-bold text-slate-900 font-display">{issuesList.length} Issues</div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Critical Distress</div>
                <div className="text-2xl font-bold text-rose-700 font-display">{criticalCount} Critical</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">In Repair / Milling</div>
                <div className="text-2xl font-bold text-amber-700 font-display">{inProgressCount} Active</div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Resolved &amp; Verified</div>
                <div className="text-2xl font-bold text-emerald-700 font-display">{resolvedCount} Repaired</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by ticket ID, road name, state, or distress..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 shadow-xs cursor-pointer"
              >
                <option value="ALL">All Jurisdictions (Pan-India)</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Uttar Pradesh">Uttar Pradesh (UP PWD)</option>
                <option value="Maharashtra">Maharashtra (MMRDA)</option>
                <option value="Karnataka">Karnataka (BBMP)</option>
                <option value="Kerala">Kerala (Kerala PWD)</option>
                <option value="Assam">Assam (Assam PWD)</option>
                <option value="Rajasthan">Rajasthan (Rajasthan PWD)</option>
              </select>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['ALL', 'Critical', 'High', 'Moderate'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-lg transition-all text-xs font-mono ${
                      severityFilter === sev
                        ? 'bg-white text-cyan-800 font-bold border border-slate-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Issues List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIssues.map((issue) => {
              const isCrit = issue.severity === 'Critical';
              const isHigh = issue.severity === 'High';

              return (
                <div
                  key={issue.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between hover:border-cyan-400 hover:shadow-md transition-all card-3d-tilt"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-700">{issue.id}</span>
                      <button
                        onClick={() => handleToggleStatus(issue.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors cursor-pointer shadow-xs ${
                          issue.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : issue.status === 'IN_PROGRESS'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle lifecycle status"
                      >
                        {issue.status.replace('_', ' ')}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">{issue.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5 font-sans leading-relaxed">{issue.distress}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] font-mono p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
                      <div>
                        <span className="text-slate-500 block">Area</span>
                        <span className="text-slate-900 font-bold">{issue.areaSqm} sqm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Max Depth</span>
                        <span className="text-slate-900 font-bold">{issue.maxDepthCm} cm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Est. Cost</span>
                        <span className="text-emerald-700 font-bold">{issue.estCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-slate-500">{issue.reportedAt}</span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/audit?sample=${issue.sampleId}`}
                        className="px-2.5 py-1.5 rounded-lg bg-white text-cyan-700 border border-slate-200 text-[11px] font-mono font-bold hover:bg-cyan-50 flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span>Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/copilot?sample=${issue.sampleId}`}
                        className="px-2.5 py-1.5 rounded-lg bg-white text-blue-700 border border-slate-200 text-[11px] font-mono font-bold hover:bg-blue-50 flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Bot className="w-3 h-3" />
                        <span>BOQ</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <LogIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddIssue={handleAddNewIssue}
        nextIdNumber={806}
      />
    </div>
  );
}
