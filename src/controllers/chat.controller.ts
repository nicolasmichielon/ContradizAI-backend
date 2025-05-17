// controllers/chatController.ts
import { Request, Response } from 'express';
import * as chatService from '../services/chat.service';

export async function createChat(req: Request, res: Response) {
  const { userId } = req.body;
  const chat = await chatService.createChat(userId);
  res.json(chat);
}

export async function getChatById(req: Request, res: Response) {
  const chat = await chatService.getChatById(req.params.id);
  res.json(chat);
}

export async function getChatsByUserId(req: Request, res: Response) {
  const chats = await chatService.getChatsByUserId(req.params.userId);
  res.json(chats);
}

export async function endChat(req: Request, res: Response) {
  const chat = await chatService.endChat(req.params.id);
  res.json(chat);
}