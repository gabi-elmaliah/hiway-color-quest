import React from 'react';
import '../styles/ScoreBar.css'; 

interface ScoreBarProps {
  score: number;
  moves: number;
  total: number;
}

/**
 * Displays the player's current score and move count.
 * Shows a victory message when the board is fully unified.
 */
const ScoreBar = ({ score, moves, total }: ScoreBarProps) => {
  return (
    <div className="score-bar-wrapper">
      <div className="score-bar">
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Player Moves:</strong> {moves}</p>
      </div>

      {score === total && (
        <div className="victory-message">
          🎉 Victory! All buttons match!
        </div>
      )}
    </div>
  );
};

export default ScoreBar;
