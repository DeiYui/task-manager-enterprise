import React from 'react';
import { Card } from 'antd';
import type { Task } from '../types';

interface Props {
  task: Task;
  isOverlay?: boolean;
  onClick?: (task: Task) => void;
}

const TaskCard: React.FC<Props> = ({ task, isOverlay, onClick }) => {
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
        // 👇 2. Nếu là Overlay (đang bay) thì nắm chặt, còn lại thì trỏ tay
        cursor: isOverlay ? 'grabbing' : 'pointer', 
        boxShadow: isOverlay ? '0 10px 20px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.1)',
        transform: isOverlay ? 'scale(1.05)' : 'scale(1)',
        marginBottom: 10,
        transition: 'all 0.2s ease'
      }}
      hoverable={!isOverlay}
      // 👇 3. Gắn sự kiện Click
      onClick={() => onClick && onClick(task)}
    >
      <div style={{ fontWeight: 600 }}>{task.title}</div>
      <div style={{ fontSize: 12, color: 'gray', marginTop: 4 }}>
           {task.assignee ? `👤 ${task.assignee.name}` : 'Unassigned'}
      </div>
    </Card>
  );
};

export default TaskCard;