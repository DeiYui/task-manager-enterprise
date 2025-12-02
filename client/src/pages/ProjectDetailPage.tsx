import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Spin, Button, Typography, Tag, Card, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import projectApi from '../api/projectApi';
import type { Project } from '../types';

const { Title, Text } = Typography;

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams(); // 1. Lấy ID từ URL (VD: /projects/5 -> id = 5)
  const navigate = useNavigate();

  // 2. Gọi API lấy chi tiết Project dựa trên ID
  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id], // Key unique theo ID
    queryFn: () => projectApi.getOne(Number(id)),
    enabled: !!id, // Chỉ gọi khi có ID
  });

  const project = (data as any)?.data as Project;

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (error) return <div style={{ color: 'red' }}>Lỗi tải dự án: {(error as any).message}</div>;
  if (!project) return <div>Không tìm thấy dự án</div>;

  return (
    <div>
      {/* Header của trang chi tiết */}
      <div style={{ marginBottom: 24 }}>
        <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            style={{ marginBottom: 16 }}
        >
            Quay lại danh sách
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <Title level={2} style={{ marginBottom: 0 }}>{project.name}</Title>
                <Text type="secondary">{project.description}</Text>
            </div>
            <Tag color={project.status === 'ACTIVE' ? 'green' : 'volcano'}>
                {project.status}
            </Tag>
        </div>
      </div>

      {/* Khu vực hiển thị Task (Tạm thời là các cột trống) */}
      <div style={{ background: '#f0f2f5', padding: 20, borderRadius: 8, minHeight: 400 }}>
        <Row gutter={16}>
            {/* Cột TODO */}
            <Col span={8}>
                <Card title="📌 TODO (Cần làm)" bordered={false} style={{ background: '#dfe6e9' }}>
                    <div style={{ textAlign: 'center', color: '#636e72' }}>Trống trơn...</div>
                </Card>
            </Col>

            {/* Cột IN PROGRESS */}
            <Col span={8}>
                <Card title="🚀 IN PROGRESS (Đang làm)" bordered={false} style={{ background: '#74b9ff' }}>
                    <div style={{ textAlign: 'center', color: 'white' }}>Chưa có gì chạy cả...</div>
                </Card>
            </Col>

            {/* Cột DONE */}
            <Col span={8}>
                <Card title="✅ DONE (Hoàn thành)" bordered={false} style={{ background: '#55efc4' }}>
                    <div style={{ textAlign: 'center', color: '#00b894' }}>Chưa xong cái nào...</div>
                </Card>
            </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProjectDetailPage;