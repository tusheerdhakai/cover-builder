import React from 'react';
import { Notification } from './Notification';
import type { NotificationItem } from '../../hooks/useNotifications';

interface NotificationManagerProps {
  notifications: NotificationItem[];
  onRemoveNotification: (id: string) => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onRemoveNotification,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={onRemoveNotification}
        />
      ))}
    </div>
  );
}; 