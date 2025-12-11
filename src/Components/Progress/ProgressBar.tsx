import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // Текущее значение прогресса (от 0 до 100)
  label?: string; // Подпись к прогресс-бару
  color?: string; // Цвет заполнения
  height?: number; // Высота прогресс-бара
  showPercentage?: boolean; // Показывать ли процент
  animated?: boolean; // Анимировать ли заполнение
  className?: string; // Дополнительные CSS классы
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label = '',
  color = '#4CAF50',
  height = 20,
  showPercentage = true,
  animated = false,
  className = ''
}) => {
  // Обеспечиваем, чтобы прогресс был в пределах 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`progress-bar-container ${className}`}>
      {/* Заголовок с лейблом и процентом */}
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage">{normalizedProgress}%</span>
          )}
        </div>
      )}

      {/* Внешняя оболочка прогресс-бара */}
      <div
        className="progress-bar-outer"
        style={{
          height: `${height}px`,
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {/* Заполняемая часть прогресс-бара */}
        <div
          className={`progress-bar-inner ${animated ? 'animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: color,
            height: '100%',
            transition: animated ? 'width 0.5s ease-in-out' : 'none',
            borderRadius: '10px'
          }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress bar'}
        />
      </div>
    </div>
  );
};

export default ProgressBar;