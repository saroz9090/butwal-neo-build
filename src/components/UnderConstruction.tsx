// src/components/UnderConstruction.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Construction, 
  Hammer, 
  Wrench, 
  HardHat, 
  Clock, 
  Mail, 
  Home,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Calendar
} from 'lucide-react';

const UnderConstruction = () => {
  // Set your project dates here
  const startDate = new Date('2025-11-5'); // Project start date
  const endDate = new Date('2025-12-15');   // Project completion date
  const currentDate = new Date();           // Current date
  
  // Calculate progress based on dates
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = currentDate.getTime() - startDate.getTime();
  const initialProgress = Math.min(95, Math.max(5, (elapsedDuration / totalDuration) * 100));
  const daysLeft = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  const [progress, setProgress] = useState(initialProgress);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState(0);
  
  // Snake game state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState<'RIGHT' | 'LEFT' | 'UP' | 'DOWN'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate food function
  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    setFood(newFood);
  }, []);

  // Move snake function
  const moveSnake = useCallback(() => {
    if (!gameStarted || gamePaused || gameOver) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (direction) {
        case 'RIGHT':
          head.x += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameStarted, gamePaused, gameOver, direction, food, generateFood]);

  // Initialize game
  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gamePaused, gameOver, moveSnake]);

  // Handle keyboard controls - PREVENT DEFAULT BEHAVIOR
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gamePaused || gameOver) return;

      // Prevent default behavior for arrow keys to stop page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ': // Space bar for pause
          setGamePaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gamePaused, gameOver, direction]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#3b82f6' : '#60a5fa';
      ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
      ctx.strokeStyle = '#1d4ed8';
      ctx.strokeRect(segment.x * 20, segment.y * 20, 18, 18);
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.stroke();

    // Draw score
    if (gameStarted) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${score}`, 10, 20);
    }
  }, [snake, food, gameStarted, score]);

  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    generateFood([{ x: 10, y: 10 }]);
  };

  const resetGame = () => {
    startGame();
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
  };

  // Update progress in real-time based on actual dates
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const newElapsed = now.getTime() - startDate.getTime();
      const newProgress = Math.min(95, Math.max(5, (newElapsed / totalDuration) * 100));
      setProgress(newProgress);
    };

    // Update every hour for more accurate progress
    const timer = setInterval(updateProgress, 60 * 60 * 1000);
    
    // Initial update
    updateProgress();

    return () => clearInterval(timer);
  }, [totalDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Construction className="w-16 h-16 text-blue-600" />
              <HardHat className="w-8 h-8 text-blue-700 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Under Construction
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We're working hard to bring you an amazing experience. 
            While you wait, enjoy a game of Snake!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Hammer className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Construction Progress</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Completion</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-blue-100" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Started:</span>
                      </div>
                      <div className="text-blue-600 font-semibold">
                        {formatDate(startDate)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Est. Completion:</span>
                      </div>
                      <div className="text-green-600 font-semibold">
                        {formatDate(endDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Time remaining: {daysLeft > 0 ? `${daysLeft} days` : 'Any day now!'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wrench className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">What's Coming</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Amazing new floor planning features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Enhanced 3D visualization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Real-time collaboration tools
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Professional export capabilities
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Get Notified</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    We'll let you know when we're ready. Leave your email and be the first to access!
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Notify Me
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column - Game */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">Play Snake</h3>
                  <div className="flex items-center gap-2">
                    {!gameStarted ? (
                      <Button onClick={startGame} className="bg-green-600 hover:bg-green-700 text-white">
                        <Play className="w-4 h-4 mr-2" />
                        Start Game
                      </Button>
                    ) : (
                      <>
                        <Button onClick={togglePause} variant="outline" className="border-blue-300">
                          {gamePaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </Button>
                        <Button onClick={resetGame} variant="outline" className="border-blue-300">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Game Canvas */}
                <div className="border-2 border-blue-300 rounded-lg bg-blue-50 p-4">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="w-full h-auto max-w-full border border-blue-200 rounded bg-slate-900 mx-auto block"
                    onClick={() => canvasRef.current?.focus()} // Focus on click
                    tabIndex={0} // Make it focusable
                  />
                  
                  {!gameStarted && (
                    <div className="text-center mt-4 p-4 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 font-semibold mb-2">How to Play:</p>
                      <p className="text-blue-700 text-sm">
                        Click on the game area, then use arrow keys to control the snake. 
                        Eat the red food to grow and earn points!
                      </p>
                    </div>
                  )}

                  {gameOver && (
                    <div className="text-center mt-4 p-4 bg-red-100 rounded-lg">
                      <p className="text-red-800 font-semibold mb-2">Game Over!</p>
                      <p className="text-red-700">Final Score: {score}</p>
                      <Button onClick={resetGame} className="mt-2 bg-red-600 hover:bg-red-700 text-white">
                        Play Again
                      </Button>
                    </div>
                  )}

                  {gamePaused && (
                    <div className="text-center mt-4 p-4 bg-blue-100 rounded-lg">
                      <p className="text-blue-800 font-semibold">Game Paused</p>
                      <p className="text-blue-700 text-sm">Press play to continue</p>
                    </div>
                  )}
                </div>

                {/* Game Stats */}
                {(gameStarted || gameOver) && (
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">Score</p>
                      <p className="text-xl font-bold text-blue-900">{score}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">Length</p>
                      <p className="text-xl font-bold text-blue-900">{snake.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">Status</p>
                      <p className="text-xl font-bold text-blue-900">
                        {gameOver ? 'Game Over' : gamePaused ? 'Paused' : 'Playing'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Instructions */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Controls</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">↑</div>
                    <span>Move Up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">↓</div>
                    <span>Move Down</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">←</div>
                    <span>Move Left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">→</div>
                    <span>Move Right</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 text-sm font-semibold">Important:</p>
                  <p className="text-amber-700 text-xs">
                    • Click the game area first to focus controls<br/>
                    • Arrow keys won't scroll the page during game<br/>
                    • Press SPACE to pause/resume the game
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-blue-200">
          <p className="text-gray-600">
            Thank you for your patience! We're building something special for you.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Construction className="w-4 h-4" />
              <span>Under Active Development</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Real-time Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;