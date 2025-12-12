import axiosClient from './axiosClient';
import type { User } from '../types';

const userApi = {
  getAll: () => axiosClient.get<{ data: User[] }>('/users'), // Gọi vào route /users vừa tạo
};

export default userApi;