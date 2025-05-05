import React, { Key, useCallback, useRef } from 'react';
import { DrawerForm } from '@ant-design/pro-components';
import { forwardRef, useImperativeHandle, useState } from 'react';
import CreateOrEditTargetName, { CreateOrEditTargetNameRef } from './comps/CreateOrEditTargetName';
import { Button } from 'antd';
import { queryTargetNameList, removeTargetName } from './tools/targetNameServers';
import { AddOutlined } from '@zykj2024/much-icons';
import { useAsync } from '@zykj2024/much-hooks';
import { McContainer, McContainerRef } from '@zykj2024/much-library';
import targetNameQueryItems from './tools/targetNameQueryItems';
import targetNameColumns from './tools/targetNameColumns';

export type TargetNameRef = {
  show: () => void;
};

export type TargetNameProps = {
  onSuccess?: () => void;
};

const TargetName = forwardRef<TargetNameRef, TargetNameProps>(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
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

  const onRequest = async () => {
    return {};
  };

  const onFinsh = async (formVals: Record<string, any>) => {
    try {
      onSuccess?.();
    } catch (error) {}
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
  }));
  return (
    <DrawerForm
      title="新增或编辑页面名称"
      onOpenChange={setVisible}
      request={onRequest}
      onFinish={onFinsh}
      layout="horizontal"
      open={visible}
      width={800}
      drawerProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
    >
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
    </DrawerForm>
  );
});

export default TargetName;
