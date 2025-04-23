import { useCallback, useState } from 'react';

/**
 * Custom hook to detect rapid (rage) clicks within a specified time frame.
 * When the click threshold is reached, it triggers a callback (e.g., freeze the UI or show a popup).
 *
 * @param onRage - Callback function to be called when rage click is detected.
 * @param rageClickLimit - Number of clicks allowed within the time window (default: 5).
 * @param withinMs - Time window in milliseconds to track clicks (default: 2000ms).
 * @returns A memoized `registerClick` function to track clicks.
 */
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
