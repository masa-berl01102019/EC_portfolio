import React, { memo, useState } from 'react';
import Selectbox from '../../atoms/Selectbox/Selectbox';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormSelectbox = ({
  name,
  value,
  onChange,
  validation = null,
  valid = false,
  label = null,
  error,
  children,
  className = '',
  ...props
}) => {

  const [isFocused, setIsFocused] = useState(null);

  return (
    <div className={className}>
      {label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text>}
      <Selectbox
        name={name}
        value={value}
        onChange={e => {
          setIsFocused(true);
          onChange(e);
        }}
        className={error && error[name] && styles.error_form}
        {...props}
      >
        {children}
      </Selectbox>
      {((isFocused || valid) && validation.fails() && validation.errors.first(name)) &&
        <Text size='s' role='error' className={[styles.mt_8, styles.front_validation].join(' ')} >
          {validation.errors.first(name)}
        </Text>
      }
      {error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text>}
    </div>
  );
};

export default FormSelectbox;