import React, { useState, useMemo, useRef } from 'react';
import { useWorldle } from '../../hooks/useWorldle';
import { countries } from '../../data/countries';
import { Search, Navigation, Download, MapPin, ArrowLeft } from 'lucide-react';
import { toPng } from 'html-to-image';
import './GlobeWordle.css';

const GuessRow = ({ guess, index }) => (
  <div className={`guess-row ${guess.percent === 100 ? 'correct' : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
    <div className="country-info">
      <span className="name">{guess.name}</span>
    </div>
    <div className="distance-metrics">
      <span className="distance">{guess.distance}km</span>
      <span className="direction" style={{ transform: `rotate(${guess.bearing}deg)` }}>
         <Navigation size={14} fill="currentColor" />
      </span>
      <div className="proximity-bar">
        <div className="bar-fill" style={{ width: `${guess.percent}%`, background: guess.color }}></div>
      </div>
    </div>
  </div>
);

const SuggestionsList = ({ suggestions, onSelect }) => (
  <div className="suggestions-list">
    {suggestions.map(s => (
      <button key={s.country} onClick={() => onSelect(s.country)}>
        <MapPin size={14} style={{ opacity: 0.5 }} />
        {s.country}
      </button>
    ))}
  </div>
);

const ShareCard = React.forwardRef(({ targetCountry, guesses }, ref) => (
  <div style={{ height: 0, overflow: 'hidden', position: 'absolute', pointerEvents: 'none' }}>
    <div ref={ref} className="share-card">
      <div className="share-header">
         <span className="share-logo">🌍 GEOMASTER</span>
         <span className="share-date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
      </div>
      <div className="share-body">
        <div className="share-status-glow">SOLVED</div>
        <div className="share-flag-container">
          <img 
            src={`https://flagcdn.com/w320/${targetCountry?.code?.toLowerCase()}.png`} 
            alt="flag" 
            className="share-flag"
            crossOrigin="anonymous" 
          />
        </div>
        <h2 className="share-country">{targetCountry?.country?.toUpperCase()}</h2>
        <div className="share-stat-box">
           <span className="label">ATTEMPTS</span>
           <span className="value">{guesses.length}</span>
        </div>
      </div>
      <div className="share-footer">
        Think you're better? Play at GeoMaster
      </div>
    </div>
  </div>
));

export default function GlobeWordle({ onBack }) {
  const { targetCountry, guesses, isWon, submitGuess } = useWorldle();
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const shareRef = useRef(null);

  const suggestions = useMemo(() => {
    if (input.length < 1) return [];
    return countries
      .filter(c => c.lat !== undefined && c.country.toLowerCase().includes(input.toLowerCase()))
      .filter(c => !guesses.some(g => g.name === c.country))
      .slice(0, 5);
  }, [input, guesses]);

  const handleGuess = (name) => {
    submitGuess(name);
    setInput('');
    setShowSuggestions(false);
  };

  const handleShare = async () => {
    if (!shareRef.current) return;
    setIsCapturing(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(shareRef.current, {
        cacheBust: true,
        backgroundColor: '#1a1c1e',
        pixelRatio: 3,
      });
      const link = document.createElement('a');
      link.download = `GeoMaster-${targetCountry?.country || 'Result'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Screenshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="card worldle-card">
      <ShareCard ref={shareRef} targetCountry={targetCountry} guesses={guesses} />

      <button className="back-btn-float" onClick={onBack}>
        <ArrowLeft size={20} />
      </button>

      <div className="card-header">
        <span className="sub-label">Globe-Wordle Daily</span>
        <h2 className="worldle-title">Daily Destination</h2>
        <p className="worldle-hint">
          Explore the world. Guess the hidden country with unlimited attempts!
        </p>
      </div>

      <div className="worldle-game-area">
        {!isWon && (
          <div className="guess-input-container">
            <div className="input-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search country..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <SuggestionsList suggestions={suggestions} onSelect={handleGuess} />
            )}
          </div>
        )}

        <div className="guesses-stack">
          {guesses.map((g, i) => (
            <GuessRow key={i} guess={g} index={i} />
          ))}
          {guesses.length === 0 && (
            <div className="placeholder-text">
              Make your first guess to begin
            </div>
          )}
        </div>

        {isWon && (
          <div className="feedback-area win">
            <div className="win-message">
              <h3 className="win-title">Congrats! 🎉</h3>
              <p className="win-text">You guessed <strong>{targetCountry.country}</strong> in <strong>{guesses.length}</strong> attempts.</p>
            </div>
            <div className="win-actions">
              <button className="primary-btn" onClick={handleShare} disabled={isCapturing}>
                {isCapturing ? 'Generating...' : <><Download size={16} style={{ marginRight: '8px' }} /> Share Result</>}
              </button>
              <button className="secondary-btn" onClick={onBack}>Menu</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}