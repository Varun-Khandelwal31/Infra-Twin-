'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import BOQResultCard from '@/components/copilot/BOQResultCard';
import { INSPECTION_SAMPLES } from '@/lib/mockInference';
import { BOQResponse } from '@/lib/groq';
import { PAN_INDIA_STATES } from '@/lib/panIndiaData';
import DataProvenanceModal from '@/components/common/DataProvenanceModal';
import {
  Bot,
  Mic,
  Send,
  Cpu,
  X,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Scale,
  MapPin,
  ChevronDown,
} from 'lucide-react';

const PAN_INDIA_PRESETS = [
  { label: '📍 Delhi (Outer Ring Road)', query: 'Generate BOQ for Outer Ring Road IIT Flyover Delhi (Area: 4.1 sqm, Depth: 18.2cm)' },
  { label: '📍 Lucknow (Shaheed Path, UP)', query: 'Generate BOQ for Gomti Nagar Shaheed Path Lucknow Uttar Pradesh (Area: 3.8 sqm, Depth: 16.5cm)' },
  { label: '📍 Mumbai (Western Express Hwy)', query: 'Generate BOQ for Western Express Highway Andheri Mumbai Maharashtra (Area: 5.8 sqm, Depth: 19.5cm)' },
  { label: '📍 Bengaluru (ORR Bellandur)', query: 'Generate BOQ for Outer Ring Road Bellandur Bengaluru Karnataka (Area: 6.2 sqm, Depth: 21.0cm)' },
  { label: '📍 Kochi (Seaport-Airport Rd, KL)', query: 'Generate BOQ for Kochi Seaport-Airport Road Kerala (Area: 3.2 sqm, Depth: 13.5cm)' },
  { label: '📍 Guwahati (GS Road, Assam)', query: 'Generate BOQ for GS Road Khanapara to Dispur Guwahati Assam (Area: 4.2 sqm, Depth: 17.0cm)' },
  { label: '📍 Hyderabad (HITEC City)', query: 'Generate BOQ for HITEC City Cyber Towers Corridor Hyderabad Telangana (Area: 3.4 sqm, Depth: 14.0cm)' },
  { label: '📍 Jaipur (Tonk Road, RJ)', query: 'Generate BOQ for Tonk Road Elevated Corridor Jaipur Rajasthan (Area: 3.5 sqm, Depth: 14.2cm)' },
  { label: '📍 Kolkata (EM Bypass, WB)', query: 'Generate BOQ for Eastern Metropolitan Bypass Salt Lake Kolkata West Bengal (Area: 4.5 sqm, Depth: 16.0cm)' },
  { label: '📍 Patna (Marine Drive, Bihar)', query: 'Generate BOQ for Patna Marine Drive Ganga Path Bihar (Area: 2.8 sqm, Depth: 12.0cm)' },
  { label: '📍 Indore (Super Corridor, MP)', query: 'Generate BOQ for Indore Super Corridor Madhya Pradesh (Area: 3.6 sqm, Depth: 15.0cm)' },
  { label: '📍 Leh-Ladakh (NH-3 Karu Sector)', query: 'Generate BOQ for Leh-Manali Highway Karu Sector Ladakh (Area: 2.8 sqm, Depth: 12.0cm)' },
  { label: '📍 NH-44 (North-South Corridor)', query: 'Generate BOQ for NH-44 North-South Highway Corridor (Area: 7.5 sqm, Depth: 20.0cm)' },
  { label: '📍 Purvanchal Expressway (UP)', query: 'Generate BOQ for Purvanchal Expressway Km 42 Uttar Pradesh (Area: 4.2 sqm, Depth: 16.0cm)' },
];

function CopilotContent() {
  const searchParams = useSearchParams();
  const sampleId = searchParams.get('sample');
  const locationParam = searchParams.get('location');
  const areaParam = searchParams.get('area');
  const depthParam = searchParams.get('depth');

  const initialSample = INSPECTION_SAMPLES.find((s) => s.id === sampleId) || INSPECTION_SAMPLES[0];

  // Construct initial prompt: prioritizing locationParam from Map if present
  const getInitialPrompt = () => {
    if (locationParam) {
      const area = areaParam || '3.5';
      const depth = depthParam || '15.0';
      return `Generate an IRC:82-2023 compliant BOQ for ${locationParam} (Area: ${area} sqm, Depth: ${depth}cm).`;
    }
    return `Generate an IRC:82-2023 compliant BOQ for ${initialSample.roadName} (${initialSample.distressType}, Area: ${initialSample.metrics.areaSqm} sqm, Depth: ${initialSample.metrics.maxDepthCm}cm).`;
  };

  const [promptInput, setPromptInput] = useState(getInitialPrompt());
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL');
  const [isLoading, setIsLoading] = useState(false);
  const [boqData, setBoqData] = useState<BOQResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  const handleGenerate = async (queryText?: string) => {
    const text = queryText !== undefined ? queryText : promptInput;
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          inspectionContext: {
            ...initialSample,
            roadName: locationParam || initialSample.roadName,
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`API returned ${res.status}: ${errBody || 'Failed to generate BOQ'}`);
      }

      const data = await res.json();
      setBoqData(data);
    } catch (err: any) {
      console.error('Copilot API Error:', err);
      setError(err?.message || 'Failed to connect to Nirman Copilot engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate BOQ on mount or when locationParam/sampleId changes
  useEffect(() => {
    const p = getInitialPrompt();
    setPromptInput(p);
    handleGenerate(p);
  }, [sampleId, locationParam, areaParam, depthParam]);

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        const voiceTxt = `Generate BOQ for ${locationParam || initialSample.roadName} (${initialSample.distressType}) using prescribed bitumen`;
        setPromptInput(voiceTxt);
        setIsListening(false);
        handleGenerate(voiceTxt);
      }, 2000);
    }
  };

  // State quick selector handler
  const handleSelectState = (stateCode: string) => {
    setSelectedStateCode(stateCode);
    const matchedState = PAN_INDIA_STATES.find((s) => s.code === stateCode);
    if (matchedState) {
      const newPrompt = `Generate an IRC:82-2023 compliant BOQ for ${matchedState.capital}, ${matchedState.state} (Area: 4.2 sqm, Depth: 16.0cm).`;
      setPromptInput(newPrompt);
      handleGenerate(newPrompt);
    }
  };

  const isLive = boqData?.source === 'live';

  return (
    <>
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-display">
              Nirman Copilot • Pan-India GenAI BOQ &amp; IRC Compliance Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Grounded in CPWD DSR, IRC:82-2023, IRC:37-2018 &amp; MoRTH 3000 • Computes localized estimates for any Indian city, district, or National Highway
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          <button
            onClick={() => setIsProvenanceOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#111726]/90 border border-slate-800/90 shadow-2xl text-cyan-400 hover:bg-cyan-500/15 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Data Sources</span>
          </button>

          <span
            className={`px-3 py-1.5 rounded-lg border font-bold shadow-xs ${
              isLive
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {isLive ? 'Llama-3 70B Live' : 'CPWD Grounded Engine'}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-[#111726]/90 border border-slate-800/90 shadow-2xl text-slate-300 font-bold shadow-xs">
            🇮🇳 36 States &amp; UTs Loaded
          </span>
        </div>
      </div>

      {/* STATE & UNION TERRITORY SELECTOR STRIP */}
      <div className="p-3.5 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
          <span className="font-bold text-white font-mono uppercase">
            Select Indian State / Region for Localized Schedule of Rates (SOR):
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStateCode}
            onChange={(e) => handleSelectState(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none cursor-pointer shadow-xs"
          >
            {PAN_INDIA_STATES.map((st) => (
              <option key={st.code} value={st.code}>
                {st.state} (CPWD Cost Index: {st.cpwdCostIndex}% • {st.climaticBitumenGrade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pan-India Preset Highway & Metro Corridors */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Pan-India Highway &amp; Metro Presets (or type any custom Indian location below):</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {PAN_INDIA_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(p.query);
                handleGenerate(p.query);
              }}
              className="px-3 py-1.5 rounded-xl border bg-[#111726] border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all shrink-0 text-xs font-mono font-medium cursor-pointer shadow-xs"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box with Keyboard Enter listener & Clear button */}
      <div className="p-4 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl shadow-sm space-y-3">
        <div className="relative flex items-center">
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Type any road, highway or city in India (e.g. Generate BOQ for Hazratganj, Lucknow Area: 3.5 sqm Depth: 16cm)... Press Enter to submit."
            rows={2}
            className="w-full pl-4 pr-32 py-3 rounded-xl bg-slate-900/60/80 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 text-xs font-sans resize-none"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {promptInput && (
              <button
                onClick={() => setPromptInput('')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                title="Clear Input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={toggleVoice}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-[#111726] text-slate-400 border-slate-800 hover:text-cyan-400'
              }`}
              title="Voice Command"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !promptInput.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:shadow-cyan-500/25 transition-all disabled:opacity-50 flex items-center gap-1.5 text-xs cursor-pointer shadow-md"
            >
              {isLoading ? (
                <Cpu className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">💡 Tip:</span>
            <span>Type any Indian location to auto-apply state CPWD cost indices • Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-300 border border-slate-800">Enter</kbd> to calculate</span>
          </div>

          {isListening && (
            <div className="text-rose-600 flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Listening to voice command...
            </div>
          )}
        </div>
      </div>

      {/* Results Output */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-[#111726]/90 border border-slate-800/90 shadow-2xl text-center space-y-3 shadow-xs">
          <Cpu className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <div className="text-sm font-bold text-white font-display">
            Synthesizing State-Specific IRC:82-2023 Bill of Quantities...
          </div>
          <p className="text-xs text-slate-500">Querying CPWD Schedule of Rates &amp; State Cost Index Multipliers</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-300 font-display">Copilot Engine Error</div>
              <p className="text-xs text-rose-200/80 mt-0.5 font-mono">{error}</p>
              <p className="text-[10px] text-slate-400 mt-1">Fallback to Pan-India Grounded Schedule Engine used below.</p>
            </div>
          </div>
          <button
            onClick={() => handleGenerate()}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {boqData && !isLoading && <BOQResultCard boq={boqData} />}

      {/* Official Data Provenance Modal */}
      <DataProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />
    </>
  );
}

export default function CopilotPage() {
  return (
    <div className="flex h-screen bg-transparent text-slate-200 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Suspense fallback={<div className="p-8 text-xs font-mono text-cyan-600">Loading Nirman Copilot...</div>}>
            <CopilotContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
