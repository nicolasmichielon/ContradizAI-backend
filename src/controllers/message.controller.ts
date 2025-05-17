// controllers/message.controller.ts
import { Request, Response } from 'express';
import * as messageService from '../services/message.service';

export async function sendMessage(req: Request, res: Response) {
  const { chatId, sender, text, language_used } = req.body;
  const result = await messageService.sendMessage(chatId, sender, text, language_used);
  res.json(result);
}

export async function getMessagesByChatId(req: Request, res: Response) {
  const result = await messageService.getMessagesByChatId(req.params.chatId);
  res.json(result);
}