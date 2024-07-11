import { useState } from 'react';

const Lobby = ({ startHandler, roomData, playerId }) => {
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
          {playerId === roomData.players[0].id ? (
            <button onClick={handleStart} disabled={disabled}>Start</button>
          ): <p>Waiting for host to start game</p>}
        </div>
      </div>
    </div >
  )
};

export default Lobby;