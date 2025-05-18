import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import userRoutes from './routes/user.route';
import chatRoutes from './routes/chat.route';
import messageRoutes from './routes/message.route';
import Anthropic from '@anthropic-ai/sdk';
import { initializeDatabase } from './services/database.service';

dotenv.config();

// Load anthropic API key
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables
initializeDatabase(supabase)
  .then(() => console.log('Database initialized successfully'))
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/user', userRoutes);
app.use('/chat', chatRoutes)
app.use('/message', messageRoutes)

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 