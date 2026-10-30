'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SLAVerificationData } from '@/lib/mockInference';
import { CheckCircle2, ShieldAlert, Cpu, Sliders, Columns, Eye } from 'lucide-react';

interface BeforeAfterViewerProps {
  sample: SLAVerificationData;
}

export default function BeforeAfterViewer({ sample }: BeforeAfterViewerProps) {
  const isApproved = sample.status === 'APPROVED';
  const [sliderPos, setSliderPos] = useState(50); // 50% split default
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handlePointerMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-md p-3 space-y-3 text-slate-800">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 font-display uppercase tracking-wider">
            Orthomosaic Differencing Studio
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">
            {isApproved ? 'SLA PASSED' : 'FRAUD ALERT'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'split' ? 'side-by-side' : 'split')}
            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 hover:text-cyan-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {viewMode === 'split' ? <Columns className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{viewMode === 'split' ? 'Side-by-Side View' : 'Split Slider View'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        /* Interactive Draggable Split-View Scan Container */
        <div
          ref={containerRef}
          className="relative h-[380px] rounded-xl overflow-hidden border border-slate-300 select-none cursor-ew-resize group shadow-xs"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={onMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={onTouchMove}
        >
          {/* Base Layer: After Repair Image (Underneath) */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={sample.afterScan.imageUrl}
              alt="After Repair Drone Scan"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-emerald-300 text-xs text-right shadow-xs">
              <span className="font-bold text-emerald-700">After Repair (Drone Scan)</span>
              <span className="block text-[10px] text-slate-500 font-mono">
                Captured: {sample.afterScan.capturedOn}
              </span>
            </div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
              <defs>
                <filter id="greenGlowViewer" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d={sample.afterScan.path}
                fill={isApproved ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                stroke={isApproved ? '#10b981' : '#ef4444'}
                strokeWidth="4"
                strokeDasharray={isApproved ? 'none' : '8, 4'}
                filter="url(#greenGlowViewer)"
                className="animate-pulse"
              />
            </svg>

            <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-white/90 border border-emerald-300 text-xs font-mono text-emerald-800 font-bold shadow-xs">
              Verified: {sample.afterScan.area}
            </div>
          </div>

          {/* Clipped Top Layer: Before Repair Image */}
          <div
            className="absolute top-0 left-0 bottom-0 overflow-hidden border-r-2 border-cyan-500 z-10 shadow-2xl transition-all duration-75"
            style={{ width: `${sliderPos}%` }}
          >
            <div style={{ width: `${containerWidth}px`, height: '100%', position: 'relative' }}>
              <img
                src={sample.beforeScan.imageUrl}
                alt="Before Repair Drone Scan"
                className="w-full h-full object-cover"
              />

              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-rose-300 text-xs shadow-xs">
                <span className="font-bold text-rose-700">Before Repair (Void Scan)</span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  Captured: {sample.beforeScan.capturedOn}
                </span>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                <defs>
                  <filter id="redGlowViewer" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d={sample.beforeScan.path}
                  fill="rgba(239, 68, 68, 0.35)"
                  stroke="#ef4444"
                  strokeWidth="4"
                  filter="url(#redGlowViewer)"
                  className="animate-pulse"
                />
              </svg>

              <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-md bg-white/90 border border-rose-300 text-xs font-mono text-rose-800 font-bold shadow-xs">
                Void: {sample.beforeScan.area}
              </div>
            </div>
          </div>

          {/* Center Draggable Split Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ left: `calc(${sliderPos}% - 16px)` }}
          >
            <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center shadow-md border-2 border-white text-xs">
              ↔
            </div>
          </div>

          {/* Center Floating AI VERIFICATION Badge */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl flex flex-col items-center justify-center text-center pointer-events-none">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 font-mono mb-0.5">
              <Cpu className="w-4 h-4 text-cyan-600 animate-spin" />
              <span>REAL-TIME AI VERIFICATION</span>
            </div>

            <div className="text-[10px] text-slate-500 uppercase tracking-tight">Repair Quality Score</div>
            <div
              className={`text-2xl font-black font-display ${
                isApproved ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {sample.repairQualityScore}%
            </div>

            <div
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold font-mono border flex items-center gap-1 mt-0.5 ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isApproved ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>SLA APPROVED</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                  <span>FRAUD DETECTED</span>
                </>
              )}
            </div>
          </div>

          {/* Bottom Split Slider Instructions Bar */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[10px] font-mono text-slate-700 shadow-xs pointer-events-none flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-cyan-600" />
            <span>Drag slider handle horizontally to compare before vs after repair scans</span>
          </div>
        </div>
      ) : (
        /* Side-by-Side Dual Scan Viewers */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-[340px] rounded-xl overflow-hidden border border-rose-200 bg-slate-50 shadow-xs">
            <img
              src={sample.beforeScan.imageUrl}
              alt="Pre-Repair Scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-lg bg-white/90 border border-rose-200 text-xs text-rose-700 font-bold shadow-xs">
              Before Repair: {sample.beforeScan.area} Void
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
              <path
                d={sample.beforeScan.path}
                fill="rgba(239, 68, 68, 0.35)"
                stroke="#ef4444"
                strokeWidth="4"
                className="animate-pulse"
              />
            </svg>
          </div>

          <div className="relative h-[340px] rounded-xl overflow-hidden border border-emerald-200 bg-slate-50 shadow-xs">
            <img
              src={sample.afterScan.imageUrl}
              alt="Post-Repair Scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-lg bg-white/90 border border-emerald-200 text-xs text-emerald-700 font-bold shadow-xs">
              After Repair: {sample.afterScan.area} Restored
            </div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
              <path
                d={sample.afterScan.path}
                fill={isApproved ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                stroke={isApproved ? '#10b981' : '#ef4444'}
                strokeWidth="4"
                strokeDasharray={isApproved ? 'none' : '8, 4'}
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
