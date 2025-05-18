import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

export async function postUserMessage(req: Request, res: Response) {
  try {
    const { chatId, text } = req.body;

    const result = await messageService.sendMessage(chatId, text);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

export async function getMessagesByChatId(req: Request, res: Response) {
  try {
    const result = await messageService.getMessagesByChatId(req.params.chatId);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('getMessagesByChatId error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
