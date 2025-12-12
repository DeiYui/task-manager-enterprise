// src/services/projectService.ts
import prisma from '../utils/prisma';

// 1. Tạo Project mới
export const createProject = async (userId: number, data: { name: string; description?: string }) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            ownerId: userId 
        }
    });
};

// 2. Lấy danh sách Project của một User
export const getProjectsByUser = async (userId: number) => {
    return await prisma.project.findMany({
        where: {
            ownerId: userId // Lọc theo khóa ngoại
        },
        include: {
            // Join bảng: Lấy thêm thông tin của User sở hữu (để hiển thị tên chủ dự án chẳng hạn)
            owner: {
                select: { id: true, name: true, email: true } 
            } 
        }
    });
};

export const getProjectById = async (projectId: number, userId: number) => {
    return await prisma.project.findFirst({
        where: { 
            id: projectId,
            // Logic: User chỉ xem được nếu là chủ sở hữu HOẶC (sau này) là thành viên
            // Tạm thời check owner trước
            ownerId: userId 
        },
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            }
        }
    });
};

// Cập nhật Dự án
export const updateProject = async (id: number, data: any) => {
    return await prisma.project.update({
        where: { id },
        data, // Chỉ update những trường gửi lên (VD: name, description)
    });
};

// Xóa Dự án (Kèm xóa sạch Task bên trong - Clean up)
export const deleteProject = async (id: number) => {
    // 1. Xóa tất cả task của dự án này trước
    await prisma.task.deleteMany({
        where: { projectId: id }
    });

    // 2. Sau đó mới xóa dự án
    return await prisma.project.delete({
        where: { id }
    });
};