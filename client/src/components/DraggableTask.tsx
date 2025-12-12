import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities'; // 👇 QUAN TRỌNG: Để tính toán tọa độ bay
import type { Task } from '../types';
import TaskCard from './TaskCard';

interface Props {
  task: Task;
  onTaskClick?: (task: Task) => void; // 👇 Nhận hàm từ cha (Page) để truyền cho con (Card)
}

const DraggableTask: React.FC<Props> = ({ task, onTaskClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: { task }, // 👇 Gắn dữ liệu để sự kiện onDragEnd biết đang kéo cái gì
  });

  const style = {
    // 👇 Biến đổi vị trí (Physics): Không có dòng này là kéo nó không chạy theo chuột đâu
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1, // Làm mờ khi đang bị kéo
    touchAction: 'none', // Tắt cuộn trang khi đang kéo trên điện thoại
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
    >
      {/* 👇 Truyền tiếp hàm click xuống cho giao diện hiển thị */}
      <TaskCard task={task} onClick={onTaskClick} />
    </div>
  );
};

export default DraggableTask;