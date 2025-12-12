import { Router } from 'express';
import { createProject, getMyProjects, deleteProject, getProjectById, updateProject } from '../controllers/projectController';
import { protect, restrictTo } from '../middlewares/authMiddleware'; 

const router = Router();

router.use(protect); 

router.post('/', createProject); 
router.get('/', getMyProjects);
router.route('/:id')
    .get(getProjectById)
    .patch(updateProject) 
    .delete(deleteProject); 

export default router;