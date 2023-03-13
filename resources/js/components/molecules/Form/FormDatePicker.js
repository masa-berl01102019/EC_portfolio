import React, { memo, useState } from 'react';
import DatePicker from '../../atoms/DatePicker/DatePicker';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormDatePicker = ({
  name,
  value,
  onChange,
  validation = null,
  valid = false,
  label = null,
  className = '',
  error,
  ...props
}) => {

  const [isFocused, setIsFocused] = useState(null);

  return (
    <div className={className}>
      {label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text>}
      <DatePicker
        name={name}
        value={value}
        onChange={e => {
          setIsFocused(true);
          onChange(e, name);
        }}
        className={error && error[name] && styles.error_form}
        {...props}
      />
      <br />
      {((isFocused || valid) && validation.fails() && validation.errors.first(name)) &&
        <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
          {validation.errors.first(name)}
        </Text>
      }
      {error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text>}
    </div>
  );

};

export default FormDatePicker;