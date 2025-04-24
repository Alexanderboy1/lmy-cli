import React, { FC } from 'react';
import styles from './index.less';

export type TeargetNameProps = {};

const TargetName: FC<TeargetNameProps> = ({}) => {
  return <div className={styles['targetName-container']}></div>;
};

export default TargetName;
