
import React from 'react';
import { PowerUp } from '../utils/gameUtils';

interface GameControlsProps {
  onReset: () => void;
  powerUps: PowerUp[];
  onUsePowerUp: (index: number) => void;
  moves: number;
  time: string;
  correctPositions: number;
  totalPositions: number;
  level: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onReset,
  powerUps,
  onUsePowerUp,
  moves,
  time,
  correctPositions,
  totalPositions,
  level
}) => {
  const getPowerUpIcon = (powerUp: PowerUp): React.ReactNode => {
    switch (powerUp) {
      case 'reveal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
      case 'shuffle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M2 18h1.4c1.3 0 2.5-.5 3.5-1.4l9.2-9.1c1-.9 2.2-1.4 3.5-1.4H22"></path>
            <path d="m18 2 4 4-4 4"></path>
            <path d="M2 6h1.9c1.5 0 2.9.6 4 1.7l7.4 7.4c1 1 2.3 1.5 3.7 1.5H22"></path>
            <path d="m18 14 4 4-4 4"></path>
          </svg>
        );
      case 'hint':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        );
      case 'swap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="m18 16 4-4-4-4"></path>
            <path d="M6 8l-4 4 4 4"></path>
            <path d="M2 12h20"></path>
          </svg>
        );
      case 'freeze':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 2v20"></path>
            <path d="M4 12H2"></path>
            <path d="M10 12H8"></path>
            <path d="M16 12h-2"></path>
            <path d="M22 12h-2"></path>
            <path d="m15 19-3-3-3 3"></path>
            <path d="m15 5-3 3-3-3"></path>
          </svg>
        );
      default:
        return null;
    }
  };
  
  const getPowerUpTooltip = (powerUp: PowerUp): string => {
    switch (powerUp) {
      case 'reveal':
        return 'Reveal a correct position';
      case 'shuffle':
        return 'Shuffle all incorrect positions';
      case 'hint':
        return 'Get a hint for your next move';
      case 'swap':
        return 'Swap any two tiles (not just adjacent)';
      case 'freeze':
        return 'Freeze a correct position';
      default:
        return '';
    }
  };
  
  return (
    <div className="glass-panel rounded-xl p-4 max-w-md mx-auto mt-4">
      <div className="flex justify-between mb-3 text-sm text-gray-600">
        <div>Level: <span className="font-medium text-blue-600">{level}</span></div>
        <div>Moves: <span className="font-medium">{moves}</span></div>
        <div>Time: <span className="font-medium">{time}</span></div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${(correctPositions / totalPositions) * 100}%`,
            transition: 'width 0.5s ease-out' 
          }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {powerUps.map((powerUp, index) => (
            <button
              key={`powerup-${index}`}
              className="relative p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              onClick={() => onUsePowerUp(index)}
              title={getPowerUpTooltip(powerUp)}
            >
              {getPowerUpIcon(powerUp)}
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                {index + 1}
              </span>
            </button>
          ))}
          {powerUps.length === 0 && (
            <div className="text-xs text-gray-500 italic p-2">
              No power-ups available
            </div>
          )}
        </div>
        
        <button
          onClick={onReset}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2"
          title="Reset Game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GameControls;
