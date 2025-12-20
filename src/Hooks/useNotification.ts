import { useNotification } from '../Components/Notification/NotificationProvider';

export const useNotify = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  };
};