import { useEffect } from 'react';
import { shuffleArray } from '../utils/helpers';

/**
 * Custom hook that handles two timed effects:
 * - Auto-shuffles the button grid every 42 seconds.
 * - Updates a countdown timer every second.
 *
 * @param setButtons - Setter function to update the button array
 * @param setEnvMoves - Setter for incrementing the environment move counter
 * @param setTimeLeft - Setter to update the countdown timer (in seconds)
 */
export const useAutoShuffle = (
  setButtons: React.Dispatch<React.SetStateAction<any[]>>,
  setEnvMoves: React.Dispatch<React.SetStateAction<number>>,
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>) => {
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
  }, [setButtons, setEnvMoves, setTimeLeft]);
};
