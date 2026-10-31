'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, ShieldCheck, Route, Zap } from 'lucide-react';

const STATS = [
  {
    icon: IndianRupee,
    value: '₹142.8 Lakhs',
    label: 'Municipal Budget Saved',
    subtext: 'Through fraud prevention & early repairs',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    icon: Route,
    value: '1,840+ km',
    label: 'Road Stretch Audited',
    subtext: 'Across 28 States, 8 UTs & National Corridors',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    icon: Zap,
    value: '4.2x Faster',
    label: 'Audit Cycle Speed',
    subtext: 'Drone AI vs Manual PWD Surveys',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  {
    icon: ShieldCheck,
    value: '99.4%',
    label: 'SLA Verification Accuracy',
    subtext: 'Sub-centimeter volumetric depth audit',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
];

export default function TickerCounter() {
  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs relative overflow-hidden group hover:shadow-md hover:border-cyan-300 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.iconColor} shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded border ${stat.badgeColor}`}>
                  Live Ticker
                </span>
              </div>
              <div className="text-3xl font-extrabold tracking-tight font-display text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.subtext}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
