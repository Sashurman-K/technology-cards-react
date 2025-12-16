import React, { useState, useEffect, useRef } from 'react';
import './CountrySearch.css';

interface CountrySearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const CountrySearch: React.FC<CountrySearchProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Простой дебаунс
  const handleInput = (value: string) => {
    setQuery(value);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  // Восстановление фокуса
  useEffect(() => {
    if (!loading && inputRef.current) {
      const timer = window.setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [loading]);

  return (
    <div className="country-search">
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Поиск..."
          className="search-input"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch('');
              inputRef.current?.focus();
            }}
            className="clear-btn"
          >
            ×
          </button>
        )}

        {loading && <span className="loading-icon">⏳</span>}
      </div>
    </div>
  );
};

export default CountrySearch;