// Wait for the DOM (Document Object Model) to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Connect to the Socket.io server
  const socket = io('http://localhost:3000');
  // Get the message container element
  const messageContainer = document.getElementById('message-container');
  // Get the message form element
  const messageForm = document.getElementById('send-container');
  // Get the message input element
  const messageInput = document.getElementById('message-input');

  // Prompt the user for their name
  const name = prompt('What is your name?').trim();
  if (!name) {
    // If no name is provided, show an alert and stop execution
    alert('Name is required');
    return;
  }
  // Append a message indicating the user joined
  appendMessage('You joined');
  // Emit the 'new-user' event to the server with the user's name
  socket.emit('new-user', name);

  // Listen for 'chat-message' events from the server
  socket.on('chat-message', data => {
    // Append the received chat message
    appendMessage(`${data.name}: ${data.message}`);
  });

  // Listen for 'user-connected' events from the server
  socket.on('user-connected', name => {
    // Append a message indicating a user connected
    appendMessage(`${name} connected`);
  });

  // Listen for 'user-disconnected' events from the server
  socket.on('user-disconnected', name => {
    // Append a message indicating a user disconnected
    appendMessage(`${name} disconnected`);
  });

  // Add an event listener to the message form
  messageForm.addEventListener('submit', e => {
    // Prevent the form from submitting normally
    e.preventDefault();
    // Get the trimmed message input value
    const message = messageInput.value.trim();
    if (!message) return;
    // Append the user's message to the message container
    appendMessage(`You: ${message}`);
    // Emit the 'send-chat-message' event to the server with the message
    socket.emit('send-chat-message', message);
    // Clear the message input field
    messageInput.value = '';
  });

  // Function to append a message to the message container
  function appendMessage(message) {
    // Create a new div element for the message
    const messageElement = document.createElement('div');
    // Set the inner text of the message element
    messageElement.innerText = message;
    // Append the message element to the message container
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
});
