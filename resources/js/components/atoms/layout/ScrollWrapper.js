import React, { memo } from 'react';
import styles from './styles.module.css';

const ScrollWrapper = ({ children, className, ...props }) => {
  return (
    <div className={[styles.flex_column, styles.scroll_area, className].join(' ')} {...props}>
      {children}
    </div>
  );
};

export default ScrollWrapper;