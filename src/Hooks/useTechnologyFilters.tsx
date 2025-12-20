import { useState, useMemo } from 'react';

export const useTechnologyFilters = (technologies: any) => {
    const [filterValue, setFilterValue] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Функция для смены фильтра
    const handleFilterChange = (status? : 'all' | 'not-started' |'in-progress' |'completed') => {
        if (status){
            setFilterValue(status);
            return;
        }
        const filters: Array<'all' | 'not-started' | 'in-progress' | 'completed'> =
            ['all', 'not-started', 'in-progress', 'completed'];
        const currentIndex = filters.indexOf(filterValue);
        const nextIndex = (currentIndex + 1) % filters.length;
        setFilterValue(filters[nextIndex]);
    };

    // Функция для массового обновления статусов
    const handleMassStatusUpdate = (status: 'completed' | 'not-started') => {
        return technologies.map((tech: any) => ({
            ...tech,
            status
        }));
    };

    // Функция для случайного выбора технологии со статусом 'not-started'
    const getRandomNotStartedTechnology = () => {
        const notStartedTechs = technologies.filter((tech: any) =>
            tech.status === 'not-started'
        );
        if (notStartedTechs.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * notStartedTechs.length);
        return notStartedTechs[randomIndex];
    };

    // Фильтрованные технологии (поиск + фильтр)
    const filteredTechnologies = useMemo(() => {
        let result = [...technologies];

        // Сначала применяем фильтр по статусу
        if (filterValue !== 'all') {
            result = result.filter(tech => tech.status === filterValue);
        }

        // Затем применяем поиск к уже отфильтрованным по статусу
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(tech =>
                tech.title.toLowerCase().includes(query) ||
                tech.description.toLowerCase().includes(query) ||
                tech.category.toLowerCase().includes(query) ||
                tech.notes.toLowerCase().includes(query)
            );
        }

        return result;
    }, [technologies, filterValue, searchQuery]);

    return {
        filterValue,
        setFilterValue,
        searchQuery,
        setSearchQuery,
        filteredTechnologies,
        handleFilterChange,
        handleMassStatusUpdate,
        getRandomNotStartedTechnology
    };
};

export default useTechnologyFilters;