import React, { forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';

export type TargetNameProps = {};
export type TargetNameRef = {};

const TargetName = forwardRef<TargetNameRef, TargetNameProps>(({}, ref) => {
  useImperativeHandle(ref, () => ({}));
  return <div className={styles['targetName-container']}></div>;
});

export default TargetName;
