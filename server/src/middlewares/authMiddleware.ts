// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appError } from '../utils/appError';
import prisma from '../utils/prisma';

// Định nghĩa kiểu dữ liệu cho Payload trong Token
interface JwtPayload {
    userId: number;
    role: string;
}

// Mở rộng Request của Express để gắn thêm user vào (TypeScript Hack)
declare global {
    namespace Express {
        interface Request {
            user?: { id: number; role: string };
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Lấy token từ header (Bearer Token)
    // Header chuẩn: "Authorization: Bearer eyJhbGci..."
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new appError('Bạn chưa đăng nhập! Vui lòng cung cấp Token.', 401));
    }

    try {
        // 2. Giải mã Token (Verify)
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;

        // 3. Kiểm tra xem User còn tồn tại không (Lỡ bị xóa rồi sao?)
        const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!currentUser) {
            return next(new appError('User sở hữu token này không còn tồn tại.', 401));
        }

        // 4. Gắn thông tin user vào Request để dùng ở Controller sau này
        req.user = { id: currentUser.id, role: currentUser.role };
        
        // 5. Cho qua
        next();

    } catch (error) {
        return next(new appError('Token không hợp lệ hoặc đã hết hạn!', 401));
    }
};

// Bonus: Middleware phân quyền (Chỉ Admin được vào)
export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // req.user đã có nhờ hàm protect chạy trước đó
        if (!roles.includes(req.user!.role)) {
            return next(new appError('Bạn không có quyền thực hiện hành động này', 403));
        }
        next();
    };
};