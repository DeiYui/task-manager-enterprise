import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Modal, Form, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, FolderOpenOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectApi from '../api/projectApi';
import type { Project } from '../types';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TextArea } = Input;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // 👇 State lưu dự án đang sửa
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 1. Lấy danh sách Project
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  // 2. Mutation: Tạo hoặc Cập nhật
  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      if (editingProject) {
        // Nếu đang sửa -> Gọi API Update
        return projectApi.update(editingProject.id, values);
      }
      // Nếu không -> Gọi API Create
      return projectApi.create(values);
    },
    onSuccess: () => {
      message.success(editingProject ? 'Cập nhật thành công!' : 'Tạo dự án mới thành công!');
      handleCancel(); // Đóng modal & reset form
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  // 3. Mutation: Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectApi.delete(id),
    onSuccess: () => {
      message.success('Đã xóa dự án!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => message.error('Không thể xóa dự án này'),
  });

  // --- CÁC HÀM XỬ LÝ (HANDLERS) ---

  const handleOpenCreate = () => {
    setEditingProject(null); // Chế độ tạo mới
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project); // Chế độ sửa
    form.setFieldsValue({ // 👇 Điền dữ liệu cũ vào form
      name: project.name,
      description: project.description
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    form.resetFields();
  };

  // --- CẤU HÌNH CỘT ---
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
        <Space size="small">
          {/* Nút Chi Tiết */}
          <Button 
            type="text" 
            icon={<FolderOpenOutlined />}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            Chi tiết
          </Button>

          {/* 👇 Nút Sửa */}
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            style={{ color: '#faad14' }} // Màu vàng cam
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>

          {/* 👇 Nút Xóa (Có Confirm) */}
          <Popconfirm
            title="Xóa dự án này?"
            description="Toàn bộ công việc bên trong sẽ bị xóa theo!"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Xóa luôn"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="text" icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
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
            onClick={handleOpenCreate} // Gọi hàm mở tạo mới
        >
          Tạo Dự Án Mới
        </Button>
      </div>

      {/* Table */}
      <Card loading={isLoading} bordered={false} styles={{ body: { padding: 0 } }} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table 
            columns={columns} 
            dataSource={projects} 
            rowKey="id"
            locale={{ emptyText: 'Chưa có dự án nào. Hãy tạo cái đầu tiên đi!' }}
        />
      </Card>

      {/* Modal Form (Dùng chung cho Tạo & Sửa) */}
      <Modal
        title={editingProject ? "Cập Nhật Dự Án" : "Khởi tạo Dự Án Mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => saveMutation.mutate(values)} // Gọi mutation chung
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
                <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                    Hủy
                </Button>
                <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
                    {editingProject ? 'Lưu Thay Đổi' : 'Tạo Dự Án'}
                </Button>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;