import React, {memo} from 'react';
import styles from './styles.module.css';

const InputRadio = ({name, value, onChange, checked, className = '', ...props}) => {
  return (
    <input className={[styles.radio, className].join(' ')} type='radio' name={name} value={value} onChange={onChange} checked={checked} {...props}/>
  );
};

export default InputRadio;