import { useState } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const JoinLobby = ({ nextHandler }) => {
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
    ws.current.send(
      JSON.stringify({ action: ACTIONS.JOIN_ROOM, username: name, roomCode: code })
    );
    nextHandler();
  }

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Join Lobby</h1>
        <div>
          <article>
            <h2>Player name</h2>
            <input type="text" value={name} onChange={handleName} maxLength={12} />
          </article>
          <br />
          <article>
            <h2>Code</h2>
            <input type="text" value={code} onChange={handleCode} maxLength={4} />
          </article>
        </div>
        <div className="buttonsWrapper">
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    </div >
  )
};

export default JoinLobby;