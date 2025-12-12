import { Router } from 'express';
import { 
    createTask, 
    deleteTask,    
    getProjectTasks, 
    updateTask 
} from '../controllers/taskController'; 
import { protect } from '../middlewares/authMiddleware';

const router = Router();
router.use(protect);

// Route gốc: /api/v1/tasks/
router.route('/')
    .get(getProjectTasks)
    .post(createTask);

// Route chi tiết: /api/v1/tasks/:id
router.route('/:id')
    .patch(updateTask)
    .delete(deleteTask);

export default router;