import LanguageIcon from '../assets/icons/language.svg?react';

const Header = () => {
  return (
    <header>
      <h3>Word Race</h3>
      <div className="iconWrapper small">
        <LanguageIcon />
      </div>
    </header>
  )
};

export default Header;