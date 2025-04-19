import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <WelcomeScreen onThemeSelect={(palette) => console.log('Selected:', palette)} />
    </div>
  );
}

export default App
