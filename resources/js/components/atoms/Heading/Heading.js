import React, { memo } from 'react';
import styles from './styles.module.css';

const Heading = ({ children, tag, tag_style, className = '', ...props }) => {
  // tag props is passed as a html element ex) h1~h6
  const Tag = tag;
  return (
    <Tag className={[styles[tag_style], className].join(' ')} {...props}>{children}</Tag>
  );
};

export default Heading;