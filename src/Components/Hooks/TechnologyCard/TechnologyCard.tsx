import './TechnologyCard.css'
import TechnologyNotes from './TechnologyNotes'
interface TechnologyCardProps {
    technology : TechnologyCardModal
    onStatusChange : any
    onNotesChange : any
}
interface TechnologyCardModal{
    id: number;
    title: string;
    description: string;
    status: string;
    notes: string;
    category: string;
}

function TechnologyCard({ technology,  onStatusChange, onNotesChange}: TechnologyCardProps) {
    let statusText = '';

    switch (technology.status) {
        case "not-started":
            statusText = 'Не начато';
            break;
        case "in-progress":
            statusText = 'В процессе';
            break;
        case 'completed':
            statusText = 'Выполнено';
            break;
        default:
            statusText = 'Неизвестно';
    }
    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.tagName.toLowerCase() !== 'textarea' &&
            !target.closest('.notes-section')
        ) {
            onStatusChange(technology.id, circleStatus(technology.status));
        }
    }



    return (
        <div className={`card__container ${technology.status} `} onClick={handleCardClick}>
            <h2 className="card__title">{technology.title}</h2>
            <p className="card__description">{technology.description}</p>
            <p className={`card__status card__status--${technology.status}`}>
                {statusText}
            </p>
            <TechnologyNotes
            notes={technology.notes}
            onNotesChange={onNotesChange}
            techId={technology.id}/>
        </div>
    );
}

function circleStatus(status : string){
    switch(status) {
    case 'not-started': return 'in-progress';
    case 'in-progress': return 'completed';
    case 'completed': return 'not-started';
  }
}

export default TechnologyCard;