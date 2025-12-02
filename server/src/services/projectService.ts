// src/services/projectService.ts
import prisma from '../utils/prisma';

// 1. Tạo Project mới
export const createProject = async (userId: number, data: { name: string; description?: string }) => {
    return await prisma.project.create({
        data: {
            name: data.name,
            description: data.description,
            // CÁCH 1: Gán trực tiếp khóa ngoại (Foreign Key)
            ownerId: userId 
            
            // CÁCH 2: Dùng connect (Prisma style) - Chọn 1 trong 2 đều được
            // owner: { connect: { id: userId } }
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
                select: { id: true, name: true, email: true } // Chỉ lấy thông tin cần thiết, giấu password đi
            } 
        }
    });
};

// Hàm xóa project
export const deleteProject = async (projectId: number) => {
    // Kiểm tra xem project có tồn tại không trước
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return null;

    // Xóa nó
    return await prisma.project.delete({
        where: { id: projectId }
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