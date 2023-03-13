import React from 'react';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const FilterSortBtn = ({ children, size = 'm', onClick, className = '', }) => {
  return (
    <Button size={size} onClick={onClick} className={[styles.icon_btn, styles.sort_btn, className].join(' ')}>
      <Icon src='/img/filter_sort_icon.svg' className={styles.sort_icon} />
      <Text size={size}>{children}</Text>
    </Button>
  );
}

export default FilterSortBtn;