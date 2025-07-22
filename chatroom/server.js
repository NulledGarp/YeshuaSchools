const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  let currentUser = {};

  socket.on('join', (userData) => {
    currentUser = userData;
    console.log(`${userData.role.toUpperCase()} ${userData.username} joined`);
  });

  socket.on('chat message', (data) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    io.emit('chat message', {
      text: data.text,
      time,
      user: data.user
    });
  });

  socket.on('typing', (name) => {
    socket.broadcast.emit('typing', name);
  });

  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
