'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Sparkles,
  Download,
  Share2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CommandPalette from '@/components/layout/CommandPalette';
import NotificationsDrawer from '@/components/layout/NotificationsDrawer';
import WalletConnectButton from '@/components/web3/WalletConnectButton';
import DataProvenanceModal from '@/components/common/DataProvenanceModal';
import { triggerPrint } from '@/lib/exportUtils';
import { Scale } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Keyboard Listener for ⌘ K / Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage('✓ Showcase URL copied to clipboard!');
        setTimeout(() => setToastMessage(null), 3500);
      }).catch(() => {
        setToastMessage('✓ Audit Link ready for sharing!');
        setTimeout(() => setToastMessage(null), 3500);
      });
    }
  };

  const handleDownloadReport = () => {
    setToastMessage('Preparing Executive Smart City Audit Report (PDF)...');
    setTimeout(() => {
      triggerPrint();
      setToastMessage(null);
    }, 600);
  };

  if (isLandingPage) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 transition-all">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-900 font-display tracking-tight">
                InfraTwin <span className="text-cyan-600">AI</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-cyan-600 transition-colors">Command Center</Link>
            <Link href="/audit" className="hover:text-cyan-600 transition-colors">3D AI Studio</Link>
            <Link href="/map" className="hover:text-cyan-600 transition-colors">Digital Twin Map</Link>
            <Link href="/copilot" className="hover:text-cyan-600 transition-colors">Nirman Copilot</Link>
            <Link href="/sla-verification" className="hover:text-cyan-600 transition-colors">Contractor SLA</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-cyan-600 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] text-cyan-700 border border-slate-200">⌘ K</kbd>
            </button>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <span>Launch Dashboard</span>
            </Link>
          </div>
        </header>

        <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="h-14 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 z-20 relative text-slate-800">
        {/* Left Pill Navigation */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
            <Link
              href="/audit"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/audit' ? 'bg-white text-cyan-800 border border-slate-200 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              AI Audit Studio
            </Link>
            <Link
              href="/map"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/map' ? 'bg-white text-cyan-800 border border-slate-200 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Digital Twin
            </Link>
            <Link
              href="/sla-verification"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/sla-verification' ? 'bg-white text-cyan-800 border border-slate-200 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              SLA Scan
            </Link>
            <Link
              href="/copilot"
              className={cn(
                'px-3 py-1 rounded-lg transition-all font-medium',
                pathname === '/copilot' ? 'bg-white text-cyan-800 border border-slate-200 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Nirman Copilot
            </Link>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-3 text-xs">
          {/* Search Command Trigger (⌘ K) */}
          <div className="relative hidden sm:flex items-center">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center justify-between w-56 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:border-cyan-400 hover:text-slate-900 transition-all font-sans text-xs"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Search telemetry...</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono text-cyan-700 border border-slate-200">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Pan-India Telemetry Stamp */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span className="text-cyan-800 font-bold">🇮🇳 Pan-India Active</span>
          </div>

          {/* Statutory Data Provenance Trigger */}
          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-cyan-800 transition-all flex items-center gap-1.5 font-mono text-xs font-bold cursor-pointer shadow-2xs"
            title="Official Data Provenance, CPWD Schedule of Rates & IRC Standards"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Data Sources</span>
          </button>

          {/* Action Buttons */}
          <button
            onClick={handleDownloadReport}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            title="Download Executive Report (PDF)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative shadow-2xs"
            title="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500" />
          </button>

          {/* Web3 Auditor Wallet Connection */}
          <WalletConnectButton />

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-sm transition-all flex items-center gap-1.5 font-mono text-xs font-bold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Audit</span>
          </button>
        </div>
      </header>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 p-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-mono font-bold shadow-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <NotificationsDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <DataProvenanceModal isOpen={isProvenanceOpen} onClose={() => setIsProvenanceOpen(false)} />
    </>
  );
}
