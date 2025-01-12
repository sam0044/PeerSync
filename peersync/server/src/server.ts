import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from 'dotenv';

config();

interface Room {
  id: string;
  peers: Set<string>;
}

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN
  }
});

// Track active rooms and their peers
const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join room
  socket.on('join-room', (roomId: string) => {
    console.log(`Client ${socket.id} joining room ${roomId}`);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { id: roomId, peers: new Set() });
    }
    
    const room = rooms.get(roomId)!;
    room.peers.add(socket.id);
    socket.join(roomId);

    // Notify others in room
    socket.to(roomId).emit('peer-joined', socket.id);
    
    // Send existing peers to new peer
    const peersInRoom = Array.from(room.peers).filter(id => id !== socket.id);
    socket.emit('existing-peers', peersInRoom);
  });

  // Handle WebRTC signaling
  socket.on('signal', ({ targetId, signal }) => {
    console.log(`Forwarding signal from ${socket.id} to ${targetId}`);
    io.to(targetId).emit('signal', {
      peerId: socket.id,
      signal
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    rooms.forEach((room, roomId) => {
      if (room.peers.has(socket.id)) {
        room.peers.delete(socket.id);
        socket.to(roomId).emit('peer-left', socket.id);
        
        if (room.peers.size === 0) {
          console.log(`Removing empty room ${roomId}`);
          rooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});