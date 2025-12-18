// src/hooks/useSound.js
import { useCallback } from 'react';

export const useSound = () => {
  const playTone = useCallback((freq, type, duration) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }, []);

  const playCorrect = () => {
    playTone(600, 'sine', 0.1);
    setTimeout(() => playTone(800, 'sine', 0.2), 100);
  };

  const playIncorrect = () => {
    playTone(300, 'sawtooth', 0.2);
    setTimeout(() => playTone(200, 'sawtooth', 0.2), 150);
  };

  const playClick = () => {
    playTone(400, 'sine', 0.05);
  };

  return { playCorrect, playIncorrect, playClick };
};