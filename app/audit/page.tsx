'use client';

import React, { useState, useRef, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import DroneOverlayViewer from '@/components/audit/DroneOverlayViewer';
import DepthHeatmapCanvas from '@/components/audit/DepthHeatmapCanvas';
import Pothole3DViewer from '@/components/audit/Pothole3DViewer';
import MetricsSidebar from '@/components/audit/MetricsSidebar';
import { INSPECTION_SAMPLES, InspectionData } from '@/lib/mockInference';
import { analyzeSinglePotholeImageAsync } from '@/lib/imageAnalyzer';
import { Cpu, Upload, Image as ImageIcon, Sparkles, Sliders, Box, Camera, BarChart2 } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

function AuditContent() {
  const searchParams = useSearchParams();
  const sampleId = searchParams.get('sample');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [samplesList, setSamplesList] = useState<InspectionData[]>(INSPECTION_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<InspectionData>(
    INSPECTION_SAMPLES.find((s) => s.id === sampleId) || INSPECTION_SAMPLES[0]
  );
  const [activeViewerTab, setActiveViewerTab] = useState<'3d' | 'drone' | 'heatmap'>('3d');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  // Dynamic Physical Calibration State
  const [flightAltitude, setFlightAltitude] = useState<number>(12.4);
  const [depthScale, setDepthScale] = useState<number>(1.0);

  // Store unscaled base metrics for consistent multiplier adjustments
  const baseMetricsRef = useRef<{ area: number; maxDepth: number; avgDepth: number }>({
    area: selectedSample.metrics.areaSqm,
    maxDepth: selectedSample.metrics.maxDepthCm,
    avgDepth: selectedSample.metrics.avgDepthCm,
  });

  const handleSampleChange = (sample: InspectionData) => {
    setIsScanning(true);
    setScanProgress(15);

    baseMetricsRef.current = {
      area: sample.metrics.areaSqm,
      maxDepth: sample.metrics.maxDepthCm,
      avgDepth: sample.metrics.avgDepthCm,
    };

    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setSelectedSample(sample);
          return 100;
        }
        return p + 25;
      });
    }, 150);
  };

  // Live Altitude Adjuster (Recalculates GSD, Physical Area & Volumetric Mass)
  const handleAltitudeChange = useCallback((newAltitude: number) => {
    setFlightAltitude(newAltitude);
    setSelectedSample((prev) => {
      const baseArea = baseMetricsRef.current.area || 2.5;
      const baseDepth = baseMetricsRef.current.maxDepth || 15.0;

      const newArea = Number((baseArea * (newAltitude / 12.4)).toFixed(2));
      const currentMaxDepth = Number((baseDepth * depthScale).toFixed(1));
      const currentAvgDepth = Number((currentMaxDepth * 0.62).toFixed(1));
      const newVolume = Number(((newArea * (currentAvgDepth / 100))).toFixed(3));

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          areaSqm: newArea,
          volumeCum: newVolume,
        },
      };
    });
  }, [depthScale]);

  // Live Depth Scale Adjuster (Recalculates 3D Extrusion, Depth & Volumetric Index)
  const handleDepthScaleChange = useCallback((newScale: number) => {
    setDepthScale(newScale);
    setSelectedSample((prev) => {
      const baseDepth = baseMetricsRef.current.maxDepth || 15.0;
      const currentArea = prev.metrics.areaSqm;

      const newMaxDepth = Number((baseDepth * newScale).toFixed(1));
      const newAvgDepth = Number((newMaxDepth * 0.62).toFixed(1));
      const newVolume = Number(((currentArea * (newAvgDepth / 100))).toFixed(3));

      return {
        ...prev,
        metrics: {
          ...prev.metrics,
          maxDepthCm: newMaxDepth,
          avgDepthCm: newAvgDepth,
          volumeCum: newVolume,
          severityIndex: newMaxDepth > 16 ? 'Critical' : newMaxDepth > 9 ? 'High' : 'Moderate',
        },
      };
    });
  }, []);

  // Real-Time Computer Vision Photo Analysis for Custom Uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setIsScanning(true);
        setScanProgress(20);

        try {
          // Run actual canvas-level pixel segmentation and depth extraction
          const analysis = await analyzeSinglePotholeImageAsync(dataUrl, {
            altitudeM: flightAltitude,
            depthScale: depthScale,
          });

          const customId = `custom-${Date.now().toString().slice(-5)}`;
          const customInspection: InspectionData = {
            id: customId,
            inspectionNo: `INSP-CV-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString(),
            roadName: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'User Custom Road Inspection',
            distressType: analysis.severityIndex === 'Critical'
              ? 'Critical Structural Pothole & Sub-base Failure'
              : 'Asphalt Pothole & Cavity Void',
            metrics: {
              areaSqm: analysis.areaSqm,
              areaTol: 0.15,
              maxDepthCm: analysis.maxDepthCm,
              maxDepthTol: 1.2,
              avgDepthCm: analysis.avgDepthCm,
              avgDepthTol: 0.8,
              volumeCum: analysis.volumeCum,
              volumeTol: 0.05,
              perimeterM: analysis.perimeterM,
              perimeterTol: 0.25,
              severityIndex: analysis.severityIndex,
              confidenceScore: analysis.confidenceScore,
            },
            location: {
              address: 'Uploaded Drone Survey Scan (GPS Tagged)',
              lat: 28.6139,
              lng: 77.2090,
              ward: 'Ward 18 - Dynamic Inspection',
              zone: 'Smart Infrastructure Zone',
            },
            recommendedAction: {
              headline: analysis.maxDepthCm > 15 ? 'Emergency Full-Depth Saw-Cut Restoration' : 'Bituminous Patch Restoration',
              subtext: `Live Pixel Audit: Area ${analysis.areaSqm} m², Max Depth ${analysis.maxDepthCm} cm, Volumetric Mass ${analysis.volumeCum} m³. IRC:82-2023 compliant.`,
              ircClause: 'IRC:82-2023 Section 4.3.2 & MoRTH Clause 3004',
            },
            segmentationPath: analysis.segmentationPath,
            depthGrid: analysis.depthGrid,
            imageUrl: dataUrl,
            galleryImages: [
              { id: `${customId}-1`, label: 'Uploaded Custom Photo', type: 'RGB Drone', url: dataUrl },
              { id: `${customId}-2`, label: 'Thermal IR Scan Matrix', type: 'Thermal IR', url: '/images/indian_pothole_1.png' },
              { id: `${customId}-3`, label: '45° Oblique Perspective', type: 'Oblique 45°', url: '/images/indian_flyover_joint_oblique.jpg' },
              { id: `${customId}-4`, label: 'Pothole Macro Close-up', type: 'Close-up Macro', url: '/images/indian_pothole_severe_before.jpg' },
            ],
          };

          baseMetricsRef.current = {
            area: analysis.areaSqm,
            maxDepth: analysis.maxDepthCm,
            avgDepth: analysis.avgDepthCm,
          };

          setSamplesList((prev) => [customInspection, ...prev]);
          setSelectedSample(customInspection);
          setIsScanning(false);
          setScanProgress(100);
        } catch (err) {
          console.error('Failed to analyze photo:', err);
          setIsScanning(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Projects</span>
          <span>&gt;</span>
          <span className="text-slate-700 font-semibold">{selectedSample.location.zone || 'Pan-India Smart Corridors'}</span>
          <span>&gt;</span>
          <span className="text-cyan-700 font-bold">Inspection: {selectedSample.inspectionNo}</span>
        </div>

        {/* Hidden File Input for Custom Road Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Upload Custom Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Drone / Mobile Photo</span>
        </button>
      </div>

      {/* Sample Selector Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>Active Road Feeds ({samplesList.length} Sites):</span>
          <span className="hidden sm:inline text-slate-500">Select any road or upload custom scan</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {/* Custom Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-cyan-300 bg-cyan-50/70 hover:bg-cyan-100/60 text-cyan-800 transition-all text-left shrink-0 shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-bold text-cyan-800">+ Custom Scan</span>
              <span className="text-[10px] text-cyan-600 font-mono">Run YOLOv8</span>
            </div>
          </button>

          {samplesList.map((s) => {
            const isSelected = selectedSample.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSampleChange(s)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all text-left shrink-0 shadow-xs ${
                  isSelected
                    ? 'bg-cyan-50 text-cyan-900 border-cyan-400 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <img
                  src={s.imageUrl}
                  alt={s.roadName}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="flex flex-col text-xs pr-1">
                  <span className="font-bold font-display truncate max-w-[140px] text-slate-900">{s.roadName.split('(')[0]}</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">{s.metrics.severityIndex} • {s.metrics.maxDepthCm}cm</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Processing Loader */}
      {isScanning && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 font-mono text-xs animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-700 font-bold">
              <Cpu className="w-4 h-4 text-cyan-600 animate-spin" />
              <span>AI VOLUMETRIC INFERENCE ({scanProgress}%)</span>
            </div>
            <span className="text-[10px] text-slate-500">YOLOv8-Seg &amp; Depth-Anything</span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-150"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Viewport Switcher + Active 3D/Drone View + Calibration */}
        <div className="lg:col-span-8 space-y-4">
          {/* Viewport Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-xs backdrop-blur-xl">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveViewerTab('3d')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeViewerTab === '3d'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D LiDAR Twin (Three.js)</span>
              </button>

              <button
                onClick={() => setActiveViewerTab('drone')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeViewerTab === 'drone'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Drone Aerial &amp; Mask</span>
              </button>

              <button
                onClick={() => setActiveViewerTab('heatmap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  activeViewerTab === 'heatmap'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>2D Heatmap</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500 px-2 hidden sm:inline">
              WebGL 3D Acceleration Active
            </span>
          </div>

          {/* Active Viewport Container */}
          {activeViewerTab === '3d' && (
            <Pothole3DViewer
              sample={selectedSample}
              depthScale={depthScale}
              flightAltitudeM={flightAltitude}
            />
          )}

          {activeViewerTab === 'drone' && (
            <DroneOverlayViewer sample={selectedSample} />
          )}

          {activeViewerTab === 'heatmap' && (
            <DepthHeatmapCanvas
              sample={selectedSample}
              flightAltitudeM={flightAltitude}
              depthScale={depthScale}
              onAltitudeChange={handleAltitudeChange}
              onDepthScaleChange={handleDepthScaleChange}
            />
          )}

          {/* Clean Physical Calibration Strip */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-slate-800 font-bold">
              <span className="flex items-center gap-1.5 text-cyan-700">
                <Sliders className="w-3.5 h-3.5" />
                <span>PHYSICAL TELEMETRY &amp; SCALE CALIBRATION</span>
              </span>
              <span className="text-[10px] text-slate-500">Live 3D Geometry Sync</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Flight Altitude:</span>
                  <span className="text-cyan-700 font-bold">{flightAltitude.toFixed(1)} m AGL</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="0.5"
                  value={flightAltitude}
                  onChange={(e) => handleAltitudeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600">Depth Metric Extrusion:</span>
                  <span className="text-amber-700 font-bold">{depthScale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={depthScale}
                  onChange={(e) => handleDepthScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Cleaned-up Metrics & Actions */}
        <div className="lg:col-span-4">
          <MetricsSidebar
            sample={selectedSample}
            flightAltitudeM={flightAltitude}
            depthScale={depthScale}
          />
        </div>
      </div>
    </>
  );
}

export default function AuditPage() {
  return (
    <div className="flex h-screen bg-transparent text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Suspense fallback={<div className="p-8 text-xs font-mono text-cyan-600">Loading Audit Studio...</div>}>
            <AuditContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
