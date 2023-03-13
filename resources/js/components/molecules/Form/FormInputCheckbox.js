import React, { memo } from 'react';
import InputCheckbox from '../../atoms/InputCheckbox/InputCheckbox';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputCheckbox = ({
  name,
  value,
  onChange,
  checked,
  label = null,
  className = '',
  ...props
}) => {

  return (
    <label className={[styles.flex, className].join(' ')}>
      <InputCheckbox
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        className={styles.mr_4}
        {...props}
      />
      <Text>{label}</Text>
    </label>
  );

};

export default FormInputCheckbox;