// Định nghĩa cấu trúc User (người sở hữu)
export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

// Định nghĩa cấu trúc Project (giống hệt Prisma Schema bên Backend)
export interface Project {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  createdAt: string;
  ownerId: number;
  owner?: User; // Kèm thông tin người tạo
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline?: string;
  projectId: number;
  assigneeId?: number;
  assignee?: User; // Người được giao việc
}