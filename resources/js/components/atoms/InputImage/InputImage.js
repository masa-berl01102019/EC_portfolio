import React, {memo} from 'react';
import styles from './styles.module.css';

const InputImage = ({
    src,
    name,
    onChange, 
    className = '', 
    ...props
  }) => {
  return (
    <label>
      <img src={src} alt="image" className={[styles.insert_img, className].join(' ')} {...props} />
      <input 
        name={name} 
        type="file" 
        accept="image/*" 
        onChange={onChange} 
        className={styles.hidden} 
      />
    </label>
  );
};

export default InputImage;