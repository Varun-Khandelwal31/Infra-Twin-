'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanEye, Layers, Cpu, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function InteractivePlayground() {
  const [activeLayer, setActiveLayer] = useState<'rgb' | 'segmentation' | 'depth'>('segmentation');

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-mono text-cyan-700 font-bold tracking-widest px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 shadow-xs">
          Interactive AI Playground
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
          Test the Computer Vision & Depth Engine
        </h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Toggle between raw aerial drone RGB imagery, YOLOv8 cyan segmentation boundary masks, and sub-centimeter monocular 3D depth heatmaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md">
        {/* Left Scan Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[360px] sm:h-[400px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-inner">
            {/* Base Image */}
            <img
              src="/images/indian_alligator_crack_corridor.jpg"
              alt="Indian National Highway Aerial Drone Scan"
              className="w-full h-full object-cover"
            />

            {/* Cyan Segmentation Outline */}
            {(activeLayer === 'segmentation' || activeLayer === 'depth') && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450" preserveAspectRatio="none">
                <defs>
                  <filter id="cyanGlowPlay" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M 180,140 C 230,110 320,120 370,160 C 420,200 450,270 410,340 C 370,410 270,430 200,380 C 140,330 130,240 150,180 Z"
                  fill={activeLayer === 'depth' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 217, 255, 0.2)'}
                  stroke={activeLayer === 'depth' ? '#ef4444' : '#0284c7'}
                  strokeWidth="4"
                  strokeDasharray="8, 4"
                  filter="url(#cyanGlowPlay)"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Depth Heatmap Overlay Effect */}
            {activeLayer === 'depth' && (
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-amber-950/40 to-blue-950/40 mix-blend-color-dodge pointer-events-none" />
            )}

            {/* Layer Control Pills */}
            <div className="absolute top-4 left-4 z-20 flex items-center bg-white/95 p-1.5 rounded-xl border border-slate-200 text-xs shadow-xs backdrop-blur-md">
              <button
                onClick={() => setActiveLayer('rgb')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'rgb'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw RGB Scan
              </button>
              <button
                onClick={() => setActiveLayer('segmentation')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'segmentation'
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                YOLOv8 Mask
              </button>
              <button
                onClick={() => setActiveLayer('depth')}
                className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                  activeLayer === 'depth'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3D Depth Mesh
              </button>
            </div>

            <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-white/90 border border-slate-200 text-[11px] font-mono text-cyan-700 shadow-xs backdrop-blur-md">
              Connaught Place • IR-2025-05-27
            </div>
          </div>
        </div>

        {/* Right Telemetry Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 mb-1 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Volumetric Inference</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display">
              Outer Ring Road Pothole #104
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Drone altitude: 12 meters • Resolution: 0.8 cm/pixel • Sub-centimeter accuracy
            </p>
          </div>

          {/* Metrics List */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-mono">Surface Area</div>
              <div className="text-base font-bold text-slate-900 font-display mt-0.5">2.5 sqm (±0.15)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-mono">Max Depth</div>
              <div className="text-base font-bold text-rose-600 font-display mt-0.5">15.0 cm (±1.2)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-mono">Volume Displacement</div>
              <div className="text-base font-bold text-cyan-700 font-display mt-0.5">0.375 m³</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 shadow-xs">
              <div className="text-[10px] text-slate-500 font-mono">Severity Score</div>
              <div className="text-base font-bold text-amber-600 font-display mt-0.5">98.7% Critical</div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/audit?sample=sample-1"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-sm hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Full Audit Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/copilot?sample=sample-1"
              className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 hover:border-cyan-300 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Generate IRC BOQ</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
