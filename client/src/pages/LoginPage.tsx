import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  // Hàm xử lý khi bấm nút Login
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 1. Gọi API Login (Anh nhớ check lại URL bên Backend xem đúng là /auth/login không nhé)
      const res: any = await axiosClient.post('/auth/login', values);
      
      // 2. Lưu token vào LocalStorage
      localStorage.setItem('accessToken', res.data.accessToken);
      
      message.success('Đăng nhập thành công! Chào mừng Boss Herta trở lại.');
      
      // 3. Chuyển hướng sang trang Dashboard
      navigate('/'); 
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', background: '#f0f2f5' 
    }}>
      <Card title="Enterprise Task Manager" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;