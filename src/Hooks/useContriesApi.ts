import { useState, useCallback } from 'react';

export interface Country {
  name?: {
    common: string;
    official: string;
  };
  capital?: string[];
  region?: string;
  population?: number;
  flags?: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca2?: string;
  cca3?: string;
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  languages?: {
    [key: string]: string;
  };
  timezones?: string[];
}

interface UseCountriesReturn {
  countries: Country[];
  loading: boolean;
  error: string | null;
  fetchCountries: () => Promise<void>;
  searchCountry: (name: string) => Promise<void>;
  isSearching: boolean;
  allCountries: Country[]; // Добавляем для хранения всех стран
}

export function useCountries(): UseCountriesReturn {
  const [allCountries, setAllCountries] = useState<Country[]>([]); // Все страны
  const [countries, setCountries] = useState<Country[]>([]); // Текущие страны (поиск или все)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false);

      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca2,cca3,currencies,languages,timezones'
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
      }

      const data: Country[] = await response.json();
      // Фильтруем страны без основных данных
      const validCountries = data.filter(country =>
        country.name && country.name.common && country.flags
      );

      const sortedCountries = validCountries.sort((a, b) =>
        (a.name?.common || '').localeCompare(b.name?.common || '')
      );

      setAllCountries(sortedCountries); // Сохраняем все страны
      setCountries(sortedCountries); // И показываем все страны

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching countries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCountry = useCallback(async (name: string) => {
    try {
      if (!name.trim()) {
        // При пустом запросе показываем все страны
        setCountries(allCountries);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);

      const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);

      if (!response.ok) {
        if (response.status === 404) {
          setCountries([]);
          setIsSearching(false);
          return;
        }
        throw new Error(`Failed to search country: ${response.status}`);
      }

      const data: Country[] = await response.json();
      // Фильтруем страны без основных данных
      const validCountries = data.filter(country =>
        country.name && country.name.common && country.flags
      );
      setCountries(validCountries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setCountries([]);
    } finally {
      setIsSearching(false);
    }
  }, [allCountries]); // Зависимость от allCountries

  return {
    countries,
    loading,
    error,
    fetchCountries,
    searchCountry,
    isSearching,
    allCountries // Экспортируем для отладки
  };
}