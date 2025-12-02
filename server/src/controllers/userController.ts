import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { createUserSchema } from '../utils/userValidation';
import { catchAsync } from '../utils/catchAsync';

import { appError } from '../utils/appError'; 

export const getUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers();
    
    res.status(200).json({
        status: 'success',
        data: users
    });
});

export const createNewUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("📍 [CONTROLLER] Đã nhận request!"); // <--- THÊM DÒNG NÀY
    console.log("📦 Body nhận được:", req.body);      // <--- VÀ DÒNG NÀY
    // 1. Validation Zod
    const validationResult = createUserSchema.safeParse(req.body);
    
    if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0].message;
        
        // 2. GỌI CLASS: Dùng đúng tên Class anh đã export (thường là AppError)
        return next(new appError(errorMessage, 400));
    }

    // 2. Gọi Service
    const newUser = await userService.createUser(validationResult.data);
    
    res.status(201).json({
        status: 'success',
        data: newUser
    });
});