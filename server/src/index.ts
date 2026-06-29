import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // Hoặc điền chính xác link domain Frontend của bạn sau khi deploy xong
  credentials: true
}));
app.use(express.json());

// Serve uploaded proof documents statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Wire up the Central API Router
app.use('/api', apiRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`[Server] He_thong_NTM Backend running on port ${PORT}`);
});

