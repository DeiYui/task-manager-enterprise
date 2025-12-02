import axiosClient from './axiosClient';
import type { Project } from '../types';

const projectApi = {
  // 1. Lấy tất cả dự án
  getAll: () => {
    return axiosClient.get<{ data: Project[] }>('/projects');
  },

  // 2. Tạo dự án mới (Dùng cho bước sau)
  create: (data: { name: string; description?: string }) => {
    return axiosClient.post('/projects', data);
  },
  
  // 3. Xóa dự án
  delete: (id: number) => {
    return axiosClient.delete(`/projects/${id}`);
  },

  getOne: (id: number) => {
    return axiosClient.get<{ data: Project }>(`/projects/${id}`);
  }
};

export default projectApi;