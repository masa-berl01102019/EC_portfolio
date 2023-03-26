import React, { memo, useState } from 'react';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../../atoms/Icon/Icon';

const Notification = memo(({
  notification,
  className = '',
  openId,
  ...props
}) => {

  const [tab, SetTab] = useState(notification.id === openId ? true : false);

  return (
    <div className={styles.container} {...props}>
      <div className={styles.title_area} onClick={() => SetTab(!tab)}>
        <div className={styles.notification_title_area}>
          <Text size='s' className={styles.mb_4}>
            {notification.modified_at ? notification.modified_at : notification.posted_at}
          </Text>
          <Text className={styles.notification_title}>{notification.title}</Text>
        </div>
        <Icon src={tab ? '/img/remove_icon.svg' : '/img/add_icon.svg'} />
      </div>
      {tab &&
        <div className={styles.body_area}>
          <Text>{notification.body}</Text>
        </div>
      }
    </div>
  );
});

export default Notification;