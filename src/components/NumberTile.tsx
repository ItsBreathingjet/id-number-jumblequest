
import React from 'react';
import { DigitStatus, getDigitStatus } from '../utils/gameUtils';

interface NumberTileProps {
  digit: string | null; // Updated to allow null for the empty space
  index: number;
  isSelected: boolean;
  isMovable: boolean; // Changed from isLocked to isMovable
  isTarget: boolean;
  targetArray: string[];
  showStatus: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const NumberTile: React.FC<NumberTileProps> = ({
  digit,
  index,
  isSelected,
  isMovable,
  isTarget,
  targetArray,
  showStatus,
  onClick,
  style
}) => {
  const status: DigitStatus = showStatus && digit !== null
    ? getDigitStatus(digit, index, targetArray) 
    : 'default';
  
  return (
    <div
      className={`
        number-tile glass-panel
        ${isSelected ? 'ring-4 ring-blue-500 transform scale-110 z-10' : ''}
        ${digit === null ? 'empty-tile' : 'cursor-pointer'}
        ${status === 'correct' ? 'correct' : ''}
        ${status === 'incorrect' ? 'incorrect' : ''}
        ${isTarget ? 'target' : ''}
        ${!isMovable ? 'cursor-not-allowed opacity-75' : ''}
      `}
      onClick={isMovable ? onClick : undefined}
      style={style}
    >
      {digit}
    </div>
  );
};

export default NumberTile;
