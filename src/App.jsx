import './App.css';
import Header from './components/Header';
import View from './components/View';
import Footer from './components/Footer';
import { WebSocketProvider } from './contexts/WebSocketContext';

const App = () => {
  return (
    <WebSocketProvider>
      <Header />
      <View />
    </WebSocketProvider>
  );
};

export default App;
