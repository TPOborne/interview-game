import { createContext, useContext, useRef, useEffect } from "react";
import { ACTIONS } from '../constants';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const heartbeatInterval = useRef(null);
  const PING_INTERVAL_MS = 30_000;

  const startHeartbeat = () => {
    heartbeatInterval.current = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
					action: ACTIONS.PING
				}));
      }
    }, PING_INTERVAL_MS);
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
  };

  useEffect(() => {
    startHeartbeat();
    const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
    ws.current = new WebSocket(`${protocol}://${window.location.host}`);

    return () => {
      ws.current.close();
      stopHeartbeat();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};
