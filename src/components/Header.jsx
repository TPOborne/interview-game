import { useState } from 'react';
import LanguageIcon from '../assets/icons/language.svg?react';
import UKIcon from '../assets/icons/flag-uk.svg?react';
import ItalyIcon from '../assets/icons/flag-italy.svg?react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language, setLanguage } = useLanguage();
  const [showFlags, setShowFlags] = useState(false);
  const handleClick = () => {
    setShowFlags(!showFlags);
  };

  const handleLanguage = (selectedLanguage) => {
    console.log('set language to ' + selectedLanguage); 
    setLanguage(selectedLanguage);
    setTimeout(() => {
      if (showFlags) {
        setShowFlags(false);
      }
    }, 1000)
  }

  return (
    <header>
      <p>Word Race</p>
      <div className={`options ${showFlags ? 'visible' : ''}`}>
        <div className="iconWrapper small" onClick={handleClick}>
          <LanguageIcon />
        </div>
        <div className="flags">
          <div className={`iconWrapper small ${language === 'ENGLISH' ? 'active' : null}`} onClick={() => handleLanguage('ENGLISH')}>
            <UKIcon />
          </div>
          <div className={`iconWrapper small ${language === 'ITALIAN' ? 'active' : null}`} onClick={() => handleLanguage('ITALIAN')}>
            <ItalyIcon />
          </div>
        </div>
      </div>
    </header>
  )
};

export default Header;