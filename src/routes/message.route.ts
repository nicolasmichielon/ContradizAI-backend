import express from 'express';
import { postUserMessage, getMessagesByChatId } from '../controllers/message.controller';
const router = express.Router();

router.post('/', postUserMessage);
router.get('/chat/:chatId', getMessagesByChatId);

export default router;