import React, { memo } from 'react';
import styles from './styles.module.css';

const CheckboxTag = ({ name, value, onChange, checked, label, className = '', ...props }) => {
  return (
    <label {...props}>
      <input className={styles.checkbox} type='checkbox' name={name} value={value} onChange={onChange} checked={checked} />
      <span className={[styles.checkbox_tag, className].join(' ')}>{label}</span>
    </label>
  );
};

export default CheckboxTag;