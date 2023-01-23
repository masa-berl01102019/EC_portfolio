import React, {forwardRef, memo} from 'react';
import styles from './styles.module.css';

const InputText = forwardRef(({name, type = 'text', value, placeholder, className = '', ...props}, ref) => {
  return (
    <input 
      id={name}
      name={name} 
      type={type} 
      defaultValue={value} 
      placeholder={placeholder}
      className={[ styles.input, className].join(' ')} 
      ref={ref}
      {...props}
    />
  );
});

export default InputText;