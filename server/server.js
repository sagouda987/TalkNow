const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const rooms = {};

io.on('connection', socket => {
  console.log('socket connected', socket.id);

  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    rooms[roomId] = rooms[roomId] || { participants: {} };
    rooms[roomId].participants[socket.id] = user || { id: socket.id, name: 'Anonymous' };
    socket.to(roomId).emit('user-joined', { socketId: socket.id, user: rooms[roomId].participants[socket.id] });
    const participants = Object.entries(rooms[roomId].participants).map(([sid,u])=>({ socketId: sid, user: u }));
    socket.emit('room-data', { participants });
  });

  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      delete rooms[roomId].participants[socket.id];
      socket.to(roomId).emit('user-left', { socketId: socket.id });
      if (Object.keys(rooms[roomId].participants).length === 0) delete rooms[roomId];
    }
  });

  socket.on('chat-message', ({ roomId, message }) => {
    io.to(roomId).emit('chat-message', { author: message.author, text: message.text, ts: Date.now() });
  });

  socket.on('signal', ({ roomId, to, data }) => {
    if (to) io.to(to).emit('signal', { from: socket.id, data });
  });

  socket.on('disconnect', () => {
    for (const roomId of Object.keys(rooms)) {
      if (rooms[roomId].participants && rooms[roomId].participants[socket.id]) {
        delete rooms[roomId].participants[socket.id];
        socket.to(roomId).emit('user-left', { socketId: socket.id });
        if (Object.keys(rooms[roomId].participants).length === 0) delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, ()=> console.log('Server listening on', PORT));
