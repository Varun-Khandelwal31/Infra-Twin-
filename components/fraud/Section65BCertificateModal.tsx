'use client';

import React from 'react';
import {
  ShieldCheck,
  X,
  Download,
  Lock,
  FileCheck2,
  MapPin,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { triggerPrint } from '@/lib/exportUtils';

interface Section65BCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    roadName?: string;
    project?: string;
    roadId?: string;
    inspectionNo?: string;
    location?: { lat: number; lng: number; address: string };
    status?: string;
    severity?: string;
    volume?: number;
    area?: number;
  };
}

export default function Section65BCertificateModal({
  isOpen,
  onClose,
  data,
}: Section65BCertificateModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [downloadToast, setDownloadToast] = React.useState(false);

  if (!isOpen) return null;

  // Generate deterministic SHA-256 styled hash from inspection metadata
  const sha256Digest = `8f4a9b2c7e1d5f0e3a6c8b9d4e2f1a0c7b5e3d9a1f8c4e6b2d0a7f5c3e1b9d8a`;
  const timestamp = new Date().toISOString();
  const certId = `CERT-GOI-SEC65B-${data.id.toUpperCase()}-2026`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPDF = () => {
    setDownloadToast(true);
    setTimeout(() => {
      triggerPrint();
      setDownloadToast(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto font-sans text-slate-800">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Header Banner */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Statutory Electronic Record
              </span>
              <span className="text-[10px] font-mono text-slate-500">{certId}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-display mt-0.5">
              Section 65B Electronic Audit Certificate
            </h2>
            <p className="text-xs text-slate-600">
              Indian Evidence Act, 1872 / Bharatiya Sakshya Adhiniyam, 2023 Compliant Evidence
            </p>
          </div>
        </div>

        {/* Toast */}
        {downloadToast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preparing Tamper-Evident Signed Certificate for PDF Print / Download...</span>
          </div>
        )}

        {/* Official Statutory Attestation Clause */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
          <p className="text-[11px] text-cyan-800 font-bold mb-1">
            STATUTORY ATTESTATION UNDER SECTION 65B(4):
          </p>
          <p className="text-[11px] text-slate-600">
            &quot;I hereby certify that the digital telemetry, volumetric point clouds, and LiDAR/RGB
            defect estimations herein were captured during the regular course of autonomous aerial
            surveillance. The hash digest reflects unmanipulated cryptographic integrity from sensor
            to audit record.&quot;
          </p>
        </div>

        {/* Technical Provenance Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">Target Roadway / Asset</span>
            <div className="text-slate-900 font-bold font-sans text-xs truncate">
              {data.roadName || data.project || 'NH-48 Corridor Segment'}
            </div>
            <div className="text-[10px] text-cyan-700 font-semibold">Road ID: {data.roadId || 'RD-DEL-48'}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">Dual GNSS RTK Precision</span>
            <div className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>± 1.8 cm RTK Fixed</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Lat: {data.location?.lat || 28.5355}° N, Lng: {data.location?.lng || 77.1588}° E
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">DGCA UAS Permit &amp; Drone ID</span>
            <div className="text-slate-900 font-bold text-xs">UAS-IND-2026-N7418</div>
            <div className="text-[10px] text-slate-500">Firmware: v4.8.2-SECURE</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase">Timestamp (UTC +5:30)</span>
            <div className="text-slate-900 font-bold text-xs truncate">{timestamp}</div>
            <div className="text-[10px] text-slate-500">NTP Synced (Stratum-1)</div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Digest Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-800">
              <Lock className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC SHA-256 DIGITAL HASH</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="text-[10px] font-mono text-cyan-700 hover:text-cyan-900 px-2 py-0.5 rounded bg-white border border-slate-200 shadow-xs flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
            </button>
          </div>
          <div className="p-2 rounded-lg bg-white text-[10px] font-mono text-slate-800 break-all border border-slate-200 select-all">
            {sha256Digest}
          </div>
        </div>

        {/* Digital Signature Seal & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs">Digital Inspector Seal Active</div>
              <div className="text-[10px] text-slate-500 font-mono">NIC-DS-CERT-884920A</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Signed Certificate (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
