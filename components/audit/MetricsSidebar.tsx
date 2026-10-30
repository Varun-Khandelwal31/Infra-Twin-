'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  FileText,
  Plus,
  Check,
  ShieldAlert,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { InspectionData } from '@/lib/mockInference';
import Section65BCertificateModal from '@/components/fraud/Section65BCertificateModal';
import VengenceCard from '@/components/ui/VengenceCard';

interface MetricsSidebarProps {
  sample: InspectionData;
  flightAltitudeM?: number;
  depthScale?: number;
}

export default function MetricsSidebar({
  sample,
  flightAltitudeM = 12.4,
  depthScale = 1.0,
}: MetricsSidebarProps) {
  const m = sample.metrics;
  const [workOrders, setWorkOrders] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);

  const isHighOrCritical = m.severityIndex === 'High' || m.severityIndex === 'Critical';
  const severityBadgeClass = isHighOrCritical
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  const woNumber = workOrders[sample.id];

  const handleAddToWorkOrder = () => {
    if (woNumber) return;
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newWo = `WO-${randomDigits}`;
    setWorkOrders((prev) => ({ ...prev, [sample.id]: newWo }));
    setToastMessage(`✓ Logged into Work Order #${newWo}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Physical tonnage estimate (2.4 t/m³ asphalt compaction)
  const estTonnage = Number((m.volumeCum * 2.4).toFixed(2));

  return (
    <div className="w-full lg:w-[360px] space-y-4 shrink-0 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Card 1: Core Diagnostic & Confidence Header */}
      <VengenceCard glowColor={isHighOrCritical ? 'rose' : 'amber'} className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${severityBadgeClass}`}>
              {m.severityIndex} Distress
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {sample.inspectionNo}
            </span>
          </div>

          {/* Clean Confidence Meter */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold shadow-xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{m.confidenceScore}% AI Confidence</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 font-display leading-snug">
            {sample.roadName}
          </h2>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
            <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
            <span className="truncate">{sample.location.address}</span>
          </div>
        </div>
      </VengenceCard>

      {/* Card 2: Essential Physical Metrics (Clean 2x2 Grid) */}
      <VengenceCard glowColor="cyan" className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
            Physical Cavity Geometry
          </h3>
          <span className="text-[10px] font-mono text-cyan-700 font-semibold">IRC:82 Calibrated</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Maximum Depth</div>
            <div className="text-lg font-bold text-rose-600 font-sans mt-0.5">
              {m.maxDepthCm} <span className="text-xs font-mono font-normal text-slate-500">cm</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">Avg: {m.avgDepthCm} cm</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Surface Void Area</div>
            <div className="text-lg font-bold text-cyan-700 font-sans mt-0.5">
              {m.areaSqm} <span className="text-xs font-mono font-normal text-slate-500">m²</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">Perimeter: {m.perimeterM} m</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Volumetric Deficit</div>
            <div className="text-lg font-bold text-emerald-700 font-sans mt-0.5">
              {m.volumeCum} <span className="text-xs font-mono font-normal text-slate-500">m³</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">Double Simpson Integral</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-200 shadow-xs">
            <div className="text-[10px] text-slate-500">Asphalt Demand</div>
            <div className="text-lg font-bold text-amber-700 font-sans mt-0.5">
              {estTonnage} <span className="text-xs font-mono font-normal text-slate-500">Tons</span>
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">MDD Compaction 98%</div>
          </div>
        </div>
      </VengenceCard>

      {/* Card 3: Recommended Action & High-Impact CTAs */}
      <VengenceCard glowColor="purple" className="p-4 space-y-3">
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-bold text-rose-800">{sample.recommendedAction.headline}</div>
            <div className="text-[11px] text-rose-600 mt-0.5 leading-relaxed font-medium">
              {sample.recommendedAction.ircClause || 'IRC:82-2023 Clause 4.3 & MoRTH Section 3000'}
            </div>
          </div>
        </div>

        {/* Primary CTA: Generate Localized BOQ */}
        <Link
          href={`/copilot?sample=${sample.id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Localized BOQ (Nirman Copilot)</span>
        </Link>

        {/* Secondary Action Buttons Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsCertOpen(true)}
            className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 text-slate-700 hover:text-cyan-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-600" />
            <span>Section 65B Audit</span>
          </button>

          <button
            onClick={handleAddToWorkOrder}
            disabled={!!woNumber}
            className={`py-2 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              woNumber
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default'
                : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            {woNumber ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>WO #{woNumber}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Work Order</span>
              </>
            )}
          </button>
        </div>
      </VengenceCard>

      {/* Section 65B Legal Evidence Modal */}
      <Section65BCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        data={{
          id: sample.id,
          roadName: sample.roadName,
          inspectionNo: sample.inspectionNo,
          location: sample.location,
          severity: sample.metrics.severityIndex,
          volume: sample.metrics.volumeCum,
          area: sample.metrics.areaSqm,
        }}
      />
    </div>
  );
}