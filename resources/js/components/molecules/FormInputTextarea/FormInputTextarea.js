import React, {memo} from 'react';
import Badge from '../../atoms/Badge/Badge';
import InputTextarea from '../../atoms/InputTextarea/InputTextarea';
import styles from './styles.module.css';

const FormInputTextarea = ({
    name, 
    value, 
    onBlur, 
    placeholder, 
    label = null, 
    error, 
    required = false, 
    flex_style ='column',
    className = ''
  }) => {

  return (
    <div>
      <div className={[styles[flex_style], className].join(' ')} >
          { label && (
            <div className={styles.row}>
              <label htmlFor={name} className={styles.label}>{label}</label>
              {required && <Badge text={'必須'} className={styles.ml}/>} 
            </div>
          )}
          <InputTextarea
            name={name} 
            value={value} 
            onBlur={onBlur} 
            placeholder={placeholder}
            className={error && error[name] && styles.error_form}
          />
      </div>
      { error && <p className={[styles.error, styles.mt].join(' ')} >{error[name]}</p> }
    </div>
  );

};

export default FormInputTextarea;