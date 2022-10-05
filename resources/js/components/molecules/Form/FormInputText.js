import React, {memo} from 'react';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputText = ({
    name, 
    value, 
    type = 'text',
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
      <InputText
        name={name} 
        type={type}
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

export default FormInputText;