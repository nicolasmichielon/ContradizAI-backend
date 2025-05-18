import express from 'express';
import { createChat, getChatById, getChatsByUserId, endChat, deleteChat } from '../controllers/chat.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createChat);
router.get('/:id', authenticateToken, getChatById);
router.get('/user/:userId', authenticateToken, getChatsByUserId);
router.patch('/:id/end', authenticateToken, endChat);
router.delete('/delete/:id', authenticateToken, deleteChat);

export default router;