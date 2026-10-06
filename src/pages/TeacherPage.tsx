// Route /teacher : Dedicated Educator & Classroom Portal
import React, { useState } from 'react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  STEM_LEARNING_OBJECTIVES, 
  TEACHER_PRESETS, 
  CLASSROOM_DEBRIEF_QUESTIONS,
  type TeacherPreset 
} from '../data/teacherScenarios';
import { 
  GraduationCap, 
  Rocket, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Share2 
} from 'lucide-react';

export const TeacherPage: React.FC = () => {
  const { launchScenario } = useMission();
  const { t, formatNum, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'presets' | 'standards' | 'debrief'>('presets');

  const handleLaunchPreset = (preset: TeacherPreset) => {
    sound.playClick();
    launchScenario(preset.destination, preset.duration);
  };

  const handleShareCode = (code: string) => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      alert(language === 'bn' 
        ? `শ্রেণিকক্ষ মিশন কোড [${code}] ক্লিপবোর্ডে কপি করা হয়েছে!` 
        : `Classroom mission code [${code}] copied to clipboard!`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8 flex-1 flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2.5 sm:mb-3 shadow-md">
            <GraduationCap className="w-4 h-4" />
            <span>{t('teacher.page.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2 sm:mb-3">
            {t('teacher.page.title')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('teacher.page.desc')}
          </p>
        </div>

        {/* 3 Main Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('presets');
            }}
            className={`min-h-[42px] flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/25'
                : 'bg-[#101827] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4 shrink-0" />
            <span>{t('teacher.tab.presets')}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('standards');
            }}
            className={`min-h-[42px] flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 ${
              activeTab === 'standards'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/25'
                : 'bg-[#101827] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{t('teacher.tab.standards')}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('debrief');
            }}
            className={`min-h-[42px] flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 ${
              activeTab === 'debrief'
                ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/25'
                : 'bg-[#101827] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>{t('teacher.tab.debrief')}</span>
          </button>
        </div>

        {/* TAB 1: CLASSROOM PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs sm:text-sm text-slate-400 font-sans text-center max-w-xl mx-auto mb-6">
              {t('teacher.presets.desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEACHER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-[#0B1222] border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold">
                        {preset.scenarioCode}
                      </span>
                      <button
                        onClick={() => handleShareCode(preset.scenarioCode)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Copy Code"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-display font-bold text-white mb-1">
                      {(language === 'bn' && preset.titleBn) ? preset.titleBn : preset.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs font-mono text-[#52D6FF] mb-3">
                      <span className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span className="capitalize">{preset.destination}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatNum(preset.duration)} {language === 'bn' ? 'দিন' : 'Days'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                      {(language === 'bn' && preset.descriptionBn) ? preset.descriptionBn : preset.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleLaunchPreset(preset)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ক্লাসরুমের জন্য চালু করো' : 'Launch Scenario for Class'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: NGSS STEM STANDARDS */}
        {activeTab === 'standards' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs sm:text-sm text-slate-400 font-sans text-center max-w-xl mx-auto mb-6">
              {t('teacher.standards.desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STEM_LEARNING_OBJECTIVES.map((obj) => (
                <div
                  key={obj.id}
                  className="bg-[#0B1222] border border-slate-800 p-5 rounded-2xl shadow-xl flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 font-bold block mb-0.5">
                      {language === 'bn' ? `স্টেম লক্ষ্যমাত্রা #${formatNum(obj.id)}` : `STEM OBJECTIVE #${obj.id}`}
                    </span>
                    <h3 className="text-sm font-display font-bold text-white mb-1.5">
                      {(language === 'bn' && obj.titleBn) ? obj.titleBn : obj.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {(language === 'bn' && obj.descriptionBn) ? obj.descriptionBn : obj.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEBRIEF DISCUSSION QUESTIONS */}
        {activeTab === 'debrief' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs sm:text-sm text-slate-400 font-sans text-center max-w-xl mx-auto mb-6">
              {t('teacher.debrief.desc')}
            </p>

            <div className="space-y-4">
              {CLASSROOM_DEBRIEF_QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-[#0B1222] border border-slate-800 p-5 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#52D6FF] font-bold">
                    <span>Q{formatNum(idx + 1)}.</span>
                    <span>{(language === 'bn' && q.targetConceptBn) ? q.targetConceptBn : q.targetConcept}</span>
                  </div>
                  <h3 className="text-base font-display font-bold text-white mb-3">
                    {(language === 'bn' && q.questionBn) ? q.questionBn : q.question}
                  </h3>
                  <div className="p-3.5 rounded-xl bg-[#060B18] border-l-4 border-purple-500 text-xs font-sans text-slate-300 leading-relaxed">
                    <span className="font-bold text-purple-300 block mb-1 font-mono text-[11px]">
                      {t('teacher.notes')}
                    </span>
                    {(language === 'bn' && q.teacherGuideNotesBn) ? q.teacherGuideNotesBn : q.teacherGuideNotes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
