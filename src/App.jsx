import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Confetti from './components/Confetti';
import LoadingScreen from './components/LoadingScreen';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';
import './styles/index.css';

// SVG Background Illustration Component
const BgIllustration = () => (
  <div className="bg-illustration">
    <div className="shape circle-1"></div>
    <div className="shape circle-2"></div>
  </div>
);

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const [wipeTarget, setWipeTarget] = useState('to-light');
  
  const [view, setView] = useState('menu'); // 'menu' | 'game'
  const [gameMode, setGameMode] = useState('zen'); // 'zen' | 'timeAttack'
  const [category, setCategory] = useState('capital'); // 'capital' | 'continent'
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const { playClick, playCorrect, playIncorrect } = useSound();
  const game = useGame(gameMode, category);

  // Theme Handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (isThemeAnimating) return;
    
    playClick();
    const target = theme === 'dark' ? 'light' : 'dark';
    setWipeTarget(`to-${target}`);
    setIsThemeAnimating(true);
    
    // Switch theme halfway through animation (0.8s total)
    setTimeout(() => {
      setTheme(target);
    }, 400);

    setTimeout(() => {
      setIsThemeAnimating(false);
    }, 800);
  };

  const startGame = (mode) => {
    playClick();
    setPendingMode(mode);
    setIsLoading(true);
  };

  const onLoadingComplete = () => {
    setGameMode(pendingMode);
    game.resetGame();
    setIsLoading(false);
    setView('game');
  };

  const handleOptionClick = (option) => {
    game.handleAnswer(option, playCorrect, playIncorrect);
  };

  const returnToMenu = () => {
    playClick();
    setView('menu');
  };

  return (
    <div className={`app-container ${isThemeAnimating ? 'theme-transitioning' : ''}`}>
      {isThemeAnimating && (
        <div 
          className={`theme-wipe ${wipeTarget}`} 
          data-text={wipeTarget === 'to-dark' ? 'Shifting to Dark' : 'Entering Light'}
        />
      )}
      {isLoading && <LoadingScreen onComplete={onLoadingComplete} />}
      <BgIllustration />
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        score={game.score} 
        highScore={game.highScore}
      />

      <main className="main-content">
        {view === 'menu' && (
          <div className="card menu-card">
            <span className="sub-label">Step into the journey</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '24px' }}>Global Explorer</h2>
            
            <div data-testid="category-select" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
              <button 
                className={`category-chip ${category === 'capital' ? 'active' : ''}`}
                onClick={() => setCategory('capital')}
              >
                Capitals
              </button>
              <button 
                className={`category-chip ${category === 'continent' ? 'active' : ''}`}
                onClick={() => setCategory('continent')}
              >
                Continents
              </button>
              <button 
                className={`category-chip ${category === 'flag' ? 'active' : ''}`}
                onClick={() => setCategory('flag')}
              >
                Flags
              </button>
            </div>

            <div className="mode-select">
              <button className="mode-btn" onClick={() => startGame('zen')}>
                <div className="mode-btn-content">
                  <span className="icon">🌿</span>
                  <div className="text">
                    <h3>Zen Mode</h3>
                    <p>Stress-free exploration</p>
                  </div>
                </div>
                <span className="mode-arrow">→</span>
              </button>
              <button className="mode-btn" onClick={() => startGame('timeAttack')}>
                <div className="mode-btn-content">
                  <span className="icon">🕒</span>
                  <div className="text">
                    <h3>Time Attack</h3>
                    <p>Race against the world</p>
                  </div>
                </div>
                <span className="mode-arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {view === 'game' && !game.isGameOver && (
          <div className="card game-card">
            {gameMode === 'timeAttack' && (
              <div className="timer-container">
                <div className="timer-bar" style={{width: `${(game.timer / 10) * 100}%`}}></div>
              </div>
            )}
            
            <div className="question-area">
              <span className="sub-label">
                {category === 'capital' ? 'Identify the capital of' : 
                 category === 'continent' ? 'Which continent is this?' : 
                 'Identify this country'}
              </span>
              {category === 'flag' ? (
                <div className="flag-display-container">
                  <img 
                    src={`https://flagcdn.com/w320/${game.currentQuestion?.code}.png`} 
                    alt="Flag" 
                    className="flag-img"
                  />
                </div>
              ) : (
                <h2 className="country-name">{game.currentQuestion?.country}</h2>
              )}
            </div>

            <div className="options-grid">
              {game.options.map((opt) => (
                <button 
                  key={opt}
                  className={`option-btn ${
                    game.feedback === 'correct' && opt === game.currentQuestion.answer ? 'correct' : ''
                  } ${
                    game.feedback === 'wrong' && opt === game.currentQuestion.selectedAnswer ? 'incorrect' : ''
                  } ${
                    game.feedback && opt !== game.currentQuestion.answer && (game.feedback === 'correct' || (game.feedback === 'wrong' && opt !== game.currentQuestion.selectedAnswer)) ? 'dim' : ''
                  }`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={!!game.feedback}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'game' && game.isGameOver && (
          <div className="card result-card">
            {game.score > 0 && <Confetti />}
            <span className="sub-label">Session Complete</span>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              {game.score >= 10 ? '👑' : game.score >= 5 ? '⭐' : '✨'}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Beautiful Run</h2>
            <p style={{ color: 'var(--text-sub)', fontSize: '1.1rem', marginBottom: '40px' }}>
              Your journey reached <strong style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>{game.score}</strong> destinations.
            </p>
            <div className="actions" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="primary-btn" onClick={() => startGame(gameMode)}>Try Again</button>
              <button className="secondary-btn" onClick={returnToMenu}>Menu</button>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .category-chip {
          padding: 8px 20px;
          border-radius: 100px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-sub);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          font-size: 0.9rem;
        }
        .category-chip.active {
          background: var(--accent-soft);
          color: var(--primary);
          border-color: var(--primary);
        }
        .flag-display-container {
          margin: 20px 0;
          display: flex;
          justify-content: center;
          animation: fadeIn 0.5s ease-out;
        }
        .flag-img {
          max-width: 240px;
          height: auto;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 4px solid white;
          transition: transform 0.3s ease;
        }
        .flag-img:hover {
          transform: scale(1.05);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;