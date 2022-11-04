import React, {memo} from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../atoms/Icon/Icon';

export const ToastifyPopup = ({
    message = '',
    isOpen = false,
    type = 'success', 
    onClose,
    className = '',
    ...props
  }) => {

  if(isOpen) {
    return (
        <div className={[styles.toast_container, styles[type], className].join(' ')} {...props}>
          <Text size='xl' role='reverse' className={[styles.mr_8, styles.mt_4].join(' ')}>{message}</Text>
          <Icon src='/img/trash_icon.svg' onClick={onClose}></Icon>
        </div>
    );
  }
}

