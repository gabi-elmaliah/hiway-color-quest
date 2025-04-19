import React, { useState } from 'react';
import { Grid, Button,Tooltip } from '@mui/material';   
import { isPrime } from '../utils/color'; // utility function to check if a number is prime
import '../styles/GameScreen.css';

interface GameScreenProps {
  palette: [string, string]; // [inactiveColor, activeColor]
}

const ROWS = 6;
const COLS = 7;
const TOTAL = ROWS * COLS;


const GameScreen = ({ palette }: GameScreenProps) => {
    const initialStates = Array.from({ length: TOTAL }, (_, i) => (i + 1) % 2 === 0);
    const [activeStates, setActiveStates] = useState<boolean[]>(initialStates);
    const [playerMoves, setPlayerMoves] = useState<number>(0);

    const toggleIndex = (index: number) => 
    {
        setPlayerMoves((moves) => moves + 1); // Increment player moves

        setActiveStates((prev) => {
        const next = [...prev];
        const toggle = (i: number) => {
            if (i >= 0 && i < TOTAL) next[i] = !next[i];
        };

        // Self
        toggle(index);

        const row = Math.floor(index / COLS);
        const col = index % COLS;

        if ((index + 1) % 2 === 0) {
            // Even: toggle direct neighbors
            if (col > 0) toggle(index - 1); // left
            if (col < COLS - 1) toggle(index + 1); // right
            if (row > 0) toggle(index - COLS); // up
            if (row < ROWS - 1) toggle(index + COLS); // down
        } else {
            // Odd: toggle diagonal neighbors
            if (row > 0 && col > 0) toggle(index - COLS - 1); // top-left
            if (row > 0 && col < COLS - 1) toggle(index - COLS + 1); // top-right
            if (row < ROWS - 1 && col > 0) toggle(index + COLS - 1); // bottom-left
            if (row < ROWS - 1 && col < COLS - 1) toggle(index + COLS + 1); // bottom-right
        }

        return next;
    });
  };
  // Calcukate the the current score
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
      {/* Score and move counter */}
      <div className="score-bar">
        <p><strong>Score:</strong> {getScore()}</p>
        <p><strong>Player Moves:</strong> {playerMoves}</p>
      </div>
  
      {/* Victory message */}
      {getScore() === TOTAL && (
        <div className="victory-message">
          🎉 Victory! All buttons match!
        </div>
      )}
  
      <div className="game-screen">
        {activeStates.map((isActive, index) => (
          <Tooltip
            key={index}
            title={isPrime(index + 1) ? "Prime" : "Not Prime (How boring!)"}
          >
            <button
              className={`grid-button ${isActive ? 'active' : 'inactive'}`}
              onClick={() => toggleIndex(index)}
            >
              {index + 1}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

  
  
  
export default GameScreen;
