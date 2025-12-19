import React, { useState } from 'react';
import './MultiplayerLobby.css';
import { Copy, Check, Play, UserPlus, ArrowLeft } from 'lucide-react';

const MultiplayerLobby = ({ 
  myId, 
  opponentId, 
  connectionStatus, 
  onConnect, 
  onStartGame, 
  onBack,
  category,
  setCategory,
  isHost
}) => {
  const [joinId, setJoinId] = useState('');
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(myId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { id: 'capital', label: 'Capitals' },
    { id: 'continent', label: 'Continents' },
    { id: 'flag', label: 'Flags' }
  ];

  return (
    <div className="card lobby-card">
      <div className="lobby-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h2>Multiplayer Lobby</h2>
      </div>

      <div className="lobby-content">
        <div className="room-info section">
          <label>Your Room ID</label>
          <div className="id-container">
            <code className="my-id">{myId || 'Generating...'}</code>
            <button className="icon-btn" onClick={copyId} disabled={!myId}>
              {copied ? <Check size={18} className="success" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="hint">Share this ID with your friend</p>
        </div>

        <div className="divider"><span>OR</span></div>

        <div className="join-room section">
          <label>Join a Room</label>
          <div className="join-input-group">
            <input 
              type="text" 
              placeholder="Enter Room ID" 
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="join-input"
            />
            <button 
              className="join-btn"
              onClick={() => onConnect(joinId)}
              disabled={!joinId || connectionStatus === 'connecting'}
            >
              {connectionStatus === 'connecting' ? 'Connecting...' : 'Join'}
            </button>
          </div>
        </div>

        {connectionStatus === 'connected' && (
          <div className="connection-status section connected">
            <div className="status-badge">
              <span className="pulse"></span>
              Connected to Opponent
            </div>
            
            <div className="category-config">
              <label>Select Category {!isHost && "(Host Only)"}</label>
              <div className="category-select">
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    className={`category-chip ${category === cat.id ? 'active' : ''}`}
                    onClick={() => isHost && setCategory(cat.id)}
                    disabled={!isHost}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {isHost ? (
              <button className="start-btn" onClick={onStartGame}>
                <Play size={20} />
                Start Battle
              </button>
            ) : (
              <p className="waiting-host-hint">Waiting for host to start the battle...</p>
            )}
          </div>
        )}

        {connectionStatus === 'error' && (
          <p className="error-text">Failed to connect. Please check the ID and try again.</p>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby;
