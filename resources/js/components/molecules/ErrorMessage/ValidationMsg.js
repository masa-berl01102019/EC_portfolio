import React from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const ValidationMsg = ({ errKey, valid, validation = null, errorObject = null, className, ...props }) => {

  const errorMsg = errorObject && Object.entries(errorObject).map(([key, value]) => {
    if (key.includes(errKey)) return value
  }).filter(value => Boolean(value));

  return (
    <>
      {errorObject ? (
        valid && errorMsg.length > 0 &&
        errorMsg.map((msg, index) => (
          <Text key={index} size='s' role='error' className={[styles.mt_8, styles.front_validation, className].join(' ')} {...props} >
            {msg}
          </Text>
        ))
      ) : (
        valid && validation.fails() && validation.errors.first(errKey) &&
        <Text size='s' role='error' className={[styles.mt_8, styles.front_validation, className].join(' ')} {...props} >
          {validation.errors.first(errKey)}
        </Text>
      )}
    </>
  );
}

export default ValidationMsg;