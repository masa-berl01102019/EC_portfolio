import React, { memo } from 'react';
import styles from './styles.module.css';

const InputCheckbox = ({ name, value, onChange, checked, className = '', ...props }) => {
  return (
    <input className={[styles.checkbox, className].join(' ')} type='checkbox' name={name} value={value} onChange={onChange} checked={checked} {...props} />
  );
};

export default InputCheckbox;