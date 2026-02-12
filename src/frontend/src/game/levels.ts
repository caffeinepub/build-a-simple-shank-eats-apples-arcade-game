export interface LevelConfig {
  level: number;
  name: string;
  targetApples: number;
  speedMultiplier: number;
  obstacles: Position[];
}

export interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;

// Level 1: No obstacles, easy
const level1Obstacles: Position[] = [];

// Level 2: Simple border obstacles
const level2Obstacles: Position[] = [
  // Top border
  { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
  { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 },
  // Bottom border
  { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 },
  { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 },
];

// Level 3: Cross pattern
const level3Obstacles: Position[] = [
  // Vertical line
  { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 },
  { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
  // Horizontal line
  { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 },
  { x: 12, y: 10 }, { x: 13, y: 10 }, { x: 14, y: 10 },
];

// Level 4: Corner boxes
const level4Obstacles: Position[] = [
  // Top-left box
  { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 },
  // Top-right box
  { x: 15, y: 3 }, { x: 16, y: 3 }, { x: 15, y: 4 }, { x: 16, y: 4 },
  // Bottom-left box
  { x: 3, y: 15 }, { x: 4, y: 15 }, { x: 3, y: 16 }, { x: 4, y: 16 },
  // Bottom-right box
  { x: 15, y: 15 }, { x: 16, y: 15 }, { x: 15, y: 16 }, { x: 16, y: 16 },
];

// Level 5: Maze-like
const level5Obstacles: Position[] = [
  // Top barriers
  { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
  { x: 12, y: 4 }, { x: 13, y: 4 }, { x: 14, y: 4 }, { x: 15, y: 4 },
  // Middle barriers
  { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 },
  { x: 13, y: 10 }, { x: 14, y: 10 }, { x: 15, y: 10 },
  // Bottom barriers
  { x: 4, y: 15 }, { x: 5, y: 15 }, { x: 6, y: 15 }, { x: 7, y: 15 },
  { x: 12, y: 15 }, { x: 13, y: 15 }, { x: 14, y: 15 }, { x: 15, y: 15 },
  // Vertical connectors
  { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 8, y: 12 }, { x: 8, y: 13 },
  { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 12 }, { x: 11, y: 13 },
];

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: 'Warm Up',
    targetApples: 5,
    speedMultiplier: 1.0,
    obstacles: level1Obstacles,
  },
  {
    level: 2,
    name: 'Getting Tricky',
    targetApples: 8,
    speedMultiplier: 1.1,
    obstacles: level2Obstacles,
  },
  {
    level: 3,
    name: 'Cross Roads',
    targetApples: 10,
    speedMultiplier: 1.2,
    obstacles: level3Obstacles,
  },
  {
    level: 4,
    name: 'Corner Chaos',
    targetApples: 12,
    speedMultiplier: 1.3,
    obstacles: level4Obstacles,
  },
  {
    level: 5,
    name: 'Maze Master',
    targetApples: 15,
    speedMultiplier: 1.4,
    obstacles: level5Obstacles,
  },
];

export function getLevelConfig(level: number): LevelConfig {
  const index = Math.min(level - 1, LEVELS.length - 1);
  return LEVELS[Math.max(0, index)];
}

export function isObstacle(x: number, y: number, obstacles: Position[]): boolean {
  return obstacles.some(obs => obs.x === x && obs.y === y);
}
