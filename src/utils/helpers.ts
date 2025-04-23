
/**
 * Generates a random hex color string (e.g. 'A1F3C9').
*/
export function getRandomHexColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase();

  return hex;
}

/**
* Recursively checks if a number is prime.
* @param n - The number to test
* @param i - Internal divisor (default 2)
*/
export function isPrime(n: number, i: number = 2): boolean {
  if (n <= 1) return false;
  if (i * i > n) return true;
  if (n % i === 0) return false;
  return isPrime(n, i + 1);
}


/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Returns a new shuffled copy of the array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};


/**
 * Given a button index, returns the indexes of its neighbors.
 * Behavior differs for even/odd button IDs.
 */
export const getNeighborIndexes = (
  index: number,
  id: number,
  rows: number,
  cols: number
): number[] => {
  const neighbors: number[] = [];
  const row = Math.floor(index / cols);
  const col = index % cols;

  if (id % 2 === 0) {
    // Even: direct neighbors (up, down, left, right)
    if (col > 0) neighbors.push(index - 1);         // left
    if (col < cols - 1) neighbors.push(index + 1);  // right
    if (row > 0) neighbors.push(index - cols);      // up
    if (row < rows - 1) neighbors.push(index + cols); // down
  } else {
    // Odd: diagonal neighbors
    if (row > 0 && col > 0) neighbors.push(index - cols - 1);       // top-left
    if (row > 0 && col < cols - 1) neighbors.push(index - cols + 1); // top-right
    if (row < rows - 1 && col > 0) neighbors.push(index + cols - 1); // bottom-left
    if (row < rows - 1 && col < cols - 1) neighbors.push(index + cols + 1); // bottom-right
  }

  return neighbors;
};

/**
 * Calculates the score as the higher count between active and inactive buttons.
 */
export const getScore = (buttons: { isActive: boolean }[]): number => {
  const countActive = buttons.filter((b) => b.isActive).length;
  const countInactive = buttons.length - countActive;
  return Math.max(countActive, countInactive);
};

