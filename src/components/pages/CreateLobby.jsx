import { useState } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const CreateLobby = ({ playerId }) => {
  const ws = useWebSocket();
  const [name, setName] = useState('');

  const handleInput = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleCreate = () => {
    if (!name.length) return;
    ws.current.send(
      JSON.stringify({ action: ACTIONS.CREATE_ROOM, id: playerId, username: name })
    );
  }

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Create Lobby</h1>
        <article>
          <h2>Player name</h2>
          <input type="text" value={name} onChange={handleInput} />
        </article>
        <div className="buttonsWrapper">
          <button onClick={handleCreate} disabled={name.length < 2}>Create</button>
        </div>
      </div>
    </div >
  )
};

export default CreateLobby;