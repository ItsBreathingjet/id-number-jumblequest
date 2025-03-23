
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  shuffleArray, 
  prepareStudentId, 
  checkWinCondition, 
  countCorrectPositions,
  PowerUp,
  Obstacle,
  generateRandomPowerUp,
  generateRandomObstacle,
  calculateScore
} from '../utils/gameUtils';
import { toast } from 'sonner';

export type GameStatus = 'idle' | 'playing' | 'won' | 'tutorial';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  studentId: string;
  targetSequence: string[];
  currentSequence: string[];
  status: GameStatus;
  moves: number;
  startTime: number | null;
  elapsedTime: number;
  score: number;
  powerUps: PowerUp[];
  activePowerUp: PowerUp | null;
  activeObstacle: Obstacle | null;
  obstacleEndTime: number | null;
  lockedPositions: number[];
  correctPositions: number;
  totalPositions: number;
  difficulty: GameDifficulty;
  streak: number;
  level: number;
}

export const useGameState = () => {
  const [state, setState] = useState<GameState>({
    studentId: '',
    targetSequence: [],
    currentSequence: [],
    status: 'idle',
    moves: 0,
    startTime: null,
    elapsedTime: 0,
    score: 0,
    powerUps: [],
    activePowerUp: null,
    activeObstacle: null,
    obstacleEndTime: null,
    lockedPositions: [],
    correctPositions: 0,
    totalPositions: 0,
    difficulty: 'easy',
    streak: 0,
    level: 1
  });
  
  const timerRef = useRef<number | null>(null);
  
  // Start a new game with the given student ID
  const startGame = useCallback((studentId: string, difficulty: GameDifficulty = 'easy') => {
    const preparedId = prepareStudentId(studentId);
    const targetSequence = preparedId.split('');
    const shuffledSequence = shuffleArray([...targetSequence]);
    
    // Make sure it's not already solved
    while (checkWinCondition(shuffledSequence, targetSequence)) {
      shuffleArray(shuffledSequence);
    }
    
    // Generate initial power-ups based on difficulty
    const initialPowerUps: PowerUp[] = [];
    const powerUpCount = difficulty === 'easy' ? 2 : (difficulty === 'medium' ? 1 : 0);
    
    for (let i = 0; i < powerUpCount; i++) {
      initialPowerUps.push(generateRandomPowerUp());
    }
    
    setState({
      studentId,
      targetSequence,
      currentSequence: shuffledSequence,
      status: 'playing',
      moves: 0,
      startTime: Date.now(),
      elapsedTime: 0,
      score: 0,
      powerUps: initialPowerUps,
      activePowerUp: null,
      activeObstacle: null,
      obstacleEndTime: null,
      lockedPositions: [],
      correctPositions: countCorrectPositions(shuffledSequence, targetSequence),
      totalPositions: targetSequence.length,
      difficulty,
      streak: 0,
      level: 1
    });
    
    toast.success('Game started! Arrange the numbers to match your Student ID.');
  }, []);
  
  // Update the timer
  useEffect(() => {
    if (state.status === 'playing' && state.startTime) {
      timerRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || 0)) / 1000)
        }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.status, state.startTime]);
  
  // Move a tile from one position to another
  const moveTile = useCallback((fromIndex: number, toIndex: number) => {
    if (state.status !== 'playing') return;
    
    // Check if positions are locked
    if (state.lockedPositions.includes(fromIndex) || state.lockedPositions.includes(toIndex)) {
      toast.error('This position is locked!');
      return;
    }
    
    setState(prev => {
      const newSequence = [...prev.currentSequence];
      
      // Apply the jumble obstacle (randomly swap another pair)
      if (prev.activeObstacle === 'jumble' && Math.random() > 0.5) {
        const availableIndices = newSequence.map((_, i) => i)
          .filter(i => !prev.lockedPositions.includes(i) && i !== fromIndex && i !== toIndex);
        
        if (availableIndices.length >= 2) {
          const idx1 = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          availableIndices.splice(availableIndices.indexOf(idx1), 1);
          const idx2 = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          
          [newSequence[idx1], newSequence[idx2]] = [newSequence[idx2], newSequence[idx1]];
          toast.info('Jumble obstacle: Two additional tiles were swapped!');
        }
      }
      
      // Swap the tiles
      [newSequence[fromIndex], newSequence[toIndex]] = [newSequence[toIndex], newSequence[fromIndex]];
      
      // Check if won
      const isWon = checkWinCondition(newSequence, prev.targetSequence);
      const correctPositions = countCorrectPositions(newSequence, prev.targetSequence);
      
      // Calculate new score if won
      const score = isWon 
        ? calculateScore(prev.moves + 1, prev.elapsedTime, prev.targetSequence.length)
        : prev.score;
        
      // Determine if we should generate a power-up (10% chance on each move)
      const shouldGeneratePowerUp = Math.random() < 0.1 && prev.powerUps.length < 3;
      
      // Determine if we should generate an obstacle (based on difficulty)
      const obstacleProbability = 
        prev.difficulty === 'easy' ? 0.05 : 
        prev.difficulty === 'medium' ? 0.1 : 0.15;
      
      const shouldGenerateObstacle = 
        Math.random() < obstacleProbability && 
        !prev.activeObstacle && 
        prev.moves > 2;
      
      // Generate new power-up if needed
      const newPowerUps = [...prev.powerUps];
      if (shouldGeneratePowerUp) {
        newPowerUps.push(generateRandomPowerUp());
        toast.success('You got a new power-up!');
      }
      
      // Generate new obstacle if needed
      let newObstacle = prev.activeObstacle;
      let newObstacleEndTime = prev.obstacleEndTime;
      
      if (shouldGenerateObstacle) {
        newObstacle = generateRandomObstacle();
        newObstacleEndTime = Date.now() + 20000; // 20 seconds
        
        // Display toast based on obstacle type
        switch (newObstacle) {
          case 'lock':
            toast.error('Obstacle: Some positions will be locked for 20 seconds!');
            break;
          case 'reverse':
            toast.error('Obstacle: Target sequence reversed for 20 seconds!');
            break;
          case 'blind':
            toast.error('Obstacle: Numbers will be hidden for 20 seconds!');
            break;
          case 'jumble':
            toast.error('Obstacle: Your moves might cause jumbles for 20 seconds!');
            break;
        }
      }
      
      // Apply the lock obstacle if active
      let newLockedPositions = [...prev.lockedPositions];
      if (newObstacle === 'lock' && prev.lockedPositions.length === 0) {
        // Lock 2-3 random positions
        const lockCount = Math.floor(Math.random() * 2) + 2;
        const availablePositions = Array.from(
          { length: newSequence.length }, 
          (_, i) => i
        ).filter(pos => !newLockedPositions.includes(pos));
        
        for (let i = 0; i < Math.min(lockCount, availablePositions.length); i++) {
          const randomIndex = Math.floor(Math.random() * availablePositions.length);
          const posToLock = availablePositions[randomIndex];
          newLockedPositions.push(posToLock);
          availablePositions.splice(randomIndex, 1);
        }
      }
      
      // Check if obstacle has expired
      if (prev.obstacleEndTime && Date.now() > prev.obstacleEndTime) {
        newObstacle = null;
        newObstacleEndTime = null;
        newLockedPositions = [];
        
        if (prev.activeObstacle) {
          toast.success('Obstacle has expired!');
        }
      }
      
      return {
        ...prev,
        currentSequence: newSequence,
        moves: prev.moves + 1,
        status: isWon ? 'won' : 'playing',
        score: isWon ? score : prev.score,
        correctPositions,
        powerUps: newPowerUps,
        activeObstacle: newObstacle,
        obstacleEndTime: newObstacleEndTime,
        lockedPositions: newLockedPositions,
        streak: isWon ? prev.streak + 1 : prev.streak,
        level: isWon ? prev.level + 1 : prev.level
      };
    });
  }, [state.status, state.lockedPositions, state.activeObstacle]);
  
  // Use a power-up
  const usePowerUp = useCallback((index: number) => {
    if (state.status !== 'playing' || index >= state.powerUps.length) return;
    
    const powerUp = state.powerUps[index];
    const newPowerUps = [...state.powerUps];
    newPowerUps.splice(index, 1);
    
    setState(prev => ({
      ...prev,
      powerUps: newPowerUps,
      activePowerUp: powerUp
    }));
    
    switch (powerUp) {
      case 'reveal': {
        // Find a position that's incorrect and reveal it
        const incorrectPositions = state.currentSequence.map((num, idx) => ({
          value: num,
          index: idx,
          isCorrect: num === state.targetSequence[idx]
        })).filter(pos => !pos.isCorrect);
        
        if (incorrectPositions.length > 0) {
          const posToReveal = incorrectPositions[Math.floor(Math.random() * incorrectPositions.length)];
          const correctValue = state.targetSequence[posToReveal.index];
          
          // Find where the correct value currently is
          const correctValueCurrentIndex = state.currentSequence.findIndex(val => val === correctValue);
          
          // Swap to put it in the right place
          if (correctValueCurrentIndex !== -1) {
            moveTile(correctValueCurrentIndex, posToReveal.index);
            toast.success(`Revealed correct position for ${correctValue}!`);
          }
        } else {
          toast.info('All positions are already correct!');
        }
        break;
      }
      
      case 'shuffle': {
        // Shuffle all numbers except those in correct positions
        setState(prev => {
          const correctIndices = prev.currentSequence.map((num, idx) => 
            num === prev.targetSequence[idx] ? idx : -1
          ).filter(idx => idx !== -1);
          
          const toShuffleIndices = prev.currentSequence.map((_, idx) => idx)
            .filter(idx => !correctIndices.includes(idx));
          
          const toShuffleValues = toShuffleIndices.map(idx => prev.currentSequence[idx]);
          const shuffledValues = shuffleArray([...toShuffleValues]);
          
          const newSequence = [...prev.currentSequence];
          toShuffleIndices.forEach((idx, i) => {
            newSequence[idx] = shuffledValues[i];
          });
          
          return {
            ...prev,
            currentSequence: newSequence,
            correctPositions: countCorrectPositions(newSequence, prev.targetSequence),
            activePowerUp: null
          };
        });
        toast.success('Shuffled all incorrect positions!');
        break;
      }
      
      case 'hint': {
        // Find one move that would increase correct positions
        setState(prev => {
          const currentCorrect = countCorrectPositions(prev.currentSequence, prev.targetSequence);
          let bestMove = { from: -1, to: -1, improvement: 0 };
          
          for (let i = 0; i < prev.currentSequence.length; i++) {
            for (let j = 0; j < prev.currentSequence.length; j++) {
              if (i === j) continue;
              
              // Try this swap
              const testSequence = [...prev.currentSequence];
              [testSequence[i], testSequence[j]] = [testSequence[j], testSequence[i]];
              
              const newCorrect = countCorrectPositions(testSequence, prev.targetSequence);
              const improvement = newCorrect - currentCorrect;
              
              if (improvement > bestMove.improvement) {
                bestMove = { from: i, to: j, improvement };
              }
            }
          }
          
          return {
            ...prev,
            activePowerUp: null
          };
        });
        
        if (state.activePowerUp === 'hint') {
          toast.success('Hint: Look for a number that belongs in a different position!');
        }
        break;
      }
      
      case 'swap': {
        // Allow swapping any two tiles (handled in UI)
        toast.info('Select two tiles to swap them (any positions)');
        break;
      }
      
      case 'freeze': {
        // Freeze a number in its correct position
        const correctPositions = state.currentSequence.map((num, idx) => ({
          value: num,
          index: idx,
          isCorrect: num === state.targetSequence[idx]
        })).filter(pos => pos.isCorrect);
        
        if (correctPositions.length > 0) {
          const posToFreeze = correctPositions[Math.floor(Math.random() * correctPositions.length)];
          
          setState(prev => ({
            ...prev,
            lockedPositions: [...prev.lockedPositions, posToFreeze.index],
            activePowerUp: null
          }));
          
          toast.success(`Frozen position ${posToFreeze.index + 1} with digit ${posToFreeze.value}!`);
        } else {
          toast.info('No correct positions to freeze yet!');
        }
        break;
      }
    }
  }, [state, moveTile]);
  
  // Reset to a new level after winning
  const nextLevel = useCallback(() => {
    if (state.status !== 'won') return;
    
    // If we still have the same student ID, start a new round with increased difficulty
    const currentDifficulty = state.difficulty;
    let newDifficulty: GameDifficulty = currentDifficulty;
    
    // Increase difficulty every 3 levels
    if (state.level % 3 === 0) {
      if (currentDifficulty === 'easy') {
        newDifficulty = 'medium';
      } else if (currentDifficulty === 'medium') {
        newDifficulty = 'hard';
      }
    }
    
    startGame(state.studentId, newDifficulty);
    toast.success(`Starting level ${state.level + 1}!`);
  }, [state.status, state.studentId, state.difficulty, state.level, startGame]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    setState({
      studentId: '',
      targetSequence: [],
      currentSequence: [],
      status: 'idle',
      moves: 0,
      startTime: null,
      elapsedTime: 0,
      score: 0,
      powerUps: [],
      activePowerUp: null,
      activeObstacle: null,
      obstacleEndTime: null,
      lockedPositions: [],
      correctPositions: 0,
      totalPositions: 0,
      difficulty: 'easy',
      streak: 0,
      level: 1
    });
  }, []);
  
  // Show the tutorial
  const showTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'tutorial'
    }));
  }, []);
  
  // Hide the tutorial
  const hideTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: prev.targetSequence.length > 0 ? 'playing' : 'idle'
    }));
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return {
    ...state,
    startGame,
    moveTile,
    usePowerUp,
    nextLevel,
    resetGame,
    showTutorial,
    hideTutorial,
    formatTime
  };
};
