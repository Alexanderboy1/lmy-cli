import React from 'react';
import { ModalForm } from '@ant-design/pro-components';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type TargetNameRef = {
  show: () => void;
};

export type TargetNameProps = {
  onSuccess?: () => void;
};

const TargetName = forwardRef<TargetNameRef, TargetNameProps>(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

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
    <ModalForm
      title="新增或编辑页面名称"
      onOpenChange={setVisible}
      request={onRequest}
      onFinish={onFinsh}
      layout="horizontal"
      open={visible}
      width={800}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
    ></ModalForm>
  );
});

export default TargetName;
