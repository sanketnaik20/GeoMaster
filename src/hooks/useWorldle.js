// src/hooks/useWorldle.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { countries } from '../data/countries';
import { calculateDistance, calculateBearing, getCompassDirection, getProximityColor } from '../utils/geo';

export const useWorldle = () => {
  const [targetCountry, setTargetCountry] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [maxGuesses] = useState(999); // Practically unlimited attempts

  // Calculate current 6-hour interval seed
  const getPeriodSeed = () => {
    const now = new Date();
    // Unique number for every 6-hour window
    // floor(Total Hours / 6)
    return Math.floor(Date.now() / (6 * 60 * 60 * 1000));
  };

  // Pick Country based on 6-hour interval
  useEffect(() => {
    const seed = getPeriodSeed();
    
    // Simple deterministic random from seed
    const random = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    // Filter countries that have coordinates
    const validCountries = countries.filter(c => c.lat !== undefined);
    const index = Math.floor(random(seed) * validCountries.length);
    setTargetCountry(validCountries[index]);

    // Load saved guesses for this 6-hour period
    const key = `geoMaster_worldle_v2_${seed}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      setGuesses(parsed.guesses || []);
      setIsWon(parsed.isWon || false);
      setIsGameOver(parsed.isGameOver || false);
    } else {
      // Clear old state if it's a new period
      setGuesses([]);
      setIsWon(false);
      setIsGameOver(false);
    }
  }, []);

  const submitGuess = useCallback((guessName) => {
    if (isWon || isGameOver || guesses.length >= maxGuesses) return;

    const findGuess = countries.find(c => c.country.toLowerCase() === guessName.toLowerCase());
    if (!findGuess || findGuess.lat === undefined) return;

    const distance = calculateDistance(
      findGuess.lat, findGuess.lng,
      targetCountry.lat, targetCountry.lng
    );
    
    const bearing = calculateBearing(
      findGuess.lat, findGuess.lng,
      targetCountry.lat, targetCountry.lng
    );

    const newGuess = {
      name: findGuess.country,
      distance,
      bearing,
      direction: getCompassDirection(bearing),
      color: getProximityColor(distance),
      percent: Math.max(0, Math.round(100 - (distance / 20000) * 100))
    };

    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);

    let won = false;
    let over = false;
    if (findGuess.country === targetCountry.country) {
      setIsWon(true);
      won = true;
      over = true;
    } else if (updatedGuesses.length >= maxGuesses) {
      setIsGameOver(true);
      over = true;
    }

    // Save to local storage using the 6-hour seed
    const seed = getPeriodSeed();
    localStorage.setItem(`geoMaster_worldle_v2_${seed}`, JSON.stringify({
      guesses: updatedGuesses,
      isWon: won,
      isGameOver: over
    }));
  }, [guesses, isWon, isGameOver, targetCountry, maxGuesses]);

  return {
    targetCountry,
    guesses,
    isWon,
    isGameOver,
    maxGuesses,
    submitGuess
  };
};
