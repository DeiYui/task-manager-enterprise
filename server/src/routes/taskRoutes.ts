// src/routes/taskRoutes.ts
import { Router } from 'express';
import { createTask, getProjectTasks } from '../controllers/taskController';

const router = Router();

router.post('/', createTask);
router.get('/', getProjectTasks);

export default router;