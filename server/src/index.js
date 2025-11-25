import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import sessionRoutes from './routes/sessions.js';
import bookingRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO
io.on('connection', (socket) => {
  socket.on('join-session', (sessionId) => {
    socket.join(`session-${sessionId}`);
  });
  socket.on('leave-session', (sessionId) => {
    socket.leave(`session-${sessionId}`);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };

