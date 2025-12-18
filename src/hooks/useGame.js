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

  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [nextQuestionData, setNextQuestionData] = useState(null);

  // Load Highscore
  useEffect(() => {
    const key = `geoMaster_highScore_${gameMode}_${quizCategory}`;
    const stored = localStorage.getItem(key);
    if (stored) setHighScore(parseInt(stored, 10));
    else setHighScore(0);
  }, [gameMode, quizCategory]);

  // Update Multiplier based on streak
  useEffect(() => {
    let m = 1;
    if (streak >= 15) m = 3;
    else if (streak >= 10) m = 2.5;
    else if (streak >= 5) m = 2;
    else if (streak >= 3) m = 1.5;
    if (m !== multiplier) setMultiplier(m);
  }, [streak, multiplier]);

  // Helper to get formatted question data
  const getQuestionData = useCallback(() => {
    const randomIdx = Math.floor(Math.random() * countries.length);
    const country = countries[randomIdx];
    
    let field = quizCategory === 'capital' ? 'capital' : 
                quizCategory === 'continent' ? 'continent' : 'country';
    
    const answer = country[field];
    const pool = [...new Set(countries.map(c => c[field]))];
    let distractors = new Set();
    
    while (distractors.size < 3) {
      const d = pool[Math.floor(Math.random() * pool.length)];
      if (d !== answer) distractors.add(d);
    }
    
    return {
      question: { ...country, answer, type: quizCategory },
      options: [...distractors, answer].sort(() => Math.random() - 0.5)
    };
  }, [quizCategory]);

  // Prefetch Image helper
  const prefetchImage = (url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  };

  // Generate Question with prefetching
  const generateQuestion = useCallback(() => {
    const data = nextQuestionData || getQuestionData();
    setCurrentQuestion(data.question);
    setOptions(data.options);
    setTimer(10); 
    setFeedback(null);

    // Prepare NEXT question and prefetch its image
    const next = getQuestionData();
    setNextQuestionData(next);
    
    if (quizCategory === 'flag') {
      prefetchImage(`https://flagcdn.com/w320/${next.question.code}.png`);
    } else if (quizCategory === 'continent') {
      prefetchImage(`https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${next.question.code}/256.png`);
    }
  }, [quizCategory, nextQuestionData, getQuestionData]);

  // Initialize
  useEffect(() => {
    generateQuestion();
  }, []); // Only on mount

  // Timer Logic
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
      setStreak(s => s + 1);
      setScore(s => s + (1 * multiplier));
      setFeedback('correct');
      playCorrect();
      setTimeout(generateQuestion, 1200);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setCurrentQuestion(prev => ({ ...prev, selectedAnswer: selected }));
      playIncorrect();
      setTimeout(() => setIsGameOver(true), 1200);
    }
  };

  const resetGame = () => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`geoMaster_highScore_${gameMode}_${quizCategory}`, score);
    }
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    setNextQuestionData(null);
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
    streak,
    multiplier,
    handleAnswer,
    resetGame
  };
};