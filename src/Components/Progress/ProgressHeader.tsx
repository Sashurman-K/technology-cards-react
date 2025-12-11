import './ProgressHeader.css'
import ProgressBar from './ProgressBar';

interface ProgressHeaderProps {
    technologies: TechnologyItem[];
}

interface TechnologyItem{
    id: number;
    title: string;
    description: string;
    status: string;
}

function ProgressHeader({technologies}: ProgressHeaderProps){
    const complatedTechnologies = technologies.filter(technologe => technologe.status === 'completed').length;
    const progress = complatedTechnologies / technologies.length * 100;
    return (
        <div>
            <div className="progressHeader__statistic-container">
                <h1>Статистика</h1>
                <p>Общее количесво технологий: {technologies.length}</p>
                <p>Количество изученных технологий: {technologies.filter(technologe => technologe.status === 'completed').length}</p>
                <p>Количество технологий в процессе изучения: {technologies.filter(technologe => technologe.status === 'in-progress').length}</p>
                <p>Количество не изученных технологий: {technologies.filter(technologe => technologe.status === 'not-completed').length}</p>
                <ProgressBar
                progress={progress}
                color="#4CAF50"
                animated={true}
                 height={20}
                />
            </div>

        </div>
    )
}

export default ProgressHeader