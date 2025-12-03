# 1. Chọn Hệ điều hành nền (Base Image)
# Dùng node bản 18 alpine (phiên bản siêu nhẹ của Linux)
FROM node:18-alpine

# 2. Tạo thư mục làm việc trong container
# Từ giờ mọi lệnh sẽ chạy trong thư mục /app này
WORKDIR /app

# 3. Copy file package.json trước (Kỹ thuật Caching)
# Tại sao? Để nếu code thay đổi nhưng thư viện không đổi, Docker sẽ không cần cài lại npm install -> Build siêu nhanh
COPY package*.json ./

# 4. Cài đặt các thư viện
RUN npm install

# 5. Copy toàn bộ code còn lại vào container
COPY . .

# 6. Generate Prisma Client (Bắt buộc để Prisma chạy được trong Linux)
RUN npx prisma generate

# 7. Biên dịch TypeScript sang JavaScript
RUN npm run build

# 8. Mở cổng 3000 (Để bên ngoài chui vào được)
EXPOSE 3000

# 9. Lệnh chạy server khi container khởi động
# Chạy file JS đã build trong thư mục dist
CMD ["node", "dist/app.js"]