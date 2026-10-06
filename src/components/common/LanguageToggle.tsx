// Premium Compact Segmented Language Switcher (Bangla 🇧🇩 | English 🇬🇧)

import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../sound/audioEngine';

interface LanguageToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '',
  size = 'md'
}) => {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: 'en' | 'bn') => {
    if (language !== lang) {
      sound.playClick();
      setLanguage(lang);
    }
  };

  const isSmall = size === 'sm';

  return (
    <div 
      className={`inline-flex items-center p-0.5 rounded-full bg-[#0A1020]/90 border border-[#52D6FF]/30 backdrop-blur-md shadow-lg select-none transition-all ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      {/* Bengali Button */}
      <button
        type="button"
        onClick={() => handleSelect('bn')}
        className={`flex items-center gap-1.5 rounded-full font-bold transition-all duration-200 ${
          isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        } ${
          language === 'bn'
            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 font-bold scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-normal'
        }`}
        aria-pressed={language === 'bn'}
      >
        <span className="text-xs">🇧🇩</span>
        <span className="font-bangla tracking-wide">বাংলা</span>
      </button>

      {/* English Button */}
      <button
        type="button"
        onClick={() => handleSelect('en')}
        className={`flex items-center gap-1.5 rounded-full font-mono transition-all duration-200 ${
          isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        } ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#3B82F6] to-[#52D6FF] text-slate-950 font-bold shadow-md shadow-[#52D6FF]/20 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-normal'
        }`}
        aria-pressed={language === 'en'}
      >
        <span>English</span>
        <span className="text-xs">🇬🇧</span>
      </button>
    </div>
  );
};
