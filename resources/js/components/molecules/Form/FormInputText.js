import React, { memo, useState } from 'react';
import InputText from '../../atoms/InputText/InputText';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputText = ({
  name,
  value,
  type = 'text',
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
      {label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text>}
      <InputText
        name={name}
        type={type}
        value={value}
        onChange={e => {
          setIsFocused(true);
          onChange(e);
        }}
        placeholder={placeholder}
        className={error && error[name] && styles.error_form}
        {...props}
      />
      {error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text>}
      {((isFocused || valid) && validation.fails() && validation.errors.first(name)) &&
        <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
          {validation.errors.first(name)}
        </Text>
      }
    </div>
  );

};

export default FormInputText;