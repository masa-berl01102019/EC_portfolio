import React, {memo} from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Mask from '../../atoms/Mask/Mask';
import Image from '../../atoms/Image/Image';

const CompletePopup = ({
    isOpen,
    children,
    className = '',
    ...props
  }) => {

  if(isOpen) {
    return (
      <Mask>
        <div className={styles.content} {...props}>
          <Image src='/img/complete_icon.svg' type='info_list' className={styles.img} />
          <Text size='xl' role='reverse' className={styles.nowrap}>{children}</Text>
        </div>
      </Mask>
    );
  }
};

export default CompletePopup;