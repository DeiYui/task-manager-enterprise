import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectApi from '../api/projectApi';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Hook để điều khiển Form
  const queryClient = useQueryClient(); // Để tương tác với Cache

  // 1. Gọi API lấy danh sách Project (Query)
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  // 2. Setup API tạo mới (Mutation)
  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      // Khi tạo thành công:
      message.success('Tạo dự án mới thành công!');
      setIsModalOpen(false); // Đóng Modal
      form.resetFields(); // Xóa dữ liệu cũ trong Form
      // 🔥 Kích hoạt lệnh: "Lấy lại danh sách projects ngay lập tức!"
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Lỗi khi tạo dự án');
    },
  });

  // Hàm xử lý khi bấm OK trên Modal
  const handleCreate = (values: any) => {
    createMutation.mutate(values);
  };

  // Cấu hình bảng
  const columns = [
    {
      title: 'Tên Dự Án',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1677ff' }}>{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'ACTIVE' ? 'green' : 'geekblue';
        if (status === 'ARCHIVED') color = 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Người tạo',
      dataIndex: ['owner', 'name'],
      key: 'owner',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Project) => (
        <Space size="middle">
        <Button 
        type="text" 
        icon={<FolderOpenOutlined />}
        // 👇 THÊM SỰ KIỆN NÀY
        onClick={() => navigate(`/projects/${record.id}`)}
      >
        Chi tiết
      </Button>
        </Space>
      ),
    },
  ];

  const projects = (data as any)?.data || [];

  if (error) return <div style={{ color: 'red' }}>Lỗi tải dữ liệu: {(error as any).message}</div>;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>🗂️ Quản Lý Dự Án</Title>
        <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => setIsModalOpen(true)} // Mở Modal
        >
          Tạo Dự Án Mới
        </Button>
      </div>

      {/* Table */}
      <Card loading={isLoading} bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table 
            columns={columns} 
            dataSource={projects} 
            rowKey="id"
            locale={{ emptyText: 'Chưa có dự án nào. Hãy tạo cái đầu tiên đi!' }}
        />
      </Card>

      {/* Modal Form Tạo Mới */}
      <Modal
        title="Khởi tạo Dự Án Mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null} // Ẩn nút mặc định để dùng nút của Form
      >
        <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            style={{ marginTop: 20 }}
        >
            <Form.Item
                name="name"
                label="Tên dự án"
                rules={[{ required: true, message: 'Tên dự án không được để trống!' }]}
            >
                <Input placeholder="Ví dụ: Website Bán Hàng FPT" size="large" />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả ngắn"
            >
                <TextArea rows={3} placeholder="Mô tả mục tiêu của dự án..." />
            </Form.Item>

            <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
                <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>
                    Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
                    Tạo Dự Án
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;