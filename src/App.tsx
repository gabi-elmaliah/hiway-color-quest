import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import HallOfHeroes from './components/HallOfHeroes';
import './App.css';


function App() {
  const [selectedPalette, setSelectedPalette] = useState<[string, string] | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <WelcomeScreen
              onThemeSelect={(palette) => setSelectedPalette(palette)}
            />
          }
        />
        <Route
          path="/game"
          element={
            selectedPalette ? (
              <GameScreen palette={selectedPalette} />
            ) : (
              <div className="fallback-message">
                <h2>Please select a theme from the Welcome screen first.</h2>
              </div>
            )
          }
        />
        <Route path="/hall-of-heroes" element={<HallOfHeroes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
