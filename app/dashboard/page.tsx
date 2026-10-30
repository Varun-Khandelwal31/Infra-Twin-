'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import RoadHealthGauge from '@/components/dashboard/RoadHealthGauge';
import FinancialTicker from '@/components/dashboard/FinancialTicker';
import LiveAlertFeed from '@/components/dashboard/LiveAlertFeed';
import DigitalTwin3DScene from '@/components/dashboard/DigitalTwin3DScene';
import { INSPECTION_SAMPLES } from '@/lib/mockInference';
import { Route, AlertTriangle, ShieldCheck, Activity, Clock } from 'lucide-react';
import VengenceCard from '@/components/ui/VengenceCard';

function useAnimatedCounter(target: number, duration: number = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.round(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
}

function useLiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function DashboardPage() {
  const clock = useLiveClock();

  // Live simulated counters that tick up slightly over time
  const [auditedKm, setAuditedKm] = useState(1840);
  const [droneSorties, setDroneSorties] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setAuditedKm((prev) => prev + Math.floor(Math.random() * 3));
      setDroneSorties((prev) => (Math.random() > 0.7 ? Math.min(prev + 1, 18) : prev));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const animatedKm = useAnimatedCounter(auditedKm, 2000);
  const activePotholes = INSPECTION_SAMPLES.filter(
    (s) => s.metrics.severityIndex === 'High' || s.metrics.severityIndex === 'Critical'
  ).length;
  const totalPotholes = INSPECTION_SAMPLES.length;

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Status Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <h1 className="text-xl font-bold text-slate-900 font-display tracking-tight">
                  🇮🇳 Pan-India Smart Infrastructure Command Center
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-Time Drone LiDAR Audits • 28 States &amp; 8 UTs • Financial Escrow Governance
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono">
              {/* Live IST Clock */}
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-cyan-800 flex items-center gap-2 shadow-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-bold tabular-nums">{clock || '--:--:-- --'}</span>
                <span className="text-slate-500">IST</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <span className="text-cyan-700 font-bold">Pan-India Active</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                IRC:82 Engine
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar — Clean Vengence 3D Tilt Spotlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <VengenceCard glowColor="cyan" className="p-4 flex items-center justify-between bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Total Audited Stretch</div>
                <div className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-0.5">
                  {animatedKm.toLocaleString()} km
                </div>
                <div className="text-[10px] font-mono text-cyan-700 mt-0.5 font-medium">National Highway Network</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shrink-0">
                <Route className="w-5 h-5" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="rose" className="p-4 flex items-center justify-between bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Active Critical Voids</div>
                <div className="text-2xl font-bold text-rose-600 font-display mt-0.5">{activePotholes} Critical</div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{totalPotholes} sites monitored</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="amber" className="p-4 flex items-center justify-between bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Escrow Fraud Defense</div>
                <div className="text-2xl font-bold text-amber-600 font-display mt-0.5">3 Blocked</div>
                <div className="text-[10px] font-mono text-amber-700 mt-0.5 font-medium">₹26.2L held in escrow</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </VengenceCard>

            <VengenceCard glowColor="emerald" className="p-4 flex items-center justify-between bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500">Active Drone Sorties</div>
                <div className="text-2xl font-bold text-emerald-600 font-display mt-0.5">{droneSorties} Flying</div>
                <div className="text-[10px] font-mono text-emerald-700 mt-0.5 font-medium">Autonomous LiDAR feed</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
            </VengenceCard>
          </div>

          {/* Core Grid: Health Index + Financial Ticker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <RoadHealthGauge score={74} />
            </div>

            <div className="lg:col-span-7">
              <FinancialTicker />
            </div>
          </div>

          {/* Secondary Grid: Live Alert Feed + 3D Digital Twin Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <LiveAlertFeed />
            </div>

            <div className="lg:col-span-5">
              <DigitalTwin3DScene />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
