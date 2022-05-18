import { useNotifications as useMantineNotifications } from '@mantine/notifications';
import { X, Check } from 'tabler-icons-react';

export enum NotificationTypes {
  Error,
  Success,
}

type showNotificationProps = {
  type: NotificationTypes;
  message: string;
  title?: string;
};

export const useNotification = () => {
  const { showNotification } = useMantineNotifications();

  const types = {
    [NotificationTypes.Error]: {
      icon: <X size={18} />,
      color: 'red',
      autoClose: false,
    },
    [NotificationTypes.Success]: {
      icon: <Check size={18} />,
      color: 'teal',
      autoClose: true,
    },
  };

  const showNotificationWithType = ({
    type,
    title = null,
    message,
  }: showNotificationProps) =>
    showNotification({
      title,
      message,
      icon: types[type].icon,
      color: types[type].color,
      autoClose: types[type].autoClose,
    });

  return showNotificationWithType;
};
