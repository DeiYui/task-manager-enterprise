// src/services/userService.ts
import prisma from '../utils/prisma'; // Import client vừa tạo
import { CreateUserDTO } from '../utils/userValidation';

// Không cần Interface User tự định nghĩa nữa, dùng của Prisma
// Hàm lấy tất cả users
export const getAllUsers = async () => {
    // Tương đương SQL: SELECT * FROM users
    return await prisma.user.findMany();
};

// Hàm tạo user mới
export const createUser = async (data: CreateUserDTO) => {
    console.log("🔥 [EUREKA] ĐANG CHẠY CODE PRISMA THẬT! DATA:", data);
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            role: data.role,
            password: "defaultPassword123" // <--- THÊM DÒNG NÀY (Tạm thời)
        }
    });
};