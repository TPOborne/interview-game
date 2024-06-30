import { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import CreateLobby from './pages/CreateLobby';
import JoinLobby from './pages/JoinLobby';
import Lobby from './pages/Lobby';

const View = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [roomData, setRoomData] = useState({
		code: 'WXYZ',
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
	// const handleRestart = () => setCurrentIndex(0);

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