import React, { memo } from 'react';
import styles from './styles.module.css';

const FlexWrapper = ({ children, className, ...props }) => {
  return (
    <div className={[styles.flex_wrap, className].join(' ')} {...props}>
      {children}
    </div>
  );
};

export default FlexWrapper;