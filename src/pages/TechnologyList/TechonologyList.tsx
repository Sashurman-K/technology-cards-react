import { Link } from 'react-router-dom';
import { useAppLogic } from '../../Hooks/useAppLogic';
import { useState } from 'react';
import TechnologyModal from '../../Components/TechnologyCard/TechnologyModal'; // Импортируем ваш компонент Modal
import './TechnologyList.css';
import ProgressBar from '../../Components/Progress/ProgressBar';

interface Technology {
  id: number;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  category?: string;
  notes?: string;
  createdAt?: string;
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
    progress,
    updateStatus
  } = useAppLogic();

  // Состояние для модального окна
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      'not-started': 'Не начато',
      'in-progress': 'В процессе',
      'completed': 'Завершено'
    };
    return statusMap[status] || status;
  };

  const getNextStatus = (currentStatus: string): 'not-started' | 'in-progress' | 'completed' => {
    const statusOrder: Array<'not-started' | 'in-progress' | 'completed'> = [
      'not-started',
      'in-progress',
      'completed'
    ];
    const currentIndex = statusOrder.indexOf(currentStatus as any);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  const handleCardClick = (techId: number, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    updateStatus(techId, nextStatus);
  };

  const getStatusClass = (status: string): string => {
    return `status status-${status}`;
  };

  const handleCardAction = (
    e: React.MouseEvent,
    techId: number,
    currentStatus: string
  ) => {
    if ((e.target as HTMLElement).closest('.details-section')) {
      return;
    }
    handleCardClick(techId, currentStatus);
  };

  return (
    <div className="page technology-list-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Все технологии</h1>
          <ProgressBar progress={progress} />
        </div>
        <div className="header-right">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="btn btn-export"
          >
            📤 Экспорт данных
          </button>

          <Link to="/add-technology" className="btn btn-primary">
            + Добавить технологию
          </Link>
        </div>
      </div>

      {/* Панель управления с фильтрами и поиском */}
      <div className="control-panel">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск технологий..."
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
                aria-label="Очистить поиск"
              >
                ×
              </button>
            )}
          </div>
          <span className="search-hint">
            Найдено: {filteredTechnologies.length} технологий
          </span>
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button
              onClick={() => handleFilterChange()}
              className={`filter-btn ${filterValue !== 'all' ? 'active' : ''}`}
            >
              {filterValue === 'all' && 'Все статусы'}
              {filterValue === 'not-started' && 'Не начато'}
              {filterValue === 'in-progress' && 'В процессе'}
              {filterValue === 'completed' && 'Завершено'}
            </button>

            <button
              onClick={() => handleRandomTechnology()}
              className="btn btn-secondary random-btn"
            >
              🎲 Случайная технология
            </button>
          </div>

          <div className="mass-actions">
            <span className="mass-actions-label">Массовые действия:</span>
            <div className="mass-buttons">
              <button
                onClick={() => handleMassStatusUpdate('not-started')}
                className="btn btn-outline"
              >
                Все в "Не начато"
              </button>
              <button
                onClick={() => handleMassStatusUpdate('completed')}
                className="btn btn-outline"
              >
                Все в "Завершено"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Список технологий */}
      <div className="technologies-container">
        {filteredTechnologies.length === 0 ? (
          <div className="empty-state">
            {searchQuery || filterValue !== 'all' ? (
              <>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить параметры поиска или фильтрации</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="btn btn-secondary"
                >
                  Сбросить фильтры
                </button>
              </>
            ) : (
              <>
                <h3>Технологий пока нет</h3>
                <p>Начните отслеживание своих технологий</p>
                <Link to="/add-technology" className="btn btn-primary">
                  Добавить первую технологию
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="technologies-grid">
            {filteredTechnologies.map((tech: Technology) => (
              <div
                key={tech.id}
                className="technology-item"
                id={`tech-card-${tech.id}`}
                onClick={(e) => handleCardAction(e, tech.id, tech.status)}
                title="Кликните для изменения статуса"
              >
                <div className="tech-main-section">
                  <div className="tech-header">
                    <h3>{tech.title}</h3>
                    {tech.category && (
                      <span className="tech-category">
                        {tech.category}
                      </span>
                    )}
                  </div>

                  <p className="tech-description">
                    {tech.description}
                  </p>

                  {tech.notes && (
                    <div className="tech-notes-preview">
                      <span className="notes-icon">📝</span>
                      <span className="notes-text">
                        {tech.notes.length > 60
                          ? `${tech.notes.substring(0, 60)}...`
                          : tech.notes
                        }
                      </span>
                    </div>
                  )}

                  <div className="tech-status-section">
                    <div className="status-indicator">
                      <div className="status-cycle">
                        <span className={getStatusClass(tech.status)}>
                          {getStatusText(tech.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-section" onClick={(e) => e.stopPropagation()}>
                  <div className="details-content">
                    <Link
                      to={`/technology/${tech.id}`}
                      className="btn-link details-link"
                    >
                      📖 Подробнее
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TechnologyModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="📤 Экспорт данных"
      >
        <div className="export-modal-content">
          <div className="export-success-icon">✅</div>
          <h3>Данные экспортированы</h3>
          <p>Файл с данными успешно скачан.</p>
          <p>Всего экспортировано записей: <strong>{filteredTechnologies.length}</strong></p>Ё

          <button
            className="btn btn-primary modal-close-btn"
            onClick={() => setIsExportModalOpen(false)}
          >
            Закрыть
          </button>
        </div>
      </TechnologyModal>
    </div>
  );
}

export default TechnologyList;