import { Router } from 'express';
import { createUser, getUserById, loginUser } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateCreateUser, validateLogin } from '../middleware/validation.middleware';

const router = Router();

router.post('/login', validateLogin, loginUser);
router.post('/', validateCreateUser, createUser);
router.get('/:id', authenticateToken, getUserById);

export default router;