import React, { useState, useEffect } from 'react';

const references = [
  "This little maneuver is gonna cost us 51 years...",
  "Initiating Docking Sequence. It's necessary.",
  "Analyzing the Tesseract...",
  "Consulting with TARS on the humor settings.",
  "GET READY TO FIGHT!",
  "Buckle up, Cooper.",
  "Gravity is the only thing that can cross dimensions...",
  "Establishing contact with the Endurance.",
  "Ghayal Ho Isliye Ghatak Ho"
];

const LoadingScreen = ({ onComplete }) => {
  const [text, setText] = useState(references[0]);

  useEffect(() => {
    const randomRef = references[Math.floor(Math.random() * references.length)];
    setText(randomRef);

    const timer = setTimeout(() => {
      onComplete();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
