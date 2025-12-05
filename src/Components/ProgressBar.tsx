import { useState, useEffect } from 'react';
import './ProgressBar.css'

interface AnimatedProgressBarProps {
  targetProgress: number;
}

const ProgressBar: React.FC<AnimatedProgressBarProps> = ({ targetProgress }) => {
  const [displayProgress, setDisplayProgress] = useState(targetProgress);

  useEffect(() => {
    setDisplayProgress(targetProgress);
  }, [targetProgress]);

  return (
    <div className="animated-progress-bar">
      <div
        className="animated-progress-fill"
        style={{
          width: `${Math.min(displayProgress, 100)}%`,
          transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      />
      <span className="animated-progress-text">
        {Math.round(displayProgress)}%
      </span>
    </div>
  );
};

export default ProgressBar