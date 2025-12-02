import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage'; 
import ProjectDetailPage from './pages/ProjectDetailPage';
// Component bảo vệ: Kiểm tra xem có token không
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  // Nếu không có token -> Đá về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Nếu có -> Cho phép vào Layout chính
  return <MainLayout />; 
};

function App() {
  return (
    <Routes>
      {/* Route Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Route Private (Phải đăng nhập mới thấy) */}
      <Route element={<ProtectedRoute />}>
        {/* Mặc định vào dashboard (Load DashboardPage) */}
        <Route path="/" element={<DashboardPage />} /> 
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        {/* Các route khác tạm thời để trống */}
        <Route path="/tasks" element={<div>Danh sách Task sẽ ở đây</div>} />
        <Route path="/users" element={<div>Danh sách User sẽ ở đây</div>} />
      </Route>

      {/* 404: Nếu gõ link linh tinh thì đá về login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;