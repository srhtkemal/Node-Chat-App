const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', message => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit('chat-message', { message, name: user });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit('user-disconnected', user);
      delete users[socket.id];
    }
  });
});

app.use(express.static('public'));

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
