import React, { memo } from 'react';
import styles from './styles.module.css';

const Selectbox = ({ children, name, value, onChange, className = '', ...props }) => {

  return (
    <div className={[styles.container, className].join(' ')}>
      <select name={name} value={value} onChange={onChange} className={styles.select} {...props}>
        {children}
      </select>
    </div>
  );

};

export default Selectbox;