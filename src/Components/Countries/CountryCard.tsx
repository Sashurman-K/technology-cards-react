import React from 'react';
import { type Country } from '../../Hooks/useContriesApi';
import './CountryCard.css';

interface CountryCardProps {
  country: Country;
  onClick?: (country: Country) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(country);
    }
  };


  if (!country.name || !country.flags) {
    return null;
  }

  const commonName = country.name.common || 'Неизвестная страна';
  const officialName = country.name.official || commonName;
  const flagAlt = country.flags.alt || `Flag of ${commonName}`;
  const flagSrc = country.flags.png || country.flags.svg;
  const capital = country.capital?.[0] || 'Нет данных';
  const region = country.region || 'Неизвестно';
  const population = country.population ? country.population.toLocaleString() : 'Нет данных';
  const currency = country.currencies ? Object.values(country.currencies)[0]?.name : 'Нет данных';

  return (
    <div
      className={`country-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="country-card-header">
        {flagSrc && (
          <img
            src={flagSrc}
            alt={flagAlt}
            className="country-flag"
            onError={(e) => {
              // Если изображение не загрузилось, заменяем на заглушку
              e.currentTarget.src = 'https://via.placeholder.com/280x160?text=No+Flag';
              e.currentTarget.alt = 'Flag not available';
            }}
          />
        )}
        <h3 className="country-name">{commonName}</h3>
      </div>

      <div className="country-card-body">
        <p className="country-info">
          <span className="info-label">Официальное название:</span>
          <span className="info-value" title={officialName}>
            {officialName.length > 30 ? `${officialName.substring(0, 30)}...` : officialName}
          </span>
        </p>

        <p className="country-info">
          <span className="info-label">Столица:</span>
          <span className="info-value">{capital}</span>
        </p>

        <p className="country-info">
          <span className="info-label">Регион:</span>
          <span className="info-value">{region}</span>
        </p>

        <p className="country-info">
          <span className="info-label">Население:</span>
          <span className="info-value">{population}</span>
        </p>

        <p className="country-info">
          <span className="info-label">Валюта:</span>
          <span className="info-value">{currency}</span>
        </p>
      </div>

      {onClick && (
        <div className="country-card-footer">
          <span className="view-details">Подробнее →</span>
        </div>
      )}
    </div>
  );
};