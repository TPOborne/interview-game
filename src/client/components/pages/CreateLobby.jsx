import { useState } from 'react';

const CreateLobby = ({ nextHandler }) => {
  const [name, setName] = useState('');

  const handleInput = (event) => {
    const { value } = event.target;
    setName(value);
  };

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Create Lobby</h1>
        <article>
          <h2>Player name</h2>
          <input type="text" value={name} onChange={handleInput} />
        </article>
        <div className="buttonsWrapper">
          <button onClick={(e) => nextHandler(e, 3)}>Create</button>
        </div>
      </div>
    </div >
  )
};

export default CreateLobby;