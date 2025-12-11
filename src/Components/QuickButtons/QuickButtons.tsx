import './QuickButtons.css'
import { useState } from 'react';
import Modal from '../TechnologyCard/TechnologyModal';

// interface QuichButtonsProps {
//     onChangeTechnologesState: (status: string) => void;
//     onUpdateRandomCard: () => void;
//     onUpdateFilter: () => void;
//     filterValue: string;
//     setSearchQuery: (value: string) => void;
//     searchQuery: string;
//     filteredTechnologies : object[]
// }
function QuickButtons(
    { onChangeTechnologiesState,
        onUpdateRandomCard,
        onUpdateFilter,
        filterValue,
        setSearchQuery,
        searchQuery,
    filteredTechnologies,
    }: any) {
    ;
    const getFilterValueName = (value: string) => {
        try {
            switch (value) {
                case 'all': return 'Все';
                case 'not-started': return 'Не выполненые';
                case 'in-progress': return 'В процессе выполнения';
                case 'completed': return 'Выполненые'
                default:
                    throw new Error("Неверное значение фильтра")
            }
        }
        catch (error: unknown) {
            alert(error);
        }
    }
    const [showExportModal, setShowExportModal] = useState(false);
 const handleExport = () => {
 const data = {
 exportedAt: new Date().toISOString(),
 technologies: filteredTechnologies
 };
 const dataStr = JSON.stringify(data, null, 2);
 // Здесь можно добавить логику для скачивания файла
 console.log('Данные для экспорта:', dataStr);
 setShowExportModal(true);
 };
        return (
        <div className="">
            <div className='QuickButtons__container'>
                <button className="QuickButtons__status-button complete"
                    onClick={() => onChangeTechnologiesState('completed')}>
                    Отметить все как завершенные
                </button>
                <button className="QuickButtons__status-button not-started"
                    onClick={() => onChangeTechnologiesState('not-started')}>
                    Сбросить все статусы
                </button>
                <button className="QuickButtons__status-random-button"
                    onClick={onUpdateRandomCard}>
                    Случайный выбор следущей технологии
                </button>
                <button className={`QuickButtons__filter-button ${filterValue}`}
                    onClick={onUpdateFilter}>
                    {getFilterValueName(filterValue)}
                </button>
                <button className='QuickButtons__export-button' onClick={handleExport}
                >Экспорт данных</button>
            </div>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>Найдено: {filteredTechnologies.length}</span>
            </div>
            <Modal
 isOpen={showExportModal}
 onClose={() => setShowExportModal(false)}
 title="Экспорт данных"
 >
 <p>Данные успешно подготовлены для экспорта!</p>
 <p>Проверьте консоль разработчика для просмотра данных.</p>
 <button onClick={() => setShowExportModal(false)}>
 Закрыть
 </button>
 </Modal>

        </div>
    )
}

export default QuickButtons