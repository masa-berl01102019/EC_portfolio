import React, { memo } from 'react';
import styles from './styles.module.css';

const InputTextarea = ({ name, value, onBlur, placeholder, className = '', ...props }) => {
  return (
    <textarea
      id={name}
      name={name}
      defaultValue={value}
      onBlur={onBlur}
      placeholder={placeholder}
      className={[styles.textarea, className].join(' ')}
      {...props}
    />
  );
};

export default InputTextarea;