import { useState, useEffect, useCallback, useRef } from 'react';
import Peer from 'peerjs';
import { countries } from '../data/countries';

export const useMultiplayer = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState('');
  const [conn, setConn] = useState(null);
  const [opponentId, setOpponentId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected'
  const [messages, setMessages] = useState([]);
  const [gameState, setGameState] = useState({
    status: 'waiting', // 'waiting' | 'starting' | 'playing' | 'ended'
    category: 'capital',
    score: 0,
    opponentScore: 0,
    questionIndex: 0,
    opponentQuestionIndex: 0,
    questions: [],
    winner: null,
    timeLeft: 60
  });

  // Initialize Peer
  useEffect(() => {
    const newPeer = new Peer();
    
    newPeer.on('open', (id) => {
      setMyId(id);
      setPeer(newPeer);
      setConnectionStatus('ready');
    });

    newPeer.on('connection', (connection) => {
      if (conn) {
        connection.close();
        return;
      }
      setConn(connection);
      setIsHost(true);
      setConnectionStatus('connected');
      setOpponentId(connection.peer);
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      setConnectionStatus('error');
    });

    return () => {
      newPeer.destroy();
    };
  }, []);

  // Handle connection events
  useEffect(() => {
    if (!conn) return;

    conn.on('data', (data) => {
      console.log('Received data:', data);
      if (data.type === 'GAME_STATE_UPDATE') {
        // Swap score and opponentScore for the receiver
        const swappedPayload = { ...data.payload };
        // Swap score
        if (data.payload.score !== undefined) {
          swappedPayload.opponentScore = data.payload.score;
          delete swappedPayload.score;
        }
        // Swap questionIndex
        if (data.payload.questionIndex !== undefined) {
          swappedPayload.opponentQuestionIndex = data.payload.questionIndex;
          delete swappedPayload.questionIndex;
        }
        setGameState(prev => ({ ...prev, ...swappedPayload }));
      } else if (data.type === 'CHAT') {
        setMessages(prev => [...prev, { sender: 'opponent', text: data.payload }]);
      } else if (data.type === 'START_GAME') {
        // For the guest, the starting questions and category are received here
        setGameState(prev => ({ ...prev, ...data.payload, status: 'playing' }));
      }
    });

    conn.on('close', () => {
      setConnectionStatus('disconnected');
      setConn(null);
      setOpponentId(null);
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('disconnected');
    });
  }, [conn]);

  const connectToPeer = (id) => {
    if (!peer) return;
    setConnectionStatus('connecting');
    const connection = peer.connect(id);
    
    connection.on('open', () => {
      setConn(connection);
      setIsHost(false);
      setConnectionStatus('connected');
      setOpponentId(id);
    });

    connection.on('error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
    });
  };

  const sendData = useCallback((type, payload) => {
    if (conn && conn.open) {
      conn.send({ type, payload });
    }
  }, [conn]);

  const updateGameState = useCallback((updates) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      sendData('GAME_STATE_UPDATE', updates);
      return newState;
    });
  }, [sendData]);

  const generateQuestions = useCallback((quizCategory, count = 100) => {
    const questions = [];
    const usedIndices = new Set();

    while (questions.length < count) {
      const randomIdx = Math.floor(Math.random() * countries.length);
      if (usedIndices.has(randomIdx)) continue;
      usedIndices.add(randomIdx);

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
      
      questions.push({
        question: { ...country, answer, type: quizCategory },
        options: [...distractors, answer].sort(() => Math.random() - 0.5)
      });
    }
    return questions;
  }, []);

  const startGame = useCallback((category) => {
      const questions = generateQuestions(category);
      const initialGameState = {
        status: 'playing',
        category,
        questions,
        score: 0,
        opponentScore: 0,
        questionIndex: 0,
        opponentQuestionIndex: 0,
        timeLeft: 60
      };
      setGameState(initialGameState);
      sendData('START_GAME', initialGameState);
  }, [sendData, generateQuestions]);

  return {
    myId,
    opponentId,
    conn,
    connectionStatus,
    isHost,
    gameState,
    messages,
    connectToPeer,
    updateGameState,
    startGame,
    sendData
  };
};
