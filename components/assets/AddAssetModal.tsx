'use client';

import React, { useState } from 'react';
import { Layers, X, Plus, Sparkles, Navigation, Route, Camera, Cpu } from 'lucide-react';

export interface AssetItem {
  id: string;
  name: string;
  category: 'Drone Fleet' | 'Pavement Stretch' | 'Sensors & Hardware' | 'Edge Computing';
  location: string;
  status: 'OPERATIONAL' | 'MONITORED' | 'UNDER_MAINTENANCE';
  health: string;
  lastMaintenance: string;
  estValue: string;
  serialNo: string;
}

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newAsset: AssetItem) => void;
}

export default function AddAssetModal({ isOpen, onClose, onAdd }: AddAssetModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Drone Fleet' | 'Pavement Stretch' | 'Sensors & Hardware' | 'Edge Computing'>('Drone Fleet');
  const [location, setLocation] = useState('NDMC Smart Zone 4');
  const [serialNo, setSerialNo] = useState('');
  const [estValue, setEstValue] = useState('₹15.0 Lakhs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const idNumber = Math.floor(100 + Math.random() * 900);
    const categoryPrefix =
      category === 'Drone Fleet'
        ? 'AST-DR'
        : category === 'Pavement Stretch'
        ? 'AST-RD'
        : category === 'Sensors & Hardware'
        ? 'AST-CAM'
        : 'AST-EDGE';

    const newAsset: AssetItem = {
      id: `${categoryPrefix}-${idNumber}`,
      name: name.trim(),
      category,
      location: location.trim(),
      status: 'OPERATIONAL',
      health: '98%',
      lastMaintenance: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      estValue: estValue.startsWith('₹') ? estValue : `₹${estValue}`,
      serialNo: serialNo.trim() || `${categoryPrefix}-UAV-2025-${idNumber}`,
    };

    onAdd(newAsset);
    setName('');
    setSerialNo('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col text-slate-800 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">Register New Infrastructure Asset</h2>
              <p className="text-[11px] text-slate-500">Add UAV, Road Segment, Sensor Pod, or Edge Node to Smart City Grid</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-mono block mb-1.5 font-medium">Asset Name &amp; Model</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Matrice 350 RTK Laser Volumetric Drone"
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-mono block mb-1.5 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-cyan-800 font-mono focus:bg-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Drone Fleet">Drone Fleet (UAV)</option>
                <option value="Pavement Stretch">Pavement Stretch</option>
                <option value="Sensors & Hardware">Sensors & Hardware</option>
                <option value="Edge Computing">Edge Computing</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-mono block mb-1.5 font-medium">Zone / Base Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. NDMC Central Hub"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-mono block mb-1.5 font-medium">Serial / Asset Tag ID</label>
              <input
                type="text"
                value={serialNo}
                onChange={(e) => setSerialNo(e.target.value)}
                placeholder="e.g. M350-RTK-2025-915"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-700 font-mono block mb-1.5 font-medium">Estimated Asset Valuation</label>
              <input
                type="text"
                value={estValue}
                onChange={(e) => setEstValue(e.target.value)}
                placeholder="e.g. ₹18.5 Lakhs"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>Asset will be integrated with PM Gati Shakti &amp; DGCA DigitalSky live node.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
