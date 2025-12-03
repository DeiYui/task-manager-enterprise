import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import { globalErrorHandler } from './middlewares/errorMiddleware';
import { appError } from './utils/appError';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
// Cấu hình dotenv để đọc file .env
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://task-manager-enterprise-p2uga2iko-deiyuis-projects.vercel.app',
        'https://task-manager-enterprise.vercel.app'], // Cho phép các nguồn này truy cập
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Các method được dùng
    credentials: true // Cho phép gửi cookie/header xác thực
}));
app.use(express.json());
// THÊM LOG NÀY VÀO (Global Logger tạm thời)
app.use((req, res, next) => {
    console.log(`📢 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('📦 Body:', req.body); // Xem Server có nhận được cục JSON không
    next();
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Hello from Enterprise Task Manager Server!',
        status: 'Active',
        timestamp: new Date()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// --- XỬ LÝ ROUTE KHÔNG TỒN TẠI (404) ---
// Nếu chạy đến đây mà chưa vào route nào -> 404
app.all(/(.*)/, (req, res, next) => {
    // Dùng next(err) để chuyền thẳng xuống Global Error Handler
    next(new appError(`Không tìm thấy đường dẫn ${req.originalUrl} trên server`, 404));
});

// --- GLOBAL ERROR HANDLER (Phải đặt cuối cùng) ---
app.use(globalErrorHandler);