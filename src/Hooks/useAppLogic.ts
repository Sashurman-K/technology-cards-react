import { useTechnologies } from './useTechnologies';
import { useTechnologyFilters } from './useTechnologyFilters';

export const useAppLogic = () => {
    const {
        technologies,
        
        updateStatus,
        updateNotes,
        updateAllStatuses,
        progress
    } = useTechnologies();

    const {
        filterValue,
        setFilterValue,
        searchQuery,
        setSearchQuery,
        filteredTechnologies,
        handleFilterChange,
        getRandomNotStartedTechnology
    } = useTechnologyFilters(technologies);

    // Функция для массового обновления статусов
    const handleMassStatusUpdateClick = (status : string) => {
        console.log(`Mass update to: ${status}`);
        updateAllStatuses(status);
    };

    // Функция для случайного выбора и обновления статуса
    const handleRandomTechnology = () => {
        const randomTech = getRandomNotStartedTechnology();

        if (!randomTech) {
            alert('Нет технологий со статусом "Не начато"!');
            return null;
        }

        // Меняем статус на 'in-progress'
        updateStatus(randomTech.id, 'in-progress');

        alert(`Технология "${randomTech.title}" теперь в процессе изучения!`);

        // Прокрутка к выбранной карточке
        setTimeout(() => {
            const element = document.getElementById(`tech-card-${randomTech.id}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlighted');
                setTimeout(() => {
                    element.classList.remove('highlighted');
                }, 2000);
            }
        }, 100);

        return randomTech.id;
    };

    return {
        // Данные
        technologies,
        filteredTechnologies,
        progress,

        // Фильтры и поиск
        filterValue,
        searchQuery,

        // Функции
        updateStatus,  // Добавлено
        updateNotes,   // Добавлено
        setSearchQuery,
        setFilterValue, // Добавлено для возможности сброса фильтра

        // Обработчики
        handleMassStatusUpdate: handleMassStatusUpdateClick,
        handleRandomTechnology,
        handleFilterChange
    };
};

export default useAppLogic;