import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from '../dtos/user.dto';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body as CreateUserDto;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  next();
};

export const validateMessage = (req: Request, res: Response, next: NextFunction) => {
  const { chatId, text } = req.body;

  if (!chatId || !text) {
    return res.status(400).json({ error: 'Chat ID and message text are required' });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({ error: 'Message text cannot be empty' });
  }

  next();
}; 

export const validateCreateChat = (req: Request, res: Response, next: NextFunction) => {
  const { userId, firstMessage } = req.body;

  if (!userId || !firstMessage) {
    return res.status(400).json({ error: 'Missing userId or firstMessage in request body' });
  }
  next();
};