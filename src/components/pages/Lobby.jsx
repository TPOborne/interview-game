import { useState } from 'react';

const Lobby = ({ startHandler, roomData }) => {
  const { code, players } = roomData;
  const [disabled, setDisabled] = useState(false);

  const handleStart = () => {
    setDisabled(true);
    startHandler();
  };

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Lobby</h1>
        <article>
          <h2>Code: {code}</h2>
          <ul>
            {players.map((player, index) => <li key={index}>{player.name}</li>)}
          </ul>
        </article>
        <div className="buttonsWrapper">
          <button onClick={handleStart} disabled={disabled}>Start</button>
        </div>
      </div>
    </div >
  )
};

export default Lobby;