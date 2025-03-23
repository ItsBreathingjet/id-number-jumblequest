
import React, { useState } from 'react';
import { validateStudentId } from '../utils/gameUtils';
import { toast } from 'sonner';

interface StudentIdFormProps {
  onSubmit: (studentId: string) => void;
  onShowTutorial: () => void;
}

const StudentIdForm: React.FC<StudentIdFormProps> = ({ onSubmit, onShowTutorial }) => {
  const [studentId, setStudentId] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStudentId(studentId)) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
      toast.error('Please enter a valid Student ID (at least 8 digits)');
      return;
    }
    
    onSubmit(studentId);
  };
  
  return (
    <div className="glass-panel rounded-2xl p-8 w-full max-w-md mx-auto animate-scale-in">
      <h2 className="text-3xl font-bold mb-2">Student ID Puzzle</h2>
      <p className="text-gray-600 mb-6">Enter your Student ID to start the game</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g. 12345678"
            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              isAnimating ? 'animate-shake border-red-500' : 'border-gray-300'
            }`}
            maxLength={12}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 digits. Only the first 8 digits will be used in the game.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            className="game-button flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Start Game
          </button>
          
          <button
            type="button"
            onClick={onShowTutorial}
            className="game-button flex-1 bg-gray-600 hover:bg-gray-700"
          >
            How to Play
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentIdForm;
