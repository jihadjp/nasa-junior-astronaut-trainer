// Global Language Context & i18n Hook for Bilingual Support (English 🇬🇧 & Bangla 🇧🇩)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS, type Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNum: (num: number | string) => string;
  isBn: boolean;
}

const STORAGE_KEY = 'outpost_language_pref';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Bengali Digits Converter for child-friendly numbers
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumerals(val: number | string): string {
  return String(val).replace(/[0-9]/g, (digit) => BN_DIGITS[parseInt(digit, 10)] || digit);
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') return saved;
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {}
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  // Sync document body class & lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      if (language === 'bn') {
        document.body.classList.add('lang-bn');
      } else {
        document.body.classList.remove('lang-bn');
      }
    }
  }, [language]);

  // Interpolation Translator Function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = (dict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        const replacement = language === 'bn' && typeof paramVal === 'number' 
          ? toBengaliNumerals(paramVal) 
          : String(paramVal);
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), replacement);
      });
    }

    return text;
  }, [language]);

  const formatNum = useCallback((num: number | string): string => {
    if (language === 'bn') {
      return toBengaliNumerals(num);
    }
    return String(num);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    formatNum,
    isBn: language === 'bn'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
