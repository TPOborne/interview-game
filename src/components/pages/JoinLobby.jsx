import { useState } from 'react';
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
      JSON.stringify({ action: ACTIONS.JOIN_ROOM, id: playerId, username: name, roomCode: code })
    );
  };

  const handleBack = (event) => {
    backHandler(event, 2);
  };

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Join Lobby</h1>
        <div className="articleWrapper">
          <article>
            <h2>Player name</h2>
            <input type="text" value={name} onChange={handleName} maxLength={12} />
          </article>
          <article>
            <h2>Code</h2>
            <input type="text" value={code} onChange={handleCode} maxLength={4} />
          </article>
        </div>
        <div className="buttonsWrapper">
          <button onClick={handleJoin}>Join</button>
          <button onClick={(e) => handleBack(e)}>Back</button>
        </div>
      </div>
    </div >
  )
};

export default JoinLobby;