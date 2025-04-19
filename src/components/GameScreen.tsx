import React, { useState, useEffect } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { isPrime, shuffleArray } from '../utils/color';
import ScoreBar from './ScoreBar';
import '../styles/GameScreen.css';

interface GameScreenProps {
  palette: [string, string]; // [inactiveColor, activeColor]
}

type ButtonData = {
  id: number;        // 1–42
  isActive: boolean;
};

const ROWS = 6;
const COLS = 7;
const TOTAL = ROWS * COLS;

const GameScreen = ({ palette }: GameScreenProps) => {
    const [interactionDisabled, setInteractionDisabled] = useState(false);
    const [showEqualizerPopup, setShowEqualizerPopup] = useState(false);
    const [envMoves, setEnvMoves] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<number>(42);
    const [playerMoves, setPlayerMoves] = useState<number>(0);
    const [buttons, setButtons] = useState<ButtonData[]>(
        Array.from({ length: TOTAL }, (_, i) => ({
        id: i + 1,                             // IDs: 1 → 42
        isActive: (i + 1) % 2 === 0,           // Even-numbered IDs = active
        }))
    );

    const handleEqualizerClick = () => {
        if (interactionDisabled) return;
      
        setInteractionDisabled(true);
        setShowEqualizerPopup(true);
        setEnvMoves((prev) => prev + 1);
      
        setButtons((prev) => {
          const evens = prev.filter((b) => b.id % 2 === 0).sort((a, b) => a.id - b.id);
          const odds = prev.filter((b) => b.id % 2 !== 0).sort((a, b) => a.id - b.id);
          return [...evens, ...odds];
        });
      
        setTimeout(() => {
          setInteractionDisabled(false);
          setShowEqualizerPopup(false);
        }, 3141.5);
      };

    //  Auto-shuffle + countdown
    useEffect(() => {
        const shuffleInterval = setInterval(() => {
        setButtons((prev) => shuffleArray(prev));
        setTimeLeft(42);
        setEnvMoves((prev) => prev + 1);
        }, 42000);

        const countdownInterval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
        clearInterval(shuffleInterval);
        clearInterval(countdownInterval);
        };
    }, []);

    // Toggle visual button + its neighbors
    const toggleIndex = (visualIndex: number) => {
        if (interactionDisabled) return;
        setPlayerMoves((moves) => moves + 1);

        setButtons((prev) => {
        const next = [...prev];

        const toggle = (i: number) => {
            if (i >= 0 && i < TOTAL) {
            next[i] = {
                ...next[i],
                isActive: !next[i].isActive,
            };
            }
        };

        toggle(visualIndex);

        const row = Math.floor(visualIndex / COLS);
        const col = visualIndex % COLS;

        if ((next[visualIndex].id) % 2 === 0) {
            if (col > 0) toggle(visualIndex - 1);
            if (col < COLS - 1) toggle(visualIndex + 1);
            if (row > 0) toggle(visualIndex - COLS);
            if (row < ROWS - 1) toggle(visualIndex + COLS);
        } else {
            if (row > 0 && col > 0) toggle(visualIndex - COLS - 1);
            if (row > 0 && col < COLS - 1) toggle(visualIndex - COLS + 1);
            if (row < ROWS - 1 && col > 0) toggle(visualIndex + COLS - 1);
            if (row < ROWS - 1 && col < COLS - 1) toggle(visualIndex + COLS + 1);
        }

        return next;
        });
    };

    const getScore = () => {
        const countActive = buttons.filter((b) => b.isActive).length;
        const countInactive = TOTAL - countActive;
        return Math.max(countActive, countInactive);
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

        <Typography variant="body1" className="shuffle-timer">Next shuffle in: {timeLeft}s</Typography>
        <Typography variant="body1" className="env-moves">Environment Moves: {envMoves}</Typography>
        
        <div className="equalizer-section">
            <button className="great-equalizer" onClick={handleEqualizerClick} disabled={interactionDisabled}>
                The Great Equalizer
            </button>
            {showEqualizerPopup && (
            <div className="popup-message">
                You invoked balance in the universe. Sit and ponder your actions!
            </div>
  )}
</div>


        <div className="game-screen">
            {buttons.map((button, visualIndex) => (
            <Tooltip
                key={button.id}
                title={
                isPrime(button.id)
                    ? 'Prime'
                    : 'Not Prime (How boring!)'
                }
            >
                <button
                className={`grid-button ${button.isActive ? 'active' : 'inactive'}`}
                onClick={() => toggleIndex(visualIndex)}
                >
                {button.id}
                </button>
            </Tooltip>
            ))}
        </div>
        </div>
    );
};

export default GameScreen;
