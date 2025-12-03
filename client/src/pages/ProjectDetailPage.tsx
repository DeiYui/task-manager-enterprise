import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spin, Button, Typography, Tag, Row, Col, Modal, Form, Input, Select, message } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext, type DragStartEvent, DragOverlay, type DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor, defaultDropAnimationSideEffects, 
type DropAnimation } from '@dnd-kit/core';

import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import projectApi from '../api/projectApi';
import taskApi from '../api/taskApi';
import type { Project, Task } from '../types';
import DraggableTask from '../components/DraggableTask'; 
import DroppableColumn from '../components/DroppableColumn'; 
import TaskCard from '../components/TaskCard';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Queries (Giữ nguyên)
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectApi.getOne(projectId),
    enabled: !!projectId,
  });

  const { data: taskData } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskApi.getByProject(projectId),
    enabled: !!projectId,
  });

  // Mutation: Cập nhật trạng thái Task (Kéo thả)
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number, status: string }) => 
        taskApi.updateStatus(taskId, status),
    onSuccess: () => {
        // Tự động refresh lại list để đảm bảo đồng bộ
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
        message.success("Cập nhật trạng thái thành công!");
    },
    onError: () => message.error("Lỗi cập nhật trạng thái")
  });

  // Mutation: Tạo Task (Giữ nguyên)
  const createTaskMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      message.success('Thêm công việc thành công!');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
    onError: (err: any) => message.error(err.response?.data?.message || 'Lỗi khi tạo task')
  });

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = Number(event.active.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) setActiveTask(task);
  };

  // 🔥 LOGIC XỬ LÝ KHI THẢ CHUỘT (THE BRAIN)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Nếu thả ra ngoài không trúng cột nào -> Hủy
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id); // 'TODO', 'IN_PROGRESS', 'DONE'

    // Tìm task hiện tại để xem status cũ là gì
    const currentTask = tasks.find(t => t.id === taskId);
    
    // Chỉ gọi API nếu status thực sự thay đổi
    if (currentTask && currentTask.status !== newStatus) {
        updateStatusMutation.mutate({ taskId, status: newStatus });
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // Phải kéo đi 10px mới bắt đầu tính (Chống rung tay)
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // Giữ 250ms mới bắt đầu kéo (Giống icon trên điện thoại)
      tolerance: 5,
    },
  });

  const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
        },
      },
    }),
  };
  const sensors = useSensors(mouseSensor, touchSensor);
  const project = (projectData as any)?.data as Project;
  const tasks = (taskData as any)?.data as Task[] || [];

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (isLoadingProject) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!project) return <div>Không tìm thấy dự án</div>;

  return (
    // 👇 Thêm modifiers và onDragStart vào đây
    <DndContext 
        onDragEnd={handleDragEnd} 
        onDragStart={handleDragStart}
        modifiers={[restrictToWindowEdges]} 
        sensors={sensors}
    >
      <div>
        {/* HEADER (Giữ nguyên) */}
        <div style={{ marginBottom: 24 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 16 }}>
                Quay lại danh sách
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <Title level={2} style={{ marginBottom: 0 }}>{project.name}</Title>
                    <Text type="secondary">{project.description}</Text>
                </div>
                <div>
                    <Tag color={project.status === 'ACTIVE' ? 'green' : 'volcano'}>{project.status}</Tag>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                        Thêm Công Việc
                    </Button>
                </div>
            </div>
        </div>

        {/* 3 CỘT DROPPABLE */}
        <div style={{ background: '#f0f2f5', padding: 20, borderRadius: 8, minHeight: 400 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <DroppableColumn id="TODO" title="📌 TODO" count={todoTasks.length} bgColor="#dfe6e9">
                        {todoTasks.map(task => <DraggableTask key={task.id} task={task} />)}
                    </DroppableColumn>
                </Col>
                <Col span={8}>
                    <DroppableColumn id="IN_PROGRESS" title="🚀 IN PROGRESS" count={inProgressTasks.length} bgColor="#74b9ff">
                        {inProgressTasks.map(task => <DraggableTask key={task.id} task={task} />)}
                    </DroppableColumn>
                </Col>
                <Col span={8}>
                    <DroppableColumn id="DONE" title="✅ DONE" count={doneTasks.length} bgColor="#55efc4">
                        {doneTasks.map(task => <DraggableTask key={task.id} task={task} />)}
                    </DroppableColumn>
                </Col>
            </Row>
        </div>

        {/* 👇 QUAN TRỌNG: DRAG OVERLAY (Lớp phủ sửa lỗi z-index) */}
        <DragOverlay dropAnimation={dropAnimationConfig}>
           {activeTask ? (
              <div style={{ transform: 'rotate(3deg)' }}> 
                  <TaskCard task={activeTask} isOverlay />
              </div>
           ) : null}
        </DragOverlay>

        {/* MODAL (Giữ nguyên) */}
        <Modal
            title="Thêm công việc mới"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={(v) => createTaskMutation.mutate({ ...v, projectId: Number(id) })}>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
                <Form.Item name="description" label="Mô tả"><TextArea rows={2} /></Form.Item>
                <Form.Item name="priority" label="Độ ưu tiên" initialValue="MEDIUM">
                    <Select><Option value="LOW">Thấp</Option><Option value="MEDIUM">Trung bình</Option><Option value="HIGH">Cao</Option></Select>
                </Form.Item>
                <Form.Item><Button type="primary" htmlType="submit" block>Tạo Task</Button></Form.Item>
            </Form>
        </Modal>
      </div>
    </DndContext>
  );
};
export default ProjectDetailPage;