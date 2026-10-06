// Educational Modal for NASA STEM Physics Explanations

import React, { useState } from 'react';
import { EDUCATIONAL_ARTICLES } from '../../data/educationalContent';
import { BookOpen, Rocket, FileText, X } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface EducationalModalProps {
  whyId: string;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({ whyId, onClose }) => {
  const article = EDUCATIONAL_ARTICLES[whyId] || EDUCATIONAL_ARTICLES.systems_engineering_redundancy;
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  const handleClose = () => {
    sound.playClick();
    onClose();
  };

  const renderDiagram = () => {
    const { type, labels, caption } = article.visualDiagram;
    return (
      <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 text-center mb-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3">
          CONCEPT SCHEMATIC: {type.toUpperCase()}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {labels.map((label, idx) => (
            <React.Fragment key={idx}>
              <span className="px-3 py-1.5 rounded-lg bg-[#101827] border border-[#52D6FF]/40 text-xs font-mono font-medium text-slate-200 shadow-sm">
                {label}
              </span>
              {idx < labels.length - 1 && (
                <span className="text-[#52D6FF] font-mono font-bold">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-sky-300/80 italic font-mono">
          {caption}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1220] border border-[#52D6FF]/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              NASA STEM ACADEMY
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
          {article.title}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {article.subtitle}
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'simple'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            SIMPLIFIED EXPLANATION
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'advanced'
                ? 'bg-[#52D6FF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ADVANCED ENGINEERING SPEC
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'simple' ? (
          <div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {article.simplifiedExplanation}
            </p>
            {renderDiagram()}
            {/* Real NASA Mission Fact Callout */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 flex items-start gap-3">
              <Rocket className="w-5 h-5 text-[#52D6FF] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold text-[#52D6FF] block mb-0.5">
                  REAL NASA MISSION BENCHMARK:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {article.realNasaMissionFact}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">PHYSICAL FORMULA / METRIC:</span>
              <code className="text-emerald-300 block bg-[#101827] p-2 rounded border border-slate-800">
                {article.advancedEngineeringSpec.formulaOrMetric}
              </code>
            </div>
            <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800">
              <span className="text-[#52D6FF] font-bold block mb-1">AEROSPACE ARCHITECTURE:</span>
              <p className="text-slate-300 leading-relaxed">
                {article.advancedEngineeringSpec.description}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">REAL-WORLD COUNTERPART:</span>
              <p className="text-slate-300">
                {article.advancedEngineeringSpec.realWorldCounterpart}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#060B18] border border-slate-800 flex items-start gap-2 text-slate-400 text-[11px]">
              <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>Reference Document: {article.advancedEngineeringSpec.referenceDocument}</span>
            </div>
          </div>
        )}

        {/* Footer Dismiss */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
          >
            RETURN TO DECISION
          </button>
        </div>
      </div>
    </div>
  );
};
