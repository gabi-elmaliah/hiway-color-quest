import { useEffect } from 'react';
import { addHeroEntry, loadHallOfHeroes, HeroEntry } from '../utils/hallOfHeroes';

type UseVictoryCheckParams = {
  buttons: { isActive: boolean }[];
  playerMoves: number;
  envMoves: number;
  onVictory: (place: number | null) => void; // trigger modal with rank
};

/**
 * Custom hook that monitors the game state and detects when the player has unified the board.
 * If the board is unified, it checks if the score qualifies for the Hall of Heroes.
 * If so, it saves the entry and calls `onVictory` with the player's placement.
 *
 * @param buttons - Current button states of the board
 * @param playerMoves - Number of moves made by the player
 * @param envMoves - Number of moves made by the environment (auto-shuffles, etc.)
 * @param onVictory - Callback function that triggers when the player qualifies for the leaderboard
 */

export const useVictoryCheck = ({
  buttons,
  playerMoves,
  envMoves,
  onVictory,
}: UseVictoryCheckParams) => {
  useEffect(() => {
    // Check if all buttons share the same state
    const allSame = buttons.every((b) => b.isActive === buttons[0].isActive);
    if (!allSame) return;

    const current = loadHallOfHeroes();
    let place: number | null = null;

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

    if (qualifies) 
      {
      const updated = addHeroEntry(newEntry); // Adds & saves

        place = updated.findIndex(
        (e) =>
          e.playerMoves === newEntry.playerMoves &&
          e.envMoves === newEntry.envMoves &&
          e.name === ''
      ) + 1;
  
    }
    onVictory(place);
  }, [buttons]);
};
