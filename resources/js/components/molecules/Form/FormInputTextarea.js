import React, {memo} from 'react';
import InputTextarea from '../../atoms/InputTextarea/InputTextarea';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputTextarea = ({
    name, 
    value, 
    onBlur, 
    placeholder, 
    label = null, 
    error, 
    className = '',
    ...props
  }) => {

  return (
    <div className={className}>
      { label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text> }
      <InputTextarea
        name={name} 
        value={value} 
        onBlur={onBlur} 
        placeholder={placeholder}
        className={error && error[name] && styles.error_form}
        {...props}
      />
      { error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text> }
    </div>
  );

};

export default FormInputTextarea;