import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Home from './pages/Home';
import Game from './pages/Game';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import Lobby from './pages/Lobby';
import { useWebSocket } from '../contexts/WebSocketContext';
import { ACTIONS } from '../constants';
import { shuffleArray, canFormWords } from '../utils/utils';

const View = () => {
	const ws = useWebSocket();
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
		if (!nextView) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			setCurrentIndex(nextView);
		}
	};

	const handleStart = () => {
		ws.current.send(
			JSON.stringify({ action: ACTIONS.START, roomCode: roomData.code })
		);
	};

	useEffect(() => {
		const handleWebSocketMessage = (event) => {
			try {
				const parsedData = JSON.parse(event.data);
				if (parsedData.error) {
					setErrorMessage(parsedData.message);
				} else {
					const { action, roomCode, players, letters, goToNextPage } = parsedData;
					if (goToNextPage) {
						if (currentIndex === 1) {
							handleNext(null, 3);
						} else {
							handleNext();
						}
					}
					switch (action) {
						case 'UPDATE_ROOM':
							setRoomData((prev) => ({ ...prev, code: roomCode, players, letters }));
							if (letters && wordList.length) {
								setPossibleWords(canFormWords(wordList, letters));
							}
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
    const loadWordList = async () => {
      try {
        const response = await fetch("/csw15.txt");
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
  }, []);

	return (
		<main>
			<div className="contents">
				{currentIndex === 0 && <Home nextHandler={handleNext} />}
				{currentIndex === 1 && <CreateLobby playerId={playerId} chosenWord={chosenWord} />}
				{currentIndex === 2 && <JoinLobby playerId={playerId} />}
				{currentIndex === 3 && <Lobby startHandler={handleStart} roomData={roomData} />}
				{currentIndex === 4 && <Game roomData={roomData} playerId={playerId} wordList={wordList} possibleWords={possibleWords} />}
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