// src/utils/authUtils.test.ts
import { hashPassword, comparePassword, generateAccessToken } from './authUtils';
import jwt from 'jsonwebtoken';

// Giả lập biến môi trường cho bài test
process.env.JWT_ACCESS_SECRET = 'test-secret';

describe('Auth Utils', () => {
    
    // Test Case 1: Băm mật khẩu
    it('should hash the password correctly', async () => {
        const password = 'mySecretPassword';
        const hash = await hashPassword(password);

        // Kỳ vọng: Hash phải khác password gốc
        expect(hash).not.toBe(password);
        // Kỳ vọng: Hash phải bắt đầu bằng thuật toán bcrypt ($2b$...)
        expect(hash).toMatch(/^\$2b\$/);
    });

    // Test Case 2: So sánh mật khẩu (Đúng)
    it('should return true for valid password', async () => {
        const password = 'password123';
        const hash = await hashPassword(password);
        
        const isMatch = await comparePassword(password, hash);
        expect(isMatch).toBe(true);
    });

    // Test Case 3: So sánh mật khẩu (Sai)
    it('should return false for invalid password', async () => {
        const password = 'password123';
        const hash = await hashPassword(password);
        
        const isMatch = await comparePassword('wrongPassword', hash);
        expect(isMatch).toBe(false);
    });

    // Test Case 4: Tạo Token
    it('should generate a valid JWT token', () => {
        const userId = 1;
        const role = 'USER';
        
        const token = generateAccessToken(userId, role);
        
        // Giải mã thử xem có đúng không
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any;
        
        expect(decoded.userId).toBe(userId);
        expect(decoded.role).toBe(role);
    });
});