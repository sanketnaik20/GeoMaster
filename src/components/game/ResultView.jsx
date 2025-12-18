import React, { Suspense, lazy } from 'react';
import './ResultView.css';

const Confetti = lazy(() => import('../common/Confetti'));

const ResultView = ({ 
  score, 
  gameMode, 
  onRestart, 
  onMenu 
}) => {
  return (
    <div className="card result-card">
      {score > 0 && (
        <Suspense fallback={null}>
          <Confetti />
        </Suspense>
      )}
      <span className="sub-label">Session Complete</span>
      <div className="result-icon">
        {score >= 10 ? '👑' : score >= 5 ? '⭐' : '✨'}
      </div>
      <h2 className="result-title">Beautiful Run</h2>
      <p className="result-description">
        Your journey reached <strong className="score-highlight">{Math.floor(score)}</strong> destinations.
      </p>
      <div className="actions">
        <button className="primary-btn" onClick={() => onRestart(gameMode)}>Try Again</button>
        <button className="secondary-btn" onClick={onMenu}>Menu</button>
      </div>
    </div>
  );
};

export default ResultView;
