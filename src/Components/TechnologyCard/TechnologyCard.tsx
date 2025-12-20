import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
  Paper,
  Alert,
  useTheme
} from '@mui/material';
import {
  Info as InfoIcon,
  Alarm as AlarmIcon,
  Notes as NotesIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  RadioButtonUnchecked as NotStartedIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface Technology {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  category?: string;
  notes?: string;
  deadline?: string;
}

interface TechnologyCardProps {
  tech: Technology;
  onStatusChange: (id: number) => void;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ tech, onStatusChange }) => {
  const theme = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not-started': return <NotStartedIcon />;
      case 'in-progress': return <PlayCircleIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <NotStartedIcon />;
    }
  };

  const formatDeadline = (deadlineString?: string): string => {
    if (!deadlineString) return '';
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = deadline.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (diffDays < 0) {
      return `${formattedDate} (просрочено ${Math.abs(diffDays)} дн.)`;
    } else if (diffDays === 0) {
      return `${formattedDate} (сегодня!)`;
    } else if (diffDays === 1) {
      return `${formattedDate} (завтра)`;
    } else if (diffDays <= 7) {
      return `${formattedDate} (через ${diffDays} дн.)`;
    } else {
      return formattedDate;
    }
  };

  const getDeadlineSeverity = (deadlineString?: string): "error" | "warning" | "info" | "success" => {
    if (!deadlineString) return 'info';
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'error';
    if (diffDays <= 3) return 'error';
    if (diffDays <= 7) return 'warning';
    return 'info';
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Проверяем, был ли клик по кнопке "Подробнее" или её дочерним элементам
    if ((e.target as HTMLElement).closest('[data-details-button]')) {
      return;
    }

    setIsChanging(true);
    onStatusChange(tech.id);

    setTimeout(() => setIsChanging(false), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('[data-details-button]')) {
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsChanging(true);
      onStatusChange(tech.id);
      setTimeout(() => setIsChanging(false), 300);
    }
  };

  return (
    <Card
      sx={{
        // ФИКСИРОВАННАЯ ВЫСОТА для всех карточек
        height: 420,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        transform: isChanging ? 'scale(0.98)' : 'scale(1)',
        opacity: isChanging ? 0.9 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          cursor: 'pointer'
        },
        borderLeft: `4px solid ${
          tech.status === 'completed' ? theme.palette.success.main :
          tech.status === 'in-progress' ? theme.palette.warning.main :
          theme.palette.error.main
        }`
      }}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${tech.title}. Статус: ${getStatusText(tech.status)}. Нажмите для изменения статуса.`}
    >
      <CardContent sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 64px)', // Высота минус кнопка
        overflow: 'hidden',
        pb: 1
      }}>
        {/* Заголовок - фиксированная высота */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          height: 56 // Фиксированная высота
        }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              flexGrow: 1,
              height: '2.6em' // 2 строки
            }}
          >
            {tech.title}
          </Typography>

          {tech.category && (
            <Chip
              label={tech.category}
              size="small"
              variant="outlined"
              sx={{ ml: 1, flexShrink: 0, height: 24 }}
            />
          )}
        </Box>

        {/* Дедлайн - условный блок */}
        <Box sx={{
          mb: 2,
          height: tech.deadline ? 48 : 0,
          overflow: 'hidden',
          transition: 'height 0.2s'
        }}>
          {tech.deadline && (
            <Alert
              severity={getDeadlineSeverity(tech.deadline)}
              icon={<AlarmIcon />}
              sx={{
                py: 0.5,
                '& .MuiAlert-message': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {formatDeadline(tech.deadline)}
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Описание - основной контент, гибкая высота */}
        <Box sx={{
          flexGrow: 1,
          mb: 2,
          overflow: 'hidden'
        }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.5,
              minHeight: '6em', // Минимум 4 строки
              maxHeight: '6em' // Максимум 4 строки
            }}
          >
            {tech.description}
          </Typography>
        </Box>

        {/* Заметки - условный блок */}
        <Box sx={{
          mb: 2,
          height: tech.notes ? 56 : 0,
          overflow: 'hidden',
          transition: 'height 0.2s'
        }}>
          {tech.notes && (
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                height: '100%',
                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                display: 'flex',
                alignItems: 'flex-start'
              }}
            >
              <NotesIcon fontSize="small" color="info" sx={{ mr: 1, mt: 0.2, flexShrink: 0 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.4,
                  flexGrow: 1
                }}
              >
                {tech.notes}
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Статус - фиксированная высота */}
        <Box sx={{
          mt: 'auto',
          height: 40
        }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 1,
              bgcolor:
                tech.status === 'completed' ? 'success.light' :
                tech.status === 'in-progress' ? 'warning.light' :
                'error.light',
              color:
                tech.status === 'completed' ? 'success.contrastText' :
                tech.status === 'in-progress' ? 'warning.contrastText' :
                'error.contrastText',
              height: '100%',
              width: '100%'
            }}
          >
            {getStatusIcon(tech.status)}
            <Typography variant="body2" sx={{
              fontWeight: 600,
              flexGrow: 1,
              textAlign: 'center'
            }}>
              {getStatusText(tech.status)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Кнопка подробнее - фиксированная высота */}
      <CardActions sx={{
        p: 2,
        pt: 0,
        height: 56,
        flexShrink: 0
      }}>
        <Button
          fullWidth
          variant="outlined"
          component={Link}
          to={`/technology/${tech.id}`}
          startIcon={<InfoIcon />}
          data-details-button="true"
          sx={{
            height: 40,
            borderRadius: 1,
            textTransform: 'none'
          }}
          onClick={(e) => e.stopPropagation()} // Останавливаем всплытие
        >
          Подробнее
        </Button>
      </CardActions>
    </Card>
  );
};

export default TechnologyCard;