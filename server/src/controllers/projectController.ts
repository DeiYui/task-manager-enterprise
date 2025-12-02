import { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/projectService';
import { catchAsync } from '../utils/catchAsync';
import { appError } from '../utils/appError';

export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id; 
    const { name, description } = req.body;

    const newProject = await projectService.createProject(userId, { name, description });

    res.status(201).json({
        status: 'success',
        data: newProject
    });
});

export const getMyProjects = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id; 
    const projects = await projectService.getProjectsByUser(userId);

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: projects
    });
});

export const deleteProject = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.id); // Lấy ID từ URL (vd: /projects/1)

    const result = await projectService.deleteProject(projectId);

    if (!result) {
        return next(new appError("Không tìm thấy Project với ID này", 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Đã xóa project thành công (Quyền lực của Admin)'
    });
});

export const getProjectById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.id);
    const userId = req.user?.id; // Lấy từ token

    // Gọi Service
    const project = await projectService.getProjectById(projectId, userId!);

    if (!project) {
        return next(new appError('Không tìm thấy dự án', 404));
    }

    res.status(200).json({
        status: 'success',
        data: project
    });
});