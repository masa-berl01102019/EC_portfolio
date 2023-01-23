import React, {memo} from 'react';
import Selectbox from '../../atoms/Selectbox/Selectbox';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FormSelectbox = ({
    name, 
    value, 
    onChange, 
    label = null, 
    error,
    children,
    className = '',
    ...props
  }) => {

  return (
    <div className={className}>
      { label && <Text tag='label' htmlFor={name} className={styles.label}>{label}</Text> }
      <Selectbox
        name={name} 
        value={value} 
        onChange={onChange} 
        className={error && error[name] && styles.error_form}
        {...props}
      >
        {children}
      </Selectbox>
      { error && <Text size='s' role='error' className={styles.mt_8} >{error[name]}</Text> }
    </div>
  );
};

export default FormSelectbox;