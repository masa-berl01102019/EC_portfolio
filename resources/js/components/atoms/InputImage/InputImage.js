import React, {memo} from 'react';
import styles from './styles.module.css';

const InputImage = ({
    name,
    onChange, 
    className = '', 
    ...props
  }) => {
  return (
    <input name={name} type="file" accept="image/*" onChange={onChange} className={className} {...props} />
  );
};

export default InputImage;