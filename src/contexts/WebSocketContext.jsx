/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useEffect } from "react";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);

  useEffect(() => {
    console.log("Initializing WebSocket connection");
    const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
    ws.current = new WebSocket(`${protocol}://${window.location.host}`);

    return () => {
      ws.current.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
};
