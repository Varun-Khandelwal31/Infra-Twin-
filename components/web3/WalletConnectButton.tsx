'use client';

import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Copy,
  Coins,
  Shield,
} from 'lucide-react';
import { DEFAULT_MUNICIPAL_WALLET } from '@/lib/web3/blockchainService';
import { BlockchainNetwork } from '@/lib/web3/types';

export default function WalletConnectButton() {
  const [wallet, setWallet] = useState(DEFAULT_MUNICIPAL_WALLET);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSwitchNetwork = (network: BlockchainNetwork) => {
    setWallet((prev) => ({ ...prev, network }));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-mono transition-all shadow-xs active:scale-95 cursor-pointer"
      >
        <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
        <Wallet className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        <span className="text-purple-800 font-bold hidden sm:inline">
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-200 text-purple-800">
          Amoy
        </span>
        <ChevronDown className="w-3 h-3 text-purple-700" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-purple-200 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-slate-800 font-sans text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-900 font-display">Municipal Auditor Keycard</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
              Active
            </span>
          </div>

          {/* Account Address Box */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
            <div className="text-[10px] text-slate-500 flex items-center justify-between">
              <span>Auditor Address</span>
              <button
                onClick={handleCopyAddress}
                className="text-purple-700 hover:text-purple-900 text-[10px] flex items-center gap-1 font-semibold"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-800 break-all select-all font-bold">
              {wallet.address}
            </div>
          </div>

          {/* Balance & Role */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[9px] text-slate-500">Treasury Gas</div>
              <div className="font-bold text-purple-700 flex items-center gap-1 mt-0.5">
                <Coins className="w-3 h-3 text-purple-600" />
                <span>{wallet.balanceMatic}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[9px] text-slate-500">Authorized Role</div>
              <div className="font-bold text-emerald-700 truncate mt-0.5">Chief Engineer</div>
            </div>
          </div>

          {/* Switch Network */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 font-mono text-[11px]">
            <div className="text-[10px] text-slate-500">Target Settlement Network:</div>
            <div className="space-y-1">
              {(['Polygon Amoy', 'Arbitrum Sepolia', 'Hyperledger Besu (Gov Intranet)'] as BlockchainNetwork[]).map(
                (net) => (
                  <button
                    key={net}
                    onClick={() => handleSwitchNetwork(net)}
                    className={`w-full p-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                      wallet.network === net
                        ? 'bg-purple-100 text-purple-900 border border-purple-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span>{net}</span>
                    {wallet.network === net && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Block Explorer Link */}
          <a
            href={`https://amoy.polygonscan.com/address/${wallet.address}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors font-medium"
          >
            <span>View on Polygonscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
