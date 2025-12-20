import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTechnologies from '../../Hooks/useTechnologies';
import './AddTechnology.css';

// Импорт Material UI компонентов
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  NoteAdd as NoteAddIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  PlayCircleOutline as PlayCircleOutlineIcon
} from '@mui/icons-material';

type TechStatus = 'not-started' | 'in-progress' | 'completed';
type TechCategory = 'frontend' | 'backend' | 'mobile' | 'devops' | 'database' | 'other';

const AddTechnology = () => {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useTechnologies();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started' as TechStatus,
    category: 'other' as TechCategory,
    notes: '',
    deadline: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const categories: Array<{ value: TechCategory; label: string; icon: React.ReactNode }> = [
    { value: 'frontend', label: 'Frontend', icon: '🖥️' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'mobile', label: 'Mobile', icon: '📱' },
    { value: 'devops', label: 'DevOps', icon: '🚀' },
    { value: 'database', label: 'Database', icon: '🗄️' },
    { value: 'other', label: 'Другое', icon: '📦' }
  ];

  const statuses: Array<{ value: TechStatus; label: string; icon: React.ReactNode }> = [
    { value: 'not-started', label: 'Не начато', icon: <HourglassEmptyIcon /> },
    { value: 'in-progress', label: 'В процессе', icon: <PlayCircleOutlineIcon /> },
    { value: 'completed', label: 'Завершено', icon: <CheckCircleIcon /> }
  ];

  // Валидация формы
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Валидация названия
    if (!formData.title.trim()) {
      errors.title = 'Введите название технологии';
    } else if (formData.title.length > 100) {
      errors.title = 'Название не должно превышать 100 символов';
    }

    // Валидация описания
    if (!formData.description.trim()) {
      errors.description = 'Введите описание технологии';
    } else if (formData.description.length > 500) {
      errors.description = 'Описание не должно превышать 500 символов';
    }

    // Валидация дедлайна
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        errors.deadline = 'Дедлайн не может быть в прошлом';
      } else if (deadlineDate > new Date('2100-01-01')) {
        errors.deadline = 'Дедлайн не может быть позже 2100 года';
      }
    }

    // Проверка на дубликаты
    const exists = technologies.some((tech: any) =>
      tech.title.toLowerCase() === formData.title.toLowerCase().trim()
    );

    if (exists) {
      errors.title = 'Технология с таким названием уже существует';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Валидация в реальном времени при изменении полей
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      validateForm();
    }
  }, [formData, touchedFields]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (!touchedFields[name]) {
      setTouchedFields(prev => ({ ...prev, [name]: true }));
    }

    if (error) setError(null);
  };

  const handleFieldBlur = (fieldName: string) => {
    if (!touchedFields[fieldName]) {
      setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    }
    validateForm();
  };

  const handleStatusChange = (status: TechStatus) => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleCategoryChange = (category: TechCategory) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Помечаем все поля как "тронутые" для отображения всех ошибок
    const allFields = ['title', 'description', 'deadline'];
    const newTouchedFields = { ...touchedFields };
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    setTouchedFields(newTouchedFields);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const newTechnology = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category,
        notes: formData.notes.trim(),
        deadline: formData.deadline || undefined,
        createdAt: new Date().toISOString()
      };

      const updatedTechnologies = [...technologies, newTechnology];
      localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));

      if (setTechnologies) {
        setTechnologies(updatedTechnologies);
      }

      // Показываем уведомление об успехе (можно интегрировать с вашей системой уведомлений)
      setTimeout(() => {
        navigate('/technologies', {
          state: {
            message: `Технология "${newTechnology.title}" успешно добавлена!`,
            newTechId: newTechnology.id,
            notificationType: 'success'
          }
        });
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при добавлении технологии');
      // Показываем уведомление об ошибке
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'not-started',
      category: 'other',
      notes: '',
      deadline: ''
    });
    setError(null);
    setValidationErrors({});
    setTouchedFields({});
  };

  // Функция для расчета предполагаемой даты окончания
  const getEstimatedDeadline = () => {
    if (!formData.deadline) return null;

    const deadline = new Date(formData.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'завтра';
    if (diffDays < 0) return `просрочено на ${Math.abs(diffDays)} дней`;
    return `через ${diffDays} дней`;
  };

  const getStatusColor = (status: TechStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colorMap: Record<TechStatus, any> = {
      'not-started': 'default',
      'in-progress': 'warning',
      'completed': 'success'
    };
    return colorMap[status];
  };

  const getCategoryColor = (category: TechCategory): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const colorMap: Record<TechCategory, any> = {
      'frontend': 'primary',
      'backend': 'secondary',
      'mobile': 'info',
      'devops': 'warning',
      'database': 'success',
      'other': 'default'
    };
    return colorMap[category];
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      {/* Заголовок страницы */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/technologies"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          Назад к списку
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Добавить новую технологию
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Заполните форму, чтобы добавить новую технологию для отслеживания
        </Typography>
      </Box>

      {/* Форма */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Основная информация */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon />
                  Основная информация
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Название технологии"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('title')}
                      placeholder="Например: React, TypeScript, Docker..."
                      required
                      error={!!validationErrors.title && touchedFields.title}
                      helperText={validationErrors.title && touchedFields.title ? validationErrors.title : `${formData.title.length}/100 символов`}
                      disabled={isSubmitting}
                      InputProps={{
                        endAdornment: formData.title && (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setFormData(prev => ({ ...prev, title: '' }))} edge="end">
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Описание"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('description')}
                      placeholder="Краткое описание технологии, что это и для чего используется..."
                      multiline
                      rows={4}
                      required
                      error={!!validationErrors.description && touchedFields.description}
                      helperText={validationErrors.description && touchedFields.description ? validationErrors.description : `${formData.description.length}/500 символов`}
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Категория */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon />
                  Категория
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {categories.map(category => (
                    <Chip
                      key={category.value}
                      label={category.label}
                      icon={<span>{category.icon}</span>}
                      onClick={() => handleCategoryChange(category.value)}
                      color={formData.category === category.value ? getCategoryColor(category.value) : 'default'}
                      variant={formData.category === category.value ? 'filled' : 'outlined'}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Статус */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon />
                  Статус изучения
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={formData.status}
                    onChange={(e) => handleStatusChange(e.target.value as TechStatus)}
                  >
                    {statuses.map(status => (
                      <FormControlLabel
                        key={status.value}
                        value={status.value}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {status.icon}
                            {status.label}
                          </Box>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Статус можно будет изменить позже на странице технологии
                </Typography>
              </Box>

              {/* Дедлайн */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventIcon />
                  Сроки изучения
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Дедлайн изучения (необязательно)"
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('deadline')}
                      InputLabelProps={{ shrink: true }}
                      error={!!validationErrors.deadline && touchedFields.deadline}
                      helperText={validationErrors.deadline && touchedFields.deadline && validationErrors.deadline}
                      disabled={isSubmitting}
                      slotProps={{
                        input: {
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    {formData.deadline && (
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="body2">
                          <strong>Дедлайн:</strong> {new Date(formData.deadline).toLocaleDateString('ru-RU')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getEstimatedDeadline()}
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {/* Заметки */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NoteAddIcon />
                  Дополнительные заметки
                </Typography>

                <TextField
                  fullWidth
                  label="Заметки, ссылки на документацию, планы изучения..."
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Добавьте заметки, ссылки на документацию, планы изучения..."
                  helperText={`${formData.notes.length}/1000 символов`}
                  disabled={isSubmitting}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Кнопки действий */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearForm}
                  disabled={isSubmitting}
                  startIcon={<ClearIcon />}
                >
                  Очистить форму
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <AddIcon />}
                >
                  {isSubmitting ? 'Добавление...' : 'Добавить технологию'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        {/* Боковая панель с подсказками */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              💡 Советы по заполнению
            </Typography>

            <Stack spacing={2}>
              <Alert severity="info" variant="outlined">
                <Typography variant="subtitle2" gutterBottom>
                  Название
                </Typography>
                Используйте конкретные названия технологий, фреймворков, инструментов
              </Alert>

              <Alert severity="info" variant="outlined">
                <Typography variant="subtitle2" gutterBottom>
                  Описание
                </Typography>
                Кратко опишите, что это за технология и для чего она используется
              </Alert>

              <Alert severity="info" variant="outlined">
                <Typography variant="subtitle2" gutterBottom>
                  Статус
                </Typography>
                Начните с "Не начато", чтобы отслеживать прогресс
              </Alert>

              <Alert severity="info" variant="outlined">
                <Typography variant="subtitle2" gutterBottom>
                  Дедлайн
                </Typography>
                Установите реалистичный срок для мотивации
              </Alert>

              <Divider />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Статистика заполнения
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Обязательные поля:</Typography>
                    <Typography variant="body2" color={formData.title && formData.description ? 'success.main' : 'error.main'}>
                      {formData.title && formData.description ? '✅ Заполнены' : '❌ Не заполнены'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Категория:</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {categories.find(c => c.value === formData.category)?.label}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Статус:</Typography>
                    <Chip
                      size="small"
                      label={statuses.find(s => s.value === formData.status)?.label}
                      color={getStatusColor(formData.status)}
                    />
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTechnology;