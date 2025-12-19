import React from 'react';
import './MainMenu.css';

const MainMenu = ({ 
  category, 
  setCategory, 
  onStartGame, 
  onStartWorldle,
  onStartMultiplayer
}) => {
  const categories = [
    { id: 'capital', label: 'Capitals' },
    { id: 'continent', label: 'Continents' },
    { id: 'flag', label: 'Flags' }
  ];

  return (
    <div className="card menu-card">
      <span className="sub-label">Step into the journey</span>
      <h2 className="menu-title">Global Explorer</h2>
      
      <div className="category-select" data-testid="category-select">
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`category-chip ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mode-select">
        <button className="mode-btn" onClick={() => onStartGame('zen')}>
          <div className="mode-btn-content">
            <span className="icon">🌿</span>
            <div className="text">
              <h3>Zen Mode</h3>
              <p>Stress-free exploration</p>
            </div>
          </div>
          <span className="mode-arrow">→</span>
        </button>
        
        <button className="mode-btn" onClick={() => onStartGame('timeAttack')}>
          <div className="mode-btn-content">
            <span className="icon">🕒</span>
            <div className="text">
              <h3>Time Attack</h3>
              <p>Race against the world</p>
            </div>
          </div>
          <span className="mode-arrow">→</span>
        </button>
        
        <button className="mode-btn special multiplayer" onClick={onStartMultiplayer}>
          <div className="mode-btn-content">
            <span className="icon">⚔️</span>
            <div className="text">
              <h3>Multiplayer</h3>
              <p>Battle with friends in real-time</p>
            </div>
          </div>
          <span className="mode-arrow">→</span>
        </button>

        <button className="mode-btn special" onClick={onStartWorldle}>
          <div className="mode-btn-content">
            <span className="icon">🌍</span>
            <div className="text">
              <h3>Globe-wordle</h3>
              <p>Daily geographical riddle</p>
            </div>
          </div>
          <span className="mode-arrow">→</span>
        </button>
  
      </div>
    </div>
  );
};

export default MainMenu;
