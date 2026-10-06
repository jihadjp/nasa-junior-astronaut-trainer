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
import { useLanguage } from '../../i18n/LanguageContext';

interface TeacherModeModalProps {
  onClose: () => void;
  onLaunchScenario: (dest: DestinationType, duration: MissionDuration) => void;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  onClose,
  onLaunchScenario
}) => {
  const { t, formatNum, language } = useLanguage();
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
              {t('teacher.badge')}
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
            {t('teacher.tab.presets')}
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
            {t('teacher.tab.standards')}
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
            {t('teacher.tab.debrief')}
          </button>
        </div>

        {/* Tab 1: Classroom Presets */}
        {activeTab === 'presets' && (
          <div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {t('teacher.presets.desc')}
            </p>

            <div className="space-y-3 mb-6">
              {TEACHER_PRESETS.map(preset => {
                const title = (language === 'bn' && preset.titleBn) ? preset.titleBn : preset.title;
                const difficulty = (language === 'bn' && preset.difficultyBn) ? preset.difficultyBn : preset.difficulty;
                const desc = (language === 'bn' && preset.descriptionBn) ? preset.descriptionBn : preset.description;
                const focus = (language === 'bn' && preset.focusTopicBn) ? preset.focusTopicBn : preset.focusTopic;

                return (
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
                          {title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-1.5 leading-relaxed">
                        {desc}
                      </p>
                      <div className="text-[11px] font-mono text-[#52D6FF]">
                        {language === 'bn' ? 'পাঠ্যক্রমের মূল বিষয়: ' : 'Curriculum Focus: '}{focus}
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
                        {t('common.launch')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 7 STEM Learning Objectives */}
        {activeTab === 'standards' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {t('teacher.standards.desc')}
            </p>
            {STEM_LEARNING_OBJECTIVES.map(obj => {
              const title = (language === 'bn' && obj.titleBn) ? obj.titleBn : obj.title;
              const desc = (language === 'bn' && obj.descriptionBn) ? obj.descriptionBn : obj.description;

              return (
                <div key={obj.id} className="p-3.5 rounded-xl bg-[#101827] border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {formatNum(obj.id)}
                    </span>
                    <h4 className="font-display font-bold text-sm text-white">
                      {title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 pl-7 leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Classroom Debrief Prompts */}
        {activeTab === 'debrief' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {t('teacher.debrief.desc')}
            </p>
            {CLASSROOM_DEBRIEF_QUESTIONS.map((q, idx) => {
              const question = (language === 'bn' && q.questionBn) ? q.questionBn : q.question;
              const targetConcept = (language === 'bn' && q.targetConceptBn) ? q.targetConceptBn : q.targetConcept;
              const notes = (language === 'bn' && q.teacherGuideNotesBn) ? q.teacherGuideNotesBn : q.teacherGuideNotes;

              return (
                <div key={q.id} className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold font-mono text-sm shrink-0">
                      {language === 'bn' ? `প্রশ্ন ${formatNum(idx + 1)}:` : `Q${idx + 1}:`}
                    </span>
                    <h4 className="font-display font-bold text-sm text-white leading-snug">
                      {question}
                    </h4>
                  </div>
                  <div className="text-[11px] font-mono text-sky-300/80">
                    {language === 'bn' ? 'মূল ধারণা: ' : 'Target Concept: '}{targetConcept}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#060B18] border border-slate-800 text-xs text-slate-300 border-l-2 border-l-emerald-500">
                    <span className="text-emerald-400 font-bold block mb-0.5 text-[10px] font-mono">
                      {t('teacher.notes')}
                    </span>
                    {notes}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all"
          >
            {language === 'bn' ? 'পোর্টাল বন্ধ করো' : 'CLOSE PORTAL'}
          </button>
        </div>
      </div>
    </div>
  );
};
