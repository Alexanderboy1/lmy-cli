import React from 'react';
import { Button, Flex } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { McPopoverButton } from '@zykj2024/much-library';
type TargetNameColumnsConfig = {
  onEdit?: (id: any) => void;
  onDelete?: (id: any) => void;
};
const targetNameColumns = ({ onEdit, onDelete }: TargetNameColumnsConfig) => {
  const columns: ColumnsType<Record<string, any>> = [
    {
      title: '操作',
      dataIndex: 'options',
      width: 180,
      fixed: 'right',
      render: (value, rowData) => {
        return (
          <Flex
            style={{
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Button type="link" onClick={() => onEdit?.(rowData?.id)}>
              编辑
            </Button>
            <McPopoverButton onConfirm={() => onDelete?.(rowData?.id)}>删除</McPopoverButton>
          </Flex>
        );
      },
    },
  ];
  return columns;
};

export default targetNameColumns;
