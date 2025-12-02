import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { createUserSchema, loginSchema } from '../utils/userValidation';
import { appError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new appError(validation.error.issues[0].message, 400));
    }

    const newUser = await authService.register(validation.data);
    
    res.status(201).json({
        status: 'success',
        message: 'Đăng ký thành công!',
        data: { id: newUser.id, email: newUser.email } // Không trả về password
    });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        return next(new appError(validation.error.issues[0].message, 400));
    }

    const result = await authService.login(validation.data);

    res.status(200).json({
        status: 'success',
        message: 'Đăng nhập thành công!',
        data: result
    });
});