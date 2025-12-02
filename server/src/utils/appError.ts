// src/utils/appError.ts

export class appError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean; // Để phân biệt lỗi do code sai (bug) hay lỗi do người dùng

    constructor(message: string, statusCode: number) {
        super(message);
        
        this.statusCode = statusCode;
        // Nếu code bắt đầu bằng 4 (400, 404) -> 'fail', nếu 5 (500) -> 'error'
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}