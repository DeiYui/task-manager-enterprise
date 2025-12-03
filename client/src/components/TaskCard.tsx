import React from 'react';
import { Card } from 'antd';
import type { Task } from '../types';

interface Props {
  task: Task;
  isOverlay?: boolean; // Nếu là bản sao đang bay thì thêm hiệu ứng
}

const TaskCard: React.FC<Props> = ({ task, isOverlay }) => {
  const getPriorityColor = (p: string) => {
    if (p === 'HIGH') return '#ff7675';
    if (p === 'MEDIUM') return '#ffeaa7';
    return '#74b9ff';
  };

  return (
    <Card 
      size="small" 
      variant="borderless" 
      style={{ 
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        cursor: isOverlay ? 'grabbing' : 'grab', // Đổi con trỏ khi đang nắm
        boxShadow: isOverlay ? '0 10px 20px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)', // Đổ bóng khi bay
        transform: isOverlay ? 'scale(1.05)' : 'scale(1)', // Phóng to nhẹ khi cầm lên
        marginBottom: 10,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      hoverable={!isOverlay}
    >
      <div style={{ fontWeight: 600 }}>{task.title}</div>
      <div style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
           {task.assignee ? task.assignee.name : 'Unassigned'}
      </div>
    </Card>
  );
};

export default TaskCard;