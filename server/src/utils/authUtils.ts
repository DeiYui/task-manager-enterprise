import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Hàm băm mật khẩu
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10); // Tạo muối (độ mặn 10)
    return await bcrypt.hash(password, salt);
};

// 2. Hàm so sánh mật khẩu (Lúc đăng nhập)
export const comparePassword = async (rawPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(rawPassword, hashedPassword);
};

// 3. Hàm tạo Access Token (Ngắn hạn)
export const generateAccessToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: '15m' // Hết hạn sau 15 phút
    });
};

// 4. Hàm tạo Refresh Token (Dài hạn)
export const generateRefreshToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: '7d' // Hết hạn sau 7 ngày
    });
};