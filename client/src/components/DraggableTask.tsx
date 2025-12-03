import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../types';
import TaskCard from './TaskCard'; // Import component UI vừa tách

interface Props {
  task: Task;
}

const DraggableTask: React.FC<Props> = ({ task }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id.toString(),
  });

  // Khi đang bị kéo đi, bản gốc sẽ mờ đi (tàng hình)
  const style = {
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} />
    </div>
  );
};

export default DraggableTask;