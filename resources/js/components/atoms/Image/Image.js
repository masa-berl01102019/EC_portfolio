import React, {memo} from 'react';
import styles from './styles.module.css';

const Image = ({src, type = 'item', alt = 'image', className = '', ...props}) => {
  return (
    <img className={[styles[type], className].join(' ')} src={src} alt={alt} {...props} />
  );
};

export default Image;