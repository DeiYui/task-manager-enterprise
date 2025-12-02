// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, createNewUser } from '../controllers/userController';

const router = Router();

// Định nghĩa: GET /api/v1/users
router.get('/', getUsers);
router.post('/', createNewUser);

export default router;