import React, {memo, useState} from 'react';
import Text from '../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../atoms/Icon/Icon';

const NotificationList = ({
    notification, 
    className = '',
    ...props
  }) => {

  const [tab, SetTab] = useState(false);

  return (
    <div className={styles.container} {...props}>
        <div className={styles.title_area} onClick={() => SetTab(!tab)}>
            <div>
                <Text size='s' className={styles.mb_4}>
                    {notification.modified_at ? notification.modified_at : notification.posted_at}
                </Text>
                <Text>{notification.title}</Text>
            </div>
            <Icon src={ tab ? '/img/remove_icon.svg' : '/img/add_icon.svg'}  />
        </div>
        {   tab && 
            <div className={styles.body_area}>
                <Text>{notification.body}</Text>
            </div>
        }
    </div>
  );
};

export default NotificationList;