import React, {memo} from 'react';
import DatePicker from '../../atoms/DatePicker/DatePicker';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormDatePicker = ({
    name, 
    value, 
    onChange, 
    label = null, 
    className = '',
    error,
    ...props
  }) => {

  return (
    <div className={className}>
      { label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text> }
      <DatePicker
        name={name} 
        value={value} 
        onChange={onChange} 
        className={error && error[name] && styles.error_form}
        {...props}
      />
      { error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text> }
    </div>
  );

};

export default FormDatePicker;