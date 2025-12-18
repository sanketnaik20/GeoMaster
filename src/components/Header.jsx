import React from 'react';
import { Moon, Sun, Compass, Volume2, VolumeX, Smartphone, SmartphoneNfc } from 'lucide-react';

export default function Header({ 
  score, 
  highScore, 
  theme, 
  toggleTheme, 
  isSoundEnabled, 
  toggleSound, 
  isHapticsEnabled, 
  toggleHaptics 
}) {
  return (
    <header className="app-header">
      <div className="logo" onClick={() => window.location.reload()}>
        <div className="logo-icon-wrapper">
          <Compass size={20} strokeWidth={2.5} />
        </div>
        <div className="logo-text">
          <b>GEO</b><span>master</span>
        </div>
      </div>
      
      <div className="stats">
        <div className="stat-pill">
          <span className="label">Best</span>
          <span className="value">{highScore}</span>
        </div>
        <div className="stat-pill">
          <span className="label">Now</span>
          <span className="value">{score}</span>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
        <button className="theme-toggle" onClick={toggleSound} title="Toggle Sound">
          {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        {/* <button className="theme-toggle" onClick={toggleHaptics} title="Toggle Haptics">
          {isHapticsEnabled ? <SmartphoneNfc size={18} /> : <Smartphone size={18} />}
        </button> */}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
        </button>
      </div>
    </header>
  );
}