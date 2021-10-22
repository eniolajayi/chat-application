const ready = function (callback) {
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", function (e) {
        callback();
      })
    : callback();
};

// Usage
ready(function () {
  // // get required elements from DOM
  const chatForm = document.getElementById("chat-form");
  const chatMessages = document.querySelector(".chat-messages");
  const roomName = document.getElementById("room-name");
  const userList = document.getElementById("users");
  const socket = io();
  const title = document.title;
  // // get username and room from url
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  document.title = `${title} - ${username}`;
  // join chat room
  socket.emit("join_room", { username, room });

  // get room users
  socket.on("room_users", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  // get message from server
  socket.on("message", (message) => {
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // send message
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = e.target.elements.msg.value;
    console.log(message);
    // emit message to server
    socket.emit("chat_message", message);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
  });

  function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
    <p class="meta"> ${message.username} <span class="time">${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector(".chat-messages").appendChild(div);
  }

  // add room name to DOM
  function outputRoomName(room) {
    roomName.innerText = room;
  }

  // Add users to dom
  function outputUsers(users) {
    userList.innerHTML = `
    ${users
      .map((user) => `<li class="users__username">${user.username}</li>`)
      .join("")}
    `;
  }
});
