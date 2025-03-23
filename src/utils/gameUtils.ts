
/**
 * Shuffles an array in place using the Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Validates if a string is a valid student ID (numeric only)
 */
export const validateStudentId = (id: string): boolean => {
  return /^\d+$/.test(id) && id.length >= 8;
};

/**
 * Prepares the student ID for the game by limiting to 8 digits if necessary
 */
export const prepareStudentId = (id: string): string => {
  return id.length > 8 ? id.slice(0, 8) : id;
};

/**
 * Checks if the current arrangement matches the target sequence
 */
export const checkWinCondition = (currentArray: string[], targetArray: string[]): boolean => {
  if (currentArray.length !== targetArray.length) return false;
  return currentArray.every((num, index) => num === targetArray[index]);
};

/**
 * Returns a digit's position status compared to the target
 */
export type DigitStatus = 'correct' | 'incorrect' | 'default';

export const getDigitStatus = (
  digit: string, 
  index: number, 
  targetArray: string[]
): DigitStatus => {
  if (index >= targetArray.length) return 'default';
  if (digit === targetArray[index]) return 'correct';
  return 'incorrect';
};

/**
 * Count how many digits are in the correct position
 */
export const countCorrectPositions = (currentArray: string[], targetArray: string[]): number => {
  return currentArray.filter((digit, index) => 
    index < targetArray.length && digit === targetArray[index]
  ).length;
};

/**
 * Generate a random power-up
 */
export type PowerUp = 
  | 'reveal' // Reveals one correct position
  | 'shuffle' // Shuffles all numbers
  | 'hint'    // Highlights the next correct move
  | 'swap'    // Allows swapping any two tiles
  | 'freeze'; // Freezes a number in correct position

export const generateRandomPowerUp = (): PowerUp => {
  const powerUps: PowerUp[] = ['reveal', 'shuffle', 'hint', 'swap', 'freeze'];
  const randomIndex = Math.floor(Math.random() * powerUps.length);
  return powerUps[randomIndex];
};

/**
 * Generate an obstacle
 */
export type Obstacle = 
  | 'lock'     // Locks a position for a few turns
  | 'reverse'  // Temporarily reverses the target sequence
  | 'blind'    // Hides numbers for a few seconds
  | 'jumble';  // Randomly swaps positions during a move

export const generateRandomObstacle = (): Obstacle => {
  const obstacles: Obstacle[] = ['lock', 'reverse', 'blind', 'jumble'];
  const randomIndex = Math.floor(Math.random() * obstacles.length);
  return obstacles[randomIndex];
};

/**
 * Calculate score based on moves and time
 */
export const calculateScore = (
  moves: number, 
  timeInSeconds: number, 
  studentIdLength: number
): number => {
  const baseScore = 1000;
  const movesPenalty = moves * 10;
  const timePenalty = timeInSeconds * 2;
  const lengthBonus = studentIdLength * 50;
  
  return Math.max(0, baseScore - movesPenalty - timePenalty + lengthBonus);
};
