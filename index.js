/* eslint-disable no-undef */
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

wss.on("connection", (ws) => {
  const id = setInterval(() => {
    ws.send(JSON.stringify(process.memoryUsage()), () => {});
  }, 100);
  console.log("started client inverval");

  ws.on("close", () => {
    console.log("stopping client interval");
    clearInterval(id);
  });
});

server.listen(8080, () => {
  console.log("Listening on http://localhost:8080");
});
