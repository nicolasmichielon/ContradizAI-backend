import express from 'express';
import { postUserMessage, getMessagesByChatId } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateMessage } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/', authenticateToken, validateMessage, postUserMessage);
router.get('/chat/:chatId', authenticateToken, getMessagesByChatId);

export default router;