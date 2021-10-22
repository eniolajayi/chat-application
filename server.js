const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const createMessageData = require("./utils/formatting");
const {
  addUser,
  removeUser,
  getCurrentUser,
  getRoomUsers,
  getAllUsers,
} = require("./utils/user");

// const MESSAGE_EVENT ="message";
// const MESSAGE_IN_CHAT_EVENT ="";
// const JOIN_ROOM_EVENT ="";
// const USERS_IN_ROOM_EVENT ="";

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000 || process.env.PORT;
const botName = "Bot";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("connected to socket");

  // On user joining room
  socket.on("join_room", ({ username, room }) => {
    const user = addUser(socket.id, username, room);
    socket.join(user.room);
    // Welcome user
    socket.emit(
      "message",
      createMessageData(botName, "Welcome, Let's get chatty")
    );
    // let room know whena user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        createMessageData(botName, `${user.username} as joined the chat`)
      );
    // send users and room info
    io.to(user.room).emit("room_users", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chat message
  socket.on("chat_message", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit("message", createMessageData(user.username, msg));
    }
  });

  // send event when user disconnects
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        createMessageData(botName, `${user.username} as left the chat`)
      );

      // send info
      io.to(user.room).emit("room_users", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
