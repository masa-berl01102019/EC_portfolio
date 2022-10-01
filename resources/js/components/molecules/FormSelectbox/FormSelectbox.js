import React, {memo} from 'react';
import Badge from '../../atoms/Badge/Badge';
import Selectbox from '../../atoms/Selectbox/Selectbox';
import styles from './styles.module.css';

const FormSelectbox = ({
    name, 
    value, 
    onChange, 
    label = null, 
    error,
    children,
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
          <Selectbox
            name={name} 
            value={value} 
            onChange={onChange} 
            className={error && error[name] && styles.error_form}
          >
          {children}
          </Selectbox>
      </div>
      { error && <p className={[styles.error, styles.mt].join(' ')} >{error[name]}</p> }
    </div>
  );

};

export default FormSelectbox;