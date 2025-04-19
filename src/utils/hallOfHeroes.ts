const STORAGE_KEY = 'hall_of_heroes';

export type HeroEntry = {
  name: string;
  playerMoves: number;
  envMoves: number;
};

export const loadHallOfHeroes = (): HeroEntry[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  };

export const saveHallOfHeroes = (entries: HeroEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

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

  