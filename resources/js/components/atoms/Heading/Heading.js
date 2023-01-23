import React, {memo} from 'react';
import styles from './styles.module.css';

const Heading = ({children, tag, tag_style, className='', ...props}) => {
  // 要素としてタグの要素としてh1 ~ h6 を受け取る
  const Tag = tag;
  return (
    <Tag className={[styles[tag_style], className].join(' ')} {...props}>{children}</Tag>
  );
};

export default Heading;