import React, {memo} from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../atoms/Mask/Mask';
import {CircularProgress} from '@material-ui/core';

const LoadingPopup = ({
    isOpen,
    children,
    className = '',
    ...props
  }) => {

  if(isOpen) {
    return (
      <Mask>
        <div className={styles.content} {...props}>
          <CircularProgress disableShrink style={{'width': '80px', 'height': '80px', 'margin': '32px auto', 'position': 'absolute', 'top': '-700%', 'left': '0', 'right': '0' }} />
          <Text size='xl' role='reverse' className={styles.nowrap}>{children}</Text>
        </div>
      </Mask>
    );
  }
};

export default LoadingPopup;