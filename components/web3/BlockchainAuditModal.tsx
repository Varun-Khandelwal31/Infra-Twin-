'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Copy,
  Layers,
  CheckCircle2,
  Lock,
  Download,
  AlertTriangle,
  Coins,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { OnChainAuditRecord } from '@/lib/web3/types';
import { downloadJSON } from '@/lib/exportUtils';

interface BlockchainAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: OnChainAuditRecord | null;
}

export default function BlockchainAuditModal({
  isOpen,
  onClose,
  record,
}: BlockchainAuditModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !record) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleExportReceipt = () => {
    downloadJSON(
      `InfraTwin_OnChain_Receipt_${record.inspectionId}_${record.receipt.blockNumber}.json`,
      record
    );
  };

  const isFrozen = record.escrowStatus === 'PAYMENT_FROZEN' || record.isFraud;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Polygon Amoy Verified
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Block #{record.receipt.blockNumber}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display mt-0.5 flex items-center gap-2">
                <span>Proof of Infrastructure Audit (PoIA)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Cryptographic Merkle Tree &amp; Smart Contract Escrow State
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Copy Notification Toast */}
        {copiedField && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{copiedField} copied to clipboard!</span>
          </div>
        )}

        {/* On-Chain Provenance Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Smart Contract Escrow State</div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  isFrozen
                    ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
                }`}
              >
                {isFrozen ? '🔒 PAYMENT_FROZEN (FRAUD ALERT)' : '🟢 APPROVED_RELEASED'}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Blockchain Network</div>
            <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-1.5 pt-0.5">
              <Coins className="w-4 h-4 text-purple-600" />
              <span>{record.receipt.network}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">Gas: {record.receipt.gasUsed}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Target Highway Asset</div>
            <div className="text-sm font-bold text-cyan-800 font-display truncate pt-0.5">
              {record.roadName}
            </div>
            <div className="text-[10px] font-mono text-slate-500 truncate">Contractor: {record.contractor}</div>
          </div>
        </div>

        {/* Transaction Hash Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-800">
              <Lock className="w-3.5 h-3.5" />
              <span>ON-CHAIN TRANSACTION HASH (POLYGON AMOY)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(record.receipt.txHash, 'Transaction Hash')}
                className="text-[10px] font-mono text-slate-700 hover:text-slate-900 px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Tx</span>
              </button>
              <a
                href={record.receipt.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono text-purple-700 hover:text-purple-900 px-2 py-1 rounded bg-purple-50 border border-purple-200 hover:bg-purple-100 flex items-center gap-1 transition-colors"
              >
                <span>Polygonscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white font-mono text-xs text-slate-800 break-all border border-slate-200 select-all">
            {record.receipt.txHash}
          </div>
        </div>

        {/* Merkle Root & Leaves Tree Viewer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700">
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>CRYPTOGRAPHIC MERKLE TREE LEAVES ({record.merkleProof.leaves.length} NODES)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Merkle Depth: {record.merkleProof.depth} Levels
            </span>
          </div>

          {/* Merkle Root Banner */}
          <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-200 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="min-w-0">
              <div className="text-[10px] text-cyan-800 font-bold uppercase">Root Hash (Anchored in State)</div>
              <div className="text-slate-900 font-bold truncate mt-0.5">{record.merkleProof.root}</div>
            </div>
            <button
              onClick={() => handleCopy(record.merkleProof.root, 'Merkle Root')}
              className="p-1.5 rounded-lg bg-white border border-cyan-200 text-slate-600 hover:text-slate-900 shrink-0 shadow-2xs"
              title="Copy Merkle Root"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Leaf Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
            {record.merkleProof.leaves.map((leaf, idx) => (
              <div
                key={leaf.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-cyan-400 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyan-800 font-bold">Leaf #{idx + 1}: {leaf.label}</span>
                  <button
                    onClick={() => handleCopy(leaf.hash, leaf.label)}
                    className="text-slate-400 hover:text-cyan-700"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[10px] font-mono text-slate-600 break-all">
                  {leaf.hash.slice(0, 24)}...{leaf.hash.slice(-16)}
                </div>
                <div className="text-[9px] font-sans text-slate-500 truncate">
                  Payload: {leaf.dataSummary}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-600" />
            <span>Contract: {record.receipt.toContract.slice(0, 14)}...</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReceipt}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export On-Chain Receipt (.json)</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
