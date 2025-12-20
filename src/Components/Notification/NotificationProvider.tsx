import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Notification {
  id: number;
  message: string;
  type: AlertColor;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: AlertColor, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const showNotification = (message: string, type: AlertColor, duration = 6000) => {
    const id = Date.now();
    const newNotification: Notification = { id, message, type, duration };

    setNotifications((prev) => [newNotification, ...prev]);
    setOpen(true);

    setTimeout(() => {
      handleClose(id);
    }, duration);
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  };

  const handleClose = (id?: number) => {
    if (id) {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } else {
      setOpen(false);
    }
  };

  const handleExited = () => {
    setNotifications((prev) => prev.slice(0, -1));
  };

  const currentNotification = notifications[0];

  return (
    <NotificationContext.Provider
      value={{ showNotification, showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      {currentNotification && (
        <Snackbar
          key={currentNotification.id}
          open={open}
          autoHideDuration={currentNotification.duration}
          onClose={() => handleClose(currentNotification.id)}
          TransitionProps={{ onExited: handleExited }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              borderRadius: 2,
            },
          }}
        >
          <Alert
            severity={currentNotification.type}
            variant="filled"
            onClose={() => handleClose(currentNotification.id)}
            sx={{
              width: '100%',
              alignItems: 'center',
              '& .MuiAlert-message': {
                flex: 1,
              },
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleClose(currentNotification.id)}
                sx={{ ml: 2 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
};