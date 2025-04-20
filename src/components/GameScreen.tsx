import React, { useState, useEffect,useCallback } from 'react';
import VictoryModal from './VictoryModal';
import { useVictoryCheck } from '../hooks/useVictoryCheck';
import { loadHallOfHeroes, saveHallOfHeroes } from '../utils/hallOfHeroes';
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
    const [showVictoryModal, setShowVictoryModal] = useState(false);
    const [victoryPlace, setVictoryPlace] = useState<number | null>(null);
    const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
    const [ragePopup, setRagePopup] = useState(false);
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
    const onVictory = useCallback((place: number) => {
        setVictoryPlace(place);
        setShowVictoryModal(true);
      }, []);
      
      useVictoryCheck({
        buttons,
        playerMoves,
        envMoves,
        onVictory,
      });
   
      
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

        const now = Date.now();
        setClickTimestamps((prev) => {
          const recent = prev.filter((ts) => now - ts <= 2000); // keep only clicks within 2s
          const updated = [...recent, now];
      
          if (updated.length >= 5) {
            setInteractionDisabled(true);
            setRagePopup(true);
      
            setTimeout(() => {
              setInteractionDisabled(false);
              setRagePopup(false);
            }, 1618); // golden ratio seconds in ms
      
            return []; // reset click tracking after rage-lock
          }
      
          return updated;
        });
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

    const handleSaveName = (name: string) => {
        const current = loadHallOfHeroes();
        const unnamedIndex = current.findIndex((e) => e.name === '');
        if (unnamedIndex !== -1) {
          current[unnamedIndex].name = name;
          saveHallOfHeroes(current);
        }
        setShowVictoryModal(false);
        setVictoryPlace(null);
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
            {ragePopup && (
            <div className="popup-message">
                Slow down, Speedy! Even wizards must rest!
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
        {import.meta.env.MODE === 'development' && (
      <button
        className="great-equalizer"
        style={{ marginTop: '2rem' }}
        onClick={() =>
          setButtons((prev) => prev.map((b) => ({ ...b, isActive: true })))
        }
      >
        🧪 Force Win (DEV)
      </button>
    )}
        {showVictoryModal && victoryPlace && (
        <VictoryModal
          place={victoryPlace}
          onSave={handleSaveName}
        />
      )}
        </div>
    );
};

export default GameScreen;
