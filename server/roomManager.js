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

export const createRoom = (roomCode, socket, id, username) => {
  if (!rooms[roomCode]) {
    rooms[roomCode] = { code: roomCode, players: [] };
  }
  joinRoom(roomCode, socket, id, username);
};

export const joinRoom = (roomCode, socket, id, username) => {
  if (!rooms[roomCode]) {
    socket.send(
      JSON.stringify({
        error: true,
        message: `Invalid code: ${roomCode}`,
      })
    );
    return;
  }
  rooms[roomCode].players.push({ socket, id, username, words: [], score: 0, giveUp: false });
  broadcastRoomUpdate(roomCode, socket);
  console.log(`${username} joined room: ${roomCode}`);
};

export const removeUserFromRooms = (socket) => {
  for (const roomCode in rooms) {
    if (rooms[roomCode].players.map((player) => player.socket).includes(socket)) {
      console.log(`removing player from room ${roomCode}`);
      const updatedRoom = rooms[roomCode].players.filter((player) => player.socket !== socket);
      rooms[roomCode].players = updatedRoom;
      if (rooms[roomCode].players.length === 0) {
        console.log(`deleting room ${roomCode} as no players in it`);
        delete rooms[roomCode];
      } else {
        console.log(`sending update to ${roomCode} to nofify of new room size`);
        broadcastRoomUpdate(roomCode);
      }
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

export const startGame = (roomCode, word) => {
  const room = getRoom(roomCode);
  if (!room) return;
  room.letters = splitAndShuffleString(word)
  broadcastRoomUpdate(roomCode, null, true);
};

export const restartGame = (roomCode) => {
  const room = getRoom(roomCode);
  if (!room) return;
  room.givenUp = false;
  room.players = room.players.map((player) => ({ ...player, words: [], score: 0, giveUp: false }));
  broadcastRoomUpdate(roomCode, null, true, true);
};

export const giveUp = (ws, roomCode) => {
  const room = getRoom(roomCode);
  if (!room) return;
  room.players = room.players.map((player) => player.socket === ws ? { ...player, giveUp: !player.giveUp } : player);
  room.givenUp = room.players.every((player) => player.giveUp);
  broadcastRoomUpdate(roomCode);
};

export const broadcastRoomUpdate = (roomCode, currentSocket, progressAll, restart) => {
  const room = rooms[roomCode];
  if (room) {
    room.players.forEach(({ socket }) => {
      socket.send(
        JSON.stringify({
          action: restart ? ACTIONS.RESTART : ACTIONS.UPDATE_ROOM,
          roomCode: roomCode,
          letters: room.letters,
          players: room.players.map(({ id, username, words, score, giveUp }) => ({
            id,
            name: username,
            words,
            score,
            giveUp
          })),
          goToNextPage: progressAll || currentSocket === socket,
          givenUp: room.givenUp
        })
      );
    });
  } else {
    console.warn(`Room ${room} not found or no clients in the room.`);
  }
};
