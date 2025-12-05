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
                <ProgressBar targetProgress={progress}/>
            </div>

        </div>
    )
}

export default ProgressHeader