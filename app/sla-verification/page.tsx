'use client';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Section65BCertificateModal from '@/components/fraud/Section65BCertificateModal';
import BlockchainAuditModal from '@/components/web3/BlockchainAuditModal';
import DataProvenanceModal from '@/components/common/DataProvenanceModal';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Layers,
  Coins,
  Scale,
  Cpu,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { analyzeDroneImagePairAsync, AnalysisOutput } from '@/lib/imageAnalyzer';
import { triggerPrint } from '@/lib/exportUtils';
import { CONTRACTOR_SLA_SAMPLES } from '@/lib/mockInference';
import { anchorAuditOnChain } from '@/lib/web3/blockchainService';
import { OnChainAuditRecord } from '@/lib/web3/types';

export default function SLAVerificationPage() {
  // Preset scenarios or interactive slider
  const [billedVolume, setBilledVolume] = useState<number>(0.53);
  const [aiFilledVolume, setAiFilledVolume] = useState<number>(0.52);
  const [compactionDensity, setCompactionDensity] = useState<number>(98.2);
  const [voidArea, setVoidArea] = useState<number>(2.85);
  const [voidDepth, setVoidDepth] = useState<number>(18.5);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPaymentFrozen, setIsPaymentFrozen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'verdict' | 'materials' | 'simulator'>('verdict');

  // Blockchain Anchoring & Modal State
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [onChainRecord, setOnChainRecord] = useState<OnChainAuditRecord | null>(null);

  // Custom Upload States & Analysis Output
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [beforeImg, setBeforeImg] = useState<string>('/images/pothole_severe_before.jpg');
  const [afterImg, setAfterImg] = useState<string>('/images/pothole_repaired_after.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [currentScenarioName, setCurrentScenarioName] = useState<string>('Outer Ring Road (IIT Flyover Corridor)');
  const [currentContractor, setCurrentContractor] = useState<string>('Apex Infraworks Pvt Ltd');

  // Dynamic Computer Vision Output
  const [cvResult, setCvResult] = useState<AnalysisOutput | null>(null);
  const [beforeSvgPath, setBeforeSvgPath] = useState<string>(
    'M 180,140 C 250,110 340,120 400,160 C 450,200 430,300 380,360 C 310,400 220,390 170,330 C 130,270 140,190 180,140 Z'
  );
  const [afterSvgPath, setAfterSvgPath] = useState<string>(
    'M 180,140 C 250,110 340,120 400,160 C 450,200 430,300 380,360 C 310,400 220,390 170,330 C 130,270 140,190 180,140 Z'
  );

  const runImageAnalysis = async (bUrl: string, aUrl: string) => {
    setIsScanning(true);
    setScanProgress(20);

    const result = await analyzeDroneImagePairAsync(bUrl, aUrl);
    setCvResult(result);
    setBeforeSvgPath(result.beforeSvgPath);
    setAfterSvgPath(result.afterSvgPath);

    let p = 25;
    const timer = setInterval(() => {
      p += 25;
      if (p >= 100) {
        clearInterval(timer);
        setScanProgress(100);
        setIsScanning(false);
        // Sync calculated metrics directly from real pixel evaluation
        setVoidArea(result.beforeAreaSqm);
        setVoidDepth(result.beforeDepthCm);
        const billedVal = Number(
          (result.beforeVolumeM3 * (1 + (result.status === 'FRAUD_ALERT' ? result.materialVariancePct / 100 : 0.02))).toFixed(2)
        );
        setBilledVolume(billedVal);
        setAiFilledVolume(result.afterFilledVolumeM3);
        setCompactionDensity(result.compactionDensity);
        setIsPaymentFrozen(result.status === 'FRAUD_ALERT');
      } else {
        setScanProgress((prev) => Math.min(prev + 25, 95));
      }
    }, 180);
  };

  // Run on initial mount
  useEffect(() => {
    runImageAnalysis(beforeImg, afterImg);
  }, []);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const url = event.target.result as string;
        if (isBefore) {
          setBeforeImg(url);
          setCurrentScenarioName(`Custom Scan: ${file.name.replace(/\.[^/.]+$/, '')}`);
          runImageAnalysis(url, afterImg);
        } else {
          setAfterImg(url);
          runImageAnalysis(beforeImg, url);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (sample: (typeof CONTRACTOR_SLA_SAMPLES)[0]) => {
    const isOver = sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED';
    setBeforeImg(sample.beforeScan.imageUrl);
    setAfterImg(sample.afterScan.imageUrl);
    setCurrentScenarioName((sample as any).roadName || sample.project);
    setCurrentContractor((sample as any).contractor || 'Apex Infraworks Pvt Ltd');
    runImageAnalysis(sample.beforeScan.imageUrl, sample.afterScan.imageUrl);
    setToastMessage(`✓ Loaded inspection scenario: ${(sample as any).roadName || sample.project}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const volumeDeficit = Math.max(0, billedVolume - aiFilledVolume);
  const deficitPercentage = billedVolume > 0 ? ((volumeDeficit / billedVolume) * 100).toFixed(1) : '0';
  const isFraud = Number(deficitPercentage) > 5 || compactionDensity < 95;

  const handleTogglePaymentFreeze = () => {
    const nextState = !isPaymentFrozen;
    setIsPaymentFrozen(nextState);
    if (nextState) {
      setToastMessage('🔒 PFMS / GeM Escrow Payment FROZEN: Contractor invoice flagged for statutory vigilance review!');
    } else {
      setToastMessage('✓ PFMS / GeM Escrow Payment RELEASED: Milestone verified compliant with MoRTH specifications.');
    }
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleExportPDF = () => {
    setToastMessage('Generating Official Volumetric SLA Audit Certificate (PDF)...');
    setTimeout(() => {
      triggerPrint();
      setToastMessage(null);
    }, 600);
  };

  const handleAnchorOnBlockchain = () => {
    setIsAnchoring(true);
    setToastMessage('⛓️ Computing SHA-256 Merkle Tree & Broadcasting to Polygon Amoy Testnet...');

    setTimeout(() => {
      const record = anchorAuditOnChain({
        inspectionId: `INSP-SLA-${Date.now().toString().slice(-6)}`,
        roadId: 'RD-NDMC-CP-01',
        roadName: currentScenarioName,
        city: 'Delhi',
        contractor: currentContractor,
        lat: 28.548,
        lng: 77.185,
        areaSqm: voidArea,
        depthCm: voidDepth,
        volumeCum: aiFilledVolume,
        billedVolumeCum: billedVolume,
        materialVariancePct: Number(deficitPercentage),
        compactionDensityPct: compactionDensity,
        pciScore: isFraud ? 58 : 84,
        isFraud,
      });

      setOnChainRecord(record);
      setIsAnchoring(false);
      setIsBlockchainModalOpen(true);
      setToastMessage('✓ Merkle Root anchored on Polygon Amoy (Block #' + record.receipt.blockNumber + ')!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#edf2f7] text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      {/* Hidden file inputs */}
      <input
        ref={beforeInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleCustomUpload(e, true)}
      />
      <input
        ref={afterInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleCustomUpload(e, false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)]">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  Contractor SLA &amp; Volumetric Fraud Verification
                </h1>
                <span
                  className={`p-1.5 rounded-lg border shadow-xs ${
                    isFraud
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  {isFraud ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentScenarioName} • <span className="font-semibold text-slate-700">{currentContractor}</span>
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTogglePaymentFreeze}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                  isPaymentFrozen
                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/20'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {isPaymentFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isPaymentFrozen ? 'PFMS Escrow: FROZEN' : 'PFMS Escrow: RELEASED'}</span>
              </button>

              <button
                onClick={handleAnchorOnBlockchain}
                disabled={isAnchoring}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <Coins className="w-3.5 h-3.5 text-purple-600" />
                <span>{isAnchoring ? 'Anchoring...' : 'On-Chain Proof'}</span>
              </button>

              <button
                onClick={() => setIsCertOpen(true)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Section 65B</span>
              </button>

              <button
                onClick={() => setIsProvenanceOpen(true)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-800 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-600" />
                <span>Data Sources</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
                title="Export PDF Report"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-cyan-800 text-xs font-mono font-bold shadow-md flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* STREAMLINED SCENARIO & UPLOAD CONTROL BAR */}
          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                  Inspection Scenario:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {CONTRACTOR_SLA_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleApplyPreset(sample)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        currentScenarioName.includes((sample as any).roadName || sample.project)
                          ? 'bg-cyan-50 border-cyan-400 text-cyan-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <span>{(sample as any).roadName || sample.project}</span>
                      <span
                        className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED' ? 'FRAUD' : 'PASS'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => beforeInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer shadow-2xs"
                >
                  Upload Before
                </button>
                <button
                  onClick={() => afterInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer shadow-2xs"
                >
                  Upload After
                </button>
                <button
                  onClick={() => runImageAnalysis(beforeImg, afterImg)}
                  disabled={isScanning}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  {isScanning ? 'Differencing...' : 'Run Analysis'}
                </button>
              </div>
            </div>

            {isScanning && (
              <div className="pt-1">
                <div className="flex justify-between text-[11px] font-mono text-cyan-700 mb-1">
                  <span>[AI Engine] Evaluating Pixel Matrices, Contour Vectors &amp; Compaction...</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-cyan-600 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* DUAL IMAGE COMPARISON VIEWERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Pre-repair Pothole with DYNAMIC RED Mask */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-200 bg-slate-900 shadow-md flex flex-col justify-between h-[360px] p-4 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                  Step 1: Pre-Repair Drone Scan (Void Detected)
                </span>
                <span className="text-[10px] font-mono text-slate-600 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                  {voidDepth.toFixed(1)} cm Max Depth
                </span>
              </div>

              {/* Background Road Image with Dynamic RED Segmentation Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={beforeImg}
                  alt="Pre-Repair Pothole Scan"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dynamic RED Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={beforeSvgPath}
                    fill="rgba(239, 68, 68, 0.35)"
                    stroke="#ef4444"
                    strokeWidth="4"
                    filter="url(#redGlow)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Volume Card */}
              <div className="relative z-10 p-3.5 rounded-xl bg-white/95 backdrop-blur-xl border border-rose-200 shadow-xs flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">Contractor Claimed Volume</div>
                  <div className="text-lg font-black text-rose-600 font-display mt-0.5">
                    {billedVolume.toFixed(2)} m³ ({(billedVolume * 2.4).toFixed(2)} Ton)
                  </div>
                </div>
                <div className="text-right border-l border-slate-200 pl-4">
                  <span className="text-slate-500 block text-[11px]">Area: {voidArea.toFixed(2)} m²</span>
                  <span className="text-rose-600 font-bold block text-xs">Deficit: -{deficitPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Right Box: Post-repair Pothole with DYNAMIC GREEN / RED Mask */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 bg-slate-900 shadow-md flex flex-col justify-between h-[360px] p-4 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                  Step 2: Post-Repair AI Verification Scan
                </span>
                <span className="text-[10px] font-mono text-emerald-700 bg-white/90 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                  Dual RTK Fixed &plusmn;1.5cm
                </span>
              </div>

              {/* Background Road Image with Dynamic Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={afterImg}
                  alt="After Repair Drone Scan"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dynamic Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={afterSvgPath}
                    fill={isFraud ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}
                    stroke={isFraud ? '#ef4444' : '#10b981'}
                    strokeWidth="4"
                    strokeDasharray={isFraud ? '8, 4' : 'none'}
                    filter="url(#greenGlow)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Volume Card */}
              <div className="relative z-10 p-3.5 rounded-xl bg-white/95 backdrop-blur-xl border border-emerald-200 shadow-xs flex items-center justify-between text-xs font-mono">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider">AI Verified Material Filled</div>
                  <div className="text-lg font-black text-emerald-600 font-display mt-0.5">
                    {aiFilledVolume.toFixed(2)} m³ ({(aiFilledVolume * 2.4).toFixed(2)} Ton)
                  </div>
                </div>
                <div className="text-right border-l border-slate-200 pl-4">
                  <span className="text-slate-500 block text-[11px]">Compaction: {compactionDensity}%</span>
                  <span className={`block font-bold text-xs ${isFraud ? 'text-rose-600' : 'text-emerald-600'}`}>
                    SLA: {isFraud ? 'FRAUD ALERT' : 'APPROVED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CORE VERDICT BENTO STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] ${
                isFraud ? 'bg-rose-50/80 border-rose-300' : 'bg-emerald-50/80 border-emerald-300'
              }`}
            >
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Audit SLA Decision</span>
                <div className={`text-xl font-bold font-display mt-0.5 ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isFraud ? 'Volumetric Fraud' : 'Clearance Approved'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {isFraud ? 'Material deficit exceeds 5% limit' : 'Filled matches invoice within tolerance'}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isFraud ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                {isFraud ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">Material Variance</span>
                <div className={`text-xl font-bold font-display mt-0.5 ${isFraud ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isFraud ? `-${deficitPercentage}% Deficit` : '+0.8% In Tolerance'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {isFraud ? `Over-billed by ${Math.abs(billedVolume - aiFilledVolume).toFixed(2)} m³` : 'Optimal compaction density'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                <Scale className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase">PFMS Smart Contract Escrow</span>
                <div className={`text-xl font-bold font-display mt-0.5 ${isPaymentFrozen ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {isPaymentFrozen ? 'Payment Frozen' : 'Disbursement Ready'}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {isPaymentFrozen ? 'Public funds held safely' : 'Contractor payout approved'}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isPaymentFrozen ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                }`}
              >
                {isPaymentFrozen ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
            </div>
          </div>

          {/* INTERACTIVE AUDIT PARAMETER SIMULATOR (ALWAYS VISIBLE) */}
          <div className="p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 font-mono">
                <Sliders className="w-4 h-4" />
                <span>INTERACTIVE AUDIT PARAMETER SIMULATOR</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Adjust sliders to test statutory fraud detection thresholds</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Contractor Claimed / Billed Volume:</span>
                  <span className="font-bold text-rose-600">{billedVolume.toFixed(2)} m³</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.50"
                  step="0.01"
                  value={billedVolume}
                  onChange={(e) => setBilledVolume(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.10 m³</span>
                  <span>Contractor Invoice Volume</span>
                  <span>1.50 m³</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">AI Drone Verified Material Filled:</span>
                  <span className="font-bold text-emerald-600">{aiFilledVolume.toFixed(2)} m³</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.50"
                  step="0.01"
                  value={aiFilledVolume}
                  onChange={(e) => setAiFilledVolume(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.10 m³</span>
                  <span>LiDAR Volumetric Reconstruction</span>
                  <span>1.50 m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI AUTOMATED DIAGNOSTICS & STATUTORY CHECKS (ALWAYS VISIBLE) */}
          {cvResult && (
            <div className="p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-cyan-600" />
                  <span>Real-Time Computer Vision &amp; Statutory Diagnostics</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-700 font-semibold">
                  Fill Completion: {cvResult.fillCompletenessPct ?? 98}%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {cvResult.aiChecks.map((chk, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-2 shadow-2xs ${
                      chk.startsWith('✓')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <span>{chk}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs">
                <strong className="text-cyan-800 font-mono">Official Audit Verdict: </strong>
                {cvResult.explanation}
              </div>
            </div>
          )}

          {/* ITEMIZED VOLUMETRIC MATERIAL AUDIT TABLE (ALWAYS VISIBLE) */}
          <div className="p-5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
                  Itemized Volumetric Material Audit (CPWD DSR Aligned)
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Calculated against physical void dimensions ({voidArea.toFixed(2)} m&sup2; &times; {voidDepth.toFixed(1)} cm)
                </p>
              </div>

              {onChainRecord && (
                <button
                  onClick={() => setIsBlockchainModalOpen(true)}
                  className="text-xs font-mono text-purple-700 hover:text-purple-900 flex items-center gap-1 underline font-semibold"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Merkle Proof (Tx: {onChainRecord.receipt.txHash.slice(0, 10)}...)</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-mono">
                  <tr>
                    <th className="p-3">Material Category</th>
                    <th className="p-3">Contractor Claimed</th>
                    <th className="p-3">AI Verified Used</th>
                    <th className="p-3">Variance / Deficit</th>
                    <th className="p-3 text-right">Audit &amp; Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono">
                  {(cvResult?.materialTable || [
                    {
                      type: 'VG-30 Bituminous Concrete (BC Type II)',
                      claimed: `${(billedVolume * 2.4).toFixed(2)} Ton`,
                      used: `${(aiFilledVolume * 2.4).toFixed(2)} Ton`,
                      variance: `-${deficitPercentage}%`,
                      status: isFraud ? 'Exceeded Tolerance' : 'Within SLA Limit',
                    },
                  ]).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900 font-sans">{row.type}</td>
                      <td className="p-3 text-slate-600">{row.claimed}</td>
                      <td className="p-3 text-cyan-700 font-semibold">{row.used}</td>
                      <td className={`p-3 font-bold ${isFraud ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {row.variance}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border shadow-xs ${
                            row.status.includes('Exceeded') || row.status.includes('Fraud')
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Section 65B Modal */}
      <Section65BCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        data={{
          id: 'sla-verification-801',
          project: currentScenarioName,
          roadId: 'RD-NDMC-CP-01',
          inspectionNo: 'INSP-SLA-2026',
          status: isFraud ? 'FRAUD_ALERT' : 'APPROVED',
          volume: billedVolume,
          area: voidArea,
        }}
      />

      {/* Blockchain Audit & Merkle Proof Modal */}
      <BlockchainAuditModal
        isOpen={isBlockchainModalOpen}
        onClose={() => setIsBlockchainModalOpen(false)}
        record={onChainRecord}
      />

      {/* Official Data Provenance Modal */}
      <DataProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />
    </div>
  );
}
