// routes/language.ts
import express from 'express';
import { getLanguages } from '../controllers/language.controller';
const router = express.Router();

router.get('/', getLanguages);

export default router;