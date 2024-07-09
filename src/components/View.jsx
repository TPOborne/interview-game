import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Home from './pages/Home';
import Game from './pages/Game';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import Lobby from './pages/Lobby';
import { useWebSocket } from '../contexts/WebSocketContext';
import { ACTIONS } from '../constants';

const View = () => {
	const ws = useWebSocket();
	const [playerId, setPlayerId] = useState()
	const [currentIndex, setCurrentIndex] = useState(0);
	const [roomData, setRoomData] = useState({
		code: 'ABCD',
		players: [],
	});
	const [errorMessage, setErrorMessage] = useState();

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
					const { action, roomCode, players, goToNextPage } = parsedData;
					if (goToNextPage) {
						if (currentIndex === 1) {
							handleNext(null, 3);
						} else {
							handleNext();
						}
					}
					switch (action) {
						case 'UPDATE_ROOM':
							setRoomData((prev) => ({ ...prev, code: roomCode, players }));
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

	return (
		<main>
			<div className="contents">
				{currentIndex === 0 && <Home nextHandler={handleNext} />}
				{currentIndex === 1 && <CreateLobby playerId={playerId} />}
				{currentIndex === 2 && <JoinLobby playerId={playerId} />}
				{currentIndex === 3 && <Lobby startHandler={handleStart} roomData={roomData} />}
				{currentIndex === 4 && <Game roomData={roomData} playerId={playerId} />}
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