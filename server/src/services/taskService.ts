// src/services/taskService.ts
import prisma from '../utils/prisma';
import { TaskStatus } from '@prisma/client'; 

// Interface cho việc tạo task (Cũ)
interface CreateTaskData {
    title: string;
    description?: string;
    projectId: number;
    assigneeId: number;
    creatorId: number;
}

// Interface cho bộ lọc (Mới)
interface GetTaskFilter {
    projectId: number;
    status?: TaskStatus;
    search?: string;
    page?: number;
    limit?: number;
}

// --- HÀM CŨ (GIỮ NGUYÊN) ---
export const createTask = async (data: CreateTaskData) => {
    return await prisma.task.create({
        data: {
            title: data.title,
            description: data.description,
            status: 'TODO',
            project: { connect: { id: data.projectId } },
            assignee: { connect: { id: data.assigneeId } },
            creator: { connect: { id: data.creatorId } }
        }
    });
};

// --- HÀM MỚI (NÂNG CẤP) ---
export const getTasksByProject = async (filter: GetTaskFilter) => {
    const { projectId, status, search, page = 1, limit = 10 } = filter;
    
    // Tính toán vị trí cắt (Offset)
    const skip = (page - 1) * limit;

    // Truy vấn dữ liệu
    const tasks = await prisma.task.findMany({
        where: {
            projectId: projectId,
            status: status, 
            // Tìm kiếm gần đúng (Contains) không phân biệt hoa thường
            title: search ? { contains: search, mode: 'insensitive' } : undefined
        },
        skip: skip,          // Bỏ qua n phần tử đầu
        take: limit,         // Lấy limit phần tử
        orderBy: {
            createdAt: 'desc' // Sắp xếp mới nhất lên đầu
        },
        include: {
            assignee: {
                select: { id: true, name: true, email: true }
            }
        }
    });

    // Đếm tổng số lượng (để Frontend biết có bao nhiêu trang)
    const total = await prisma.task.count({
        where: {
            projectId: projectId,
            status: status,
            title: search ? { contains: search, mode: 'insensitive' } : undefined
        }
    });

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
};