const socket = io();
let user = {};
let typingTimeout;

// Join chat
function joinChat() {
  const username = document.getElementById('username').value.trim();
  const role = document.getElementById('role').value;

  if (!username) return alert('Enter your name.');

  user = { username, role };

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('chat-container').classList.remove('hidden');

  document.getElementById('role-label').textContent = `${role.toUpperCase()}: ${username}`;

  socket.emit('join', user);
}

// Handle sending messages
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit('chat message', {
      text: message,
      user
    });
    input.value = '';
  }
  socket.emit('stop typing');
});

input.addEventListener('input', () => {
  socket.emit('typing', user.username);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => socket.emit('stop typing'), 1000);
});

// Listen for messages
socket.on('chat message', function (msg) {
  const item = document.createElement('div');
  item.innerHTML = `<div><span class="font-semibold">${msg.user.role.toUpperCase()} ${msg.user.username}</span> 
    <span class="text-gray-500 text-xs">[${msg.time}]</span><div>${msg.text}</div></div>`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

// Typing indicator
socket.on('typing', function (name) {
  typingIndicator.textContent = `${name} is typing...`;
});

socket.on('stop typing', function () {
  typingIndicator.textContent = '';
});
