import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db';
import { seedDoctorsIfEmpty } from './utils/doctorsData';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chats';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use(errorHandler);

setupSocket(io);

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  try {
    await connectDB();
    await seedDoctorsIfEmpty();
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
