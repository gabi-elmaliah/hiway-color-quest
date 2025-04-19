export function getRandomHexColor(): string {
    const hex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
  
    return hex;
  }

  export function isPrime(n: number, i: number = 2): boolean {
    if (n <= 1) return false;
    if (i * i > n) return true;
    if (n % i === 0) return false;
    return isPrime(n, i + 1);
  }

  
export const shuffleArray = (array: number[]): number[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  
  