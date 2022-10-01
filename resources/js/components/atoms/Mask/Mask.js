import React, {memo} from 'react';
import styles from './styles.module.css';

const Mask = ({children, onClick, className = '', ...props}) => {
  return (
    <div onClick={onClick} className={[styles.mask, className].join(' ')} {...props}>{children}</div>
  );
};

export default Mask;