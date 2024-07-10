import { ACTIONS } from "../src/constants/index.js";
import { splitAndShuffleString } from '../src/utils/utils.js';

const rooms = {};

const getRoom = (roomCode) => {
  const room = rooms[roomCode];
  if (!room) {
    console.error(`room with code ${roomCode} does not exist.`);
    return false;
  }
  return room;
};

export const createRoom = (room, socket, id, username, word) => {
  if (!rooms[room]) {
    rooms[room] = { letters: splitAndShuffleString(word), players: [] };
  }
  joinRoom(room, socket, id, username);
};

export const joinRoom = (room, socket, id, username) => {
  if (!rooms[room]) {
    socket.send(
      JSON.stringify({
        error: true,
        message: `Invalid code: ${room}`,
      })
    );
    return;
  }
  rooms[room].players.push({ socket, id, username, words: [], score: 0 });
  broadcastRoomUpdate(room, socket);
  console.log(`${username} joined room: ${room}`);
};

export const removeUserFromRooms = (socket) => {
  for (const room in rooms) {
    rooms[room].players = rooms[room].players.filter((user) => user.socket !== socket);
    if (rooms[room].players.length === 0) {
      delete rooms[room];
    } else {
      broadcastRoomUpdate(room);
    }
  }
};

export const displayRooms = () => {
  const roomData = Object.keys(rooms).map((room) => {
    return {
      room,
      users: rooms[room].players.map((user) => user.username).join(", "),
    };
  });
  console.table(roomData);
};

export const submitWord = (socket, roomCode, word) => {
  const room = getRoom(roomCode);
  if (!room) return;
  const player = room.players.find((player) => player.socket === socket);
  if (!player) {
    console.error(`player does not exist in room ${roomCode}`);
    return;
  }
  console.log(
    `player ${player.username} submitted word ${word} to room ${roomCode}`
  );
  player.score += 1;
  player.words.push(word);
  broadcastRoomUpdate(roomCode);
};

export const startGame = (roomCode) => {
  const room = getRoom(roomCode);
  if (!room) return;
  broadcastRoomUpdate(roomCode, null, true);
};

export const broadcastRoomUpdate = (roomCode, currentSocket, progressAll) => {
  const room = rooms[roomCode];
  if (room) {
    room.players.forEach(({ socket }) => {
      socket.send(
        JSON.stringify({
          action: ACTIONS.UPDATE_ROOM,
          roomCode: roomCode,
          letters: room.letters,
          players: room.players.map(({ id, username, words, score }) => ({
            id,
            name: username,
            words,
            score,
          })),
          goToNextPage: progressAll || currentSocket === socket,
        })
      );
    });
  } else {
    console.warn(`Room ${room} not found or no clients in the room.`);
  }
};
