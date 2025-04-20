import { Dispatch, SetStateAction } from 'react';

type ButtonData = {
  id: number;
  isActive: boolean;
};

type UseEqualizerParams = {
  setButtons: (fn: (prev: ButtonData[]) => ButtonData[]) => void;
  setEnvMoves: Dispatch<SetStateAction<number>>;
  setInteractionDisabled: (disabled: boolean) => void;
  setShowEqualizerPopup: (show: boolean) => void;
};

/**
 * Custom hook that returns a function to activate "The Great Equalizer" feature.
 * This rearranges all even-ID buttons to the start and odd-ID buttons to the end,
 * temporarily disabling user interaction and showing a popup.
 *
 * @param setButtons - State updater to rearrange the button order.
 * @param setEnvMoves - Increments environment move counter.
 * @param setInteractionDisabled - Disables user interactions temporarily.
 * @param setShowEqualizerPopup - Shows/hides a popup explaining the effect.
 * @returns A callback function to trigger the equalizer.
 */
export const useEqualizer = ({
  setButtons,
  setEnvMoves,
  setInteractionDisabled,
  setShowEqualizerPopup,
}: UseEqualizerParams) => {
  return () => {
    setInteractionDisabled(true);
    setShowEqualizerPopup(true);
    setEnvMoves((prev) => prev + 1);

    setButtons((prev) => {
      const evens = prev.filter((b) => b.id % 2 === 0).sort((a, b) => a.id - b.id);
      const odds = prev.filter((b) => b.id % 2 !== 0).sort((a, b) => a.id - b.id);
      return [...evens, ...odds];
    });

    setTimeout(() => {
      setInteractionDisabled(false);
      setShowEqualizerPopup(false);
    }, 3141.5);
  };
};
