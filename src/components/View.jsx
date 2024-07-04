import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import Lobby from './pages/Lobby';
import { useWebSocket } from '../contexts/WebSocketContext';

const View = () => {
	const ws = useWebSocket();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [roomData, setRoomData] = useState({
		code: 'ABCD',
		players: [],
	});

	const handleNext = (event, nextView) => {
		console.log(nextView);
		if (!nextView) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			setCurrentIndex(nextView);
		}
	}

	useEffect(() => {
		const handleWebSocketMessage = (event) => {
			try {
				const { action, roomCode, players } = JSON.parse(event.data);
				switch (action) {
					case 'UPDATE_ROOM':
						setRoomData({ ...roomData, code: roomCode, players });
						break;
					default:
						console.log("Unhandled action from server:", action);
						break;
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

	return (
		<main>
			<div className="contents">
				{currentIndex === 0 && <Home nextHandler={handleNext} />}
				{currentIndex === 1 && <CreateLobby nextHandler={handleNext} />}
				{currentIndex === 2 && <JoinLobby nextHandler={handleNext} />}
				{currentIndex === 3 && <Lobby nextHandler={handleNext} roomData={roomData} />}
				{currentIndex === 4 && <Game />}
			</div>
		</main>
	);
}

export default View;