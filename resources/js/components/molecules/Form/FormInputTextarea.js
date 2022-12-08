import React, {memo, useState} from 'react';
import InputTextarea from '../../atoms/InputTextarea/InputTextarea';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputTextarea = ({
    name, 
    value, 
    onChange,
    validation = null, 
    valid = false,
    placeholder, 
    label = null, 
    error, 
    className = '',
    ...props
  }) => {

  const [isFocused, setIsFocused] = useState(null);

  return (
    <div className={className}>
      { label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text> }
      <InputTextarea
        name={name} 
        value={value} 
        onChange={e => {
          setIsFocused(true);
          onChange(e);
        }} 
        placeholder={placeholder}
        className={error && error[name] && styles.error_form}
        {...props}
      />
      { ((isFocused || valid) && validation.fails() && validation.errors.first(name)) && 
        <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
          {validation.errors.first(name)}
        </Text> 
      }
      { error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text> }
    </div>
  );

};

export default FormInputTextarea;