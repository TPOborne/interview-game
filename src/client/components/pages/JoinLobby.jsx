import { useState } from 'react';

const JoinLobby = ({ nextHandler }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleName = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleCode = (event) => {
    const { value } = event.target;
    setCode(value);
  };

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
          <button onClick={nextHandler}>Join</button>
        </div>
      </div>
    </div >
  )
};

export default JoinLobby;