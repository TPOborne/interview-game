import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ENGLISH');
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
  );
};