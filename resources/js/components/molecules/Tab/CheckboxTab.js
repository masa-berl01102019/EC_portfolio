import React, {memo, useState} from 'react';
import Icon from '../../atoms/Icon/Icon';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';

const CheckboxTab = ({children, tabName='', className = '', ...props}) => {

  const [openList, setOpenList] = useState(false);

  return (
    <div className={className} {...props}>
      <div className={[styles.mb_8, styles.tab_btn].join(' ')} onClick={() => setOpenList(!openList)}>
        <Text>{tabName}</Text>
        <Icon src={openList ? '/img/remove_icon.svg' : '/img/add_icon.svg'} />
      </div>
      {openList &&
        <div>
          {children}
        </div>
      }
    </div>
  );
}

export default CheckboxTab;