import { useState, useEffect, useCallback, useRef } from 'react';
import BinIcon from '../../assets/icons/bin.svg?react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const Game = ({ roomData, playerId, wordList }) => {
  const [letters, setLetters] = useState(roomData.letters.map((letter, index) => ({
    id: index + 1,
    value: letter,
    selected: false
  })));
  const [word, setWord] = useState('');
  const ws = useWebSocket();
  const [animating, setAnimating] = useState(false);
  const [wordTaken, setWordTaken] = useState(false);
  const [latestWords, setLatestWords] = useState({});
  const prevRoomData = useRef();

  const handleClick = (selectedLetter) => {
    if (animating) return;
    setLetters((prev) => (prev.map((letter) => letter.id === selectedLetter.id ? { ...selectedLetter, selected: true } : letter)));
    if (!selectedLetter.selected) {
      setWord((prev) => prev.concat(selectedLetter.value));
    }
  };

  const handleDelete = () => {
    setWord('');
    setLetters((prev) => prev.map((letter) => ({ ...letter, selected: false })));
  };

  const checkWordValid = useCallback((currentWord) => {
    if (!wordList) return false;
    const isValid = wordList.includes(currentWord);
    return isValid;
    // emit to server
  }, [wordList]);

  useEffect(() => {
    const playerHasWord = roomData.players.find((player) => player.words.includes(word));
    setWordTaken(playerHasWord);
    if (playerHasWord) return;
    if (!word.length || !letters[4].selected) return;
    const wordIsValid = checkWordValid(word);
    if (!wordIsValid) return;
    ws.current.send(
      JSON.stringify({ action: ACTIONS.SUBMIT_WORD, roomCode: roomData.code, word })
    );
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
      handleDelete();
    }, 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word, checkWordValid, ws, roomData.code, letters]);

  useEffect(() => {
    const previous = prevRoomData.current;
    if (previous) {
      if (roomData !== previous) {
        const changedPlayer = roomData.players.find((player) => player.words.length !== previous.players.find(({id}) => id === player.id).words.length);
        if (changedPlayer) {
          const newWord = changedPlayer.words[changedPlayer.words.length - 1];
          setLatestWords((prev) => {
            const words = { ...prev };
            words[changedPlayer.id] = newWord;
            return words;
          });
          setTimeout(() => {
            setLatestWords((prev) => {
              const words = { ...prev };
              words[changedPlayer.id] = null;
              return words;
            });
          }, 1500);
        }
      }
    }
    prevRoomData.current = roomData;
  }, [roomData]);

  return (
    <div className="game">
      <div className="playerScoresWrapper">
        {roomData.players.map((player, index) => (
          <div className="playerScore" key={index}>
            <p>{player.name}</p>
            <h2>{player.score}</h2>
            {latestWords[player.id] && (
              <h6>{latestWords[player.id]}</h6>
            )}
          </div>
        ))}
      </div>
      <h1 className={animating ? 'textCorrect' : null}>{word}</h1>
      <p className={!wordTaken ? "hidden" : "textWrong"}>
        {wordTaken ? (
          wordTaken.id === playerId ? 'You have this word' : `${wordTaken.name} has this word`
        ) : 'word taken'}
      </p>
      <div className="grid">
        {letters.map((letter) => (
          <div key={letter.id} className={`tile ${!letter.selected ? null : (animating ? 'correct' : (wordTaken ? 'wrong' : 'selected'))}`} onClick={() => handleClick(letter)}>
            {letter.value}
          </div>
        ))}
      </div>
      <div className="buttons">
        <div className={animating ? "iconWrapper hidden" : "iconWrapper"} onClick={handleDelete}>
          <BinIcon />
        </div>
      </div>
    </div>

  );
};

export default Game;