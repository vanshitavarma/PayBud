const { Server } = require('socket.io');
const { verifyToken } = require('../utils/jwt');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.user = verifyToken(token);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user.userId);
    console.log(`🔌 User ${socket.user.userId} connected`);

    socket.on('join:group', (groupId) => socket.join(`group:${groupId}`));
    socket.on('leave:group', (groupId) => socket.leave(`group:${groupId}`));
    socket.on('disconnect', () => console.log(`❌ User ${socket.user.userId} disconnected`));
  });

  return io;
}

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
