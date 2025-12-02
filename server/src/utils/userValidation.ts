// src/utils/userValidation.ts
import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(2, "Tên ngắn quá"),
    email: z.string().email("Email sai"),
    role: z.enum(["ADMIN", "USER"]), 
    password: z.string().min(6, "Mật khẩu đăng ký phải dài hơn 6 ký tự")
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

// Schema cho Đăng Nhập
export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải dài hơn 6 ký tự")
});

export type LoginDTO = z.infer<typeof loginSchema>;