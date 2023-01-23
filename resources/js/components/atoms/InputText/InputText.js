import React, {memo} from 'react';
import styles from './styles.module.css';

const InputText = ({name, type = 'text', value, onBlur, placeholder, className = '', ...props}) => {
  return (
    <input 
      id={name}
      name={name} 
      type={type} 
      defaultValue={value} 
      onBlur={onBlur} 
      placeholder={placeholder}
      className={[ styles.input, className].join(' ')} 
      {...props}
    />
  );
};

export default InputText;