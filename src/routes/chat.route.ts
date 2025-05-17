import express from 'express';
import { createChat, getChatById, getChatsByUserId, endChat } from '../controllers/chat.controller';
const router = express.Router();

router.post('/', createChat);
router.get('/:id', getChatById);
router.get('/user/:userId', getChatsByUserId);
router.patch('/:id/end', endChat);

export default router;