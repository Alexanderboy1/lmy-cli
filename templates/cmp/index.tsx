import React, { FC } from 'react';
import styles from './index.less';

export type TargetNameProps = {};

const TargetName: FC<TargetNameProps> = ({}) => {
  return <div className={styles['targetName-container']}></div>;
};

export default TargetName;
