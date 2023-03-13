import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Text from '../../../atoms/Text/Text';
import styles from './styles.module.css';
import Icon from '../../../atoms/Icon/Icon';

const NotificationCard = memo(({
  notification,
  className = '',
  ...props
}) => {

  return (
    <div className={styles.notification_card} {...props}>
      <Link to={`/notifications`} className={[styles.link_fill, styles.flex].join(' ')}>
        <div className={[styles.text_contents].join(' ')}>
          <Text size='s' className={[styles.mb_4, styles.card_text].join(' ')}>
            {notification.modified_at ? notification.modified_at : notification.posted_at}
          </Text>
          <Text size='l' className={[styles.card_text, styles.font_bold].join(' ')}>
            {notification.title}
          </Text>
        </div>
        <Icon src={'/img/arrow_right_icon.svg'} className={styles.icon} />
      </Link>
    </div>
  );
});

export default NotificationCard;