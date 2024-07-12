import LanguageIcon from '../assets/icons/language.svg?react';
import UKIcon from '../assets/icons/flag-uk.svg?react';
import ItalyIcon from '../assets/icons/flag-italy.svg?react';

const Header = () => {
  return (
    <header>
      <p>Word Race</p>
      <div className="iconWrapper small">
        <LanguageIcon />
      </div>
    </header>
  )
};

export default Header;