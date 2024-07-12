import { useState } from 'react';
import { FormattedMessage } from "react-intl";
import UKIcon from '../../assets/icons/flag-uk.svg?react';
import ItalyIcon from '../../assets/icons/flag-italy.svg?react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { ACTIONS } from '../../constants';

const CreateLobby = ({ playerId, backHandler }) => {
  const ws = useWebSocket();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('ENGLISH');

  const handleInput = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleCreate = () => {
    if (!name.length) return;
    ws.current.send(
      JSON.stringify({ action: ACTIONS.CREATE_ROOM, id: playerId, username: name, language })
    );
  };

  const handleLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleBack = () => {
    backHandler();
  }

  return (
    <div className="infoWrapper">
      <div className="info">
        <h1><FormattedMessage id="HOST_LOBBY" /></h1>
        <article>
          <h2><FormattedMessage id="PLAYER_NAME" /></h2>
          <input type="text" value={name} onChange={handleInput} />
          <div className="languageInputs">
            <div className={`iconWrapper small ${language === 'ENGLISH' ? 'active' : null}`} onClick={() => handleLanguage('ENGLISH')}>
              <UKIcon />
            </div>
            <div className={`iconWrapper small ${language === 'ITALIAN' ? 'active' : null}`} onClick={() => handleLanguage('ITALIAN')}>
              <ItalyIcon />
            </div>
          </div>
        </article>
        <div className="buttonsWrapper">
          <button onClick={handleCreate} disabled={name.length < 2}><FormattedMessage id="CREATE" /></button>
          <button onClick={handleBack}><FormattedMessage id="BACK" /></button>
        </div>
      </div>
    </div >
  )
};

export default CreateLobby;