import './QuickButtons.css'
interface QuichButtonsProps{
    onChangeTechnologesState : (status : string) => void;
    onUpdateRandomCard : () => void;
    onUpdateFilter: () => void;
    filterValue: string;
}
function QuickButtons({onChangeTechnologesState, onUpdateRandomCard, onUpdateFilter, filterValue} : QuichButtonsProps){;
    const getFilterValueName = (value : string) => {
        try{
            switch (value){
            case 'all': return 'Все';
            case 'not-completed': return 'Не выполненые';
            case 'in-progress': return 'В процессе выполнения';
            case 'completed': return 'Выполненые'
            default:
                throw new Error("Неверное значение фильтра")
        }
        }
        catch(error : unknown){
            alert(error);
        }
    }
    return (
        <div className='QuickButtons__container'>
            <button className="QuichButtons__status-button complete"
            onClick={() => onChangeTechnologesState('completed')}>
                Отметить все как завершенные
            </button>
            <button className="QuichButtons__status-button not-complete"
            onClick={() => onChangeTechnologesState('not-completed')}>
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
        </div>
    )
}

export default QuickButtons