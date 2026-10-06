// Route /mission/briefing : Cinematic Pre-Mission Directive & Flight Readiness
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMission } from '../context/MissionContext';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { 
  Rocket, 
  ArrowLeft, 
  Zap, 
  Droplets, 
  Wind, 
  Apple, 
  Shield, 
  Wrench, 
  Users, 
  Compass, 
  Sparkles, 
  Target 
} from 'lucide-react';

export const BriefingPage: React.FC = () => {
  const navigate = useNavigate();
  const { destConfig, durationConfig, gameState, setGameState } = useMission();
  const { t, formatNum, language } = useLanguage();

  // Play subtle ambient tone on briefing screen mount
  useEffect(() => {
    sound.startAmbient();
  }, []);

  const handleBeginMission = () => {
    sound.playSuccess();
    // Ensure simulation is properly initialized on Day 1 paused
    setGameState(prev => ({
      ...prev,
      missionDay: 1,
      missionStatus: 'ongoing',
      isPaused: true
    }));
    navigate('/mission/simulation');
  };

  const challengeList = [
    { icon: <Zap className="w-5 h-5 text-amber-400" />, title: language === 'bn' ? 'বিদ্যুৎ (Power)' : 'Power', desc: t('briefing.challenge.power') },
    { icon: <Droplets className="w-5 h-5 text-blue-400" />, title: language === 'bn' ? 'পানি (Water)' : 'Water', desc: t('briefing.challenge.water') },
    { icon: <Wind className="w-5 h-5 text-[#52D6FF]" />, title: language === 'bn' ? 'অক্সিজেন (Oxygen)' : 'Oxygen', desc: t('briefing.challenge.o2') },
    { icon: <Apple className="w-5 h-5 text-emerald-400" />, title: language === 'bn' ? 'খাবার (Food)' : 'Food', desc: t('briefing.challenge.food') },
    { icon: <Shield className="w-5 h-5 text-purple-400" />, title: language === 'bn' ? 'সুরক্ষাবলয় (Shielding)' : 'Shielding', desc: t('briefing.challenge.shield') },
    { icon: <Wrench className="w-5 h-5 text-orange-400" />, title: language === 'bn' ? 'যন্ত্রাংশ (Spares)' : 'Spares', desc: t('briefing.challenge.spares') },
  ];

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-[#52D6FF]/30">
      {/* Background Ambient Glow & Starfield */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20 ${
        destConfig === 'moon' ? 'bg-[#52D6FF]' : 'bg-red-600'
      }`} />

      {/* Top Directive Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#52D6FF] animate-pulse" />
          <span className="font-display font-bold text-sm tracking-widest text-white">
            {t('nav.brand')} // {t('briefing.badge')}
          </span>
        </div>
        <div className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#52D6FF]" />
          <span className="capitalize">{destConfig} Orbit Insertion</span>
        </div>
      </header>

      {/* Main Briefing Stage */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827] border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MISSION 01 DIRECTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-2">
            {destConfig === 'moon' ? t('briefing.title.moon') : t('briefing.title.mars')}
          </h1>

          {/* Primary Objective Banner */}
          <div className="max-w-2xl mx-auto mt-4 p-4 rounded-2xl bg-[#0B1222]/90 border border-slate-800 text-slate-200 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#52D6FF] uppercase mb-1">
              <Target className="w-4 h-4 text-[#52D6FF]" />
              <span>{t('briefing.obj.title')}</span>
            </div>
            <p className="text-sm sm:text-base font-sans text-slate-300">
              {t('briefing.obj.desc').replace('{days}', String(formatNum(durationConfig)))}
            </p>
          </div>
        </div>

        {/* 6 Interconnected Challenges Grid */}
        <div className="mb-8">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t('briefing.challenges.title')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {challengeList.map((ch, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-[#0B1222]/80 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-3 backdrop-blur-sm"
              >
                <div className="p-2 rounded-lg bg-[#060B18] border border-slate-800 shrink-0">
                  {ch.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-display font-bold text-white mb-0.5">{ch.title}</h3>
                  <p className="text-[11px] text-slate-400 font-sans leading-snug">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Crew Introduction */}
        <div className="mb-8 bg-[#0B1222]/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{t('briefing.crew.title')} ({formatNum(gameState.crew.length)} {language === 'bn' ? 'সদস্য' : 'Members'})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gameState.crew.map((member) => (
              <div key={member.id} className="p-2.5 rounded-xl bg-[#060B18] border border-slate-800 flex items-center gap-2.5">
                <span className="text-2xl">{member.avatarSeed || '👨‍🚀'}</span>
                <div className="overflow-hidden">
                  <div className="text-xs font-display font-bold text-white truncate">
                    {(language === 'bn' && member.nameBn) ? member.nameBn : member.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#52D6FF] truncate">
                    {(language === 'bn' && member.roleBn) ? member.roleBn : member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              sound.playClick();
              navigate('/mission/setup');
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs sm:text-sm font-mono flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('briefing.btn.adjust')}</span>
          </button>

          <button
            onClick={handleBeginMission}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-[#52D6FF] hover:from-emerald-400 hover:to-[#38BDF8] text-slate-950 font-display font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            <Rocket className="w-6 h-6 fill-current" />
            <span>{t('briefing.btn.begin')}</span>
          </button>
        </div>
      </main>
    </div>
  );
};
