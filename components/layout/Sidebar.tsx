'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  ScanEye,
  ShieldCheck,
  Bot,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  BarChart3,
  Layers,
  Users,
  Settings,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Map View', href: '/map', icon: MapPin },
  { label: '3D AI Inspection', href: '/audit', icon: ScanEye },
  { label: 'Contractor SLA Audit', href: '/sla-verification', icon: ShieldCheck },
  { label: 'Nirman Copilot (BOQ)', href: '/copilot', icon: Bot },
  { label: 'Predictive Maintenance', href: '/predictive', icon: TrendingUp },
  { label: 'Issues Directory', href: '/issues', icon: AlertTriangle },
  { label: 'Work Orders', href: '/work-orders', icon: ClipboardList },
  { label: 'Analytics & Leaderboard', href: '/analytics', icon: BarChart3 },
  { label: 'Asset Inventory', href: '/assets', icon: Layers },
  { label: 'Operations Team', href: '/team', icon: Users },
  { label: 'System Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0b0f19] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none z-30 min-h-screen text-slate-300">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 bg-[#0b0f19]">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white font-display">InfraTwin</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono font-bold border border-cyan-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Smart City Audit Engine • NHAI</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors group relative overflow-hidden',
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform group-hover:scale-110 shrink-0',
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'
                    )}
                  />
                  <span className="font-mono">{item.label}</span>
                  {isActive && (
                    <span className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Footer Status */}
      <div className="p-3 border-t border-slate-800/80 space-y-3 bg-[#0b0f19]">
        <div className="flex items-center justify-between px-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>System Online</span>
          </div>
          <span className="font-mono text-slate-500 text-[10px]">v2.4.1</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-white">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
          />
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">Aarav Mehta</div>
            <div className="text-[10px] text-cyan-400 truncate font-mono">City Chief Engineer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
