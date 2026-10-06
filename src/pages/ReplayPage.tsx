// Route /mission/replay : Mission Replay & "What-If?" Decision Branching Timeline
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  GitBranch, 
  RotateCcw, 
  ArrowLeft 
} from 'lucide-react';

export const ReplayPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, handleBranchReplay } = useMission();
  const { t, formatNum, language } = useLanguage();

  const { completedDecisions, scores } = gameState;
  const [selectedBranchDay, setSelectedBranchDay] = useState<number>(
    completedDecisions.length > 0 ? completedDecisions[0].day : 1
  );

  const handleStartBranch = (day: number) => {
    sound.playClick();
    handleBranchReplay(day);
  };

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center animate-fadeIn">
        <div className="bg-[#0B1220] border border-purple-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-800 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-2">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{t('replay.page.badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-2">
              {t('replay.page.title')}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              {t('replay.page.desc')}
            </p>
          </div>

          {/* First Run Benchmark Summary */}
          <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 mb-6">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3 font-bold">
              {t('replay.benchmark')}
            </span>
            <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
              <div className="p-3 rounded-lg bg-[#0B1220] border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'bn' ? 'নভোচারী স্বাস্থ্য' : 'WELLBEING'}
                </span>
                <span className="text-emerald-400 font-bold text-sm sm:text-base">
                  {formatNum(Math.round(gameState.crewWellbeing))}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'bn' ? 'বিজ্ঞান পয়েন্ট' : 'SCIENCE'}
                </span>
                <span className="text-purple-400 font-bold text-sm sm:text-base">
                  {formatNum(gameState.sciencePoints)} PTS
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1220] border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'bn' ? 'চূড়ান্ত স্কোর' : 'FINAL SCORE'}
                </span>
                <span className="text-[#52D6FF] font-bold text-sm sm:text-base">
                  {formatNum(scores?.overallScore || 70)} / {formatNum(100)}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Decision Points */}
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-3">
              {t('replay.select')}
            </span>

            {completedDecisions.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 text-xs text-slate-400 font-mono text-center flex flex-col items-center gap-3">
                <p>
                  {language === 'bn' 
                    ? 'কোনো সিদ্ধান্ত রেকর্ড হয়নি। প্রথম দিন থেকে পুনরায় শুরু করতে পারো।' 
                    : 'No past decision points recorded. Replay from Mission Day 1.'}
                </p>
                <button
                  onClick={() => handleStartBranch(1)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'দিন ১ থেকে নতুন করে খেলো' : 'Replay from Day 1'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {completedDecisions.map((d) => {
                  const isSelected = selectedBranchDay === d.day;
                  return (
                    <div
                      key={d.day}
                      onClick={() => setSelectedBranchDay(d.day)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500'
                          : 'bg-[#060B18] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-purple-900/60 text-purple-300 font-mono text-xs font-bold">
                          {language === 'bn' ? `দিন ${formatNum(d.day)}` : `Day ${d.day}`}
                        </span>
                        <div>
                          <div className="text-xs font-display font-bold text-white">
                            {d.choiceLabel}
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {language === 'bn' ? 'এই দিনের সিদ্ধান্ত পরিবর্তন করো' : 'Branch from this decision point'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartBranch(d.day);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{language === 'bn' ? 'খেলো' : 'Branch'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('/mission/report')}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'রিপোর্টে ফিরে যাও' : 'Back to Report'}</span>
            </button>

            <button
              onClick={() => handleStartBranch(selectedBranchDay)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-display font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {t('replay.branch.btn').replace('{day}', String(formatNum(selectedBranchDay)))}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
