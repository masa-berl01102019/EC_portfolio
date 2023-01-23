import React, {memo} from 'react';
import styles from './styles.module.css';

export const Footer = ({className, ...props}) => {
    return (
        <footer className={[styles.footer, className].join('')} {...props}>
            &copy; DEMO DEV CO., LTD. ALL RIGHT RESERVED.
        </footer>
    );
};
