import prisma from '../utils/prisma';
import { CreateUserDTO, LoginDTO } from '../utils/userValidation';
import { appError } from '../utils/appError';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/authUtils';

// 1. Đăng ký (Register)
export const register = async (data: CreateUserDTO) => {
    // Check trùng email
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new appError('Email này đã được sử dụng', 400);
    }

    // Băm mật khẩu (QUAN TRỌNG)
    const hashedPassword = await hashPassword(data.password!); 

    // Lưu vào DB
    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword, // Lưu cái đã băm
            role: data.role
        }
    });

    return newUser;
};

// 2. Đăng nhập (Login)
export const login = async (data: LoginDTO) => {
    // Tìm user theo email
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw new appError('Email hoặc mật khẩu không đúng', 401);
    }

    // So sánh mật khẩu
    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
        throw new appError('Email hoặc mật khẩu không đúng', 401);
    }

    // Tạo Token
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    return { 
        user: { id: user.id, name: user.name, email: user.email, role: user.role }, 
        accessToken, 
        refreshToken 
    };
};