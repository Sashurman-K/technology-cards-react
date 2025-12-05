import './TechnologyCard.css'
interface TechnologyCardProps {
    id: number;
    title: string;
    description: string;
    status: string;
    onChangeTechnologeType : any
}

function TechnologyCard({ id, title, description, status,  onChangeTechnologeType}: TechnologyCardProps) {
    let statusText = '';

    switch (status) {
        case "not-completed":
            statusText = 'Не выполнено';
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

    return (
        <div className={`card__container ${status} `} onClick={() => onChangeTechnologeType(id, circleStatus(status))}>
            <h2 className="card__title">{title}</h2>
            <p className="card__description">{description}</p>
            <p className={`card__status card__status--${status}`}>
                {statusText}
            </p>
        </div>
    );
}

function circleStatus(status : string){
    switch(status) {
    case 'not-completed': return 'in-progress';
    case 'in-progress': return 'completed';
    case 'completed': return 'not-completed';
  }
}

export default TechnologyCard;