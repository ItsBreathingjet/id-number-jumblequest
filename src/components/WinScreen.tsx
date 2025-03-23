
import React, { useEffect, useState } from 'react';

interface WinScreenProps {
  score: number;
  moves: number;
  time: string;
  level: number;
  onNextLevel: () => void;
  onReset: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({
  score,
  moves,
  time,
  level,
  onNextLevel,
  onReset
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto animate-scale-in">
        <h2 className="text-4xl font-bold gradient-text mb-4">Victory!</h2>
        
        <div className="mb-6 text-center">
          <p className="text-lg mb-4">
            You successfully arranged the numbers to match your Student ID!
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left mb-4">
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Level</div>
              <div className="text-2xl font-bold">{level}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Moves</div>
              <div className="text-lg font-medium">{moves}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-lg font-medium">{time}</div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onNextLevel}
            className="game-button flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Next Level
          </button>
          
          <button
            onClick={onReset}
            className="game-button flex-1 bg-gray-600 hover:bg-gray-700"
          >
            New Game
          </button>
        </div>
      </div>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                backgroundColor: ['#ff3e7f', '#0ea5e9', '#22c55e', '#eab308', '#8b5cf6'][
                  Math.floor(Math.random() * 5)
                ],
                left: `${Math.random() * 100}%`,
                top: -10,
                animationDuration: `${Math.random() * 2 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WinScreen;
