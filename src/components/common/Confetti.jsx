import React, { useEffect, useState } from 'react';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20,
      size: Math.random() * 8 + 4,
      color: ['#8da399', '#a8c69f', '#e5989b', '#f4e9e2'][Math.floor(Math.random() * 4)],
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="confetti-container" style={{
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10
    }}>
      {particles.map(p => (
        <div 
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: '50%',
            opacity: 0.6,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
