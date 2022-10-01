import React, {memo} from 'react';
import styles from './styles.module.css';

const Text = ({children, tag = 'p', size = 'm', role = 'text', className='', ...props}) => {
  // 要素としてタグの要素として p, div, span 等を受け取る
  const Tag = tag;
  return (
    <Tag className={[styles[size], styles[role], className].join(' ')} {...props}>{children}</Tag>
  );
};

export default Text;