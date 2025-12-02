import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Màu sắc theme từ Antd
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Xóa token
    navigate('/login'); // Đá về trang login
  };

  // Menu user (góc trên phải)
  const userMenu = {
    items: [
      {
        key: '1',
        label: 'Hồ sơ cá nhân',
        icon: <UserOutlined />,
      },
      {
        key: '2',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 1. SIDEBAR (Cột trái) */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', color: 'white', lineHeight: '32px', fontWeight: 'bold' }}>
           {collapsed ? 'TM' : 'Task Manager'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <ProjectOutlined />,
              label: 'Dự án của tôi',
              onClick: () => navigate('/'),
            },
            {
              key: '2',
              icon: <CheckSquareOutlined />,
              label: 'Công việc (Tasks)',
              onClick: () => navigate('/tasks'),
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: 'Thành viên',
              onClick: () => navigate('/users'),
            },
          ]}
        />
      </Sider>

      {/* 2. MAIN CONTENT (Bên phải) */}
      <Layout>
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          {/* Avatar User góc phải */}
          <Dropdown menu={userMenu}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600 }}>Super Boss</span>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </Header>

        {/* Nội dung thay đổi (Dynamic Content) */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet /> {/* Đây là nơi các trang con sẽ hiện ra */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;