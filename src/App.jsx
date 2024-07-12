import './App.css';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { LocaleProvider } from './contexts/LocaleContext';
import Content from './Content';

const App = () => {
  return (
    <WebSocketProvider>
      <LocaleProvider>
        <Content />
      </LocaleProvider>
    </WebSocketProvider>
  );
};

export default App;
