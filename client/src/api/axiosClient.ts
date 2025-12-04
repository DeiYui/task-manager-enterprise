import axios from 'axios';

// 1. Tạo instance của Axios
const axiosClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api/v1', // URL Backend của anh
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log("🔗 API URL đang dùng:", import.meta.env.VITE_API_URL);
// 2. Interceptor cho REQUEST (Gửi đi)
// Tự động chèn Token vào mỗi lần gọi API
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Lấy token từ LocalStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor cho RESPONSE (Nhận về)
// Xử lý khi Token hết hạn (401) hoặc lỗi server
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Trả về data sạch
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa từng thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử refresh để tránh vòng lặp vô hạn

      try {
        // Gọi API Refresh Token (Giả sử anh đã có route này ở Backend)
        // const refreshToken = localStorage.getItem('refreshToken');
        // const res = await axios.post('http://localhost:3000/api/v1/auth/refresh', { refreshToken });
        
        // Lưu token mới và thực hiện lại request cũ
        // localStorage.setItem('accessToken', res.data.accessToken);
        // axiosClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        // return axiosClient(originalRequest);
        
        // TẠM THỜI: Nếu lỗi 401 thì logout luôn (cho đơn giản phase đầu)
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; 
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;