import { Router } from 'express';
import { login, getMe, register, getUsers, updateUser, deleteUser } from '../controllers/auth.controller.js';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticateJWT, getMe);
router.post('/register', authenticateJWT, register);

// CRUD Users
router.get('/users', authenticateJWT, getUsers);
router.put('/users/:id', authenticateJWT, updateUser);
router.delete('/users/:id', authenticateJWT, deleteUser);

export default router;
