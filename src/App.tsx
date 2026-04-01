import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { SnakeScene } from './game/SnakeScene';
import { Settings } from './components/Settings';
import { Controls } from './components/Controls';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-high-score') || '0');
  });
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 400,
      height: 400,
      physics: {
        default: 'arcade',
      },
      scene: [SnakeScene],
      backgroundColor: '#1a1a1a',
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Custom events from Phaser to React
    const scene = game.scene.getScene('SnakeScene') as SnakeScene;
    
    const handleScoreUpdate = (s: number) => setScore(s);
    const handleGameOver = (finalScore: number) => {
      setGameState('GAMEOVER');
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('snake-high-score', finalScore.toString());
      }
    };

    game.events.on('update-score', handleScoreUpdate);
    game.events.on('game-over', handleGameOver);

    return () => {
      game.destroy(true);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
    const scene = gameRef.current?.scene.getScene('SnakeScene') as SnakeScene;
    if (scene) scene.resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-[400px] flex flex-col gap-4">
        {/* Header/HUD */}
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-widest">Score</span>
            <span className="text-2xl font-bold text-emerald-400">{score}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs text-slate-400 uppercase tracking-widest">
              <Trophy size={12} className="text-yellow-500" />
              <span>Best</span>
            </div>
            <span className="text-2xl font-bold">{highScore}</span>
          </div>
        </div>

        {/* Game Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-black">
          <div id="game-container" className="w-full h-full" />

          {/* Overlays */}
          {gameState === 'IDLE' && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SNAKE</h1>
              <p className="text-slate-400 mb-8">Use arrows or touch buttons to play</p>
              <button
                onClick={startGame}
                className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <Play size={20} fill="currentColor" />
                START GAME
              </button>
            </div>
          )}

          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
              <h2 className="text-4xl font-black text-white mb-2">GAME OVER</h2>
              <p className="text-white/80 mb-6 font-medium">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                <RotateCcw size={20} />
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Controls & Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Controls onDirectionChange={(dir) => {
            const scene = gameRef.current?.scene.getScene('SnakeScene') as SnakeScene;
            if (scene) scene.setDirection(dir);
          }} />
          <Settings />
        </div>
      </div>
      
      <footer className="mt-8 text-slate-500 text-sm">
        Classic Snake Built with Phaser & React
      </footer>
    </div>
  );
};

export default App;