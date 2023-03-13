import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const EditLink = ({ children, to, className = '' }) => {
  return (
    <Link to={to} className={[styles.flex, className].join(' ')}>
      <Icon src='/img/detail_icon.svg' className={styles.detail_icon} />
      <Text role='primary'>{children}</Text>
    </Link>
  );
};

export default EditLink;