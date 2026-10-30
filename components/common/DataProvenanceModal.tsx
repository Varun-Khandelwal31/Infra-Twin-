'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  FileText,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award,
  Hash,
  X,
  Compass,
} from 'lucide-react';
import { PAN_INDIA_STATES } from '@/lib/panIndiaData';

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataProvenanceModal({ isOpen, onClose }: DataProvenanceModalProps) {
  const [activeTab, setActiveTab] = useState<'rates' | 'irc' | 'physics' | 'legal' | 'states'>('rates');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 font-sans">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Official Data Provenance &amp; Statutory Grounding
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  GOVT STANDARDS COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent statutory references, official Schedule of Rates (SOR), sensor physics &amp; Indian Evidence Act Section 65B certification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'rates'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Schedule of Rates (CPWD / PWD)</span>
          </button>

          <button
            onClick={() => setActiveTab('irc')}
            className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'irc'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. IRC &amp; MoRTH Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('physics')}
            className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'physics'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>3. Sensor Physics &amp; Volumetrics</span>
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'legal'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>4. Sec 65B &amp; Web3 Admissibility</span>
          </button>

          <button
            onClick={() => setActiveTab('states')}
            className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'states'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>5. Pan-India State Cost Index (36 States/UTs)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: SCHEDULE OF RATES */}
          {activeTab === 'rates' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 leading-relaxed text-slate-700">
                <strong className="text-cyan-900 block text-sm font-display mb-1">
                  Where do the BOQ costs and unit rates come from?
                </strong>
                All unit rates, labor schedules, and machinery deployment costs generated by InfraTwin AI are directly derived from the official <strong>Central Public Works Department Delhi Schedule of Rates (CPWD DSR 2023 &amp; 2024 Revisions)</strong>, published by the Directorate General of CPWD, Ministry of Housing and Urban Affairs (MoHUA), Government of India.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-cyan-700 font-mono font-bold">
                    <span>CPWD-DSR-4.2.1</span>
                    <span className="text-emerald-700 font-mono">₹64,000 / Ton</span>
                  </div>
                  <div className="font-bold text-slate-900">VG-30 Bituminous Concrete (BC Type II)</div>
                  <p className="text-[11px] text-slate-500">
                    Dense grading bituminous concrete with 5.0% - 5.4% VG-30 bitumen binder content, hot-mix plant blended, laid at 140°C - 160°C per MoRTH Section 507.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-cyan-700 font-mono font-bold">
                    <span>CPWD-DSR-5.1.4</span>
                    <span className="text-emerald-700 font-mono">₹1,650 / Ton</span>
                  </div>
                  <div className="font-bold text-slate-900">Graded Crushed Stone Aggregate (10-20mm)</div>
                  <p className="text-[11px] text-slate-500">
                    Hard basalt/traprock crushed aggregate conforming to IS:383 grading, aggregate impact value &lt; 24%, flakiness index &lt; 15%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-cyan-700 font-mono font-bold">
                    <span>MoRTH-Cl-3004.3</span>
                    <span className="text-emerald-700 font-mono">₹98 / Liter</span>
                  </div>
                  <div className="font-bold text-slate-900">Bitumen Emulsion RS-1 (Rapid-Setting Tack Coat)</div>
                  <p className="text-[11px] text-slate-500">
                    Cationic bitumen emulsion applied at 0.25 to 0.50 kg/m² for bituminous base tack coat per MoRTH Section 503.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-cyan-700 font-mono font-bold">
                    <span>SSR-MACH-ROLL-02</span>
                    <span className="text-emerald-700 font-mono">₹7,200 / Shift</span>
                  </div>
                  <div className="font-bold text-slate-900">Vibratory Mini-Roller (3-Ton Tandem)</div>
                  <p className="text-[11px] text-slate-500">
                    Standard Schedule of Rates (SSR) for mechanical compaction achieving &gt; 98% Maximum Dry Density (MDD) along patch perimeter.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Ref: MoHUA CPWD Schedule of Rates Vol I &amp; II • Baseline Location: New Delhi (Index 100)</span>
                <span className="text-cyan-700 font-bold">Updated: Oct 2026</span>
              </div>
            </div>
          )}

          {/* TAB 2: STATUTORY IRC & MORTH CODES */}
          {activeTab === 'irc' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 leading-relaxed text-slate-700">
                <strong className="text-cyan-900 block text-sm font-display mb-1">
                  Statutory Indian Road Congress (IRC) Compliance
                </strong>
                Every automated recommendation, repair methodology, depth threshold, and compaction density check executed by InfraTwin AI is hardcoded to adhere strictly to statutory Indian standards:
              </div>

              <div className="space-y-3 font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">IRC:82-2023 Section 4.3.2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-bold">MANDATORY</span>
                  </div>
                  <div className="text-slate-900 font-bold">Rectangular Saw-Cut Boundary &amp; Vertical Edge Sealing</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    &quot;Pothole repairs shall be executed by cutting the distressed area into rectangular shapes with vertical edges. The hole shall be thoroughly cleaned, coated with Bitumen Emulsion RS-1 tack coat at 0.5 kg/sqm, and filled with Bituminous Concrete in layers not exceeding 50mm compacted thickness.&quot;
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">MoRTH Section 3000 Clause 3004.3</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">DENSITY VERIFICATION</span>
                  </div>
                  <div className="text-slate-900 font-bold">Nuclear Density Gauge Compaction MDD &ge; 97%</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Mandatory sub-grade and bituminous compaction verification. Relative compaction must achieve minimum 97% Maximum Dry Density (MDD) verified through nuclear gauge or sand replacement method before work order clearance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">IRC:37-2018 Section 6.2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">STRUCTURAL DESIGN</span>
                  </div>
                  <div className="text-slate-900 font-bold">Guidelines for the Design of Flexible Pavements</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Specifies bituminous overlay thickness, Cumulative Standard Axles (MSA), and polymer-modified bitumen (CRMB-55 or PMB-40) for high-traffic corridors (&gt; 30 MSA) to prevent reflective rutting.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">IRC:SP:98-2020</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">COLD MIX TECHNOLOGY</span>
                  </div>
                  <div className="text-slate-900 font-bold">High Rainfall, Monsoon &amp; Hilly Terrain Specifications</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Mandatory cold mix asphalt emulsion guidelines for high rainfall zones (Kerala, Assam, Meghalaya, Goa) and sub-zero freeze-thaw Himalayan regions (Ladakh, Himachal Pradesh, Uttarakhand).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SENSOR PHYSICS & VOLUMETRICS */}
          {activeTab === 'physics' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 leading-relaxed text-slate-700">
                <strong className="text-cyan-900 block text-sm font-display mb-1">
                  How are the 3D depth, area, and volume physically calculated?
                </strong>
                InfraTwin AI does not guess volumetric dimensions. Measurements are derived from real photogrammetry physics combining UAV altitude, camera focal length, pixel Ground Sampling Distance (GSD), and double numerical integration.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-cyan-700 font-bold block text-xs">1. Ground Sampling Distance (GSD) Formula</span>
                  <div className="p-2 rounded bg-white border border-slate-200 text-emerald-700 text-[11px] font-bold">
                    GSD = (H &times; s_w) / (f &times; img_w)
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Where <strong>H = 12.4m</strong> flight altitude, <strong>s_w = 35.9mm</strong> (Sony full-frame sensor width), <strong>f = 24mm</strong> focal length. Yields calibrated ground resolution of <strong>0.42 cm/pixel</strong> with Dual RTK-GNSS positioning (&plusmn;1.5cm accuracy).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-cyan-700 font-bold block text-xs">2. 3D Volumetric Integral (Simpson&apos;s 2D)</span>
                  <div className="p-2 rounded bg-white border border-slate-200 text-emerald-700 text-[11px] font-bold">
                    V = &iint;_&Omega; &lambda; &middot; z_metric(x,y) dx dy
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Double integral evaluated over segmented void cavity &Omega;. Depth values z(x,y) are calibrated against depth-anything monocular regression and verified with 3D LiDAR point cloud returns.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono">
                <span className="text-slate-900 font-bold block text-xs">3. Compaction Density &amp; Surface Smoothness Correlation</span>
                <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                  Surface smoothness index is computed via 3x3 Sobel edge gradient spatial variance:
                  <code className="text-cyan-800 block bg-white p-2 rounded mt-1 border border-slate-200">
                    &sigma;_roughness = &radic;[ (1/N) &sum; (L_i - &mu;_L)&sup2; ] &bull; Density_MDD = 99.5 - 0.28 &middot; &sigma;_roughness
                  </code>
                  Achieving &ge; 97% Maximum Dry Density requires smooth, aggregate-locked surface texture. High variance flags loose, uncompacted asphalt.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: LEGAL & BLOCKCHAIN ADMISSIBILITY */}
          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 leading-relaxed text-slate-700">
                <strong className="text-cyan-900 block text-sm font-display mb-1">
                  Court Admissibility &amp; Anti-Corruption Vigilance (CVC)
                </strong>
                To ensure contractor audit results can withstand judicial scrutiny and vigilance inquiries, InfraTwin AI generates statutory electronic evidence certificates compliant with Indian law:
              </div>

              <div className="space-y-3 font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">Section 65B of Indian Evidence Act, 1872</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">STATUTORY ADMISSIBILITY</span>
                  </div>
                  <div className="text-slate-900 font-bold">Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA)</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Every inspection automatically produces a cryptographically signed Section 65B certificate verifying drone device serial number, unbroken custody chain, SHA-256 pixel checksum, and GPS RTK fix coordinates, admissible in Indian courts as primary digital evidence.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-700 text-xs">Decentralized Merkle Tree Anchoring</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">TAMPER-PROOF</span>
                  </div>
                  <div className="text-slate-900 font-bold">Polygon Amoy Testnet Escrow Freezing</div>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    Audit summaries are committed as cryptographic Merkle Roots to the public Polygon ledger. When volumetric fraud exceeds 5%, an automated smart contract freeze signal is broadcast to Public Financial Management System (PFMS) and Government e-Marketplace (GeM) APIs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAN-INDIA STATE COST INDEX */}
          {activeTab === 'states' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 leading-relaxed text-slate-700">
                <strong className="text-cyan-900 block text-sm font-display mb-1">
                  Pan-India State Schedule of Rates (SOR) &amp; Cost Index Calibration
                </strong>
                Infrastructure costs vary across Indian states due to local aggregate quarries, bitumen refinery transportation distances, and mountainous or coastal terrain. InfraTwin AI applies official <strong>CPWD State Cost Indices (Baseline Delhi = 100)</strong> to dynamically adjust BOQ rates:
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">State / UT</th>
                      <th className="p-3">Cost Index</th>
                      <th className="p-3">Terrain Factor</th>
                      <th className="p-3">Prescribed Bitumen</th>
                      <th className="p-3">PWD Schedule Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {PAN_INDIA_STATES.slice(0, 15).map((st) => (
                      <tr key={st.code} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-900 font-sans">{st.state}</td>
                        <td className="p-3 text-cyan-700 font-bold">{st.cpwdCostIndex}%</td>
                        <td className="p-3 text-slate-600">{st.terrainMultiplier}x ({st.terrain.split(' ')[0]})</td>
                        <td className="p-3 text-emerald-700 font-bold">{st.climaticBitumenGrade}</td>
                        <td className="p-3 text-slate-500 text-[10px]">{st.pwdScheduleCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Showing 15 of 36 Indian States &amp; UTs loaded in system</span>
                <span className="text-cyan-700 font-mono font-bold">100% Pan-India Coverage Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Audited &amp; Grounded: CPWD DSR, MoRTH 5th Rev &amp; IRC:82-2023</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-md transition-all cursor-pointer"
          >
            Close Provenance View
          </button>
        </div>
      </div>
    </div>
  );
}
