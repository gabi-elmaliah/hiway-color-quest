import React from 'react';
import '../styles/ScoreBar.css'; 

interface ScoreBarProps {
  score: number;
  moves: number;
  total: number;
}

/**
 * Displays the player's current score and move count.
 */
const ScoreBar = ({ score, moves, total }: ScoreBarProps) => {
  return (
    <div className="score-bar-wrapper">
      <div className="score-bar">
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Player Moves:</strong> {moves}</p>
      </div>
    </div>
  );
};

export default React.memo(ScoreBar);
