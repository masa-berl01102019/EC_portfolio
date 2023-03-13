import React, { memo } from 'react';
import styles from './styles.module.css'

export const TableBodyCell = ({ children, className = '', ...props }) => {
  return (
    <td className={[styles.td, className].join(' ')} {...props}>{children}</td>
  );
};