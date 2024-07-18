import { useState } from 'react';
import { FormattedMessage } from "react-intl";

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
        <h1>
          <FormattedMessage id="LOBBY" />
        </h1>
        <article>
          <h2>
            <FormattedMessage id="CODE" />: {code}
          </h2>
          <ul>
            {players.map((player, index) => <li key={index}>{player.name}</li>)}
          </ul>
        </article>
        <div className="buttonsWrapper">
          {playerId === roomData.players[0].id ? (
            <button onClick={handleStart} disabled={disabled}>
              <FormattedMessage id="START" />
            </button>
          ) : (
            <p>
              <FormattedMessage id="WAITING_FOR_HOST" />
            </p>
          )}
        </div>
      </div>
    </div >
  )
};

export default Lobby;