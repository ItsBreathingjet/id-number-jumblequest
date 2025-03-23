
import React from 'react';
import { GameDifficulty } from '../hooks/useGameState';

interface GameStatsProps {
  studentId: string;
  moves: number;
  time: string;
  correctPositions: number;
  totalPositions: number;
  difficulty: GameDifficulty;
  level: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  studentId,
  moves,
  time,
  correctPositions,
  totalPositions,
  difficulty,
  level
}) => {
  const getDifficultyColor = (difficulty: GameDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
    }
  };
  
  const getDifficultyText = (difficulty: GameDifficulty) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
    }
  };
  
  return (
    <div className="glass-panel rounded-xl p-4 max-w-md mx-auto mt-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <div className="text-xs text-gray-500">Student ID</div>
          <div className="font-medium">{studentId}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500">Level</div>
          <div className="font-medium">{level}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500">Difficulty</div>
          <div className={`text-xs font-medium inline-block px-2 py-0.5 rounded-full ${getDifficultyColor(difficulty)}`}>
            {getDifficultyText(difficulty)}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500">Progress</div>
          <div className="font-medium">{correctPositions}/{totalPositions}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500">Moves</div>
          <div className="font-medium">{moves}</div>
        </div>
        
        <div>
          <div className="text-xs text-gray-500">Time</div>
          <div className="font-medium">{time}</div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
