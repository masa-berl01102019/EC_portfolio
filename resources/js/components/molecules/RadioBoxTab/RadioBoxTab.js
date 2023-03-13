import React, { memo } from 'react';
import styles from './styles.module.css';
import InputRadio from '../../atoms/InputRadio/InputRadio';

const RadioBoxTab = ({ name, value, onChange, checked, label, className = '', ...props }) => {
  return (
    <label {...props}>
      <InputRadio className={styles.radio} name={name} value={value} onChange={onChange} checked={checked} />
      <span className={[styles.radio_tab, className].join(' ')}>{label}</span>
    </label>
  );
};

export default RadioBoxTab;