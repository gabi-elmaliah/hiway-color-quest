// Key used for storing hall of heroes in localStorage
const STORAGE_KEY = 'hall_of_heroes';

// Represents a single hero leaderboard entry
export type HeroEntry = {
  name: string;
  playerMoves: number;
  envMoves: number;
};

/**
 * Loads the Hall of Heroes from localStorage.
 * Returns an array of HeroEntry objects, or an empty array if none exist.
 */
export const loadHallOfHeroes = (): HeroEntry[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  /**
 * Saves an array of HeroEntry objects to localStorage.
 */
export const saveHallOfHeroes = (entries: HeroEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

/**
 * Adds a new hero to the Hall of Heroes.
 * Keeps only the top 10 heroes sorted by:
 * 1. Least player moves
 * 2. Least environment moves (if player moves are equal)
 */
export const addHeroEntry = (newEntry: HeroEntry) => {
    const current = loadHallOfHeroes();
  
    const updated = [...current, newEntry]
      .sort((a, b) =>
        a.playerMoves !== b.playerMoves
          ? a.playerMoves - b.playerMoves
          : a.envMoves - b.envMoves
      )
      .slice(0, 10); // Only keep top 10
  
    saveHallOfHeroes(updated);
    return updated;
  };

  