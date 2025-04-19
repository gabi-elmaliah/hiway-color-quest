import React, { useState } from 'react';
import './VictoryModal.css';

type VictoryModalProps = {
  place: number;
  onSave: (name: string) => void;
};

const VictoryModal = ({ place, onSave, }: VictoryModalProps) => {
  const [name, setName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 3);
    setName(value);
  };

  const handleSubmit = () => {
    if (name.length === 3) {
      onSave(name);
    }
  };

  return (
    <div className="victory-modal-backdrop">
      <div className="victory-modal">
        <h2>Glory awaits!</h2>
        <p>You've claimed {place}ᵗʰ place in the Hall of Heroes.</p>
        <p>Inscribe your name into legend:</p>
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
      </div>
    </div>
  );
};

export default VictoryModal;
