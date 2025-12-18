import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useGame } from './hooks/useGame';
import { useSound } from './hooks/useSound';

// Components
import Header from './components/layout/Header';
import BgIllustration from './components/layout/BgIllustration';
import MainMenu from './components/home/MainMenu';
import QuizView from './components/game/QuizView';
import ResultView from './components/game/ResultView';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy loaded
const GlobeWordle = lazy(() => import('./components/game/GlobeWordle'));

// Styles
import './styles/index.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const [wipeTarget, setWipeTarget] = useState('to-light');
  
  const [view, setView] = useState('menu'); // 'menu' | 'game' | 'worldle'
  const [gameMode, setGameMode] = useState('zen'); // 'zen' | 'timeAttack'
  const [category, setCategory] = useState('capital'); // 'capital' | 'continent' | 'flag'
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  // Settings
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState(true);

  const { playClick, playCorrect, playIncorrect } = useSound();
  const game = useGame(gameMode, category);

  // Theme Handling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Continent Theme Handling
  useEffect(() => {
    if (view === 'game' && game.currentQuestion) {
      document.documentElement.setAttribute('data-continent', game.currentQuestion.continent);
    } else {
      document.documentElement.removeAttribute('data-continent');
    }
  }, [view, game.currentQuestion]);

  const toggleTheme = () => {
    if (isThemeAnimating) return;
    if (isSoundEnabled) playClick();
    const target = theme === 'dark' ? 'light' : 'dark';
    setWipeTarget(`to-${target}`);
    setIsThemeAnimating(true);
    setTimeout(() => setTheme(target), 400);
    setTimeout(() => setIsThemeAnimating(false), 800);
  };

  const startGame = (mode) => {
    if (isSoundEnabled) playClick();
    setPendingMode(mode);
    setIsLoading(true);
  };

  const startWorldle = () => {
    if (isSoundEnabled) playClick();
    setPendingMode('worldle');
    setIsLoading(true);
  };

  const onLoadingComplete = () => {
    if (pendingMode === 'worldle') {
      setView('worldle');
    } else {
      setGameMode(pendingMode);
      game.resetGame();
      setView('game');
    }
    setIsLoading(false);
  };

  const handleAnswer = (option) => {
    game.handleAnswer(
      option, 
      () => isSoundEnabled && playCorrect(), 
      () => isSoundEnabled && playIncorrect()
    );
  };

  const returnToMenu = () => {
    if (isSoundEnabled) playClick();
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
        isSoundEnabled={isSoundEnabled}
        toggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        isHapticsEnabled={isHapticsEnabled}
        toggleHaptics={() => setIsHapticsEnabled(!isHapticsEnabled)}
      />

      <main className="main-content">
        {view === 'menu' && (
          <MainMenu 
            category={category}
            setCategory={setCategory}
            onStartGame={startGame}
            onStartWorldle={startWorldle}
          />
        )}

        {view === 'game' && !game.isGameOver && (
          <QuizView 
            game={game}
            gameMode={gameMode}
            category={category}
            onAnswer={handleAnswer}
          />
        )}

        {view === 'game' && game.isGameOver && (
          <ResultView 
            score={game.score}
            gameMode={gameMode}
            onRestart={startGame}
            onMenu={returnToMenu}
          />
        )}

        {view === 'worldle' && (
          <Suspense fallback={null}>
            <GlobeWordle onBack={returnToMenu} />
          </Suspense>
        )}
      </main>
    </div>
  );
}



export default App;
