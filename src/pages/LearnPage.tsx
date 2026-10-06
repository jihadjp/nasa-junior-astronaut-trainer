// Route /learn : Comprehensive STEM Knowledge Base & Scientific Academy
import React, { useState } from 'react';
import { AppNavbar } from '../components/layout/AppNavbar';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../sound/audioEngine';
import { EDUCATIONAL_ARTICLES } from '../data/educationalContent';
import { CadetQuizCertificate } from '../components/learn/CadetQuizCertificate';
import { NasaDataSourcesDirectory } from '../components/learn/NasaDataSourcesDirectory';
import { 
  Sparkles, 
  ExternalLink, 
  Layers, 
  FileText 
} from 'lucide-react';

type LearnTab = 'moon' | 'mars' | 'power' | 'water' | 'oxygen' | 'food' | 'radiation' | 'missions' | 'quiz' | 'data';

export const LearnPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<LearnTab>('moon');

  const tabs: Array<{ id: LearnTab; label: string; icon: string }> = [
    { id: 'moon', label: t('learn.tab.moon'), icon: '🌙' },
    { id: 'mars', label: t('learn.tab.mars'), icon: '🔴' },
    { id: 'power', label: t('learn.tab.power'), icon: '⚡' },
    { id: 'water', label: t('learn.tab.water'), icon: '💧' },
    { id: 'oxygen', label: t('learn.tab.o2'), icon: '🌬️' },
    { id: 'food', label: t('learn.tab.food'), icon: '🌱' },
    { id: 'radiation', label: t('learn.tab.rad'), icon: '🛡️' },
    { id: 'missions', label: t('learn.tab.missions'), icon: '🚀' },
    { id: 'quiz', label: t('learn.tab.quiz'), icon: '🎖️' },
    { id: 'data', label: t('learn.tab.data'), icon: '🛰️' },
  ];

  const handleTabChange = (tabId: LearnTab) => {
    sound.playClick();
    setActiveTab(tabId);
  };

  // Map tab to educational article
  const getArticle = () => {
    switch (activeTab) {
      case 'power': return EDUCATIONAL_ARTICLES['power_grids_dust'];
      case 'water': return EDUCATIONAL_ARTICLES['eclss_water_recovery'];
      case 'oxygen': return EDUCATIONAL_ARTICLES['oxygen_generation_electrolysis'];
      case 'food': return EDUCATIONAL_ARTICLES['plant_biology_microg'];
      case 'radiation': return EDUCATIONAL_ARTICLES['radiation_physics'];
      case 'missions': return EDUCATIONAL_ARTICLES['systems_engineering_redundancy'];
      default: return null;
    }
  };

  const article = getArticle();

  return (
    <div className="w-full min-h-screen bg-[#050914] text-slate-100 flex flex-col justify-between selection:bg-[#52D6FF]/30">
      <AppNavbar />

      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-5 sm:py-8 flex-1 flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#52D6FF]/40 text-[#52D6FF] text-xs font-mono mb-2.5 sm:mb-3 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>{t('learn.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2 sm:mb-3">
            {t('learn.title')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            {t('learn.desc')}
          </p>
        </div>

        {/* 8 Topic Tabs Pill Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 sm:pb-4 mb-6 sm:mb-8 justify-start sm:justify-center max-w-full no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-mono flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#52D6FF] text-slate-950 font-bold shadow-lg shadow-[#52D6FF]/25 scale-105'
                    : 'bg-[#101827]/80 hover:bg-[#152238] text-slate-300 border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-[#0B1222] border border-slate-800 rounded-2xl p-4 sm:p-8 shadow-2xl flex-1 flex flex-col justify-between">
          {/* SPECIAL TAB 1: THE MOON */}
          {activeTab === 'moon' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🌙</span>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {language === 'bn' ? 'চাঁদ: চরম প্রতিকূল ও বাতাসহীন এক বিশ্ব' : 'The Moon: Extreme Vacuum & Thermal Swings'}
                  </h2>
                  <span className="text-xs font-mono text-[#52D6FF]">
                    {language === 'bn' ? 'নাসা আর্টেমিস প্রোগ্রাম ও দক্ষিণ মেরুর বরফ' : 'NASA Artemis Program & Lunar South Pole Ice'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060B18] border-l-4 border-[#52D6FF] text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {language === 'bn' ? (
                  <p>
                    চাঁদে কোনো বায়ুমণ্ডল বা চৌম্বক ক্ষেত্র নেই। ফলে দিনের বেলা পৃষ্ঠের তাপমাত্রা +১২০°C পর্যন্ত ওঠে এবং ১৪ দিনের দীর্ঘ রাতে তা -১৩০°C এ নেমে যায়! এছাড়া সূর্য ও গ্যালাক্সির বিপজ্জনক কণা সরাসরি এসে চাঁদের মাটিতে আঘাত করে। বিজ্ঞানীরা চাঁদের মাটি (Regolith) ব্যবহার করে ঘাঁটির চারপাশে পুরু মাটির দেওয়াল বা বাঙ্কার তৈরি করেন, যা বিকিরণ ও তীব্র তাপমাত্রা থেকে নভোচারীদের বাঁচায়।
                  </p>
                ) : (
                  <p>
                    The Moon possesses no atmosphere or protective magnetic dipole. Surface temperatures swing from +120°C in direct lunar sunlight to -130°C in the 14-day lunar night. Without atmospheric filtration, cosmic radiation showers the surface unimpeded. NASA’s Artemis architecture utilizes excavated lunar regolith piled over inflatable pressure vessels to provide thermal inertia and radiation attenuation.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#101827] border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-sky-300 uppercase mb-2">
                    {language === 'bn' ? 'শ্যাকলটন ক্র্যাটারের চির অন্ধকার' : 'Permanently Shadowed Craters'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'চাঁদের দক্ষিণ মেরুর গভীর গর্তগুলোতে কোটি কোটি বছর ধরে সূর্যের আলো পৌঁছায়নি। সেখানে কোটি কোটি টন পানির বরফ জমে আছে, যা ভেঙে অক্সিজেন ও রকেট জ্বালানি তৈরি সম্ভব।'
                      : 'Craters at the lunar south pole like Shackleton remain in perpetual darkness at -246°C, harboring billions of metric tons of water ice accessible for life support and propellant.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#101827] border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-sky-300 uppercase mb-2">
                    {language === 'bn' ? '১৪ দিনের ব্যাটারি চ্যালেঞ্জ' : 'The 14-Day Night Energy Storage'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'যেহেতু রাত একটানা ১৪ পৃথিবী দিন স্থায়ী হয়, সৌর প্যানেল দীর্ঘ সময় কাজ করে না। ঘাঁটিতে পর্যাপ্ত খাদ্য ও তাপমাত্রা বজায় রাখতে বিশাল ক্ষমতার রিজার্ভ ব্যাটারি প্রয়োজন।'
                      : 'With 354 continuous hours of lunar darkness, stationary solar power requires supplemental regenerative fuel cells (RFCs) or micro-nuclear fission surface power.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SPECIAL TAB 2: MARS */}
          {activeTab === 'mars' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔴</span>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {language === 'bn' ? 'মঙ্গল গ্রহ: ধূলিঝড় ও পাতলা বাতাসের লাল গ্রহ' : 'Mars: Dust Storms & Thin Carbon Dioxide Atmosphere'}
                  </h2>
                  <span className="text-xs font-mono text-red-400">
                    {language === 'bn' ? 'নাসা মার্স ২০২০ পারসিভিয়ারেন্স ও MOXIE পরীক্ষা' : 'NASA Mars 2020 Perseverance & MOXIE Experiment'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#060B18] border-l-4 border-red-500 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {language === 'bn' ? (
                  <p>
                    মঙ্গল গ্রহের বাতাস পৃথিবীর চেয়ে ১০০ গুণ পাতলা এবং তার ৯৫% কার্বন ডাই-অক্সাইড (CO₂)। ফলে মানুষ সেখানে শ্বাস নিতে পারে না। নাসার পারসিভিয়ারেন্স রোভারের বিশেষ যন্ত্র MOXIE (Mars Oxygen ISRU Experiment) ৮০০ ডিগ্রি সেলসিয়াস তাপে মঙ্গলের বাতাস থেকে সফলভাবে বিশুদ্ধ শ্বাসযোগ্য অক্সিজেন তৈরি করেছে। এছাড়া মঙ্গলে মাঝেমধ্যে তীব্র ধূলিঝড় ওঠে যা পুরো গ্রহকে ঢেকে ফেলে এবং সৌর প্যানেলের বিদ্যুৎ উৎপাদন ৭৫% পর্যন্ত কমিয়ে দেয়!
                  </p>
                ) : (
                  <p>
                    Mars possesses a tenuous atmosphere (0.6% of Earth’s surface pressure) composed of 95% carbon dioxide. NASA’s MOXIE experiment aboard the Perseverance rover proved in-situ resource utilization by converting atmospheric CO₂ into breathable oxygen via solid oxide electrolysis at 800°C. Global dust storms occasionally engulf the planet, attenuating solar irradiance by up to 75% for months.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#101827] border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase mb-2">
                    {language === 'bn' ? 'যোগাযোগের বিলম্ব (Communication Latency)' : 'Communication Latency'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'পৃথিবী থেকে মঙ্গলে রেডিও সিগন্যাল যেতে এবং ফিরে আসতে ৪ থেকে ২০ মিনিট সময় লাগে। তাই কোনো জরুরি বিপদে পৃথিবী থেকে তাৎক্ষণিক সাহায্য সম্ভব নয়; নভোচারীদের স্বয়ংসম্পূর্ণ হতে হয়।'
                      : 'Radio signals take 4 to 20 minutes each way between Earth and Mars depending on orbital distance. Astronauts cannot rely on real-time Mission Control overrides and must operate autonomously.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#101827] border border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase mb-2">
                    {language === 'bn' ? 'মঙ্গলের মাটি ও পারক্লোরেট লবণ' : 'Toxic Perchlorates in Martian Regolith'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {language === 'bn'
                      ? 'মঙ্গলের মাটিতে পারক্লোরেট নামক ক্ষতিকর লবণ থাকে। তাই গ্রিনহাউসে গাছ লাগানোর আগে মাটি ধুয়ে সম্পূর্ণ পরিশোধিত করতে হয়।'
                      : 'Martian soil contains 0.5–1.0% toxic perchlorate salts, which disrupt thyroid function in humans and must be chemically leached before regolith can be used for agricultural soil.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STANDARD STEM TOPICS 3 TO 8 */}
          {article && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-mono text-[#52D6FF] uppercase tracking-wider block mb-1">
                  {(language === 'bn' && article.categoryBn) ? article.categoryBn : article.category}
                </span>
                <h2 className="text-2xl font-display font-bold text-white mb-1">
                  {(language === 'bn' && article.titleBn) ? article.titleBn : article.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-sans">
                  {(language === 'bn' && article.subtitleBn) ? article.subtitleBn : article.subtitle}
                </p>
              </div>

              {/* Simplified Student Explanation */}
              <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {(language === 'bn' && article.simplifiedExplanationBn) 
                  ? article.simplifiedExplanationBn 
                  : article.simplifiedExplanation}
              </div>

              {/* Visual Diagram Representation */}
              {article.visualDiagram && (
                <div className="p-4 rounded-xl bg-[#101827] border border-[#52D6FF]/20">
                  <div className="text-[10px] font-mono uppercase text-[#52D6FF] font-bold mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'প্রকৌশল ডায়াগ্রাম' : 'ENGINEERING SYSTEM FLOW'}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                    {((language === 'bn' && article.visualDiagram.labelsBn) ? article.visualDiagram.labelsBn : article.visualDiagram.labels).map((lbl, idx, arr) => (
                      <React.Fragment key={idx}>
                        <div className="px-3.5 py-2 rounded-lg bg-[#060B18] border border-slate-700 font-mono text-xs text-white font-bold shadow-sm">
                          {lbl}
                        </div>
                        {idx < arr.length - 1 && (
                          <span className="text-[#52D6FF] font-bold">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-400 mt-3 font-mono">
                    {(language === 'bn' && article.visualDiagram.captionBn) ? article.visualDiagram.captionBn : article.visualDiagram.caption}
                  </p>
                </div>
              )}

              {/* Real NASA Mission Telemetry Box */}
              <div className="p-4 rounded-xl bg-[#101827] border-l-4 border-emerald-500">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'আসল নাসা মিশন ফ্যাক্ট' : 'REAL NASA MISSION FACT'}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {(language === 'bn' && article.realNasaMissionFactBn) ? article.realNasaMissionFactBn : article.realNasaMissionFact}
                </p>
              </div>

              {/* Advanced Engineering Specifications */}
              {article.advancedEngineeringSpec && (
                <div className="p-4 rounded-xl bg-[#060B18] border border-slate-800 text-xs font-mono">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'পদার্থবিজ্ঞান ও প্রকৌশল সূত্র:' : 'PHYSICS SPECIFICATION:'}
                  </div>
                  <div className="text-[#52D6FF] font-bold mb-2">
                    {article.advancedEngineeringSpec.formulaOrMetric}
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2 font-sans">
                    {(language === 'bn' && article.advancedEngineeringSpec.descriptionBn)
                      ? article.advancedEngineeringSpec.descriptionBn
                      : article.advancedEngineeringSpec.description}
                  </p>
                  <div className="text-[10px] text-slate-500">
                    <span className="text-slate-400">Ref: </span>
                    {article.advancedEngineeringSpec.referenceDocument}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SPECIAL TAB 9: CADET STEM QUIZ & CERTIFICATE */}
          {activeTab === 'quiz' && (
            <CadetQuizCertificate />
          )}

          {/* SPECIAL TAB 10: NASA OPEN DATA DIRECTORY */}
          {activeTab === 'data' && (
            <NasaDataSourcesDirectory />
          )}

          {/* NASA Scientific Sources Section at Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#52D6FF]" />
              <span>NASA Planetary Data System (PDS) & Technical Reports Server (NTRS)</span>
            </span>
            <a
              href="https://www.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#52D6FF] hover:underline flex items-center gap-1"
            >
              <span>NASA.gov Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
