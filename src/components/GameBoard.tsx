
import React, { useState, useEffect } from 'react';
import NumberTile from './NumberTile';
import { PowerUp, Obstacle } from '../utils/gameUtils';
import { toast } from 'sonner';

interface GameBoardProps {
  currentSequence: (string | null)[]; // Updated to allow null for empty space
  targetSequence: string[];
  onMove: (fromIndex: number, toIndex: number) => void;
  emptySpaceIndex: number; // Added to track the empty space
  activePowerUp: PowerUp | null;
  activeObstacle: Obstacle | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentSequence,
  targetSequence,
  onMove,
  emptySpaceIndex,
  activePowerUp,
  activeObstacle
}) => {
  const [showNumbers, setShowNumbers] = useState(true);
  
  // Handle the blind obstacle
  useEffect(() => {
    if (activeObstacle === 'blind') {
      setShowNumbers(false);
      
      const timeout = setTimeout(() => {
        setShowNumbers(true);
      }, 5000);
      
      return () => clearTimeout(timeout);
    } else {
      setShowNumbers(true);
    }
  }, [activeObstacle]);
  
  // Handle reverse obstacle (just for display)
  const displayTargetSequence = activeObstacle === 'reverse' 
    ? [...targetSequence].reverse() 
    : targetSequence;
  
  // Function to check if a tile is movable (adjacent to empty space)
  const isMovable = (index: number): boolean => {
    if (index === emptySpaceIndex) return false;
    
    const gridSize = 3; // 3x3 grid
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptySpaceIndex / gridSize);
    const emptyCol = emptySpaceIndex % gridSize;
    
    // A tile is movable if it's in the same row or column as the empty space
    // and adjacent to it (no diagonal moves)
    const sameRow = row === emptyRow;
    const sameCol = col === emptyCol;
    
    if (sameRow) {
      return Math.abs(col - emptyCol) === 1;
    }
    
    if (sameCol) {
      return Math.abs(row - emptyRow) === 1;
    }
    
    return false;
  };
  
  const handleTileClick = (index: number) => {
    if (isMovable(index)) {
      onMove(index, emptySpaceIndex);
    } else if (index !== emptySpaceIndex) {
      toast.error("You can only move tiles adjacent to the empty space");
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Target Sequence:</p>
        <div className="flex items-center justify-center glass-panel rounded-xl p-2">
          {displayTargetSequence.map((digit, index) => (
            <div
              key={`target-${index}`}
              className="flex items-center justify-center w-8 h-8 rounded-lg target m-1 font-medium"
            >
              {digit}
            </div>
          ))}
          {activeObstacle === 'reverse' && (
            <div className="absolute -right-4 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
              REVERSED
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-panel rounded-xl p-4">
        <div 
          className="grid grid-cols-3 gap-0 justify-center" // No gap for a true sliding puzzle look
        >
          {currentSequence.map((digit, index) => (
            <NumberTile
              key={`tile-${index}`}
              digit={showNumbers ? digit : digit === null ? null : '?'}
              index={index}
              isSelected={false}
              isMovable={isMovable(index)}
              isTarget={false}
              targetArray={targetSequence}
              showStatus={true}
              onClick={() => handleTileClick(index)}
              style={{ 
                opacity: showNumbers ? 1 : 0.7,
                width: '3.5rem', // Compact size
                height: '3.5rem', // Compact size
                margin: '0.125rem' // Tiny margin for separation
              }}
            />
          ))}
        </div>
        
        {activePowerUp === 'swap' && (
          <div className="mt-3 text-sm text-blue-600 font-medium text-center rounded-lg bg-blue-50 py-1">
            Swap Power-Up Active: Click any tile to swap with another
          </div>
        )}
        
        {activeObstacle === 'blind' && !showNumbers && (
          <div className="mt-3 text-sm text-red-600 font-medium text-center rounded-lg bg-red-50 py-1">
            Blind Obstacle Active: Numbers hidden for a few seconds
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
