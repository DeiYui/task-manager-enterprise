import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';
import { catchAsync } from '../utils/catchAsync';
import { appError } from '../utils/appError'; 
import { TaskStatus } from '@prisma/client'; 

export const createTask = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, projectId, assigneeId, creatorId } = req.body;

    if (!projectId || !assigneeId || !creatorId) {
        return next(new appError("Thiếu ID liên kết (project, assignee, creator)", 400));
    }

    const newTask = await taskService.createTask({
        title, 
        description, 
        projectId: Number(projectId), 
        assigneeId: Number(assigneeId),
        creatorId: Number(creatorId)
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