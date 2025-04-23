import React, { FC, Key, useCallback, useRef } from 'react';
import { McContainer, McContainerRef } from '@zykj2024/much-library';
import { AddOutlined } from '@zykj2024/much-icons';
import targetNameQueryItems from './tools/targetNameQueryItems';
import { Button } from 'antd';
const TargetName: FC = () => {
  const mcContainerRef = useRef<McContainerRef>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const batchBtns = (
    <>
      <Button type="link">批量删除</Button>
    </>
  );

  const actionBar = (
    <>
      <Button type="primary" icon={<AddOutlined />}>
        新增
      </Button>
    </>
  );

  // 取消选中
  const seletedCancel = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  return (
    <>
      <McContainer
        ref={mcContainerRef}
        queryItems={targetNameQueryItems()}
        batchNum={selectedRowKeys.length}
        batchBtns={batchBtns}
        onCancel={seletedCancel}
        actionBar={actionBar}
        tableProps={{
          rowKey: 'id',
          rowSelection: {
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (keys) => {
              setSelectedRowKeys(keys);
            },
          },
        }}
      />
    </>
  );
};

export default TargetName;
