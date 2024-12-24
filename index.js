import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ACTIONS } from "./src/constants/index.js";
import { generateRandomCode } from "./src/utils/utils.js";
import {
  createRoom,
  joinRoom,
  removeUserFromRooms,
  displayRooms,
  submitWord,
  startGame,
  giveUp,
  restartGame
} from "./server/roomManager.js";

const app = express();
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  console.log('using prod mode');
  app.use(express.static(path.join(__dirname, "/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
} else {
  console.log('using dev mode');
  (async () => {
    const { createProxyMiddleware } = await import("http-proxy-middleware");
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:5173",
        changeOrigin: true,
      })
    );
  })();
}

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    if (!message) {
      console.warn("No data passed in message");
      return;
    }

    let parsedMessage = null;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error("Error parsing message:", error.message);
      return;
    }
    const { action, id, username, roomCode, word, language } = parsedMessage;

    switch (action) {
      case ACTIONS.CREATE_ROOM:
        createRoom(generateRandomCode(), ws, id, username, language);
        break;
      case ACTIONS.JOIN_ROOM:
        if (!roomCode || !username) {
          console.warn("Missing roomCode or username");
          return;
        }
        joinRoom(roomCode, ws, id, username);
        break;
      case ACTIONS.START:
        startGame(roomCode, word);
        break;
      case ACTIONS.SUBMIT_WORD:
        submitWord(ws, roomCode, word);
        break;
      case ACTIONS.GIVE_UP:
        giveUp(ws, roomCode);
        break;
      case ACTIONS.RESTART:
        restartGame(roomCode);
        break;
      case ACTIONS.PING:
        ws.send(JSON.stringify({ action: ACTIONS.PONG }))
        break;
      default:
        console.log("Unknown action", action);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    removeUserFromRooms(ws);
    displayRooms();
  });
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  if (process.env.NODE_ENV === "production") { 
    console.log(`Running in production mode on port ${PORT}`);
  } else {
    console.log(`WebSocket server is running on http://localhost:${PORT}`);
  }
});
