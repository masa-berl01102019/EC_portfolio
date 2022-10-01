import React, {memo} from 'react';
import styles from './styles.module.css';

const Badge = ({text, type = 'require', className = '', ...props}) => {
  const style_type = type + '_badge';
  return (
    <span className={[styles[style_type], className].join(' ')} {...props}>{text}</span>
  );
};

export default Badge;