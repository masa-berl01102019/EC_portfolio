import React, { memo } from 'react';
import { Link } from "react-router-dom";
import styles from './styles.module.css';

const LinkBtn = ({ children, size = 'm', color = 'secondary', to, className, ...props }) => {
  return (
    <Link to={to} className={[styles.btn_link, styles[size], styles[color], className].join(' ')} {...props}>{children}</Link>
  );
};

export default LinkBtn;