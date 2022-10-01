import React from 'react';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const CartBtn = ({children, size = 'm', onClick, className = '', ...props}) => {

  const disabled = props.disabled ? 'disabled' : '';

  return (
    <Button size={size} onClick={onClick} className={[styles.icon_btn, styles[disabled], className].join(' ')} {...props}>
      <Icon src='/img/shopping_cart_icon.svg' />
      <Text size={size}>{children}</Text>
    </Button>
  );
}

export default CartBtn;