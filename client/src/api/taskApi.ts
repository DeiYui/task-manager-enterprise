import axiosClient from './axiosClient';
import type { Task } from '../types';

const taskApi = {
  // 1. Lấy danh sách Task của 1 Project
  getByProject: (projectId: number) => {
    return axiosClient.get<{ data: Task[] }>(`/tasks?projectId=${projectId}`);
  },

  // 2. Tạo Task mới
  create: (data: { title: string; description?: string; projectId: number; priority: string; assigneeId?: number }) => {
    return axiosClient.post('/tasks', data);
  },
  
  // 3. Cập nhật trạng thái (Kéo thả)
  updateStatus: (id: number, status: string) => {
    return axiosClient.patch(`/tasks/${id}`, { status });
  },

  // 4. 👇 Cập nhật thông tin (Dùng cho Modal Sửa: Title, Desc, Priority, Assignee...)
  update: (id: number, data: any) => {
    return axiosClient.patch(`/tasks/${id}`, data);
  },

  // 5. 👇 Xóa Task
  delete: (id: number) => {
    return axiosClient.delete(`/tasks/${id}`);
  }
};

export default taskApi;