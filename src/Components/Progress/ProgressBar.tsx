import './ProgressBar.css';


const ProgressBar = ({progress} : any) => {

  return (
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
          </div>)
};

export default ProgressBar;