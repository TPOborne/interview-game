import { ACTIONS } from "../src/constants/index.js";

const rooms = {};

export const createRoom = (room, socket, username) => {
  if (!rooms[room]) {
    rooms[room] = [];
  }
  joinRoom(room, socket, username);
};

export const joinRoom = (room, socket, username) => {
  if (!rooms[room]) {
    rooms[room] = [];
  }
  rooms[room].push({ socket, username });
  broadcastRoomUpdate(room);
  console.log(`${username} joined room: ${room}`);
};

export const removeUserFromRooms = (socket) => {
  for (const room in rooms) {
    rooms[room] = rooms[room].filter((user) => user.socket !== socket);
    if (rooms[room].length === 0) {
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
      users: rooms[room].map((user) => user.username).join(", "),
    };
  });
  console.table(roomData);
};

export const broadcastRoomUpdate = (room) => {
  const sockets = rooms[room];
  if (sockets) {
    sockets.forEach(({ socket }) => {
      socket.send(
        JSON.stringify({
          action: ACTIONS.UPDATE_ROOM,
          roomCode: room,
          players: rooms[room].map(({ username }) => username),
        })
      );
    });
  } else {
    console.log(`Room ${room} not found or no clients in the room.`);
  }
};
