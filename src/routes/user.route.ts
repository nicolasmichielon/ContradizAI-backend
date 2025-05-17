import { Router } from 'express';
import { createUser, getUserById, loginUser } from '../controllers/user.controller';

const router = Router();

router.post('/login', loginUser);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;