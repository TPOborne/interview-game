import React from 'react';
import { FormattedMessage } from "react-intl";

const End = ({ restartHandler, playerId, roomData, possibleWords }) => {
  const handleRestart = () => restartHandler();

  return (
    <div className="infoWrapper fadeIn">
      <div className="gameOver">
        <h1>
          <FormattedMessage id="GAME_OVER" />
        </h1>
        <article>
          <h2>
            <FormattedMessage id="FOUND" />
          </h2>
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
          <h2>
            <FormattedMessage id="UNFOUND" />
          </h2>
          <div className="grid">
            {possibleWords.map((word) => <p key={word}>{word}</p>)}
          </div>
        </article>
        <div className="buttonsWrapper">
          {playerId === roomData.players[0].id ? (
            <button onClick={handleRestart}>
              <FormattedMessage id="RESTART" />
            </button>
          ) : (
            <p>
              <FormattedMessage id="WAITING_FOR_HOST_RESTART" />
            </p>
          )}
        </div>
      </div>
    </div >
  )
};

export default End;