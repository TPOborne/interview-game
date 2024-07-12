import { useState } from 'react';
import { FormattedMessage } from "react-intl";
import LanguageIcon from '../assets/icons/language.svg?react';
import UKIcon from '../assets/icons/flag-uk.svg?react';
import ItalyIcon from '../assets/icons/flag-italy.svg?react';
import FranceIcon from '../assets/icons/flag-france.svg?react';
import { useLocale } from '../contexts/LocaleContext';

const Header = () => {
  const { locale, setLocale } = useLocale();
  const [showFlags, setShowFlags] = useState(false);
  const handleClick = () => {
    setShowFlags(!showFlags);
  };

  const handleLocale = (selectedLocale) => {
    setLocale(selectedLocale);
    setTimeout(() => {
      if (showFlags) {
        setShowFlags(false);
      }
    }, 1000)
  }

  return (
    <header>
      <p className={showFlags ? 'active' : null}><FormattedMessage id="NAME" /></p>
      <div className={`options ${showFlags ? 'visible' : ''}`}>
        <div className="iconWrapper small" onClick={handleClick}>
          <LanguageIcon />
        </div>
        <div className="flags">
          <div className={`iconWrapper small ${locale === 'en' ? 'active' : null}`} onClick={() => handleLocale('en')}>
            <UKIcon />
          </div>
          <div className={`iconWrapper small ${locale === 'it' ? 'active' : null}`} onClick={() => handleLocale('it')}>
            <ItalyIcon />
          </div>
          <div className={`iconWrapper small ${locale === 'fr' ? 'active' : null}`} onClick={() => handleLocale('fr')}>
            <FranceIcon />
          </div>
        </div>
      </div>
    </header>
  )
};

export default Header;