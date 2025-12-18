import React from 'react';
import './QuizView.css';

const QuizView = ({ 
  game, 
  gameMode, 
  category, 
  onAnswer 
}) => {
  const { currentQuestion, options, feedback, timer, streak, multiplier } = game;

  const getSubLabel = () => {
    switch (category) {
      case 'capital': return 'Identify the capital of';
      case 'continent': return 'Which continent is this?';
      case 'flag': return 'Identify this country';
      default: return 'Identify';
    }
  };

  return (
    <div className="card game-card">
      {gameMode === 'timeAttack' && (
        <div className="timer-container">
          <div className="timer-bar" style={{ width: `${(timer / 10) * 100}%` }}></div>
        </div>
      )}
      
      <div className="game-stats-overlay">
        {streak > 0 && (
          <div className={`streak-badge ${streak >= 5 ? 'mega' : ''}`}>
            🔥 {streak} Streak
          </div>
        )}
        {multiplier > 1 && (
          <div className="multiplier-badge">
            {multiplier}x Points
          </div>
        )}
      </div>

      <div className="question-area">
        <span className="sub-label">{getSubLabel()}</span>
        
        <div className="visual-display">
          {category === 'flag' ? (
            <div className="flag-display-container">
              <img 
                src={`https://flagcdn.com/w320/${currentQuestion?.code}.png`} 
                alt="Flag" 
                className="flag-img"
              />
            </div>
          ) : category === 'continent' ? (
             <div className="map-display-container">
              <img 
                src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${currentQuestion?.code}/256.png`} 
                alt="" 
                className="map-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('no-map');
                }}
              />
              <h2 className="country-name">{currentQuestion?.country}</h2>
            </div>
          ) : (
            <h2 className="country-name">{currentQuestion?.country}</h2>
          )}
        </div>
      </div>

      <div className="options-grid">
        {options.map((opt) => (
          <button 
            key={opt}
            className={`option-btn ${
              feedback === 'correct' && opt === currentQuestion.answer ? 'correct' : ''
            } ${
              feedback === 'wrong' && opt === currentQuestion.selectedAnswer ? 'incorrect' : ''
            } ${
              feedback && opt !== currentQuestion.answer && (feedback === 'correct' || (feedback === 'wrong' && opt !== currentQuestion.selectedAnswer)) ? 'dim' : ''
            }`}
            onClick={() => onAnswer(opt)}
            disabled={!!feedback}
          >
            {opt}
          </button>
        ))}
      </div>

      {feedback === 'correct' && currentQuestion?.fact && (
        <div className="fact-banner">
          <span className="fact-icon">🌍</span>
          <p>{currentQuestion.fact}</p>
        </div>
      )}
    </div>
  );
};

export default QuizView;
