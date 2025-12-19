import React, { useState, useEffect } from 'react';
import './QuizView.css';
import './MultiplayerQuizView.css';
import { Trophy, User, Users } from 'lucide-react';

const MultiplayerQuizView = ({ 
  gameState, 
  onAnswer,
  onExit
}) => {
  const { questions, questionIndex, opponentQuestionIndex, score, opponentScore, status, category, timeLeft } = gameState;
  const currentData = questions[questionIndex];
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  if (status === 'ended') {
    const win = score > opponentScore;
    const tie = score === opponentScore;

    return (
      <div className="card result-card multi-result">
        <div className="result-header">
          <Trophy className={`trophy-icon ${win ? 'win' : ''}`} size={48} />
          <h2>{tie ? "It's a Tie!" : win ? "You Won!" : "Opponent Won!"}</h2>
        </div>
        
        <div className="score-summary">
          <div className="score-item you">
            <span className="label">You</span>
            <span className="value">{score}</span>
          </div>
          <div className="score-item divider">VS</div>
          <div className="score-item opponent">
            <span className="label">Opponent</span>
            <span className="value">{opponentScore}</span>
          </div>
        </div>

        <button className="mode-btn primary" onClick={onExit}>
          Return to Menu
        </button>
      </div>
    );
  }

  const handleOptionClick = (opt) => {
    if (feedback) return;
    
    setSelectedAnswer(opt);
    const isCorrect = opt === currentData.question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setFeedback(null);
      setSelectedAnswer(null);
    }, 1200);
  };

  const getSubLabel = () => {
    switch (category) {
      case 'capital': return 'Identify the capital of';
      case 'continent': return 'Which continent is this?';
      case 'flag': return 'Identify this country';
      default: return 'Identify';
    }
  };

  return (
    <div className="multiplayer-game-container">
      <div className="multi-timer-wrapper">
        <div className="multi-timer-bar-bg">
          <div 
            className="multi-timer-bar-fill" 
            style={{ 
              width: `${(timeLeft / 60) * 100}%`,
              background: timeLeft <= 10 ? '#f87171' : 'var(--primary)'
            }}
          ></div>
        </div>
        <div className="multi-timer-text">
          <span className="time-value">{timeLeft}s</span>
          <span className="time-label">REMAINING</span>
        </div>
      </div>

      <div className="multi-scoreboard">
          <div className="player-stat you">
            <User size={20} />
            <div className="stat-text">
                <span className="name">You</span>
                <span className="score">{score}</span>
            </div>
          </div>
          <div className="progress-info">
            <span className="label">Question</span>
            <span className="value">{questionIndex + 1}/{questions.length}</span>
          </div>
          <div className="player-stat opponent">
            <div className="stat-text">
                <span className="name">Opponent</span>
                <span className="score">{opponentScore}</span>
            </div>
            <Users size={20} />
          </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-dots">
            {[...Array(5)].map((_, i) => (
                <div 
                    key={i} 
                    className={`dot ${i < (questionIndex % 5) ? 'active' : ''}`}
                ></div>
            ))}
        </div>
        <div className="opponent-progress">
             Opponent at Q{opponentQuestionIndex + 1}
        </div>
      </div>

      <div className="card game-card multi-game-card">
        <div className="question-area">
          <span className="sub-label">{getSubLabel()}</span>
          
          <div className="visual-display">
            {category === 'flag' ? (
              <div className="flag-display-container">
                <img 
                  src={`https://flagcdn.com/w320/${currentData.question.code}.png`} 
                  alt="Flag" 
                  className="flag-img"
                />
              </div>
            ) : category === 'continent' ? (
               <div className="map-display-container">
                <img 
                  src={`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${currentData.question.code}/256.png`} 
                  alt="" 
                  className="map-img"
                />
                <h2 className="country-name">{currentData.question.country}</h2>
              </div>
            ) : (
              <h2 className="country-name">{currentData.question.country}</h2>
            )}
          </div>
        </div>

        <div className="options-grid">
          {currentData.options.map((opt) => (
            <button 
              key={opt}
              className={`option-btn ${
                feedback === 'correct' && opt === currentData.question.answer ? 'correct' : ''
              } ${
                feedback === 'wrong' && opt === selectedAnswer ? 'incorrect' : ''
              } ${
                (feedback === 'correct' && opt !== currentData.question.answer) || 
                (feedback === 'wrong' && opt !== selectedAnswer) ? 'dim' : ''
              }`}
              onClick={() => handleOptionClick(opt)}
              disabled={!!feedback}
            >
              {opt}
            </button>
          ))}
        </div>

        {feedback === 'correct' && currentData.question.fact && (
          <div className="fact-banner">
            <span className="fact-icon">🌍</span>
            <p>{currentData.question.fact}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiplayerQuizView;
