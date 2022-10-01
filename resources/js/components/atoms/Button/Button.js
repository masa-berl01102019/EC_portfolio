import React, {memo} from 'react';
import styles from './styles.module.css';

const Button = ({children, size = 'm', color = 'secondary', onClick, className, ...props}) => {
  return (
    <button onClick={onClick} className={[styles.btn, styles[size], styles[color], className].join(' ')} {...props}>{children}</button>
  );
};

export default Button;

