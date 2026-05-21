import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

// Import configurations
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

// Import routes
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import reviewRoutes from './routes/reviews';
import searchRoutes from './routes/search';

const app: Application = express();
const httpServer = createServer(app);

// Socket.IO setup for real-time features
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);

// Socket.IO connection handling
let activeUsers = 0;
const listingViewers = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  activeUsers++;
  console.log(`✅ User connected. Active users: ${activeUsers}`);
  
  io.emit('activeUsers', activeUsers);

  // Join listing room
  socket.on('joinListing', (listingId: string) => {
    socket.join(`listing:${listingId}`);
    
    if (!listingViewers.has(listingId)) {
      listingViewers.set(listingId, new Set());
    }
    listingViewers.get(listingId)!.add(socket.id);
    
    const viewerCount = listingViewers.get(listingId)!.size;
    io.to(`listing:${listingId}`).emit('listingViewers', viewerCount);
  });

  // Leave listing room
  socket.on('leaveListing', (listingId: string) => {
    socket.leave(`listing:${listingId}`);
    
    if (listingViewers.has(listingId)) {
      listingViewers.get(listingId)!.delete(socket.id);
      const viewerCount = listingViewers.get(listingId)!.size;
      io.to(`listing:${listingId}`).emit('listingViewers', viewerCount);
    }
  });

  socket.on('disconnect', () => {
    activeUsers--;
    console.log(`❌ User disconnected. Active users: ${activeUsers}`);
    
    // Remove from all listing rooms
    listingViewers.forEach((viewers, listingId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        const viewerCount = viewers.size;
        io.to(`listing:${listingId}`).emit('listingViewers', viewerCount);
      }
    });
    
    io.emit('activeUsers', activeUsers);
  });
});

// Make io accessible to routes
app.set('io', io);

// 404 handler
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('❌ Error:', err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB (non-blocking)
    connectDatabase().catch(err => {
      console.error('Initial MongoDB connection failed:', err.message);
    });

    // Connect to Redis (optional - app works without it)
    await connectRedis();

    // Start HTTP server regardless of MongoDB status
    httpServer.listen(PORT, () => {
      console.log('');
      console.log('🚀 ═══════════════════════════════════════════════════');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`📡 Socket.IO enabled for real-time features`);
      console.log('🚀 ═══════════════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };
