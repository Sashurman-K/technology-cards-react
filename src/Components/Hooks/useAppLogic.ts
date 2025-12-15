import { useTechnologies } from './useTechnologies';
import { useTechnologyFilters } from './useTechnologyFilters';

export const useAppLogic = () => {
    const {
        technologies,
        setTechnologies,
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
        handleMassStatusUpdate,
        getRandomNotStartedTechnology
    } = useTechnologyFilters(technologies);

    // Функция для массового обновления статусов
    const handleMassStatusUpdateClick = (status: string) => {
        console.log(`handleMassStatusUpdateClick ${status}`)
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
        filteredTechnologies, // Отфильтрованные и найденные
        progress,

        // Фильтры и поиск
        filterValue,
        searchQuery,

        // Функции
        updateStatus,
        updateNotes,
        setSearchQuery,

        // Обработчики
        handleMassStatusUpdate: handleMassStatusUpdateClick,
        handleRandomTechnology,
        handleFilterChange
    };
};

export default useAppLogic