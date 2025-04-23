import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';
import { useAutoShuffle } from '../hooks/useAutoShuffle';
import { useEqualizer } from '../hooks/useEqualizer';
import { useRageClickDetector } from '../hooks/useRageClickDetector';
import { useVictoryCheck } from '../hooks/useVictoryCheck';
import VictoryModal from './VictoryModal';
import { loadHallOfHeroes, saveHallOfHeroes } from '../utils/hallOfHeroes';
import { Tooltip, Typography } from '@mui/material';
import { isPrime, getScore, getNeighborIndexes } from '../utils/helpers';
import ScoreBar from './ScoreBar';
import '../styles/GameScreen.css';

interface GameScreenProps {
  palette: [string, string]; // [inactiveColor, activeColor]
}

type ButtonData = {
  id: number;
  isActive: boolean;
};

const ROWS = 6;
const COLS = 7;
const TOTAL = ROWS * COLS;

/**
 * GameScreen Component
 * Core gameplay view – displays the interactive button grid and manages game logic.
 */
const GameScreen = ({ palette }: GameScreenProps) => {
  const [buttons, setButtons] = useState<ButtonData[]>(
    Array.from({ length: TOTAL }, (_, i) => ({
      id: i + 1,
      isActive: (i + 1) % 2 === 0, // Even IDs start active
    }))
  );

  const [playerMoves, setPlayerMoves] = useState(0);
  const [envMoves, setEnvMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(42);
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [showEqualizerPopup, setShowEqualizerPopup] = useState(false);
  const [ragePopup, setRagePopup] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryPlace, setVictoryPlace] = useState<number | null>(null);

  // Triggered when user wins the game
  const onVictory = useCallback((place: number | null) => {
    setVictoryPlace(place);
    setShowVictoryModal(true);
  }, []);

  const navigate = useNavigate();
  useVictoryCheck({ buttons, playerMoves, envMoves, onVictory });

  // Show rage popup if player clicks too quickly
  const onRage = useCallback(() => {
    setInteractionDisabled(true);
    setRagePopup(true);

    setTimeout(() => {
      setInteractionDisabled(false);
      setRagePopup(false);
    }, 1618);
  }, []);

  const registerClick = useRageClickDetector(onRage);

  const handleEqualizerClick = useEqualizer({
    setButtons,
    setEnvMoves,
    setInteractionDisabled,
    setShowEqualizerPopup,
  });

  useAutoShuffle(setButtons, setEnvMoves, setTimeLeft);

  /**
   * Handles a grid button click, toggles the button and its neighbors.
   */
  const toggleIndex = (visualIndex: number) => 
    {
    if (interactionDisabled) return;

    registerClick();
    setPlayerMoves((prev) => prev + 1);

    setButtons((prev) => 
      {
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

      const neighbors = getNeighborIndexes(
        visualIndex,
        next[visualIndex].id,
        ROWS,
        COLS
      );

      neighbors.forEach(toggle);
      return next;
    });
  };

  /**
   * Saves the hero's name after victory.
   */
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
      <ScoreBar score={getScore(buttons)} moves={playerMoves} total={TOTAL} />

      <Typography variant="body1" className="shuffle-timer">
        Next shuffle in: {timeLeft}s
      </Typography>
      <Typography variant="body1" className="env-moves">
        Environment Moves: {envMoves}
      </Typography>

    
      <div className="equalizer-section">
        <button
          className="great-equalizer"
          onClick={handleEqualizerClick}
          disabled={interactionDisabled}
        >
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
            title={isPrime(button.id) ? 'Prime' : 'Not Prime (How boring!)'}
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

      <button
        className="great-equalizer"
        onClick={() => navigate('/')}
        >
        Back to Home Page
      </button>

      
      {showVictoryModal && (
        <VictoryModal
          place={victoryPlace}
          onSave={handleSaveName}
          playerMoves={playerMoves}
          envMoves={envMoves}
        />
      )}
    </div>
  );
};

export default GameScreen;
