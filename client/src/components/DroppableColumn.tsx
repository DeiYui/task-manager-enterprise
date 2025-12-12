import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Card } from 'antd';

interface Props {
  id: string; // ID của cột sẽ là: 'TODO', 'IN_PROGRESS', 'DONE'
  title: string;
  count: number;
  bgColor: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<Props> = ({ id, title, count, bgColor, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  // Khi có ai đó kéo task bay ngang qua, cột sẽ đổi màu (Hiệu ứng thị giác)
  const style = {
    background: isOver ? '#ffeaa7' : bgColor, // Đổi màu vàng nhạt khi hover
    minHeight: 400,
    transition: 'background 0.3s',
    borderRadius: 8,
    padding: 8
  };

  return (
    <Card 
        title={`${title} (${count})`} 
        variant="borderless" 
        style={{ background: 'transparent' }} 
        styles={{ body: { padding: 0 } }}
    >
        <div ref={setNodeRef} style={style}>
            {children}
        </div>
    </Card>
  );
};

export default DroppableColumn;