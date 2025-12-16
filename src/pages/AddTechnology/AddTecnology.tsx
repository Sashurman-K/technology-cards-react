import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppLogic } from '../../Hooks/useAppLogic';
import './AddTechnology.css';

type TechStatus = 'not-started' | 'in-progress' | 'completed';
type TechCategory = 'frontend' | 'backend' | 'mobile' | 'devops' | 'database' | 'other';

const AddTechnology = () => {
  const navigate = useNavigate();
  const { technologies, setTechnologies } = useAppLogic();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started' as TechStatus,
    category: 'other' as TechCategory,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: Array<{ value: TechCategory; label: string }> = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'devops', label: 'DevOps' },
    { value: 'database', label: 'Database' },
    { value: 'other', label: 'Другое' }
  ];

  const statuses: Array<{ value: TechStatus; label: string }> = [
    { value: 'not-started', label: 'Не начато' },
    { value: 'in-progress', label: 'В процессе' },
    { value: 'completed', label: 'Завершено' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError(null);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error('Введите название технологии');
      }

      if (!formData.description.trim()) {
        throw new Error('Введите описание технологии');
      }

      if (formData.description.length > 500) {
        throw new Error('Описание не должно превышать 500 символов');
      }

      const newTechnology = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category,
        notes: formData.notes.trim(),
        createdAt: new Date().toISOString()
      };

      const currentTechnologies = JSON.parse(localStorage.getItem('technologies') || '[]');

      const exists = currentTechnologies.some((tech: any) =>
        tech.title.toLowerCase() === newTechnology.title.toLowerCase()
      );

      if (exists) {
        throw new Error('Технология с таким названием уже существует');
      }

      const updatedTechnologies = [...currentTechnologies, newTechnology];
      localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));

      if (setTechnologies) {
        setTechnologies(updatedTechnologies);
      }

      setTimeout(() => {
        navigate('/technologies', {
          state: {
            message: `Технология "${newTechnology.title}" успешно добавлена!`,
            newTechId: newTechnology.id
          }
        });
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при добавлении технологии');
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
      notes: ''
    });
    setError(null);
  };

  return (
    <div className="page add-tech-page">
      <div className="add-tech-header">
        <Link to="/technologies" className="btn-primary-back">
          ← Назад к списку
        </Link>
        <h1>Добавить новую технологию</h1>
      </div>

      <div className="add-tech-container">
        <form onSubmit={handleSubmit} className="add-tech-form">
          <div className="add-tech-section">
            <h3>Основная информация</h3>

            <div className="add-tech-form-group">
              <label htmlFor="title" className="add-tech-label add-tech-label-required">
                Название технологии
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Например: React, TypeScript, Docker..."
                className="add-tech-input"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
              <div className="add-tech-input-hint">
                {formData.title.length}/100 символов
              </div>
            </div>

            <div className="add-tech-form-group">
              <label htmlFor="description" className="add-tech-label add-tech-label-required">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Краткое описание технологии, что это и для чего используется..."
                className="add-tech-textarea"
                rows={4}
                required
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="add-tech-input-hint">
                {formData.description.length}/500 символов
              </div>
            </div>

            <div className="add-tech-form-group">
              <label htmlFor="category" className="add-tech-label">
                Категория
              </label>
              <div className="add-tech-category-buttons">
                {categories.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={`add-tech-category-btn ${formData.category === category.value ? 'add-tech-category-btn-active' : ''}`}
                    disabled={isSubmitting}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="add-tech-section">
            <h3>Настройки отслеживания</h3>

            <div className="add-tech-form-group">
              <label className="add-tech-label">Начальный статус</label>
              <div className="add-tech-status-buttons">
                {statuses.map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleStatusChange(status.value)}
                    className={`add-tech-status-btn add-tech-status-${status.value} ${formData.status === status.value ? 'add-tech-status-btn-active' : ''}`}
                    disabled={isSubmitting}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <div className="add-tech-status-hint">
                Статус можно будет изменить позже на странице технологии
              </div>
            </div>

            <div className="add-tech-form-group">
              <label htmlFor="notes" className="add-tech-label">
                Дополнительные заметки
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Добавьте заметки, ссылки на документацию, планы изучения..."
                className="add-tech-textarea"
                rows={3}
                maxLength={1000}
                disabled={isSubmitting}
              />
              <div className="add-tech-input-hint">
                {formData.notes.length}/1000 символов
              </div>
            </div>
          </div>

          {error && (
            <div className="add-tech-error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="add-tech-form-actions">
            <button
              type="button"
              onClick={handleClearForm}
              className="add-tech-btn add-tech-btn-secondary"
              disabled={isSubmitting}
            >
              Очистить форму
            </button>

            <button
              type="submit"
              className="add-tech-btn add-tech-btn-primary"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="add-tech-spinner"></span>
                  Добавление...
                </>
              ) : (
                'Добавить технологию'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddTechnology;