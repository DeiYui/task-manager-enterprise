import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spin, Button, Typography, Tag, Row, Col, message } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { 
  DndContext, 
  type DragStartEvent, 
  DragOverlay, 
  type DragEndEvent, 
  useSensor, 
  useSensors, 
  MouseSensor, 
  TouchSensor, 
  defaultDropAnimationSideEffects, 
  type DropAnimation 
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

// Import API & Types
import projectApi from '../api/projectApi';
import taskApi from '../api/taskApi';
import type { Project, Task } from '../types';

// Import Components
import DraggableTask from '../components/DraggableTask'; 
import DroppableColumn from '../components/DroppableColumn'; 
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal'; // 👇 Component Modal mới

const { Title, Text } = Typography;

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);
  const queryClient = useQueryClient();
  
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Task đang bay (DnD)
  const [editingTask, setEditingTask] = useState<Task | null>(null); // 👇 Task đang sửa (Edit Mode)

  // --- QUERIES ---
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

  // --- MUTATIONS (GỌI API) ---

  // 1. Lưu Task (Tự động phân biệt Tạo mới hoặc Cập nhật)
  const saveTaskMutation = useMutation({
    mutationFn: (values: any) => {
      if (editingTask) {
        // Nếu đang có task sửa -> Gọi API Update
        return taskApi.update(editingTask.id, values);
      } else {
        // Nếu không -> Gọi API Create
        return taskApi.create({ ...values, projectId });
      }
    },
    onSuccess: () => {
      message.success(editingTask ? 'Cập nhật thành công!' : 'Thêm công việc thành công!');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setIsModalOpen(false);
      setEditingTask(null);
    },
    onError: (err: any) => message.error(err.response?.data?.message || 'Có lỗi xảy ra'),
  });

  // 2. Xóa Task
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskApi.delete(taskId),
    onSuccess: () => {
      message.success('Đã xóa công việc!');
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setIsModalOpen(false);
      setEditingTask(null);
    },
    onError: () => message.error('Lỗi khi xóa task'),
  });

  // 3. Cập nhật trạng thái (Kéo thả)
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number, status: string }) => 
        taskApi.updateStatus(taskId, status),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
    onError: () => message.error("Lỗi cập nhật trạng thái")
  });

  // --- HANDLERS ---

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    setEditingTask(null); // Reset về mode tạo mới
    setIsModalOpen(true);
  };

  // Mở modal sửa (Khi click vào task)
  const handleEditTask = (task: Task) => {
    setEditingTask(task); // Set task cần sửa
    setIsModalOpen(true);
  };

  // Xử lý DnD Start
  const handleDragStart = (event: DragStartEvent) => {
    const taskId = Number(event.active.id);
    const task = tasks.find(t => t.id === taskId);
    if (task) setActiveTask(task);
  };

  // Xử lý DnD End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);
    const currentTask = tasks.find(t => t.id === taskId);
    
    if (currentTask && currentTask.status !== newStatus) {
        // Optimistic Update: Update UI ngay (nếu muốn xịn hơn), ở đây gọi API luôn
        updateStatusMutation.mutate({ taskId, status: newStatus });
    }
    setActiveTask(null);
  };

  // Cấu hình Sensor (Cảm ứng kéo thả)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
  };

  // --- RENDER ---
  const project = (projectData as any)?.data as Project;
  const tasks = (taskData as any)?.data as Task[] || [];
  
  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (isLoadingProject) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!project) return <div>Không tìm thấy dự án</div>;

  return (
    <DndContext 
        onDragEnd={handleDragEnd} 
        onDragStart={handleDragStart}
        modifiers={[restrictToWindowEdges]} 
        sensors={sensors}
    >
      <div>
        {/* HEADER */}
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
                        Thêm Công Việc
                    </Button>
                </div>
            </div>
        </div>

        {/* 3 CỘT KANBAN */}
        <div style={{ background: '#f0f2f5', padding: 20, borderRadius: 8, minHeight: 400 }}>
            <Row gutter={16}>
                {/* Cột TODO */}
                <Col span={8}>
                    <DroppableColumn id="TODO" title="📌 TODO" count={todoTasks.length} bgColor="#dfe6e9">
                        {todoTasks.map(task => (
                          <DraggableTask 
                            key={task.id} 
                            task={task} 
                            onTaskClick={handleEditTask} // 👈 KẾT NỐI SỰ KIỆN CLICK
                          />
                        ))}
                    </DroppableColumn>
                </Col>
                
                {/* Cột IN PROGRESS */}
                <Col span={8}>
                    <DroppableColumn id="IN_PROGRESS" title="🚀 IN PROGRESS" count={inProgressTasks.length} bgColor="#74b9ff">
                        {inProgressTasks.map(task => (
                          <DraggableTask key={task.id} task={task} onTaskClick={handleEditTask} />
                        ))}
                    </DroppableColumn>
                </Col>

                {/* Cột DONE */}
                <Col span={8}>
                    <DroppableColumn id="DONE" title="✅ DONE" count={doneTasks.length} bgColor="#55efc4">
                        {doneTasks.map(task => (
                          <DraggableTask key={task.id} task={task} onTaskClick={handleEditTask} />
                        ))}
                    </DroppableColumn>
                </Col>
            </Row>
        </div>

        {/* DRAG OVERLAY (Hiệu ứng bay) */}
        <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeTask ? (
              <div style={{ transform: 'rotate(3deg)' }}> 
                  <TaskCard task={activeTask} isOverlay />
              </div>
            ) : null}
        </DragOverlay>

        {/* 👇 SỬ DỤNG TASK MODAL MỚI (Thay thế Modal thủ công cũ) */}
        <TaskModal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={(values) => saveTaskMutation.mutate(values)}
            loading={saveTaskMutation.isPending || deleteTaskMutation.isPending}
            initialValues={editingTask}
            onDelete={editingTask ? () => deleteTaskMutation.mutate(editingTask.id) : undefined}
        />
      </div>
    </DndContext>
  );
};

export default ProjectDetailPage;