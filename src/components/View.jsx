import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Home from './pages/Home';
import Game from './pages/Game';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import Lobby from './pages/Lobby';
import End from './pages/End';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ACTIONS } from '../constants';
import { shuffleArray, canFormWords } from '../utils/utils';

const View = () => {
	const ws = useWebSocket();
	const { language } = useLanguage();
	const [playerId, setPlayerId] = useState()
	const [currentIndex, setCurrentIndex] = useState(0);
	const [roomData, setRoomData] = useState({
		letters: [],
		code: 'ABCD',
		players: [],
	});
	const [errorMessage, setErrorMessage] = useState();
	const [wordList, setWordList] = useState(null);
	const [chosenWord, setChosenWord] = useState('');
	const [possibleWords, setPossibleWords] = useState([]);

	const handleNext = (event, nextView) => {
		if (nextView === null || nextView === undefined) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			setCurrentIndex(nextView);
		}
	};

	const handleStart = () => {
		ws.current.send(
			JSON.stringify({ action: ACTIONS.START, roomCode: roomData.code, word: chosenWord })
		);
	};

	const handleRestart = () => {
		ws.current.send(
			JSON.stringify({ action: ACTIONS.RESTART, roomCode: roomData.code })
		);
	};

	const handleBack = (event, numberBack) => {
		if (currentIndex > 0) {
			const newIndex = currentIndex - (numberBack ? numberBack : 1);
			setCurrentIndex(newIndex);
		}
	};

	useEffect(() => {
		const handleWebSocketMessage = (event) => {
			try {
				const parsedData = JSON.parse(event.data);
				if (parsedData.error) {
					setErrorMessage(parsedData.message);
				} else {
					const { action, roomCode, players, letters, goToNextPage, givenUp } = parsedData;
					if (goToNextPage) {
						if (currentIndex === 1) {
							handleNext(null, 3);
						} else {
							handleNext();
						}
					}
					switch (action) {
						case ACTIONS.UPDATE_ROOM:
							setRoomData((prev) => ({ ...prev, code: roomCode, players, letters, givenUp }));
							if (letters && wordList.length) {
								setPossibleWords(canFormWords(wordList, letters));
							}
							break;
						case ACTIONS.RESTART:
							setRoomData((prev) => ({ ...prev, code: roomCode, players, letters, givenUp }));
							const randomWord = shuffleArray(wordList.filter((word) => word.length === 9))[0];
							setChosenWord(randomWord);
							handleNext(null, 3);
						case ACTIONS.PONG:
							console.log('received pong from server');
							break;
						default:
							console.warn("Unhandled action from server:", action);
							break;
					}
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		if (ws.current) {
			ws.current.addEventListener("message", handleWebSocketMessage);
		}

		return () => {
			if (ws.current) {
				ws.current.removeEventListener("message", handleWebSocketMessage);
			}
		};
	}, [ws, currentIndex]);

	useEffect(() => {
		if (errorMessage) {
			setTimeout(() => {
				setErrorMessage(null);
			}, [5000]);
		}
	}, [errorMessage]);

	useEffect(() => {
		if (!playerId) setPlayerId(uuidv4());
	}, [playerId]);

	useEffect(() => {
    if (roomData.givenUp) {
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  }, [roomData.givenUp])

	useEffect(() => {
    const loadWordList = async () => {
      try {
				let file = null;
				if (language === 'ENGLISH') file = "/english3.txt";
				if (language === 'ITALIAN') file = "/italiano.txt";
				if (!file) throw new Error('No language specified');
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error("Failed to fetch the file");
        }
        const text = await response.text();
        const arrayOfWords = text.split("\n");
        const cleanedWords = arrayOfWords.map(word => word.trim()).filter((word) => word.length >= 4 && word.length <= 9);
        setWordList(cleanedWords);
				const randomWord = shuffleArray(cleanedWords.filter((word) => word.length === 9))[0];
				setChosenWord(randomWord);
      } catch (error) {
        console.error("Error:", error.message);
        setWordList(null);
      }
    };

    loadWordList();
  }, [language]);

	return (
		<main>
			<div className="contents">
				{currentIndex === 0 && <Home nextHandler={handleNext} />}
				{currentIndex === 1 && <CreateLobby playerId={playerId} chosenWord={chosenWord} backHandler={handleBack} />}
				{currentIndex === 2 && <JoinLobby playerId={playerId} backHandler={handleBack} />}
				{currentIndex === 3 && <Lobby startHandler={handleStart} roomData={roomData} playerId={playerId} />}
				{currentIndex === 4 && <Game roomData={roomData} playerId={playerId} wordList={wordList} possibleWords={possibleWords} />}
				{currentIndex === 5 && <End restartHandler={handleRestart} playerId={playerId} roomData={roomData} possibleWords={possibleWords} />}
			</div>
			{errorMessage && (
				<div className="errorPopup">
					{errorMessage}
				</div>
			)}
		</main>
	);
}

export default View;