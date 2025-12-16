import { useAppLogic } from "../../Hooks/useAppLogic"
import "./Statistics.css"
import { Link } from 'react-router-dom';



const Statistics = () => {
    const {technologies, progress} = useAppLogic();
    return(
        <div className="page statistics-page">
            <h1>Статистика</h1>
            <div className="statistics__container">
                <div className="statistics__numbers">


                <div className="statistics__item">
                    <div className="statistic__number all-count">{technologies.length}</div>
                    <p className="statistic__desc">Всего технологий</p>
                </div>
                <div className="statistics__item">
                    <div className="statistic__number not-started-count">
                        {technologies.filter((tech : any) => tech.status == "not-started").length}</div>
                    <p className="statistic__desc">Не начаты</p>
                </div>
                <div className="statistics__item">
                    <div className="statistic__number progress-count">
                        {technologies.filter((tech : any) => tech.status == "in-progress").length}</div>
                    <p className="statistic__desc">В процессе изучения</p>
                </div>
                <div className="statistics__item">
                    <div className="statistic__number completed-count">
                        {technologies.filter((tech : any) => tech.status == "completed").length}</div>
                    <p className="statistic__desc">Завершены</p>
                </div>
                </div>
                <div className="statistic__progress">
                    <div className="progress-indicator">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Прогресс: {progress}%
            </span>
          </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics;