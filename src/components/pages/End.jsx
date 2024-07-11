import React from 'react';

const End = ({ restartHandler, playerId, roomData, possibleWords }) => {
  const handleRestart = () => restartHandler();

  return (
    <div className="infoWrapper fadeIn">
      <div className="gameOver">
        <h1>Game Over</h1>
        <article>
          <h2>Found</h2>
          <div className="playerWords">
            {roomData.players.map((player) => (
              <React.Fragment key={player.id}>
                <h3>{player.name}</h3>
                <div className="grid">
                  {player.words.map((word) => <p key={word}>{word}</p>)}
                </div>
              </React.Fragment>
            ))}
          </div>
          <h2>Unfound</h2>
          <div className="grid">
            {possibleWords.map((word) => <p key={word}>{word}</p>)}
          </div>
        </article>
        <div className="buttonsWrapper">
          {playerId === roomData.players[0].id ? (
            <button onClick={handleRestart}>Restart</button>
          ) : <p>Waiting for host to restart game</p>}
        </div>
      </div>
    </div >
  )
};

export default End;