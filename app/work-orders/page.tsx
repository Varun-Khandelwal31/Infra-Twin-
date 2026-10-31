'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import IssueWorkOrderModal, { WorkOrderItem } from '@/components/work-orders/IssueWorkOrderModal';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  IndianRupee,
  ShieldCheck,
  FileText,
  Building2,
  Plus,
  Paperclip,
  Download,
  Lock,
} from 'lucide-react';
import { downloadCSV, triggerPrint } from '@/lib/exportUtils';

const INITIAL_WORK_ORDERS: WorkOrderItem[] = [
  {
    id: 'WO-2025-8041',
    project: 'Connaught Place Full-Depth Bituminous Patching',
    contractor: 'Apex Infraworks Pvt Ltd',
    zone: 'Delhi NCR - Ward 34 (NDMC)',
    budget: '₹4.80 Lakhs',
    materialClaimed: '2.80 Ton Bitumen',
    progress: 85,
    status: 'UNDER_AUDIT',
    deadline: 'Jun 15, 2025',
    slaStatus: 'PENDING_SCAN',
    sampleId: 'sample-1',
    tenderDocName: 'NDMC_RFQ_CP_OuterCircle.pdf',
  },
  {
    id: 'WO-2025-8042',
    project: 'Outer Ring Road Flyover Milling & DBM Overlay',
    contractor: 'Buildcon Highways Ltd',
    zone: 'Delhi NCR - Ward 12 (South Delhi)',
    budget: '₹14.50 Lakhs',
    materialClaimed: '6.50 Ton Bitumen',
    progress: 40,
    status: 'PAYMENT_FROZEN',
    deadline: 'May 30, 2025',
    slaStatus: 'FRAUD_DETECTED',
    sampleId: 'sample-2',
    tenderDocName: 'PWD_IIT_Flyover_Overlay_Specs.pdf',
  },
  {
    id: 'WO-2025-8043',
    project: 'Purvanchal Expressway Km 42 High-Speed Overlay',
    contractor: 'Larsen & Toubro Heavy Civil Infrastructure',
    zone: 'Uttar Pradesh - Lucknow Division (UP PWD)',
    budget: '₹18.20 Lakhs',
    materialClaimed: '8.40 Ton VG-40 Bitumen',
    progress: 75,
    status: 'UNDER_AUDIT',
    deadline: 'Jul 10, 2025',
    slaStatus: 'SCHEDULED',
    sampleId: 'sample-lucknow',
    tenderDocName: 'UPEIDA_Purvanchal_Pavement_Repair.pdf',
  },
  {
    id: 'WO-2025-8044',
    project: 'Western Express Highway Milling & SMA Overlay',
    contractor: 'Dilip Buildcon Ltd',
    zone: 'Maharashtra - Mumbai MMRDA (K-East Ward)',
    budget: '₹22.50 Lakhs',
    materialClaimed: '10.20 Ton CRMB-55 Bitumen',
    progress: 50,
    status: 'IN_PROGRESS',
    deadline: 'Jun 25, 2025',
    slaStatus: 'SCHEDULED',
    sampleId: 'sample-mumbai',
    tenderDocName: 'MMRDA_WEH_Flyover_Tender.pdf',
  },
  {
    id: 'WO-2025-8045',
    project: 'Bellandur Outer Ring Road Asphalt Resurfacing',
    contractor: 'Greenline Pavements & Infra',
    zone: 'Karnataka - Bengaluru BBMP (ORR Bellandur)',
    budget: '₹12.80 Lakhs',
    materialClaimed: '5.80 Ton VG-30 Bitumen',
    progress: 90,
    status: 'APPROVED',
    deadline: 'Jun 05, 2025',
    slaStatus: 'PASSED',
    sampleId: 'sample-bengaluru',
    tenderDocName: 'BBMP_Mahadevapura_Corridor_Notice.pdf',
  },
  {
    id: 'WO-2025-8046',
    project: 'NH-66 Coastal Rutting & Bitumen Seal',
    contractor: 'Tata Projects Urban Pavements',
    zone: 'Kerala - Kochi Division (Kerala PWD)',
    budget: '₹8.60 Lakhs',
    materialClaimed: '4.10 Ton PMB-120 Bitumen',
    progress: 65,
    status: 'UNDER_AUDIT',
    deadline: 'Jul 15, 2025',
    slaStatus: 'SCHEDULED',
    sampleId: 'sample-5',
    tenderDocName: 'KeralaPWD_NH66_Edappally_Sanction.pdf',
  },
  {
    id: 'WO-2025-8047',
    project: 'Dwarka Sector 21 Tack Coat & Crack Seal',
    contractor: 'Greenline Pavements & Infra',
    zone: 'Delhi NCR - Ward 08 (Dwarka)',
    budget: '₹2.10 Lakhs',
    materialClaimed: '1.20 Ton Bitumen',
    progress: 100,
    status: 'APPROVED',
    deadline: 'May 20, 2025',
    slaStatus: 'PASSED',
    sampleId: 'sample-3',
    tenderDocName: 'NHAI_Dwarka_Sec21_Sanction.pdf',
  },
  {
    id: 'WO-2025-8048',
    project: 'Barakhamba Sub-base Grouting & Saw Cut Patch',
    contractor: 'Apex Infraworks Pvt Ltd',
    zone: 'Delhi NCR - Ward 34 (NDMC)',
    budget: '₹6.20 Lakhs',
    materialClaimed: '3.50 Ton Bitumen',
    progress: 60,
    status: 'IN_PROGRESS',
    deadline: 'Jun 30, 2025',
    slaStatus: 'SCHEDULED',
    sampleId: 'sample-4',
    tenderDocName: 'Barakhamba_Arterial_Tender_Notice.pdf',
  },
];

