'use client';

import React from 'react';
import { Camera, Cpu, Bot, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Camera,
    title: 'Autonomous Drone Sortie',
    desc: 'Drones capture high-resolution RGB and multispectral road surface imagery across city wards.',
    color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'YOLOv8 & 3D Depth Engine',
    desc: 'Sub-centimeter segmentation masks trace distress boundaries and construct WebGL 3D depth heatmaps.',
    color: 'text-purple-700 border-purple-200 bg-purple-50',
  },
  {
    num: '03',
    icon: Bot,
    title: 'Nirman Copilot (Groq Llama-3)',
    desc: 'Generates IRC:82-2023 compliant BOQs, material schedules, cost estimates, and carbon footprints.',
    color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: 'Contractor SLA & Fraud Freeze',
    desc: 'Compares post-repair scans with claimed material volumes to automatically freeze fraudulent contractor payments.',
    color: 'text-rose-700 border-rose-200 bg-rose-50',
  },
];

export default function WorkflowPipeline() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-xs uppercase font-mono text-cyan-700 font-bold tracking-widest px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 shadow-xs">
          Autonomous Audit Pipeline
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mt-3">
          How InfraTwin AI Governs Smart City Roads
        </h2>
        <p className="text-slate-600 text-sm mt-2">
          From raw aerial drone flight to automated statutory compliance and contractor payment release.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-slate-300 group-hover:text-cyan-600 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-display mb-2 group-hover:text-cyan-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
