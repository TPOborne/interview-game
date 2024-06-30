import { useState } from 'react';
import BinIcon from '../../assets/icons/bin.svg?react';

const Game = () => {
  const [letters, setLetters] = useState(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map((letter, index) => ({
    id: index + 1,
    value: letter,
    selected: false
  })));

  const [word, setWord] = useState('');

  const handleClick = (selectedLetter) => {
    setLetters((prev) => (prev.map((letter) => letter.id === selectedLetter.id ? { ...selectedLetter, selected: true } : letter)));
    if (!selectedLetter.selected) {
      setWord((prev) => prev.concat(selectedLetter.value));
    }
  }

  const handleDelete = () => {
    setWord('');
    setLetters((prev) => prev.map((letter) => ({ ...letter, selected: false })));
  }

  return (
    <div className="game">
      <h1>{word}</h1>
      <div className="grid">
        {letters.map((letter) => (
          <div key={letter.id} className={`tile ${letter.selected ? 'selected' : null}`} onClick={() => handleClick(letter)}>
            {letter.value}
          </div>
        ))}
      </div>
      <div className="buttons">
        <div className="iconWrapper" onClick={handleDelete}>
          <BinIcon />
        </div>
      </div>
    </div>

  );
};

export default Game;