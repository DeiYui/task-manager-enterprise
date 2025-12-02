// src/middlewares/errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { appError } from '../utils/appError';

// Middleware xử lý lỗi BẮT BUỘC phải có đủ 4 tham số: (err, req, res, next)
export const globalErrorHandler = (err: appError, req: Request, res: Response, next: NextFunction) => {
    
    // Mặc định là lỗi 500 nếu không xác định được
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.error('🔥 ERROR LOG:', err); // Sau này thay bằng Winston

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Chỉ hiện stack trace khi ở môi trường dev để debug
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};