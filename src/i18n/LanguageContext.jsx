import { createContext, useContext, useState, useCallback } from 'react';
import { en } from './en';
import { ja } from './ja';

const translations = { en, ja };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app-language') || 'en';
  });

  const switchLanguage = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('app-language', newLang);
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  // Get exercise/food/category name based on current language
  const getName = useCallback((item) => {
    if (!item?.names) return item?.name || '';
    return item.names[lang] || item.names.en || '';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t, getName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be inside LanguageProvider');
  return ctx;
}
