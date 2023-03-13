import React, { memo } from 'react';
import styles from './styles.module.css';

const Icon = ({ src, alt = 'icon', className = '', ...props }) => {
  return (
    <img className={[styles.icon_defalt, className].join(' ')} src={src} alt={alt} {...props} />
  );
};

export default Icon;