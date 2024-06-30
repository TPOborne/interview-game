import { useState } from 'react';

const CreateLobby = ({ nextHandler }) => {
  const [name, setName] = useState('');

  const handleInput = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleCreate = (event) => {
    nextHandler(event, 3);
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
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div >
  )
};

export default CreateLobby;