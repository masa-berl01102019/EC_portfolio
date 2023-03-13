import React, { memo } from 'react';
import NotificationCard from '../Card/NotificationCard';

const NotificationCardLists = memo(({ notifications, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </div >
  );
});

export default NotificationCardLists;