// controllers/message.controller.ts
import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

export async function sendMessage(req: Request, res: Response) {
  try {
    const { chatId, sender, text, language_used } = req.body;

    if (!chatId || !sender || !text) {
      return res.status(400).json({ error: 'Missing required fields: chatId, sender, or text' });
    }

    const result = await messageService.sendMessage(chatId, sender, text, language_used);
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
