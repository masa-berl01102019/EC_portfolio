import React, {memo} from 'react';
import InputRadio from '../../atoms/InputRadio/InputRadio';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormInputRadio = ({
    name, 
    value, 
    onChange, 
    checked, 
    label = null, 
    className = '',
    error,
    ...props
  }) => {

  return (
    <label className={[styles.flex, styles.align_center, className].join(' ')}>
      <InputRadio
        name={name} 
        value={value} 
        onChange={onChange}
        checked={checked}
        className={error && error[name] && styles.error_form}
        {...props}
      />
      <Text className={styles.ml_8}>{label}</Text>
    </label>
  );

};

export default FormInputRadio;