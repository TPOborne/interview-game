import { useState } from 'react';
import { FormattedMessage } from "react-intl";
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const JoinLobby = ({ playerId, backHandler }) => {
  const ws = useWebSocket();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleName = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleCode = (event) => {
    const { value } = event.target;
    setCode(value.toUpperCase());
  };

  const handleJoin = () => {
    if (!name || code.length !== 4) return;
    ws.current.send(
      JSON.stringify({ 
        action: ACTIONS.JOIN_ROOM,
        id: playerId,
        username: name,
        roomCode: code 
      })
    );
  };

  const handleBack = (event) => {
    backHandler(event, 2);
  };

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1><FormattedMessage id="JOIN_LOBBY" /></h1>
        <div className="articleWrapper">
          <article>
            <h2>
              <FormattedMessage id="PLAYER_NAME" />
            </h2>
            <input
              type="text"
              value={name}
              onChange={handleName}
              maxLength={12}
            />
          </article>
          <article>
            <h2>
              <FormattedMessage id="CODE" />
            </h2>
            <input
              type="text"
              value={code}
              onChange={handleCode}
              maxLength={4}
            />
          </article>
        </div>
        <div className="buttonsWrapper">
          <button onClick={handleJoin}>
            <FormattedMessage id="JOIN" />
          </button>
          <button onClick={(e) => handleBack(e)}>
            <FormattedMessage id="BACK" />
          </button>
        </div>
      </div>
    </div >
  )
};

export default JoinLobby;