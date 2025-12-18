// src/hooks/useGame.js
import { useState, useEffect, useCallback } from 'react';
import { countries } from '../data/countries';

export const useGame = (gameMode, quizCategory = 'capital') => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  // Load Highscore
  useEffect(() => {
    const key = `geoMaster_highScore_${gameMode}_${quizCategory}`;
    const stored = localStorage.getItem(key);
    if (stored) setHighScore(parseInt(stored, 10));
    else setHighScore(0);
  }, [gameMode, quizCategory]);

  // Generate Question
  const generateQuestion = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * countries.length);
    const correctCountry = countries[randomIdx];
    
    let targetField;
    if (quizCategory === 'capital') {
      targetField = 'capital';
    } else if (quizCategory === 'continent') {
      targetField = 'continent';
    } else {
      // Flag mode: answer is the country name
      targetField = 'country';
    }
    
    const correctAnswer = correctCountry[targetField];
    
    // Generate distractors
    let distractors = new Set();
    const pool = [...new Set(countries.map(c => c[targetField]))];
    
    while (distractors.size < 3 && distractors.size < pool.length - 1) {
      const d = pool[Math.floor(Math.random() * pool.length)];
      if (d !== correctAnswer) distractors.add(d);
    }
    
    const allOptions = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);
    
    setCurrentQuestion({
      ...correctCountry,
      answer: correctAnswer,
      type: quizCategory
    });
    setOptions(allOptions);
    setTimer(10); 
    setFeedback(null);
  }, [quizCategory]);

  // Initialize
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  // Timer Logic (Only for Time Attack)
  useEffect(() => {
    if (gameMode === 'zen' || isGameOver || feedback) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, isGameOver, feedback]);

  const handleAnswer = (selected, playCorrect, playIncorrect) => {
    if (feedback || isGameOver) return;

    if (selected === currentQuestion.answer) {
      setScore(s => s + 1);
      setFeedback('correct');
      playCorrect();
      setTimeout(generateQuestion, 1200);
    } else {
      setFeedback('wrong');
      // Store the wrong answer for feedback display
      setCurrentQuestion(prev => ({ ...prev, selectedAnswer: selected }));
      playIncorrect();
      setTimeout(() => setIsGameOver(true), 1200);
    }
  };

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
      const key = `geoMaster_highScore_${gameMode}_${quizCategory}`;
      localStorage.setItem(key, score);
    }
    setScore(0);
    setIsGameOver(false);
    generateQuestion();
  };

  return {
    currentQuestion,
    options,
    score,
    highScore,
    timer,
    isGameOver,
    feedback,
    handleAnswer,
    resetGame
  };
};