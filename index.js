"use strict";

import express from "express";
import path from "path";
import { createServer } from "http";

import { WebSocketServer } from "ws";

const app = express();
const __dirname = path.resolve();

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/dist")));
} else {
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

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "hello from server" }));
  console.log("client connected");

  ws.on("message", (message) => {
    console.log(message.toString());
    // wss.broadcast(message.toString());
  });

  ws.on("close", () => {
    console.log("client disconnected");
  });
});

server.listen(8080, () => {
  console.log("Listening on http://localhost:8080");
});
