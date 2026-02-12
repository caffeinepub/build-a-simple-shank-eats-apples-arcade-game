import { useState, useEffect, useCallback, useRef } from 'react';
import { LEVELS, getLevelConfig, isObstacle } from './levels';
import { loadShankSkin, loadAppleSkin, saveShankSkin, saveAppleSkin, getShankSprite, getAppleSprite } from './skins';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'LEVEL_COMPLETE';

export interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 80;

const BEST_SCORE_KEY = 'shank-game-best-score';

export function useShankGame() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [applesEaten, setApplesEaten] = useState(0);
  const [shankBody, setShankBody] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [apple, setApple] = useState<Position>({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [shankSkin, setShankSkinState] = useState(() => loadShankSkin());
  const [appleSkin, setAppleSkinState] = useState(() => loadAppleSkin());

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const levelConfig = getLevelConfig(currentLevel);

  const setShankSkin = useCallback((skinId: string) => {
    setShankSkinState(skinId);
    saveShankSkin(skinId);
  }, []);

  const setAppleSkin = useCallback((skinId: string) => {
    setAppleSkinState(skinId);
    saveAppleSkin(skinId);
  }, []);

  const spawnApple = useCallback((body: Position[], obstacles: Position[]) => {
    const availablePositions: Position[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const isOccupiedByBody = body.some(segment => segment.x === x && segment.y === y);
        const isOccupiedByObstacle = isObstacle(x, y, obstacles);
        if (!isOccupiedByBody && !isOccupiedByObstacle) {
          availablePositions.push({ x, y });
        }
      }
    }
    if (availablePositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length);
      return availablePositions[randomIndex];
    }
    return { x: 15, y: 10 };
  }, []);

  const checkCollision = useCallback((head: Position, body: Position[], obstacles: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Obstacle collision
    if (isObstacle(head.x, head.y, obstacles)) {
      return true;
    }
    // Self collision (skip head)
    for (let i = 1; i < body.length; i++) {
      if (body[i].x === head.x && body[i].y === head.y) {
        return true;
      }
    }
    return false;
  }, []);

  const moveShank = useCallback(() => {
    setShankBody(prevBody => {
      const head = prevBody[0];
      let newHead: Position;

      switch (nextDirection) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      // Check collision
      if (checkCollision(newHead, prevBody, levelConfig.obstacles)) {
        setGameState('GAME_OVER');
        return prevBody;
      }

      const newBody = [newHead, ...prevBody];

      // Check if apple eaten
      if (newHead.x === apple.x && newHead.y === apple.y) {
        const newScore = score + 10;
        const newApplesEaten = applesEaten + 1;
        setScore(newScore);
        setApplesEaten(newApplesEaten);
        
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem(BEST_SCORE_KEY, newScore.toString());
        }

        // Check if level complete
        if (newApplesEaten >= levelConfig.targetApples) {
          setGameState('LEVEL_COMPLETE');
          return newBody;
        }

        setApple(spawnApple(newBody, levelConfig.obstacles));
        // Increase speed slightly
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        return newBody;
      } else {
        // Remove tail if no apple eaten
        newBody.pop();
        return newBody;
      }
    });

    setDirection(nextDirection);
  }, [nextDirection, apple, score, bestScore, applesEaten, levelConfig, checkCollision, spawnApple]);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastUpdateRef.current === 0) {
      lastUpdateRef.current = timestamp;
    }

    const elapsed = timestamp - lastUpdateRef.current;

    if (elapsed >= speed) {
      moveShank();
      lastUpdateRef.current = timestamp;
    }

    if (gameState === 'PLAYING') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [speed, moveShank, gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      lastUpdateRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const startGame = useCallback(() => {
    const initialBody = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    const level1Config = getLevelConfig(1);
    setShankBody(initialBody);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setApple(spawnApple(initialBody, level1Config.obstacles));
    setScore(0);
    setApplesEaten(0);
    setCurrentLevel(1);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
  }, [spawnApple]);

  const nextLevel = useCallback(() => {
    const newLevel = currentLevel + 1;
    if (newLevel > LEVELS.length) {
      // Game completed all levels
      setGameState('GAME_OVER');
      return;
    }

    const newLevelConfig = getLevelConfig(newLevel);
    const initialBody = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    
    setCurrentLevel(newLevel);
    setApplesEaten(0);
    setShankBody(initialBody);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setApple(spawnApple(initialBody, newLevelConfig.obstacles));
    
    // Apply speed multiplier for new level
    const baseSpeed = INITIAL_SPEED - (score / 10) * SPEED_INCREMENT;
    setSpeed(Math.max(MIN_SPEED, baseSpeed / newLevelConfig.speedMultiplier));
    
    setGameState('PLAYING');
  }, [currentLevel, score, spawnApple]);

  const pauseGame = useCallback(() => {
    if (gameState === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, [gameState]);

  const resumeGame = useCallback(() => {
    if (gameState === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, [gameState]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const changeDirection = useCallback((newDirection: Direction) => {
    if (gameState !== 'PLAYING') return;

    // Prevent 180-degree turns
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    if (opposites[direction] !== newDirection) {
      setNextDirection(newDirection);
    }
  }, [direction, gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'START') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (gameState === 'LEVEL_COMPLETE') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextLevel();
        }
        return;
      }

      if (gameState === 'GAME_OVER') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          restartGame();
        }
        return;
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          pauseGame();
        } else if (gameState === 'PAUSED') {
          resumeGame();
        }
        return;
      }

      if (gameState !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, changeDirection, startGame, pauseGame, resumeGame, restartGame, nextLevel]);

  return {
    gameState,
    shankBody,
    apple,
    score,
    bestScore,
    currentLevel,
    applesEaten,
    levelConfig,
    gridSize: GRID_SIZE,
    cellSize: CELL_SIZE,
    shankSkin,
    appleSkin,
    shankSprite: getShankSprite(shankSkin),
    appleSprite: getAppleSprite(appleSkin),
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    nextLevel,
    changeDirection,
    setShankSkin,
    setAppleSkin,
  };
}
