/*
  Warnings:

  - You are about to drop the column `userId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `assigneeId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userId_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "userId",
ADD COLUMN     "assigneeId" INTEGER NOT NULL,
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
