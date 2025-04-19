import { useState } from 'react'
import GameScreen from './components/GameScreen' 
import './App.css'

function App() {
  const palette: [string, string] = ['#2196f3', '#f44336']; // Blue & Red example

  return (
    <div>
      <GameScreen palette={palette} />
    </div>
  );
}

export default App
