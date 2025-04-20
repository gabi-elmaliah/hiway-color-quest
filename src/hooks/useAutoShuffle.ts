import { useEffect } from 'react';
import { shuffleArray } from '../utils/color';

export const useAutoShuffle = (
  setButtons: React.Dispatch<React.SetStateAction<any[]>>,
  setEnvMoves: React.Dispatch<React.SetStateAction<number>>,
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>
) => {
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
