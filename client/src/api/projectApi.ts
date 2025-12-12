import axiosClient from './axiosClient';
import type { Project } from '../types';

const projectApi = {
  // 1. Lấy tất cả dự án
  getAll: () => {
    return axiosClient.get<{ data: Project[] }>('/projects');
  },

  // 2. Tạo dự án mới
  create: (data: { name: string; description?: string }) => {
    return axiosClient.post('/projects', data);
  },
  
  // 👇 3. Cập nhật dự án (Sửa tên, mô tả)
  update: (id: number, data: { name?: string; description?: string }) => {
    return axiosClient.patch(`/projects/${id}`, data);
  },

  // 4. Xóa dự án
  delete: (id: number) => {
    return axiosClient.delete(`/projects/${id}`);
  },

  // 5. Lấy chi tiết 1 dự án
  getOne: (id: number) => {
    return axiosClient.get<{ data: Project }>(`/projects/${id}`);
  }
};

export default projectApi;