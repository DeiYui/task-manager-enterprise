// check-db.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'; // Import thêm cái này

dotenv.config(); // BẮT BUỘC: Load file .env trước khi Prisma chạy

const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUG INFO ---");
  // In ra xem nó đang dùng URL nào (Cẩn thận lộ pass nếu chụp ảnh public, nhưng ở đây cứ check đi)
  console.log("URL:", process.env.DATABASE_URL); 
  
  console.log("--- ĐANG KẾT NỐI DATABASE... ---");
  const users = await prisma.user.findMany();
  
  console.log("--- KẾT QUẢ TỪ POSTGRESQL ---");
  console.log(users);
  console.log(`---> Tổng cộng: ${users.length} users`);
}

main()
  .catch((e) => {
    console.error("Lỗi rồi:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });