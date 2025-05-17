// routes/message.ts
import express from 'express';
import { sendMessage, getMessagesByChatId } from '../controllers/message.controller';
const router = express.Router();

router.post('/', sendMessage);
router.get('/chat/:chatId', getMessagesByChatId);

export default router;