
import React, { useEffect } from 'react';
import StudentIdForm from '../components/StudentIdForm';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import WinScreen from '../components/WinScreen';
import GameStats from '../components/GameStats';
import { useGameState } from '../hooks/useGameState';
import { toast } from 'sonner';

const Index = () => {
  const gameState = useGameState();
  
  useEffect(() => {
    // Display toast explaining roguelike elements when game starts
    if (gameState.status === 'playing' && gameState.moves === 0) {
      toast.info(
        "This is a roguelike number puzzle! Watch out for obstacles and collect power-ups as you play. Each level gets progressively harder!",
        { duration: 5000 }
      );
    }
  }, [gameState.status, gameState.moves]);
  
  // Find the empty space index in the current sequence
  const emptySpaceIndex = gameState.currentSequence.findIndex(item => item === null);
  
  // Tutorial content
  const renderTutorial = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto animate-scale-in overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold mb-4">How to Play</h2>
        
        <div className="space-y-4 text-left">
          <p>
            <span className="font-medium">Goal:</span> Arrange the numbers to match your Student ID sequence.
          </p>
          
          <div>
            <h3 className="font-medium text-lg">Game Rules:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enter your Student ID to start the game.</li>
              <li>The game takes the first 8 digits of your ID.</li>
              <li>The numbers will be randomly shuffled.</li>
              <li>Drag and drop tiles to arrange them in the correct order.</li>
              <li>You can only swap adjacent tiles (up, down, left, right).</li>
              <li>The target sequence is displayed at the top.</li>
              <li>Correctly positioned numbers will turn blue.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Roguelike Elements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>As you progress, the game gets harder.</li>
              <li>You can collect and use power-ups to help you.</li>
              <li>Beware of obstacles that make the game more challenging.</li>
              <li>Each level adds more complexity.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Power-Ups:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Reveal:</span> Shows the correct position for one number.</li>
              <li><span className="font-medium">Shuffle:</span> Reshuffles all incorrect positions.</li>
              <li><span className="font-medium">Hint:</span> Highlights a beneficial move.</li>
              <li><span className="font-medium">Swap:</span> Allows swapping any two tiles (not just adjacent).</li>
              <li><span className="font-medium">Freeze:</span> Locks a correct position in place.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Obstacles:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="font-medium">Lock:</span> Some positions become locked temporarily.</li>
              <li><span className="font-medium">Reverse:</span> The target sequence is temporarily reversed.</li>
              <li><span className="font-medium">Blind:</span> Numbers are hidden for a few seconds.</li>
              <li><span className="font-medium">Jumble:</span> Making a move may cause additional tiles to swap.</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={gameState.hideTutorial}
          className="game-button mt-6 bg-blue-600 hover:bg-blue-700 w-full"
        >
          Got it!
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Digit Dash Dungeon</h1>
          <p className="text-gray-600">
            {gameState.status === 'idle' 
              ? 'A roguelike puzzle adventure with your Student ID' 
              : `Arrange the digits to match your Student ID: ${gameState.studentId}`}
          </p>
        </header>
        
        <div className="space-y-4">
          {gameState.status === 'idle' && (
            <StudentIdForm 
              onSubmit={gameState.startGame} 
              onShowTutorial={gameState.showTutorial} 
            />
          )}
          
          {(gameState.status === 'playing' || gameState.status === 'won') && (
            <>
              {gameState.status === 'playing' && (
                <GameBoard
                  currentSequence={gameState.currentSequence}
                  targetSequence={gameState.targetSequence}
                  onMove={gameState.moveTile}
                  emptySpaceIndex={emptySpaceIndex}
                  activePowerUp={gameState.activePowerUp}
                  activeObstacle={gameState.activeObstacle}
                />
              )}
              
              {gameState.status === 'playing' && (
                <>
                  <GameControls
                    onReset={gameState.resetGame}
                    powerUps={gameState.powerUps}
                    onUsePowerUp={gameState.usePowerUp}
                    moves={gameState.moves}
                    time={gameState.formatTime(gameState.elapsedTime)}
                    correctPositions={gameState.correctPositions}
                    totalPositions={gameState.totalPositions}
                    level={gameState.level}
                  />
                  
                  <GameStats
                    studentId={gameState.studentId}
                    moves={gameState.moves}
                    time={gameState.formatTime(gameState.elapsedTime)}
                    correctPositions={gameState.correctPositions}
                    totalPositions={gameState.totalPositions}
                    difficulty={gameState.difficulty}
                    level={gameState.level}
                  />
                </>
              )}
              
              {gameState.status === 'won' && (
                <WinScreen
                  score={gameState.score}
                  moves={gameState.moves}
                  time={gameState.formatTime(gameState.elapsedTime)}
                  level={gameState.level}
                  onNextLevel={gameState.nextLevel}
                  onReset={gameState.resetGame}
                />
              )}
            </>
          )}
        </div>
        
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>
            Enter your Student ID and arrange the numbers to win. Power-ups and obstacles add an exciting twist!
          </p>
          {gameState.status !== 'idle' && (
            <button
              onClick={gameState.showTutorial}
              className="text-blue-500 hover:text-blue-700 underline mt-2"
            >
              Need help?
            </button>
          )}
        </footer>
      </div>
      
      {gameState.status === 'tutorial' && renderTutorial()}
    </div>
  );
};

export default Index;
