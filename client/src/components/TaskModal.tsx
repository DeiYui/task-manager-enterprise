import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Popconfirm } from 'antd';
import { useQuery } from '@tanstack/react-query';
import userApi from '../api/userApi';
import type { User } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
  initialValues?: any; // Nếu có cái này -> Chế độ Edit
  onDelete?: () => void; // Hàm xóa (chỉ hiện khi Edit)
}

const TaskModal: React.FC<Props> = ({ open, onCancel, onOk, loading, initialValues, onDelete }) => {
  const [form] = Form.useForm();
  const isEditMode = !!initialValues;

  // Lấy danh sách User để đổ vào Dropdown
  const { data: userData } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
    enabled: open, // Chỉ gọi API khi mở modal
  });

  const users = (userData as any)?.data as User[] || [];

  // Khi mở modal lên, điền dữ liệu cũ vào (nếu là Edit)
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        assigneeId: initialValues.assigneeId || null // Set người được gán
      });
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={isEditMode ? "Cập nhật công việc" : "Thêm công việc mới"}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden={true}
      forceRender={true}
    >
      <Form form={form} layout="vertical" onFinish={onOk}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Cần tiêu đề!' }]}>
          <Input placeholder="Ví dụ: Fix lỗi login..." />
        </Form.Item>
        
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} placeholder="Mô tả chi tiết..." />
        </Form.Item>

        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="priority" label="Độ ưu tiên" style={{ flex: 1 }} initialValue="MEDIUM">
            <Select>
              <Option value="LOW">Thấp 🟢</Option>
              <Option value="MEDIUM">Trung bình 🟡</Option>
              <Option value="HIGH">Cao 🔴</Option>
            </Select>
          </Form.Item>

          <Form.Item name="assigneeId" label="Giao cho ai?" style={{ flex: 1 }}>
            <Select placeholder="Chọn thành viên" allowClear>
               {users.map(u => (
                 <Option key={u.id} value={u.id}>{u.name} ({u.email})</Option>
               ))}
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          {isEditMode && onDelete ? (
            <Popconfirm title="Xóa task này?" onConfirm={onDelete} okText="Xóa" cancelText="Hủy">
               <Button danger type="text">Xóa Task</Button>
            </Popconfirm>
          ) : <div />} {/* Div rỗng để đẩy nút Submit sang phải */}
          
          <div style={{ display: 'flex', gap: 10 }}>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default TaskModal;