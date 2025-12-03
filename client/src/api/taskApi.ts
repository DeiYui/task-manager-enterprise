import axiosClient from './axiosClient';
import type { Task } from '../types';

const taskApi = {
  // 1. Lấy danh sách Task của 1 Project

  getByProject: (projectId: number) => {
    return axiosClient.get<{ data: Task[] }>(`/tasks?projectId=${projectId}`);
  },

  // 2. Tạo Task mới
  create: (data: { title: string; description?: string; projectId: number; priority: string }) => {
    return axiosClient.post('/tasks', data);
  },
  
  // 3. Cập nhật trạng thái (Kéo thả sau này dùng)
  updateStatus: (id: number, status: string) => {
    return axiosClient.patch(`/tasks/${id}`, { status });
  }
};

export default taskApi;