export default function WorkOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workOrdersList, setWorkOrdersList] = useState<WorkOrderItem[]>(INITIAL_WORK_ORDERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddNewWorkOrder = (newOrder: WorkOrderItem) => {
    setWorkOrdersList((prev) => [newOrder, ...prev]);
    setToastMessage(`✓ Tender ${newOrder.id} (${newOrder.project}) published and linked to PFMS Escrow!`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleToggleStatus = (id: string) => {
    setWorkOrdersList((prev) =>
      prev.map((wo) => {
        if (wo.id === id) {
          const nextStatus: 'UNDER_AUDIT' | 'PAYMENT_FROZEN' | 'APPROVED' | 'IN_PROGRESS' =
            wo.status === 'UNDER_AUDIT'
              ? 'APPROVED'
              : wo.status === 'APPROVED'
              ? 'PAYMENT_FROZEN'
              : 'UNDER_AUDIT';

          setToastMessage(`✓ Work Order ${wo.id} status updated to ${nextStatus}!`);
          setTimeout(() => setToastMessage(null), 3500);
          return { ...wo, status: nextStatus };
        }
        return wo;
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['Tender ID', 'Project Title', 'Contractor', 'Municipal Zone', 'Budget Sanctioned', 'Material Claimed', 'Progress %', 'Escrow Status', 'SLA Result', 'Deadline'];
    const rows = workOrdersList.map((w) => [
      w.id,
      w.project,
      w.contractor,
      w.zone,
      w.budget,
      w.materialClaimed,
      `${w.progress}%`,
      w.status,
      w.slaStatus,
      w.deadline,
    ]);
    downloadCSV(`InfraTwin_Work_Orders_Escrow_${new Date().toISOString().slice(0, 10)}.csv`, rows, headers);
    setToastMessage('✓ Municipal Work Orders & Tender Schedule exported as CSV!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleViewTenderDoc = (docName?: string) => {
    setToastMessage(`Generating official tender document (${docName || 'Tender_Sanction.pdf'})...`);
    setTimeout(() => {
      triggerPrint();
      setToastMessage(null);
    }, 600);
  };

  const filteredOrders = workOrdersList.filter((wo) => {
    const matchesSearch =
      wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || wo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudgetLakhs = workOrdersList.reduce((acc, curr) => {
    const num = parseFloat(curr.budget.replace(/[^0-9.]/g, '')) || 0;
    return acc + num;
  }, 0);

  const activeOrdersCount = workOrdersList.filter((w) => w.status !== 'APPROVED').length;
  const frozenCount = workOrdersList.filter((w) => w.status === 'PAYMENT_FROZEN').length;
  const approvedCount = workOrdersList.filter((w) => w.status === 'APPROVED').length;

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
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  🇮🇳 Pan-India Contractor Work Orders &amp; SLA Governance
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Automated Material Billing Audits across State PWDs &amp; NHAI • PFMS Escrow Disbursement • IRC:82 Compliance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-300 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Work Orders (CSV)</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:shadow-md transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New Work Order Tender</span>
              </button>
            </div>
          </div>

          {/* Success Toast Banner */}
          {toastMessage && (
            <div className="p-4 rounded-xl bg-cyan-50/90 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold shadow-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Total Sanctioned Escrow</div>
                <div className="text-2xl font-bold text-slate-900 font-display">₹{totalBudgetLakhs.toFixed(2)} Lakhs</div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Active Work Orders</div>
                <div className="text-2xl font-bold text-cyan-700 font-display">{activeOrdersCount} Active</div>
              </div>
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Escrow Holds (Frozen)</div>
                <div className="text-2xl font-bold text-rose-700 font-display">{frozenCount} Frozen</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between card-3d-tilt">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Passed AI Audit</div>
                <div className="text-2xl font-bold text-emerald-700 font-display">{approvedCount} Cleared</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by tender ID, project, contractor, or zone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              {['ALL', 'UNDER_AUDIT', 'PAYMENT_FROZEN', 'APPROVED', 'IN_PROGRESS'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Work Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((wo) => {
              const isFrozen = wo.status === 'PAYMENT_FROZEN';
              const isApproved = wo.status === 'APPROVED';

              return (
                <div
                  key={wo.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4 hover:border-cyan-400 hover:shadow-md transition-all card-3d-tilt"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-cyan-700">{wo.id}</span>
                        <button
                          onClick={() => handleToggleStatus(wo.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                            isFrozen
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : isApproved
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Click to toggle escrow clearance status"
                        >
                          {wo.status.replace('_', ' ')}
                        </button>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">{wo.project}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <strong className="text-slate-700">{wo.contractor}</strong>
                        </span>
                        <span>•</span>
                        <span>{wo.zone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs font-mono">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">Sanctioned Budget</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{wo.budget}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">Completion Deadline</div>
                        <div className="text-slate-700 font-semibold mt-0.5">{wo.deadline}</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex-1 max-w-xs space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-500">
                        <span>Execution Progress: {wo.progress}%</span>
                        <span>Claimed: {wo.materialClaimed}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isFrozen ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${wo.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleViewTenderDoc(wo.tenderDocName)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-700 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{wo.tenderDocName || 'Tender_Specs.pdf'}</span>
                      </button>

                      <Link
                        href={`/sla-verification`}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-mono font-bold hover:bg-purple-100 transition-colors flex items-center gap-1"
                        title="View On-Chain Smart Contract Escrow Record"
                      >
                        <span>⛓️ On-Chain Escrow</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <Link
                        href={`/fraud-detection`}
                        className="px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200 text-[11px] font-mono font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1"
                      >
                        <span>SLA Fraud Audit</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <Link
                        href={`/copilot?sample=${wo.sampleId || 'sample-1'}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-mono font-bold hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <span>View IRC:82 BOQ</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <IssueWorkOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWorkOrder={handleAddNewWorkOrder}
        nextIdNumber={8045}
      />
    </div>
  );
}
