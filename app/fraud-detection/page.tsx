'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import BeforeAfterViewer from '@/components/fraud/BeforeAfterViewer';
import MaterialVarianceTable from '@/components/fraud/MaterialVarianceTable';
import Section65BCertificateModal from '@/components/fraud/Section65BCertificateModal';
import BlockchainAuditModal from '@/components/web3/BlockchainAuditModal';
import DataProvenanceModal from '@/components/common/DataProvenanceModal';
import { CONTRACTOR_SLA_SAMPLES, SLAVerificationData } from '@/lib/mockInference';
import { anchorAuditOnChain } from '@/lib/web3/blockchainService';
import { OnChainAuditRecord } from '@/lib/web3/types';
import {
  Download,
  Share2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  Activity,
  RefreshCw,
  Lock,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Cpu,
  CheckCircle2,
  Zap,
  Coins,
  Scale,
} from 'lucide-react';

import { analyzeDroneImagePairAsync, AnalysisOutput } from '@/lib/imageAnalyzer';

export default function FraudDetectionPage() {
  const [samplesList, setSamplesList] = useState<SLAVerificationData[]>(CONTRACTOR_SLA_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<SLAVerificationData>(CONTRACTOR_SLA_SAMPLES[0]);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Blockchain state
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [onChainRecord, setOnChainRecord] = useState<OnChainAuditRecord | null>(null);

  // Custom Upload Refs
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [customBeforeUrl, setCustomBeforeUrl] = useState<string | null>(null);
  const [customAfterUrl, setCustomAfterUrl] = useState<string | null>(null);
  const [beforeFileName, setBeforeFileName] = useState<string>('');
  const [afterFileName, setAfterFileName] = useState<string>('');

  // Live AI Scanning Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [scanTelemetryLog, setScanTelemetryLog] = useState<string>('Audit complete. All multi-spectral telemetry synced.');

  // Real-time SLA Interactive Controls State
  const [overbillPct, setOverbillPct] = useState<number>(2.1);
  const [compactionDensity, setCompactionDensity] = useState<number>(96);
  const [allowedTolerance, setAllowedTolerance] = useState<number>(5);
  const [potholeDepthCm, setPotholeDepthCm] = useState<number>(18.5);
  const [customAnalysis, setCustomAnalysis] = useState<AnalysisOutput | null>(null);

  // Run Real Image Pixel Analysis on preset or custom image change
  const executeImagePairAnalysis = async (beforeUrl: string, afterUrl: string) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanTelemetryLog('Initializing YOLOv8-Seg Instance Segmentation & Depth Anything Engine...');

    const analysis = await analyzeDroneImagePairAsync(beforeUrl, afterUrl);
    setCustomAnalysis(analysis);

    // Stream telemetry animation
    const steps = [
      { progress: 35, log: `[AI 1/4] Segmented Pre-Repair Void: ${analysis.beforeAreaSqm} m² at ${analysis.beforeDepthCm} cm depth` },
      { progress: 65, log: `[AI 2/4] Volumetric Void: ${analysis.beforeVolumeM3} m³ (${(analysis.beforeVolumeM3 * 2.4).toFixed(2)} Tons asphalt)` },
      { progress: 85, log: `[AI 3/4] Differencing Post-Repair: Variance -${analysis.materialVariancePct}%, Compaction ${analysis.compactionDensity}%` },
      { progress: 100, log: `[AI 4/4] Status Evaluated: ${analysis.status === 'APPROVED' ? 'CLEARANCE APPROVED' : 'FRAUD ALERT TRIGGERED'}` },
    ];

    let stepIdx = 0;
    const timer = setInterval(() => {
      if (stepIdx < steps.length) {
        setScanProgress(steps[stepIdx].progress);
        setScanTelemetryLog(steps[stepIdx].log);
        stepIdx++;
      } else {
        clearInterval(timer);
        setIsScanning(false);
        // Sync sliders with true computer vision analysis
        setOverbillPct(analysis.materialVariancePct);
        setCompactionDensity(analysis.compactionDensity);
        setPotholeDepthCm(analysis.beforeDepthCm);
      }
    }, 300);
  };

  // Run on initial mount
  useEffect(() => {
    executeImagePairAnalysis(selectedSample.beforeScan.imageUrl, selectedSample.afterScan.imageUrl);
  }, [selectedSample.id]);

  // Handle Before Image Upload
  const handleBeforeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBeforeFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomBeforeUrl(dataUrl);
        const currentAfter = customAfterUrl || selectedSample.afterScan.imageUrl;
        createAndAnalyzeCustomSample(dataUrl, currentAfter, file.name, afterFileName || 'after_scan.jpg');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle After Image Upload
  const handleAfterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAfterFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomAfterUrl(dataUrl);
        const currentBefore = customBeforeUrl || selectedSample.beforeScan.imageUrl;
        createAndAnalyzeCustomSample(currentBefore, dataUrl, beforeFileName || 'before_scan.jpg', file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const createAndAnalyzeCustomSample = async (
    beforeUrl: string,
    afterUrl: string,
    bName: string,
    aName: string
  ) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanTelemetryLog('Extracting Pixel Matrices from Uploaded Orthomosaic Images...');

    const analysis = await analyzeDroneImagePairAsync(beforeUrl, afterUrl);
    setCustomAnalysis(analysis);

    const customId = `custom-${Date.now()}`;
    const newCustomSample: SLAVerificationData = {
      id: customId,
      project: `Live Upload: ${bName.slice(0, 14)}`,
      roadId: `UPLOAD-${Math.floor(1000 + Math.random() * 9000)}`,
      inspectionId: `INSP-CV-${new Date().toISOString().slice(0, 10)}`,
      date: new Date().toLocaleString(),
      repairQualityScore: analysis.repairQualityScore,
      status: analysis.status,
      beforeScan: {
        capturedOn: 'Uploaded Pre-Repair Scan',
        area: `${analysis.beforeAreaSqm} m²`,
        path: analysis.beforeSvgPath,
        imageUrl: beforeUrl,
      },
      afterScan: {
        capturedOn: 'Uploaded Post-Repair Scan',
        area: `${(analysis.beforeAreaSqm * 0.98).toFixed(2)} m²`,
        path: analysis.afterSvgPath,
        imageUrl: afterUrl,
      },
      summaryMetrics: {
        repairQuality: analysis.repairQualityScore,
        surfaceSmoothness: analysis.surfaceSmoothness,
        compactionQuality: analysis.compactionDensity,
        edgeCompliance: Math.max(15, Math.min(98, Math.round((100 - analysis.materialVariancePct) * 0.95))),
        drainageCompliance: Math.max(10, Math.min(95, Math.round(analysis.repairQualityScore * 0.9))),
      },
      aiAnalysisResults: analysis.aiChecks,
      materialTable: analysis.materialTable as any,
      verificationExplanation: analysis.explanation,
    };

    setSamplesList((prev) => [newCustomSample, ...prev.filter((s) => !s.id.startsWith('custom-'))]);
    setSelectedSample(newCustomSample);

    // Sync sliders
    setOverbillPct(analysis.materialVariancePct);
    setCompactionDensity(analysis.compactionDensity);
    setPotholeDepthCm(analysis.beforeDepthCm);

    // Animate scan finish
    let p = 25;
    const interval = setInterval(() => {
      p += 25;
      setScanProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 200);
  };

  // Real-Time Dynamic SLA Calculation Engine
  const calculatedQualityScore = Math.max(
    10,
    Math.min(99, Math.round(compactionDensity * 0.55 + (100 - overbillPct) * 0.45))
  );

  const isFraud = overbillPct > allowedTolerance || compactionDensity < 85 || calculatedQualityScore < 75;
  const currentStatus: 'APPROVED' | 'FRAUD_ALERT' = isFraud ? 'FRAUD_ALERT' : 'APPROVED';

  // Base material tonnages dynamically scaled with pothole depth & overbill
  const baseTonnage = Number(((selectedSample.beforeScan.area ? parseFloat(selectedSample.beforeScan.area) : 2.5) * (potholeDepthCm / 100) * 2.4).toFixed(2));
  const claimedTonnage = Number((baseTonnage * (1 + overbillPct / 100)).toFixed(2));
  const actualTonnage = baseTonnage;

  // Construct dynamic real-time sample state
  const dynamicSample: SLAVerificationData = {
    ...selectedSample,
    repairQualityScore: calculatedQualityScore,
    status: currentStatus,
    summaryMetrics: {
      repairQuality: calculatedQualityScore,
      surfaceSmoothness: Math.max(20, Math.min(98, Math.round(compactionDensity * 0.9))),
      compactionQuality: compactionDensity,
      edgeCompliance: Math.max(15, Math.min(95, Math.round((100 - overbillPct) * 0.95))),
      drainageCompliance: Math.max(10, Math.min(95, Math.round(calculatedQualityScore * 0.9))),
    },
    materialTable: [
      {
        type: 'Asphalt Mix (VG-30 BM)',
        claimed: `${claimedTonnage.toFixed(2)} Ton`,
        used: `${actualTonnage.toFixed(2)} Ton`,
        variance: overbillPct > allowedTolerance ? `-${overbillPct.toFixed(1)}%` : `-1.8%`,
        status: overbillPct > allowedTolerance ? 'Exceeded Threshold' : 'Within Limit',
      },
      {
        type: 'Bitumen Binder (5.2%)',
        claimed: `${(claimedTonnage * 52).toFixed(1)} Kg`,
        used: `${(actualTonnage * 52).toFixed(1)} Kg`,
        variance: overbillPct > allowedTolerance ? `-${overbillPct.toFixed(1)}%` : `-1.9%`,
        status: overbillPct > allowedTolerance ? 'Exceeded Threshold' : 'Within Limit',
      },
      {
        type: 'Graded Crushed Aggregate',
        claimed: `${(claimedTonnage * 0.82).toFixed(2)} Ton`,
        used: `${(actualTonnage * 0.82).toFixed(2)} Ton`,
        variance: overbillPct > allowedTolerance ? `-${overbillPct.toFixed(1)}%` : `-1.7%`,
        status: overbillPct > allowedTolerance ? 'Exceeded Threshold' : 'Within Limit',
      },
      {
        type: 'Bitumen Emulsion RS-1',
        claimed: `${(claimedTonnage * 6.5).toFixed(1)} L`,
        used: `${(actualTonnage * 6.5).toFixed(1)} L`,
        variance: overbillPct > allowedTolerance ? `-${overbillPct.toFixed(1)}%` : `-2.1%`,
        status: overbillPct > allowedTolerance ? 'Exceeded Threshold' : 'Within Limit',
      },
      {
        type: 'Total B.O.Q. Volume',
        claimed: '—',
        used: '—',
        variance: `-${overbillPct.toFixed(1)}% (Avg)`,
        status: isFraud ? 'Fraud Detected' : 'Compliant',
      },
    ],
    verificationExplanation: isFraud
      ? `REAL-TIME SLA ALERT: Contractor claimed ${claimedTonnage.toFixed(2)} Tons of asphalt, but 3D volumetric audit confirms physical void required only ${actualTonnage.toFixed(2)} Tons (${overbillPct.toFixed(1)}% material deficit). Nuclear compaction is ${compactionDensity}% (below IRC:82 standard). Escrow payment has been automatically FROZEN on PFMS / GeM.`
      : `REAL-TIME SLA PASSED: Repair quality score is ${calculatedQualityScore}% with ${compactionDensity}% compaction density. Material variance (${overbillPct.toFixed(1)}%) is within allowed threshold (${allowedTolerance}%). Payment clearance APPROVED on GeM/PFMS.`,
  };

  const handleAnchorBlockchain = () => {
    setIsAnchoring(true);
    setToastMessage('⛓️ Computing SHA-256 Merkle Tree & Anchoring on Polygon Amoy...');

    const actualVolM3 = Number((actualTonnage / 2.4).toFixed(2));
    const claimedVolM3 = Number((claimedTonnage / 2.4).toFixed(2));

    setTimeout(() => {
      const record = anchorAuditOnChain({
        inspectionId: `INSP-FRAUD-${Date.now().toString().slice(-6)}`,
        roadId: dynamicSample.roadId || 'RD-MMRDA-WEH-01',
        roadName: dynamicSample.project || 'Western Express Highway Overlay',
        city: 'Mumbai',
        contractor: (dynamicSample as any).contractor || 'Apex Infraworks Pvt Ltd',
        lat: 19.076,
        lng: 72.858,
        areaSqm: dynamicSample.beforeScan.area ? parseFloat(dynamicSample.beforeScan.area) : 4.8,
        depthCm: potholeDepthCm,
        volumeCum: actualVolM3,
        billedVolumeCum: claimedVolM3,
        materialVariancePct: overbillPct,
        compactionDensityPct: compactionDensity,
        pciScore: isFraud ? 54 : 88,
        isFraud,
      });

      setOnChainRecord(record);
      setIsAnchoring(false);
      setIsBlockchainModalOpen(true);
      setToastMessage(`✓ On-Chain Proof anchored on Polygon Amoy (Block #${record.receipt.blockNumber})!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 750);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  Contractor SLA &amp; Real-Time Fraud Verification Engine
                </h1>
                <span className="p-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Dynamic 3D volumetric differencing, custom drone image pair upload, and automated escrow payment clearance
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Data Sources Trigger */}
              <button
                onClick={() => setIsProvenanceOpen(true)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-cyan-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-cyan-600" />
                <span>Data Sources (CPWD / MoRTH)</span>
              </button>

              {/* Blockchain Anchoring Trigger */}
              <button
                onClick={handleAnchorBlockchain}
                disabled={isAnchoring}
                className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-purple-600" />
                <span>{isAnchoring ? 'Anchoring on Polygon...' : 'Anchor on Blockchain'}</span>
              </button>

              <button
                onClick={() => setIsCertOpen(true)}
                className="px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Section 65B Audit Certificate</span>
              </button>
              <button
                onClick={() => {
                  setToastMessage(
                    isFraud
                      ? '🔒 PFMS / GeM Escrow Payment FROZEN: Contractor invoice locked due to material variance threshold violation!'
                      : '✓ PFMS / GeM Escrow Payment APPROVED: Material and compaction verified compliant!'
                  );
                  setTimeout(() => setToastMessage(null), 4500);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  isFraud
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isFraud ? 'PFMS Payment: FROZEN' : 'PFMS Payment: APPROVED'}</span>
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-900 text-xs font-mono font-bold shadow-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* DUAL IMAGE UPLOAD & LIVE SCANNING CONTROL HUB */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
                <span className="text-xs font-bold text-slate-900 font-mono uppercase">
                  Live Drone Pair Upload &amp; Volumetric Differencing Pipeline
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-700 font-medium">
                Upload your own Before &amp; After photos to run instant live AI analysis
              </span>
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={beforeInputRef}
              onChange={handleBeforeUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={afterInputRef}
              onChange={handleAfterUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Upload 1: Before Repair */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Pre-Repair Scan (Before)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {beforeFileName ? beforeFileName.slice(0, 16) + '...' : 'pothole_severe_before.jpg'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-rose-300 shrink-0 bg-slate-100">
                    <img
                      src={customBeforeUrl || dynamicSample.beforeScan.imageUrl}
                      alt="Before Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => beforeInputRef.current?.click()}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Before Photo</span>
                  </button>
                </div>
              </div>

              {/* Upload 2: After Repair */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Post-Repair Scan (After)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {afterFileName ? afterFileName.slice(0, 16) + '...' : 'pothole_repaired_after.jpg'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-300 shrink-0 bg-slate-100">
                    <img
                      src={customAfterUrl || dynamicSample.afterScan.imageUrl}
                      alt="After Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => afterInputRef.current?.click()}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom After Photo</span>
                  </button>
                </div>
              </div>

              {/* Run Live AI Analysis Button */}
              <div className="md:col-span-4 flex flex-col justify-between h-full space-y-2">
                <button
                  onClick={() =>
                    executeImagePairAnalysis(
                      customBeforeUrl || selectedSample.beforeScan.imageUrl,
                      customAfterUrl || selectedSample.afterScan.imageUrl
                    )
                  }
                  disabled={isScanning}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Cpu className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                  <span>{isScanning ? 'Running 3D AI Differencing...' : 'Run Real-Time AI Differencing'}</span>
                </button>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                  <span>YOLOv8-Seg Mask + Depth Anything</span>
                  <span className="text-cyan-700 font-bold">Live Pixel Analysis</span>
                </div>
              </div>
            </div>

            {/* LIVE SCANNING ANIMATED PROGRESS BAR & TELEMETRY STREAM */}
            {isScanning && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-cyan-300 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-800 font-bold flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
                    <span>{scanTelemetryLog}</span>
                  </span>
                  <span className="text-cyan-700 font-extrabold">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Interactive SLA Parameter Control Sliders */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 font-mono">
                <Sliders className="w-4 h-4" />
                <span>REAL-TIME SLA TELEMETRY SIMULATOR</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Live calculated from image differencing • Adjust sliders to test custom tolerances
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Slider 1: Material Deficit / Overbilling */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700">Material Variance Deficit:</span>
                  <span className={`font-bold ${overbillPct > allowedTolerance ? 'text-rose-600' : 'text-emerald-600'}`}>
                    -{overbillPct.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={0.5}
                  value={overbillPct}
                  onChange={(e) => setOverbillPct(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0% (Compliant)</span>
                  <span>{allowedTolerance}% SLA Limit</span>
                  <span>60% (Fraud)</span>
                </div>
              </div>

              {/* Slider 2: Compaction Density */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700">Nuclear Compaction Density:</span>
                  <span className={`font-bold ${compactionDensity < 85 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {compactionDensity}% MDD
                  </span>
                </div>
                <input
                  type="range"
                  min={55}
                  max={100}
                  step={1}
                  value={compactionDensity}
                  onChange={(e) => setCompactionDensity(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>55% (Failed)</span>
                  <span>85% (IRC Limit)</span>
                  <span>100% (Optimal)</span>
                </div>
              </div>

              {/* Slider 3: Allowed Variance Threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700">Allowed SLA Tolerance:</span>
                  <span className="font-bold text-cyan-700">±{allowedTolerance}%</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  step={1}
                  value={allowedTolerance}
                  onChange={(e) => setAllowedTolerance(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>2% (Strict PWD)</span>
                  <span>5% (Standard)</span>
                  <span>15% (Relaxed)</span>
                </div>
              </div>

              {/* Slider 4: Pothole Depth Parameter */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-700">Void Excavation Depth:</span>
                  <span className="font-bold text-amber-700">{potholeDepthCm} cm</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={0.5}
                  value={potholeDepthCm}
                  onChange={(e) => setPotholeDepthCm(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>5 cm (Surface)</span>
                  <span>15 cm (Medium)</span>
                  <span>30 cm (Deep Void)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Strip & Sample Presets */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600">
              <span>Project: <strong className="text-slate-900">{dynamicSample.project}</strong></span>
              <span>•</span>
              <span>Road ID: <strong className="text-cyan-700">{dynamicSample.roadId}</strong></span>
              <span>•</span>
              <span>Inspection ID: <strong className="text-cyan-700">{dynamicSample.inspectionId}</strong></span>
              <span>•</span>
              <span>Live Status: <strong className={currentStatus === 'APPROVED' ? 'text-emerald-700' : 'text-rose-700'}>{currentStatus}</strong></span>
            </div>

            {/* Test Sample Preset Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {samplesList.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSample(s);
                    executeImagePairAnalysis(s.beforeScan.imageUrl, s.afterScan.imageUrl);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all font-sans font-medium text-xs cursor-pointer ${
                    selectedSample.id === s.id
                      ? s.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs font-bold'
                        : 'bg-rose-50 text-rose-800 border border-rose-300 shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {s.id.startsWith('custom') ? 'Custom Upload' : idx === 0 ? 'Compliant Repair Preset' : 'Fraud Alert Preset'}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-side Before/After Drone Visual with Draggable Split Slider */}
          <BeforeAfterViewer sample={dynamicSample} />

          {/* Material Variance & Verification Summary Table */}
          <MaterialVarianceTable sample={dynamicSample} />
        </main>
      </div>

      {/* Section 65B Certificate Modal */}
      <Section65BCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        data={{
          id: dynamicSample.id,
          project: dynamicSample.project,
          roadId: dynamicSample.roadId,
          inspectionNo: dynamicSample.inspectionId,
          status: dynamicSample.status,
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

