import React, { memo } from 'react';
import styles from './styles.module.css'

export const TableHeadCell = ({ children, className = '', ...props }) => {
  return (
    <th className={[styles.th, className].join(' ')} {...props}>{children}</th>
  );
};