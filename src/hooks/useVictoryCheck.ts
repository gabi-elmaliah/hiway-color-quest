import { useEffect } from 'react';
import { addHeroEntry, loadHallOfHeroes, HeroEntry } from '../utils/hallOfHeroes';

type UseVictoryCheckParams = {
  buttons: { isActive: boolean }[];
  playerMoves: number;
  envMoves: number;
  onVictory: (place: number) => void; // trigger modal with rank
};

export const useVictoryCheck = ({
  buttons,
  playerMoves,
  envMoves,
  onVictory,
}: UseVictoryCheckParams) => {
  useEffect(() => {
    if (buttons.length === 0) return;

    const allSame = buttons.every((b) => b.isActive === buttons[0].isActive);
    if (!allSame) return;

    const current = loadHallOfHeroes();

    const newEntry: HeroEntry = { name: '', playerMoves, envMoves };

    let qualifies = false;

    if (current.length < 10) {
      qualifies = true;
    } else {
      const worst = current[current.length - 1];
      qualifies =
        playerMoves < worst.playerMoves ||
        (playerMoves === worst.playerMoves && envMoves < worst.envMoves);
    }

    if (qualifies) {
      const updated = addHeroEntry(newEntry); // Adds & saves

      const place = updated.findIndex(
        (e) =>
          e.playerMoves === newEntry.playerMoves &&
          e.envMoves === newEntry.envMoves &&
          e.name === ''
      ) + 1;

      if (place > 0 && place <= 10) {
        onVictory(place);
      }
    }
  }, [buttons]);
};
