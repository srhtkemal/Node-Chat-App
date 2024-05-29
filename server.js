// Import the express module
const express = require('express');
// Import the http module
const http = require('http');
// Import the socket.io module
const socketIo = require('socket.io');

// Create an instance of an express app
const app = express();
// Create an HTTP server using the express app
const server = http.createServer(app);
// Create a Socket.io server using the HTTP server
const io = socketIo(server);

// Object to store connected users
const users = {};

// Listen for new connections to the Socket.io server
io.on('connection', socket => {
  // Listen for the 'new-user' event from the client
  socket.on('new-user', name => {
    // Store the new user's name with the socket ID
    users[socket.id] = name;
    // Broadcast to all other clients that a new user has connected
    socket.broadcast.emit('user-connected', name);
  });

  // Listen for the 'send-chat-message' event from the client
  socket.on('send-chat-message', message => {
    // Get the user name associated with the socket ID
    const user = users[socket.id];
    if (user) {
      // Broadcast the chat message to all other clients
      socket.broadcast.emit('chat-message', { message, name: user });
    }
  });

  // Listen for the 'disconnect' event
  socket.on('disconnect', () => {
    // Get the user name associated with the socket ID
    const user = users[socket.id];
    if (user) {
      // Broadcast to all other clients that a user has disconnected
      socket.broadcast.emit('user-disconnected', user);
      // Remove the user from the users object
      delete users[socket.id];
    }
  });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
