import React, {memo} from 'react';
import Badge from '../../atoms/Badge/Badge';
import InputText from '../../atoms/InputText/InputText';
import styles from './styles.module.css';

const FormInputText = ({
    name, 
    value, 
    type = 'text',
    onBlur, 
    placeholder, 
    label = null, 
    error, 
    required = false, 
    flex_style ='column',
    className = '',
    ...props
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
          <InputText
            name={name} 
            type={type}
            value={value} 
            onBlur={onBlur} 
            placeholder={placeholder}
            className={error && error[name] && styles.error_form}
            {...props}
          />
      </div>
      { error && <p className={[styles.error, styles.mt].join(' ')} >{error[name]}</p> }
    </div>
  );

};

export default FormInputText;