import React, { memo } from 'react';
import styles from './styles.module.css';

const Text = ({ children, tag = 'p', size = 'm', role = 'text', className = '', ...props }) => {
  // tag props is passed as a html element ex) p, div, span
  const Tag = tag;
  return (
    <Tag className={[styles[size], styles[role], className].join(' ')} {...props}>{children}</Tag>
  );
};

export default Text;