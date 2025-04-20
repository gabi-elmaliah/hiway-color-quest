import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VictoryModal.css';


/**
 * VictoryModal Component
 * Displays a congratulatory popup allowing the player to enter their name
 * if they ranked in the top 10 Hall of Heroes.
 */
type VictoryModalProps = {
  place: number | null;
  onSave: (name: string) => void;
  playerMoves: number;
  envMoves: number;
  
};

const VictoryModal = ({ place, onSave, playerMoves, envMoves }: VictoryModalProps) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  // Converts input to uppercase and trims to 3 chars 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 3);
    setName(value);
  };
  
  /**
   * Submit the entered name if valid and navigate to welcome screen.
   */
  const handleSubmit = () => {
    if (name.length === 3) {
      onSave(name);
      navigate('/');
    }
  };

  return (
    <div className="victory-modal-backdrop">
    <div className="victory-modal">
      <h2>Glory awaits!</h2>

      {place ? (
        <>
          <p>You've claimed <strong>{place}ᵗʰ</strong> place in the Hall of Heroes.</p>
          <p>Inscribe your name into legend:</p>
          <p>🎯 Player Moves: <strong>{playerMoves}</strong></p>
          <p>🌍 Env Moves: <strong>{envMoves}</strong></p>
          <input
            type="text"
            value={name}
            onChange={handleChange}
            maxLength={3}
            className="arcade-input"
            placeholder="_ _ _"
          />
          <div className="modal-buttons">
            <button onClick={handleSubmit} disabled={name.length !== 3}>Submit</button>
          </div>
        </>
      ) : (
        <>
          <p>You've completed the quest! 🎉</p>
          <p>But didn’t reach the top 10. Try again and improve your skills!</p>
          <div className="victory-stats">
            <p>🎯 Player Moves: <strong>{playerMoves}</strong></p>
            <p>🌍 Env Moves: <strong>{envMoves}</strong></p>
          </div>
          <div className="modal-buttons">
            <button onClick={() => navigate('/')}>Back to Start</button>
          </div>
        </>
      )}
    </div>
  </div>
  );
};

export default VictoryModal;
