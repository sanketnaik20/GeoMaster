import React from 'react';
import { Moon, Sun, Compass } from 'lucide-react';

export default function Header({ score, highScore, theme, toggleTheme }) {
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

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
      </button>
    </header>
  );
}