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
  FileText,
  Upload,
} from 'lucide-react';
import { analyzeDroneImagePairAsync, AnalysisOutput } from '@/lib/imageAnalyzer';
import { triggerPrint } from '@/lib/exportUtils';
import { CONTRACTOR_SLA_SAMPLES } from '@/lib/mockInference';
import { anchorAuditOnChain } from '@/lib/web3/blockchainService';
import { OnChainAuditRecord } from '@/lib/web3/types';

export default function SLAVerificationPage() {
  // Preset scenarios or interactive slider
  const [billedVolume, setBilledVolume] = useState<number>(0.32);
  const [aiFilledVolume, setAiFilledVolume] = useState<number>(0.03);
  const [compactionDensity, setCompactionDensity] = useState<number>(73.0);
  const [voidArea, setVoidArea] = useState<number>(2.03);
  const [voidDepth, setVoidDepth] = useState<number>(15.7);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPaymentFrozen, setIsPaymentFrozen] = useState(true);
  const [activeDetailTab, setActiveDetailTab] = useState<'diagnostics' | 'cpwd'>('diagnostics');

  // Blockchain Anchoring & Modal State
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [onChainRecord, setOnChainRecord] = useState<OnChainAuditRecord | null>(null);

  // Custom Upload States & Analysis Output
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [beforeImg, setBeforeImg] = useState<string>('/images/indian_pothole_severe_before.jpg');
  const [afterImg, setAfterImg] = useState<string>('/images/indian_pothole_fraud_after.jpg');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(100);
  const [currentScenarioName, setCurrentScenarioName] = useState<string>('South Delhi PWD Package 4');
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
    setBeforeImg(sample.beforeScan.imageUrl);
    setAfterImg(sample.afterScan.imageUrl);
    setCurrentScenarioName((sample as any).roadName || sample.project);
    setCurrentContractor((sample as any).contractor || 'Apex Infraworks Pvt Ltd');
    runImageAnalysis(sample.beforeScan.imageUrl, sample.afterScan.imageUrl);
    setToastMessage(`✓ Loaded scenario: ${(sample as any).roadName || sample.project}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-Time Calculations from Sliders / Image Evaluation
  const volumeDeficit = Math.max(0, billedVolume - aiFilledVolume);
  const deficitPercentage = billedVolume > 0 ? ((volumeDeficit / billedVolume) * 100).toFixed(1) : '0';
  const isFraud = Number(deficitPercentage) > 5 || compactionDensity < 95;

  const handleTogglePaymentFreeze = () => {
    const nextState = !isPaymentFrozen;
    setIsPaymentFrozen(nextState);
    if (nextState) {
      setToastMessage('🔒 PFMS Escrow Payment FROZEN: Contractor invoice flagged for statutory vigilance review!');
    } else {
      setToastMessage('✓ PFMS Escrow Payment RELEASED: Milestone verified compliant with MoRTH specifications.');
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
      setToastMessage(`✓ Merkle Root anchored on Polygon Amoy (Block #${record.receipt.blockNumber})!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-transparent text-slate-800 font-sans overflow-hidden">
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

        <main className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Executive Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-300 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 font-display tracking-tight">
                  Contractor SLA &amp; Volumetric Fraud Verification
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 shadow-2xs ${
                    isFraud
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isFraud ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                  <span>{isFraud ? 'FRAUD DETECTED' : 'SLA VERIFIED'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {currentScenarioName} • <span className="font-semibold text-slate-700">{currentContractor}</span>
              </p>
            </div>

            {/* Action CTAs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTogglePaymentFreeze}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer ${
                  isPaymentFrozen
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                }`}
              >
                {isPaymentFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isPaymentFrozen ? 'PFMS Escrow: FROZEN' : 'PFMS Escrow: RELEASED'}</span>
              </button>

              <button
                onClick={handleAnchorOnBlockchain}
                disabled={isAnchoring}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <Coins className="w-3.5 h-3.5 text-purple-600" />
                <span>{isAnchoring ? 'Anchoring...' : 'On-Chain Proof'}</span>
              </button>

              <button
                onClick={() => setIsCertOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-700" />
                <span>Section 65B</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="p-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                title="Export PDF Report"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-3 rounded-xl bg-white border border-slate-300 text-cyan-900 text-xs font-mono font-bold shadow-md flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* STREAMLINED SCENARIO & UPLOAD CONTROL BAR (CLEAN SINGLE ROW) */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-300 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            {/* Scenario Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-600 font-mono uppercase tracking-wider shrink-0 mr-1">
                Corridor:
              </span>
              {CONTRACTOR_SLA_SAMPLES.map((sample) => {
                const sampleName = (sample as any).roadName || sample.project;
                const isSampleActive = currentScenarioName.includes(sampleName);
                const isSampleFraud = sample.status === 'FRAUD_ALERT' || sample.status === 'REJECTED';
                // Short display name for clean 1-row presentation
                const shortLabel = sampleName
                  .replace('Smart Roads', '')
                  .replace('PWD Package 4', '')
                  .replace('Smart City Corridor', '')
                  .replace('Highway Overlay', '')
                  .trim();

                return (
                  <button
                    key={sample.id}
                    onClick={() => handleApplyPreset(sample)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSampleActive
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:text-slate-900'
                    }`}
                  >
                    <span>{shortLabel}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold font-mono ${
                        isSampleFraud
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isSampleFraud ? 'FRAUD' : 'PASS'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Upload & Differencing CTAs */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => beforeInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-700" />
                <span>Upload Before</span>
              </button>
              <button
                onClick={() => afterInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Upload className="w-3 h-3 text-cyan-700" />
                <span>Upload After</span>
              </button>
              <button
                onClick={() => runImageAnalysis(beforeImg, afterImg)}
                disabled={isScanning}
                className="px-3.5 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-2xs transition-all"
              >
                {isScanning ? 'Differencing...' : 'Run AI Analysis'}
              </button>
            </div>
          </div>

          {/* Scanning Progress Bar */}
          {isScanning && (
            <div className="p-3 rounded-xl bg-white border border-cyan-300">
              <div className="flex justify-between text-[11px] font-mono text-cyan-800 mb-1">
                <span>[AI Engine] Evaluating Pixel Matrices, Contour Differencing &amp; Compaction...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-cyan-600 transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* DUAL IMAGE COMPARISON VIEWERS (HERO COMPUTER VISION CANVASES) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Box: Pre-repair Pothole */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-300 bg-slate-900 shadow-sm flex flex-col justify-between h-[340px] p-3.5 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
                  Pre-Repair Drone Scan
                </span>
                <span className="text-[10px] font-mono text-slate-700 bg-white/95 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  Depth: {voidDepth.toFixed(1)} cm
                </span>
              </div>

              {/* Background Road Image with Dynamic RED Segmentation Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={beforeImg}
                  alt="Pre-Repair Pothole Scan"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
                />

                {/* Dynamic RED Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="redGlowLight" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={beforeSvgPath}
                    fill="rgba(239, 68, 68, 0.40)"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    filter="url(#redGlowLight)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Bottom Telemetry HUD */}
              <div className="relative z-10 p-2.5 rounded-xl bg-white/95 backdrop-blur-xl border border-rose-300 shadow-sm flex items-center justify-between text-xs font-mono text-slate-800">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Contractor Invoiced</div>
                  <div className="text-base font-black text-rose-700 font-display">
                    {billedVolume.toFixed(2)} m³ ({(billedVolume * 2.4).toFixed(2)} Ton)
                  </div>
                </div>
                <div className="text-right border-l border-slate-200 pl-3">
                  <span className="text-slate-500 block text-[10px]">Area: {voidArea.toFixed(2)} m²</span>
                  <span className="text-rose-700 font-bold block text-xs">Deficit: -{deficitPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Right Box: Post-repair Pothole */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-300 bg-slate-900 shadow-sm flex flex-col justify-between h-[340px] p-3.5 group">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
                  Post-Repair Verification Scan
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-white/95 px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                  Dual RTK Fixed ±1.5cm
                </span>
              </div>

              {/* Background Road Image with Dynamic Overlay */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img
                  src={afterImg}
                  alt="After Repair Drone Scan"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
                />

                {/* Dynamic Segmentation Mask Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                  <defs>
                    <filter id="greenGlowLight" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d={afterSvgPath}
                    fill={isFraud ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}
                    stroke={isFraud ? '#ef4444' : '#10b981'}
                    strokeWidth="3.5"
                    strokeDasharray={isFraud ? '8, 4' : 'none'}
                    filter="url(#greenGlowLight)"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Bottom Telemetry HUD */}
              <div className="relative z-10 p-2.5 rounded-xl bg-white/95 backdrop-blur-xl border border-emerald-300 shadow-sm flex items-center justify-between text-xs font-mono text-slate-800">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">AI Verified Material</div>
                  <div className="text-base font-black text-emerald-700 font-display">
                    {aiFilledVolume.toFixed(2)} m³ ({(aiFilledVolume * 2.4).toFixed(2)} Ton)
                  </div>
                </div>
                <div className="text-right border-l border-slate-200 pl-3">
                  <span className="text-slate-500 block text-[10px]">Compaction: {compactionDensity}%</span>
                  <span className={`block font-bold text-xs ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                    Verdict: {isFraud ? 'FRAUD ALERT' : 'APPROVED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 CORE VERDICT CARDS (ESSENTIAL EXECUTIVE DATA ONLY) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm ${
                isFraud ? 'bg-rose-50/90 border-rose-300' : 'bg-emerald-50/90 border-emerald-300'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Statutory SLA Verdict</span>
                <div className={`text-lg font-bold font-display mt-0.5 ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isFraud ? 'Volumetric Fraud' : 'Clearance Approved'}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {isFraud ? 'Deficit exceeds 5% MoRTH limit' : 'Filled matches invoice within tolerance'}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isFraud ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                }`}
              >
                {isFraud ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Material Variance</span>
                <div className={`text-lg font-bold font-display mt-0.5 ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isFraud ? `-${deficitPercentage}% Deficit` : '+0.8% In Tolerance'}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {isFraud ? `Over-billed by ${Math.abs(billedVolume - aiFilledVolume).toFixed(2)} m³` : 'Optimal compaction density'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">PFMS Smart Contract Escrow</span>
                <div className={`text-lg font-bold font-display mt-0.5 ${isPaymentFrozen ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {isPaymentFrozen ? 'Payment Frozen' : 'Disbursement Ready'}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {isPaymentFrozen ? 'Public funds held safely in escrow' : 'Contractor payout approved'}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isPaymentFrozen ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                }`}
              >
                {isPaymentFrozen ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* BALANCED 2-COLUMN SECTION: SIMULATOR (LEFT) & AUDIT DETAILS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Interactive Parameter Simulator */}
            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 font-mono">
                    <Sliders className="w-4 h-4" />
                    <span>INTERACTIVE PARAMETER SIMULATOR</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Live Threshold Evaluation</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-semibold">Contractor Claimed Volume:</span>
                      <span className="font-bold text-rose-700">{billedVolume.toFixed(2)} m³</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="1.50"
                      step="0.01"
                      value={billedVolume}
                      onChange={(e) => setBilledVolume(parseFloat(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.10 m³</span>
                      <span>Invoice Claim</span>
                      <span>1.50 m³</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-semibold">AI Verified Material Filled:</span>
                      <span className="font-bold text-emerald-700">{aiFilledVolume.toFixed(2)} m³</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="1.50"
                      step="0.01"
                      value={aiFilledVolume}
                      onChange={(e) => setAiFilledVolume(parseFloat(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.10 m³</span>
                      <span>LiDAR Reconstruction</span>
                      <span>1.50 m³</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Statutory Rule: <strong>MoRTH Clause 500</strong></span>
                <span className={`font-mono font-bold ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                  Variance: -{deficitPercentage}% (Threshold: &le; 5%)
                </span>
              </div>
            </div>

            {/* Right: Technical Evidence Hub with Tabs */}
            <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3 flex flex-col justify-between">
              {/* Tabs */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveDetailTab('diagnostics')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        activeDetailTab === 'diagnostics'
                          ? 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      AI Diagnostics
                    </button>
                    <button
                      onClick={() => setActiveDetailTab('cpwd')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        activeDetailTab === 'cpwd'
                          ? 'bg-cyan-50 text-cyan-900 border border-cyan-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      CPWD DSR Material Audit
                    </button>
                  </div>

                  {onChainRecord && (
                    <button
                      onClick={() => setIsBlockchainModalOpen(true)}
                      className="text-[11px] font-mono text-purple-700 hover:text-purple-900 flex items-center gap-1 underline font-semibold"
                    >
                      <Layers className="w-3 h-3" />
                      <span>Merkle Root</span>
                    </button>
                  )}
                </div>

                {/* Tab 1: AI Diagnostics */}
                {activeDetailTab === 'diagnostics' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {(cvResult?.aiChecks || [
                        '✓ RTK Dual-antenna GPS positioning lock within ±1.5cm',
                        '✗ Bituminous volume deficit exceeds statutory 5% limit',
                        '✗ Inadequate asphalt layer compaction density (73%)',
                        '✓ Cryptographic drone telemetry SHA-256 hash verified',
                      ]).map((chk, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border text-[11px] leading-tight ${
                            chk.startsWith('✓')
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          {chk}
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
                      <strong className="text-cyan-800 font-mono text-[11px]">Audit Verdict: </strong>
                      {cvResult?.explanation ||
                        'Pre-repair drone photogrammetry identified a 0.32 m³ void. Post-repair scan revealed only 0.03 m³ of asphalt applied. Invoice rejected under MoRTH 500 guidelines.'}
                    </div>
                  </div>
                )}

                {/* Tab 2: CPWD DSR Table */}
                {activeDetailTab === 'cpwd' && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="p-2 font-sans font-semibold">Material</th>
                          <th className="p-2">Claimed</th>
                          <th className="p-2">Actual</th>
                          <th className="p-2">Variance</th>
                          <th className="p-2 text-right">Escrow</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(cvResult?.materialTable || [
                          {
                            type: 'VG-30 Bituminous Concrete',
                            claimed: `${(billedVolume * 2.4).toFixed(2)} Ton`,
                            used: `${(aiFilledVolume * 2.4).toFixed(2)} Ton`,
                            variance: `-${deficitPercentage}%`,
                            status: isFraud ? 'Exceeded' : 'Within SLA',
                          },
                        ]).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-2 font-sans font-semibold text-slate-900">{row.type}</td>
                            <td className="p-2 text-slate-600">{row.claimed}</td>
                            <td className="p-2 text-cyan-800 font-semibold">{row.used}</td>
                            <td className={`p-2 font-bold ${isFraud ? 'text-rose-700' : 'text-emerald-700'}`}>
                              {row.variance}
                            </td>
                            <td className="p-2 text-right">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  row.status.includes('Exceeded') || row.status.includes('Fraud')
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {isFraud ? 'Frozen' : 'Approved'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                <span>Calculated against physical void: {voidArea.toFixed(2)} m² × {voidDepth.toFixed(1)} cm</span>
                <span className="text-cyan-800 font-semibold">CPWD DSR 2023 Aligned</span>
              </div>
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
