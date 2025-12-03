import { Router } from 'express';
import { createTask, getProjectTasks, updateTask } from '../controllers/taskController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', createTask);
router.get('/', getProjectTasks);
router.patch('/:id', updateTask);

export default router;