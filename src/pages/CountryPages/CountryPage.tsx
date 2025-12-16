import React, { useEffect, useState, useCallback } from 'react';
import { useCountries, type Country } from '../../Hooks/useContriesApi';
import CountrySearch from '../../Components/Countries/CountrySeach';
import { CountryCard } from '../../Components/Countries/CountryCard';
import './CountryPage.css';

export const CountriesPage: React.FC = () => {
  const {
    countries,
    loading,
    error,
    fetchCountries,
    searchCountry,
    isSearching
  } = useCountries();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Первоначальная загрузка только один раз
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchCountries();
      setHasInitialLoad(true);
    }
  }, [fetchCountries, hasInitialLoad]);

  // Обработчик поиска
  const handleSearch = useCallback(async (query: string) => {
    await searchCountry(query);
  }, [searchCountry]);

  const handleCountryClick = (country: Country) => {
    if (country.name && country.flags) {
      setSelectedCountry(country);
    }
  };

  const handleCloseModal = () => {
    setSelectedCountry(null);
  };

  const getSafeValue = (value: any, defaultValue = 'Нет данных') => {
    return value || defaultValue;
  };

  const exportCountryToJson = (country: Country) => {
    try {
      const cleanCountry = JSON.parse(JSON.stringify(country));
      const countryName = country.name?.common
        ? country.name.common.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : 'country';
      const filename = `${countryName}_${Date.now()}.json`;

      const jsonString = JSON.stringify(cleanCountry, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Страна "${country.name?.common || 'Неизвестная'}" экспортирована в файл ${filename}`);

    } catch (error) {
      console.error('Ошибка при экспорте:', error);
      alert('Произошла ошибка при экспорте данных');
    }
  };

  // Общий статус загрузки (только первоначальная загрузка)
  const isLoading = loading && !hasInitialLoad;

  return (
    <div className="countries-page">
      <div className="page-header">
        <h1 className="page-title">🌍 Страны мира</h1>
        <p className="page-subtitle">
          Информация о странах, их столицах, населении и других характеристиках
        </p>
      </div>

      <CountrySearch onSearch={handleSearch} loading={isSearching} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCountries} className="retry-button">
            Попробовать снова
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных о странах...</p>
        </div>
      ) : (
        <>
          <div className="countries-stats">
            <div className="stat-card">
              <span className="stat-label">Найдено стран</span>
              <span className="stat-value">{countries.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Статус</span>
              <span className="stat-value">
                {isSearching ? 'Поиск...' : countries.length === 0 ? 'Нет результатов' : 'Готово'}
              </span>
            </div>
          </div>

          {countries.length === 0 && !isSearching ? (
            <div className="no-results">
              <p>Страны не найдены. Попробуйте изменить запрос поиска.</p>
              {hasInitialLoad && (
                <button
                  onClick={fetchCountries}
                  className="retry-button"
                  style={{ marginTop: '16px' }}
                >
                  Показать все страны
                </button>
              )}
            </div>
          ) : (
            <div className="countries-grid">
              {countries.map((country, index) => (
                country.name && country.flags ? (
                  <CountryCard
                    key={country.cca3 || country.cca2 || `country-${index}`}
                    country={country}
                    onClick={handleCountryClick}
                  />
                ) : null
              ))}
            </div>
          )}
        </>
      )}

      {selectedCountry && selectedCountry.name && (
        <div className="country-modal">
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>

            <div className="modal-header">
              {selectedCountry.flags && (
                <img
                  src={selectedCountry.flags.png || selectedCountry.flags.svg}
                  alt={getSafeValue(selectedCountry.flags.alt, `Flag of ${selectedCountry.name.common}`)}
                  className="modal-flag"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/120x80?text=No+Flag';
                  }}
                />
              )}
              <h2>{getSafeValue(selectedCountry.name.common, 'Неизвестная страна')}</h2>
              <p className="modal-official-name">
                {getSafeValue(selectedCountry.name.official, 'Нет официального названия')}
              </p>
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Код страны:</span>
                <span className="detail-value">
                  {getSafeValue(selectedCountry.cca3 || selectedCountry.cca2)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Столица:</span>
                <span className="detail-value">
                  {getSafeValue(selectedCountry.capital?.[0])}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Регион:</span>
                <span className="detail-value">
                  {getSafeValue(selectedCountry.region)}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Население:</span>
                <span className="detail-value">
                  {selectedCountry.population
                    ? selectedCountry.population.toLocaleString()
                    : 'Нет данных'
                  }
                </span>
              </div>

              {selectedCountry.currencies && (
                <div className="detail-row">
                  <span className="detail-label">Валюта:</span>
                  <span className="detail-value">
                    {Object.values(selectedCountry.currencies)[0]?.name || 'Нет данных'}
                    {Object.values(selectedCountry.currencies)[0]?.symbol &&
                      ` (${Object.values(selectedCountry.currencies)[0].symbol})`}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="modal-button export-button"
                onClick={() => selectedCountry && exportCountryToJson(selectedCountry)}
              >
                📥 Экспорт в JSON
              </button>

              <button
                className="modal-button close-button"
                onClick={handleCloseModal}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};