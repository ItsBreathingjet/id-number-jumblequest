
import React from 'react';
import { DigitStatus, getDigitStatus } from '../utils/gameUtils';

interface NumberTileProps {
  digit: string;
  index: number;
  isSelected: boolean;
  isLocked: boolean;
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
  isLocked,
  isTarget,
  targetArray,
  showStatus,
  onClick,
  style
}) => {
  const status: DigitStatus = showStatus 
    ? getDigitStatus(digit, index, targetArray) 
    : 'default';
  
  return (
    <div
      className={`
        number-tile glass-panel w-16 h-16 rounded-xl cursor-pointer m-1
        ${isSelected ? 'ring-4 ring-blue-500 transform scale-110 z-10' : ''}
        ${isLocked ? 'ring-2 ring-yellow-500' : ''}
        ${status === 'correct' ? 'correct' : ''}
        ${status === 'incorrect' ? 'incorrect' : ''}
        ${isTarget ? 'target' : ''}
        ${isLocked ? 'cursor-not-allowed' : ''}
      `}
      onClick={onClick}
      style={style}
    >
      {digit}
      {isLocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-3 h-3 text-white"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default NumberTile;
