import { Request, Response, NextFunction } from 'express';

// Hàm này nhận vào một async function, và trả về một function mới có try-catch ngầm
export const catchAsync = (fn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next); // Nếu lỗi -> gọi next(err) -> xuống Global Handler
    };
};