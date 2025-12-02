import { Router } from 'express';
import { createProject, getMyProjects, deleteProject, getProjectById } from '../controllers/projectController';
import { protect, restrictTo } from '../middlewares/authMiddleware'; 

const router = Router();

// Áp dụng protect cho TẤT CẢ các route bên dưới dòng này
router.use(protect); 

router.post('/', createProject); // Giờ phải có Token mới gọi được
router.get('/', getMyProjects);
router.get('/:id', getProjectById);

// --- ROUTE ĐẶC BIỆT ---
// Chỉ ADMIN mới được xóa
router.delete('/:id', restrictTo('ADMIN'), deleteProject);

export default router;