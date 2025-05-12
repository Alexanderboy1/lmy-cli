import React from 'react';
import { GetProps, Tabs } from 'antd';
type TargetNameItems = GetProps<typeof Tabs>['items'];
const TargetName: React.FC = () => {
  const items: TargetNameItems = [];
  return <Tabs destroyInactiveTabPane type="card" items={items} />;
};

export default TargetName;
