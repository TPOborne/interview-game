import { useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import View from './components/View';
import Footer from './components/Footer';

const App = () => {
  const connection = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.host}`);

    // Connection opened
    ws.addEventListener("open", (event) => {
      ws.send(JSON.stringify({ message: "Hello I am client" }));
    })

    // Listen for messages
    ws.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
    })

    connection.current = ws;

    return () => connection.close()
  }, []);

  return (
    <>
      <Header />
      <View />
      <Footer />
    </>
  )
}

export default App;
