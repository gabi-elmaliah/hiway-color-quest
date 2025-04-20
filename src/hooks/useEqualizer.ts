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
