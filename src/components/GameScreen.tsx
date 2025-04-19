import React, { useState, useEffect } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { isPrime, shuffleArray } from '../utils/color';
import ScoreBar from './ScoreBar';
import '../styles/GameScreen.css';

interface GameScreenProps {
  palette: [string, string]; // [inactiveColor, activeColor]
}

const ROWS = 6;
const COLS = 7;
const TOTAL = ROWS * COLS;

const GameScreen = ({ palette }: GameScreenProps) => {
  const [order, setOrder] = useState<number[]>(
    Array.from({ length: TOTAL }, (_, i) => i)
  );

  const initialStates = Array.from({ length: TOTAL }, (_, i) => (i + 1) % 2 === 0);
  const [activeStates, setActiveStates] = useState<boolean[]>(initialStates);
  const [timeLeft, setTimeLeft] = useState<number>(42);
  const [playerMoves, setPlayerMoves] = useState<number>(0);

  // 🕒 Shuffle and countdown intervals
  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setOrder((prevOrder) => shuffleArray(prevOrder));
      setTimeLeft(42);
    }, 42000);

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(shuffleInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const toggleIndex = (visualIndex: number) => {
    setPlayerMoves((moves) => moves + 1);

    setActiveStates((prev) => {
      const next = [...prev];
      const toggle = (i: number) => {
        if (i >= 0 && i < TOTAL) next[i] = !next[i];
      };

      toggle(visualIndex);

      const row = Math.floor(visualIndex / COLS);
      const col = visualIndex % COLS;

      if ((visualIndex + 1) % 2 === 0) {
        if (col > 0) toggle(visualIndex - 1); // left
        if (col < COLS - 1) toggle(visualIndex + 1); // right
        if (row > 0) toggle(visualIndex - COLS); // up
        if (row < ROWS - 1) toggle(visualIndex + COLS); // down
      } else {
        if (row > 0 && col > 0) toggle(visualIndex - COLS - 1); // top-left
        if (row > 0 && col < COLS - 1) toggle(visualIndex - COLS + 1); // top-right
        if (row < ROWS - 1 && col > 0) toggle(visualIndex + COLS - 1); // bottom-left
        if (row < ROWS - 1 && col < COLS - 1) toggle(visualIndex + COLS + 1); // bottom-right
      }

      return next;
    });
  };

  const getScore = () => {
    const countTrue = activeStates.filter((val) => val === true).length;
    const countFalse = TOTAL - countTrue;
    return Math.max(countTrue, countFalse);
  };

  return (
    <div
      className="game-screen-wrapper"
      style={
        {
          ['--inactive-color' as any]: palette[0],
          ['--active-color' as any]: palette[1],
        } as React.CSSProperties
      }
    >
      <ScoreBar score={getScore()} moves={playerMoves} total={TOTAL} />
      <Typography variant="body1" className="shuffle-timer">
        🔁 Next shuffle in: {timeLeft}s
      </Typography>

      <div className="game-screen">
        {order.map((originalIndex, visualIndex) => {
          const isActive = activeStates[originalIndex];

          return (
            <Tooltip
              key={originalIndex}
              title={
                isPrime(originalIndex + 1)
                  ? 'Prime'
                  : 'Not Prime (How boring!)'
              }
            >
              <button
                className={`grid-button ${isActive ? 'active' : 'inactive'}`}
                onClick={() => toggleIndex(visualIndex)}
              >
                {originalIndex + 1}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default GameScreen;
