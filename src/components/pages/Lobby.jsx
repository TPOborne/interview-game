const Lobby = ({ nextHandler, roomData }) => {
  const { code, players } = roomData;
  return (
    <div className="infoWrapper">
      <div className="info">
        <h1>Lobby</h1>
        <article>
          <h2>Code: {code}</h2>
          <ul>
            {players.map((player, index) => <li key={index}>{player}</li>)}
          </ul>
        </article>
        <div className="buttonsWrapper">
          <button onClick={nextHandler}>Start</button>
        </div>
      </div>
    </div >
  )
};

export default Lobby;