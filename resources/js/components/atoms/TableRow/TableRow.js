import React, { memo } from 'react';
import styles from './styles.module.css'

export const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={[styles.tr, className].join(' ')} {...props}>{children}</tr>
  );
};