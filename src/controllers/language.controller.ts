// controllers/language.controller.ts
import { Request, Response } from 'express';
import * as languageService from '../services/language.service';

export async function getLanguages(req: Request, res: Response) {
  const result = await languageService.getLanguages();
  res.json(result);
}