import { useCallback, useState } from 'react';

export const useRageClickDetector = (
  onRage: () => void,
  rageClickLimit: number = 5,
  withinMs: number = 2000) => {
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);

  const registerClick = useCallback(() => {
    const now = Date.now();
    setClickTimestamps((prev) => {
      const recent = prev.filter((ts) => now - ts <= withinMs);
      const updated = [...recent, now];

      if (updated.length >= rageClickLimit) {
        onRage();  // Trigger callback to show popup and freeze
        return []; // Reset clicks
      }

      return updated;
    });
  }, [onRage, rageClickLimit, withinMs]);

  return registerClick ;
};
