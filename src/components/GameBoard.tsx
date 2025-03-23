
import React, { useState, useEffect } from 'react';
import NumberTile from './NumberTile';
import { PowerUp, Obstacle } from '../utils/gameUtils';
import { toast } from 'sonner';

interface GameBoardProps {
  currentSequence: string[];
  targetSequence: string[];
  onMove: (fromIndex: number, toIndex: number) => void;
  lockedPositions: number[];
  activePowerUp: PowerUp | null;
  activeObstacle: Obstacle | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentSequence,
  targetSequence,
  onMove,
  lockedPositions,
  activePowerUp,
  activeObstacle
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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
  
  const handleDragStart = (index: number) => {
    // If position is locked, don't allow dragging
    if (lockedPositions.includes(index) && activePowerUp !== 'swap') {
      return;
    }
    
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };
  
  const handleDragEnter = (index: number) => {
    // Visual feedback could be added here
  };
  
  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    if (draggedIndex === index) return;
    
    // If we're using the 'swap' power-up, allow swapping any two tiles
    if (activePowerUp === 'swap') {
      onMove(draggedIndex, index);
      setDraggedIndex(null);
      toast.success('Tiles swapped successfully!');
      return;
    }
    
    // Only allow swapping adjacent tiles
    const isAdjacent = Math.abs(draggedIndex - index) === 1 || 
                       Math.abs(draggedIndex - index) === Math.floor(Math.sqrt(currentSequence.length));
    
    if (isAdjacent) {
      onMove(draggedIndex, index);
    } else {
      toast.error('You can only swap adjacent tiles (unless using a swap power-up)');
    }
    
    setDraggedIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  
  // Calculate grid dimensions
  const gridCols = Math.ceil(Math.sqrt(currentSequence.length));
  
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
          className="grid gap-2 justify-center"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          }}
        >
          {currentSequence.map((digit, index) => (
            <NumberTile
              key={`tile-${index}`}
              digit={showNumbers ? digit : '?'}
              index={index}
              isSelected={draggedIndex === index}
              isLocked={lockedPositions.includes(index)}
              isTarget={false}
              targetArray={targetSequence}
              showStatus={true}
              onClick={() => {}} // We're using drag now, so empty function
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              style={{ 
                opacity: showNumbers ? 1 : 0.7,
                animationDelay: `${index * 0.05}s`,
                width: '3.5rem',
                height: '3.5rem'
              }}
            />
          ))}
        </div>
        
        {activePowerUp === 'swap' && (
          <div className="mt-3 text-sm text-blue-600 font-medium text-center rounded-lg bg-blue-50 py-1">
            Swap Power-Up Active: Drag any tile to swap with another
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
