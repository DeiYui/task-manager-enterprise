import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';
import { catchAsync } from '../utils/catchAsync';
import { appError } from '../utils/appError'; 
import { TaskStatus } from '@prisma/client'; 

export const createTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Lấy dữ liệu từ Body (Frontend gửi lên)
    const { title, description, projectId, assigneeId, priority } = req.body;
    
    // 2. Lấy ID người đang đăng nhập từ Token (Do middleware 'protect' gắn vào)
    const userId = req.user?.id; 

    // 3. Validation: Chỉ bắt buộc projectId
    if (!projectId) {
        return next(new appError("Thiếu Project ID", 400));
    }

    // 4. Logic thông minh:
    // - creatorId: Luôn là người đang login (userId).
    // - assigneeId: Nếu Frontend không gửi, tạm thời gán luôn cho người tạo (hoặc để null nếu DB cho phép).
    // Ở đây tôi sẽ gán cho chính anh (userId) để code không bị lỗi.
    
    const newTask = await taskService.createTask({
        title, 
        description, 
        priority: priority || 'MEDIUM', // Mặc định là MEDIUM nếu thiếu
        projectId: Number(projectId), 
        creatorId: Number(userId), // 🔥 TỰ ĐỘNG LẤY TỪ TOKEN
        assigneeId: assigneeId ? Number(assigneeId) : Number(userId) // 🔥 Nếu không chọn ai, tự gán cho mình
    });

    res.status(201).json({
        status: 'success',
        data: newTask
    });
});

export const getProjectTasks = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Lấy tất cả params từ URL
    const { projectId, page, limit, status, search } = req.query;

    if (!projectId) {
        return next(new appError("Thiếu projectId trên params", 400));
    }

    // 2. Gọi Service với Object Filter (Cập nhật cho khớp với Service mới)
    const result = await taskService.getTasksByProject({
        projectId: Number(projectId),
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        status: status ? (status as TaskStatus) : undefined, // Ép kiểu string sang Enum
        search: search as string
    });

    // 3. Trả về kết quả kèm Metadata phân trang
    res.status(200).json({
        status: 'success',
        pagination: {
            page: result.page,
            limit: result.limit,
            totalItems: result.total,
            totalPages: result.totalPages
        },
        data: result.tasks
    });
});

export const updateTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.id);
    const updates = req.body; // { status: 'DONE', ... }

    const updatedTask = await taskService.updateTask(taskId, updates);

    res.status(200).json({
        status: 'success',
        data: updatedTask
    });
});