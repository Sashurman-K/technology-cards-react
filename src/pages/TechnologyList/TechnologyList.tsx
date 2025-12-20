import React from 'react';
import { Link } from 'react-router-dom';
import { useAppLogic } from '../../Hooks/useAppLogic';
import { useState, useEffect } from 'react';
import { useNotify } from '../../Hooks/useNotification';
import './TechnologyList.css';

// Импорт Material UI компонентов
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Casino as CasinoIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Notes as NotesIcon,
  Book as BookIcon
} from '@mui/icons-material';

interface Technology {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  category?: string;
  notes?: string;
  createdAt?: string;
  deadline?: string;
}

function TechnologyList() {
  const {
    filteredTechnologies,
    searchQuery,
    setSearchQuery,
    filterValue,
    handleFilterChange,
    handleRandomTechnology,
    handleMassStatusUpdate,
    handleMassSelectedUpdate,
    progress,
    updateStatus
  } = useAppLogic();

  const notify = useNotify();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMassEditModalOpen, setIsMassEditModalOpen] = useState(false);
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);
  const [modalTechnologies, setModalTechnologies] = useState<Technology[]>([]);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isMassEditModalOpen) {
      setModalTechnologies(filteredTechnologies);
      setSelectedTechIds([]);
    }
  }, [isMassEditModalOpen, filteredTechnologies]);

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colorMap: Record<string, any> = {
      'not-started': 'default',
      'in-progress': 'warning',
      'completed': 'success'
    };
    return colorMap[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in-progress':
        return <ScheduleIcon />;
      default:
        return <InfoIcon />;
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

  const getDeadlineColor = (deadlineString?: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (!deadlineString) return 'default';

    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'error';
    } else if (diffDays <= 3) {
      return 'error';
    } else if (diffDays <= 7) {
      return 'warning';
    } else {
      return 'default';
    }
  };

  const handleTechCheckboxChange = (techId: number) => {
    setSelectedTechIds(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTechIds.length === modalTechnologies.length) {
      setSelectedTechIds([]);
    } else {
      setSelectedTechIds(modalTechnologies.map(tech => tech.id));
    }
  };

  const handleMassStatusChange = (newStatus: 'not-started' | 'in-progress' | 'completed') => {
    if (selectedTechIds.length === 0) {
      notify.warning('Выберите хотя бы одну технологию');
      return;
    }

    handleMassSelectedUpdate(selectedTechIds, newStatus);
    notify.success(`Статус ${selectedTechIds.length} технологий изменен на "${getStatusText(newStatus)}"`);

    setIsMassEditModalOpen(false);
    setSelectedTechIds([]);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMassEditModalOpen(false);
    }

    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      handleSelectAll();
    }
  };

  const handleExportData = () => {
    if (exportStatus === 'exporting') return;

    setExportStatus('exporting');

    try {
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalTechnologies: filteredTechnologies.length,
          format: exportFormat,
          version: '1.0'
        },
        technologies: filteredTechnologies.map(tech => ({
          ...tech,
          statusText: getStatusText(tech.status)
        }))
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const dataUrl = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `technologies_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(dataUrl), 100);

      setExportStatus('success');
      notify.success('Данные успешно экспортированы в JSON');

      setTimeout(() => {
        setIsExportModalOpen(false);
        setExportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
      notify.error('Ошибка при экспорте данных');
    }
  };

  const handleExportCSV = () => {
    if (exportStatus === 'exporting') return;

    setExportStatus('exporting');

    try {
      const headers = ['ID', 'Название', 'Описание', 'Статус', 'Категория', 'Дедлайн', 'Создано', 'Заметки'];

      const csvRows = filteredTechnologies.map(tech => [
        tech.id,
        `"${tech.title.replace(/"/g, '""')}"`,
        `"${tech.description.replace(/"/g, '""')}"`,
        getStatusText(tech.status),
        tech.category || '',
        tech.deadline ? new Date(tech.deadline).toLocaleDateString('ru-RU') : '',
        tech.createdAt ? new Date(tech.createdAt).toLocaleDateString('ru-RU') : '',
        `"${(tech.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `technologies_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);

      setExportStatus('success');
      notify.success('Данные успешно экспортированы в CSV');

      setTimeout(() => {
        setIsExportModalOpen(false);
        setExportStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('CSV export error:', error);
      setExportStatus('error');
      notify.error('Ошибка при экспорте данных в CSV');
    }
  };

  const handleUpdateStatus = (techId: number) => {
    try {
      updateStatus(techId);
      const tech = filteredTechnologies.find(t => t.id === techId);
      if (tech) {
        notify.info(`Статус "${tech.title}" обновлен`);
      }
    } catch (error) {
      notify.error('Ошибка при обновлении статуса');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Заголовок страницы */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Все технологии
          </Typography>
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Прогресс: {progress}%
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => setIsExportModalOpen(true)}
          >
            Экспорт данных
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/add-technology"
            startIcon={<AddIcon />}
          >
            Добавить технологию
          </Button>
        </Grid>
      </Grid>

      {/* Панель управления */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Поиск */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск технологий..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Найдено: {filteredTechnologies.length} технологий
            </Typography>
          </Grid>

          {/* Фильтры и кнопки */}
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size="grow">
                <Button
                  variant={filterValue === 'all' ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('all')}
                  startIcon={<FilterListIcon />}
                  sx={{ mr: 1 }}
                >
                  Все
                </Button>
                <Button
                  variant={filterValue === 'not-started' ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('not-started')}
                  sx={{ mr: 1 }}
                >
                  Не начато
                </Button>
                <Button
                  variant={filterValue === 'in-progress' ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('in-progress')}
                  sx={{ mr: 1 }}
                >
                  В процессе
                </Button>
                <Button
                  variant={filterValue === 'completed' ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('completed')}
                >
                  Завершено
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  onClick={handleRandomTechnology}
                  startIcon={<CasinoIcon />}
                >
                  Случайная
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Массовые действия */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" gutterBottom>
              Массовые действия:
            </Typography>
            <Grid container spacing={1}>
              <Grid>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleMassStatusUpdate('not-started')}
                >
                  Все в "Не начато"
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleMassStatusUpdate('completed')}
                >
                  Все в "Завершено"
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsMassEditModalOpen(true)}
                >
                  Выбрать для редактирования
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Сетка технологий */}
      {filteredTechnologies.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {searchQuery || filterValue !== 'all' ? (
            <>
              <Typography variant="h6" gutterBottom>
                Ничего не найдено
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Попробуйте изменить параметры поиска или фильтрации
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  handleFilterChange('all');
                  setSearchQuery('');
                }}
              >
                Сбросить фильтры
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Технологий пока нет
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Начните отслеживание своих технологий
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/add-technology"
                startIcon={<AddIcon />}
              >
                Добавить первую технологию
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredTechnologies.map((tech) => (
            <Grid key={tech.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
                onClick={() => handleUpdateStatus(tech.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleUpdateStatus(tech.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Технология: ${tech.title}, статус: ${getStatusText(tech.status)}`}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ flexGrow: 1 }}>
                      {tech.title}
                    </Typography>
                    {tech.category && (
                      <Chip
                        label={tech.category}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>

                  {tech.deadline && (
                    <Chip
                      icon={<ScheduleIcon />}
                      label={formatDeadline(tech.deadline)}
                      size="small"
                      color={getDeadlineColor(tech.deadline)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  )}

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tech.description}
                  </Typography>

                  {tech.notes && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <NotesIcon fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        {tech.notes.length > 60
                          ? `${tech.notes.substring(0, 60)}...`
                          : tech.notes}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      icon={getStatusIcon(tech.status)}
                      label={getStatusText(tech.status)}
                      color={getStatusColor(tech.status)}
                      variant="filled"
                      size="small"
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    component={Link}
                    to={`/technology/${tech.id}`}
                    startIcon={<BookIcon />}
                    onClick={(e) => e.stopPropagation()}
                    sx={{ ml: 1 }}
                  >
                    Подробнее
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Модальное окно экспорта */}
      <Dialog
        open={isExportModalOpen}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportStatus('idle');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileDownloadIcon />
            Экспорт данных
          </Box>
        </DialogTitle>
        <DialogContent>
          {exportStatus === 'success' ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Данные успешно экспортированы!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Файл скачан автоматически.
              </Typography>
            </Box>
          ) : exportStatus === 'error' ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <WarningIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ошибка при экспорте
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Произошла ошибка при попытке экспортировать данные.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Пожалуйста, попробуйте еще раз.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ pt: 2 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Выберите формат для экспорта данных
              </Alert>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={6}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: exportFormat === 'json' ? 2 : 1,
                      borderColor: exportFormat === 'json' ? 'primary.main' : 'divider',
                      bgcolor: exportFormat === 'json' ? 'primary.50' : 'background.paper'
                    }}
                    onClick={() => setExportFormat('json')}
                  >
                    <Typography variant="h6">JSON</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Полная структура данных
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={6}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: exportFormat === 'csv' ? 2 : 1,
                      borderColor: exportFormat === 'csv' ? 'primary.main' : 'divider',
                      bgcolor: exportFormat === 'csv' ? 'primary.50' : 'background.paper'
                    }}
                    onClick={() => setExportFormat('csv')}
                  >
                    <Typography variant="h6">CSV</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Табличный формат
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Всего технологий:</strong> {filteredTechnologies.length}
                </Typography>
                <Typography variant="body2">
                  <strong>Формат:</strong> {exportFormat.toUpperCase()}
                </Typography>
              </Box>

              {filteredTechnologies.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Нет данных для экспорта. Добавьте технологии сначала.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {exportStatus === 'success' ? (
            <Button onClick={() => {
              setIsExportModalOpen(false);
              setExportStatus('idle');
            }}>
              Закрыть
            </Button>
          ) : exportStatus === 'error' ? (
            <>
              <Button onClick={() => setExportStatus('idle')}>
                Назад
              </Button>
              <Button
                onClick={exportFormat === 'json' ? handleExportData : handleExportCSV}
                variant="contained"
              >
                Попробовать снова
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsExportModalOpen(false)}
                disabled={exportStatus === 'exporting'}
              >
                Отмена
              </Button>
              <Button
                onClick={exportFormat === 'json' ? handleExportData : handleExportCSV}
                variant="contained"
                disabled={exportStatus === 'exporting' || filteredTechnologies.length === 0}
                startIcon={exportStatus === 'exporting' ? <CircularProgress size={20} /> : null}
              >
                {exportStatus === 'exporting' ? 'Экспорт...' : 'Экспортировать'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Модальное окно массового редактирования */}
      <Dialog
        open={isMassEditModalOpen}
        onClose={() => setIsMassEditModalOpen(false)}
        maxWidth="md"
        fullWidth
        onKeyDown={handleModalKeyDown}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckBoxIcon />
            Массовое редактирование технологий
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTechIds.length === modalTechnologies.length && modalTechnologies.length > 0}
                    indeterminate={selectedTechIds.length > 0 && selectedTechIds.length < modalTechnologies.length}
                    onChange={handleSelectAll}
                  />
                }
                label={`Выбрать все (${modalTechnologies.length})`}
              />
              <Typography variant="body2" color="primary">
                Выбрано: {selectedTechIds.length}
              </Typography>
            </Box>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid>
                <Button
                  variant="outlined"
                  onClick={() => handleMassStatusChange('not-started')}
                  disabled={selectedTechIds.length === 0}
                  size="small"
                >
                  Не начато
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => handleMassStatusChange('in-progress')}
                  disabled={selectedTechIds.length === 0}
                  size="small"
                >
                  В процессе
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => handleMassStatusChange('completed')}
                  disabled={selectedTechIds.length === 0}
                  size="small"
                >
                  Завершено
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {modalTechnologies.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" py={3}>
                Нет технологий для выбора
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {modalTechnologies.map((tech) => (
                  <Grid size={12} key={tech.id}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        bgcolor: selectedTechIds.includes(tech.id) ? 'action.selected' : 'background.paper'
                      }}
                      onClick={() => handleTechCheckboxChange(tech.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTechCheckboxChange(tech.id);
                        }
                      }}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={selectedTechIds.includes(tech.id)}
                    >
                      <Checkbox
                        checked={selectedTechIds.includes(tech.id)}
                        onChange={() => handleTechCheckboxChange(tech.id)}
                        onClick={(e) => e.stopPropagation()}
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                      />
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography variant="body1">
                          {tech.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getStatusText(tech.status)}
                        </Typography>
                      </Box>
                      {tech.category && (
                        <Chip label={tech.category} size="small" variant="outlined" />
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMassEditModalOpen(false)}>
            Отмена
          </Button>
          <Button
            onClick={() => {
              if (selectedTechIds.length === 0) {
                notify.warning('Выберите хотя бы одну технологию');
                return;
              }
              handleMassStatusChange('in-progress');
            }}
            variant="contained"
            disabled={selectedTechIds.length === 0}
          >
            Применить изменения ({selectedTechIds.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TechnologyList;