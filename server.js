const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000 || process.env.PORT;
const botName = "MEE6";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("connected to socket");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
