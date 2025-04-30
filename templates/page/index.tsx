import React, { FC, Key, useCallback, useRef } from 'react';
import { McContainer, McContainerRef } from '@zykj2024/much-library';
import { useAsync } from '@zykj2024/much-hooks';
import { AddOutlined } from '@zykj2024/much-icons';
import targetNameQueryItems from './tools/targetNameQueryItems';
import { Button } from 'antd';

import { queryTargetNameList, removeTargetName } from './tools/targetNameServers';
import targetNameColumns from './tools/targetNameColumns';
import CreateOrEditTargetName, { CreateOrEditTargetNameRef } from './comps/CreateOrEditTargetName';
const TargetName: FC = () => {
  const mcContainerRef = useRef<McContainerRef>(undefined);
  const createOrEditTargetNameRef = useRef<CreateOrEditTargetNameRef>(null);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<Key[]>([]);

  const batchBtns = (
    <>
      <Button
        type="link"
        onClick={() => {
          removeTargetName(selectedRowKeys, () => {
            successCallback();
            seletedCancel();
          });
        }}
      >
        批量删除
      </Button>
    </>
  );

  const actionBar = (
    <>
      <Button
        type="primary"
        icon={<AddOutlined />}
        onClick={() => createOrEditTargetNameRef.current?.show()}
      >
        新增
      </Button>
    </>
  );

  // 取消选中
  const seletedCancel = useCallback(() => {
    setSelectedRowKeys([]);
  }, []);

  // 操作成功回调
  const successCallback = useCallback(() => {
    mcContainerRef.current?.query();
  }, []);

  const { data, loading, run } = useAsync(queryTargetNameList, {
    manual: true,
  });

  return (
    <>
      <McContainer
        ref={mcContainerRef}
        loading={loading}
        queryItems={targetNameQueryItems()}
        batchNum={selectedRowKeys.length}
        batchBtns={batchBtns}
        onCancel={seletedCancel}
        actionBar={actionBar}
        onQuery={run}
        tableProps={{
          rowKey: 'id',
          dataSource: data?.records || [],
          columns: targetNameColumns({
            onEdit: (id) => createOrEditTargetNameRef.current?.show(),
            onDelete: (id) => removeTargetName([id], successCallback),
          }),
          pagination: {
            total: data?.total || 0,
          },
          rowSelection: {
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (keys) => {
              setSelectedRowKeys(keys);
            },
          },
        }}
      />
      <CreateOrEditTargetName ref={createOrEditTargetNameRef} onSuccess={successCallback} />
    </>
  );
};

export default TargetName;
