import './App.css';
import Header from './components/Header';
import View from './components/View';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { LanguageProvider } from './contexts/LanguageContext';

const App = () => {
  return (
    <WebSocketProvider>
      <LanguageProvider>
        <Header />
        <View />
      </LanguageProvider>
    </WebSocketProvider>
  );
};

export default App;
