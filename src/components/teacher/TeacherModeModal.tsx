// Teacher Mode Modal: Scenario Generator, Curriculum Standards & Debrief Prompts

import React, { useState } from 'react';
import { 
  STEM_LEARNING_OBJECTIVES, 
  TEACHER_PRESETS, 
  CLASSROOM_DEBRIEF_QUESTIONS, 
  type TeacherPreset 
} from '../../data/teacherScenarios';
import type { DestinationType, MissionDuration } from '../../types/game';
import { GraduationCap, Copy, Check, Play, BookOpen, MessageSquare, X } from 'lucide-react';
import { sound } from '../../sound/audioEngine';

interface TeacherModeModalProps {
  onClose: () => void;
  onLaunchScenario: (dest: DestinationType, duration: MissionDuration) => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  onClose,
  onLaunchScenario
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'standards' | 'debrief'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<TeacherPreset>(TEACHER_PRESETS[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleCopyCode = (code: string) => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleStartPreset = (preset: TeacherPreset) => {
    sound.playSuccess();
    onLaunchScenario(preset.destination, preset.duration);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0B1324] border border-blue-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              TEACHER & EDUCATOR PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              // NASA STEM CURRICULUM
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-5 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'presets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            CLASSROOM SCENARIOS
          </button>
          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'standards'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            7 STEM OBJECTIVES
          </button>
          <button
            onClick={() => setActiveTab('debrief')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'debrief'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            CLASSROOM DEBRIEF PROMPTS
          </button>
        </div>

        {/* Tab 1: Classroom Presets */}
        {activeTab === 'presets' && (
          <div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Launch pre-configured educational mission scenarios tailored for distinct curriculum units and grade levels. Share scenario codes with students for synchronized classroom trials.
            </p>

            <div className="space-y-3 mb-6">
              {TEACHER_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    selectedPreset.id === preset.id
                      ? 'bg-[#121F38] border-blue-400 shadow-md ring-1 ring-blue-400'
                      : 'bg-[#101827] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-bold text-sm text-white">
                        {preset.title}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {preset.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mb-1.5">
                      {preset.description}
                    </p>
                    <div className="text-[11px] font-mono text-[#52D6FF]">
                      Curriculum Focus: {preset.focusTopic}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(preset.scenarioCode);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#060B18] border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-all"
                      title="Copy scenario code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {preset.scenarioCode}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartPreset(preset);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md"
                    >
                      LAUNCH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: 7 STEM Learning Objectives */}
        {activeTab === 'standards' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              Mapped directly to Next Generation Science Standards (NGSS) and NASA Space Apps educational benchmarks:
            </p>
            {STEM_LEARNING_OBJECTIVES.map(obj => (
              <div key={obj.id} className="p-3.5 rounded-xl bg-[#101827] border border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {obj.id}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white">
                    {obj.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Classroom Debrief Prompts */}
        {activeTab === 'debrief' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              Use these guided Socratic discussion questions following gameplay to encourage students to reflect on systems interdependence and opportunity costs:
            </p>
            {CLASSROOM_DEBRIEF_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold font-mono text-sm shrink-0">
                    Q{idx + 1}:
                  </span>
                  <h4 className="font-display font-bold text-sm text-white leading-snug">
                    {q.question}
                  </h4>
                </div>
                <div className="text-[11px] font-mono text-sky-300/80">
                  Target Concept: {q.targetConcept}
                </div>
                <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-xs text-slate-300 border-l-2 border-l-emerald-500">
                  <span className="text-emerald-400 font-bold block mb-0.5 text-[10px] font-mono">
                    TEACHER GUIDING NOTES:
                  </span>
                  {q.teacherGuideNotes}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
          >
            CLOSE PORTAL
          </button>
        </div>
      </div>
    </div>
  );
};
