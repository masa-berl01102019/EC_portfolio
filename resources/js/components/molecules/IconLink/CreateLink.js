import React, {memo} from 'react';
import {Link} from 'react-router-dom';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const CreateLink = ({children, to, className = '' }) => {
  return (
    <Link to={to} className={[styles.flex, styles.button_style, className].join(' ')}>
      <Icon src='/img/add_icon_white.svg' className={styles.add_icon}/>
      <Text role='reverse'>{children}</Text>
    </Link>
  );
};

export default CreateLink;