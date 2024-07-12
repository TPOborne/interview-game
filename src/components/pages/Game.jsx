import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FormattedMessage } from "react-intl";
import FlagIcon from '../../assets/icons/flag.svg?react';
import BinIcon from '../../assets/icons/bin.svg?react';
import UndoIcon from '../../assets/icons/undo.svg?react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const Game = ({ roomData, playerId, wordList, possibleWords }) => {
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
  const [lastLetterIds, setLastLetterIds] = useState([]);
  const prevRoomData = useRef();

  const disabledActions = useMemo(() => {
    return (animating || roomData.givenUp);
  }, [animating, roomData.givenUp]);

  const handleClick = (selectedLetter) => {
    if (disabledActions) return;
    if (!selectedLetter.selected) {
      setLetters((prev) => (prev.map((letter) => letter.id === selectedLetter.id ? { ...selectedLetter, selected: true } : letter)));
      setLastLetterIds((prev) => [...prev, selectedLetter.id]);
      setWord((prev) => prev.concat(selectedLetter.value));
    }
  };

  const handleGiveUp = () => {
    if (disabledActions) return;
    handleDelete();
    ws.current.send(
      JSON.stringify({ action: ACTIONS.GIVE_UP, roomCode: roomData.code })
    );
  };

  const handleDelete = () => {
    if (disabledActions) return;
    setWord('');
    setLetters((prev) => prev.map((letter) => ({ ...letter, selected: false })));
    setLastLetterIds([]);
  };

  const handleUndo = () => {
    if (disabledActions || word.length === 0 || !lastLetterIds.length) return;
    setWord((prevWord) => prevWord.substring(0, prevWord.length - 1));
    setLetters((prevLetters) => prevLetters.map((letter) => letter.id === lastLetterIds[lastLetterIds.length - 1] ? { ...letter, selected: false } : letter));
    setLastLetterIds((prevIds) => prevIds.slice(0, prevIds.length -1));
  }

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

  const foundWords = useMemo(() => {
    if (!roomData?.players?.length) return 0;
    const foundWords = roomData.players.reduce((total, player) => {
      return total + player.words.length;
    }, 0);
    return foundWords;
  }, [roomData.players]);

  return (
    <div className={`game ${roomData.givenUp ? 'fadeOut' : ''}`}>
      <div className="playerScoresWrapper">
        {roomData.players.map((player, index) => (
          <div className="playerScore" key={index}>
            <p>{player.name}</p>
            <h2>{player.score}</h2>
            {latestWords[player.id] && (
              <h6>{latestWords[player.id]}</h6>
            )}
            {player.giveUp && (
              <h6 className="giveUp">
                <FormattedMessage id="GIVE_UP" />
              </h6>
            )}
          </div>
        ))}
      </div>
      <h1 className={animating ? 'textCorrect' : null}>{word}</h1>
      <p className={!wordTaken ? "hidden wordTaken" : "textWrong wordTaken"}>
        {wordTaken ? (
          wordTaken.id === playerId ? (
            <FormattedMessage id="YOU_HAVE_WORD" />
          ) : (
            <FormattedMessage id="THEY_HAVE_WORD" values={{ value: wordTaken.name }} />
          )
        ) : 'blank'}
      </p>
      <h6>
        <FormattedMessage id="WORDS_LEFT" values={{ value: possibleWords.length - foundWords }} />
      </h6>
      <div className="grid">
        {letters.map((letter) => (
          <div key={letter.id} className={`tile ${!letter.selected ? null : (animating ? 'correct' : 'selected')}`} onClick={() => handleClick(letter)}>
            {letter.value}
          </div>
        ))}
      </div>
      <div className="buttons">
        <div className="iconWrapper" onClick={handleGiveUp}>
          <FlagIcon />
        </div>
        <div className="iconWrapper" onClick={handleDelete}>
          <BinIcon />
        </div>
        <div className="iconWrapper" onClick={handleUndo}>
          <UndoIcon />
        </div>
      </div>
    </div>

  );
};

export default Game;