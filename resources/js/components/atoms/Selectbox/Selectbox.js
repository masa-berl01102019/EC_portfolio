import React, {memo} from 'react';
import styles from './styles.module.css';

const Selectbox = ({children, name, value, onChange, className = ''}) => {
  
  return (
    <div className={styles.container}>
      <select name={name} value={value} onChange={onChange} className={[styles.select, className].join(' ')}>
        {children}
      </select>
    </div>
  );

};

export default Selectbox;