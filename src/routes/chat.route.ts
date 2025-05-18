import express from 'express';
import { createChat, getChatById, getChatsByUserId, deleteChat } from '../controllers/chat.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateCreateChat } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/', authenticateToken, validateCreateChat, createChat);
router.get('/:id', authenticateToken, getChatById);
router.get('/user/:userId', authenticateToken, getChatsByUserId);
router.delete('/delete/:id', authenticateToken, deleteChat);

export default router;