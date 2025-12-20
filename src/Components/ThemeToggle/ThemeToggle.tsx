import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={mode === 'light' ? 'Тёмная тема' : 'Светлая тема'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label={mode === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
        sx={{
          ml: 1,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {mode === 'light' ? (
          <Brightness4Icon sx={{ color: '#667eea' }} />
        ) : (
          <Brightness7Icon sx={{ color: '#fff' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};