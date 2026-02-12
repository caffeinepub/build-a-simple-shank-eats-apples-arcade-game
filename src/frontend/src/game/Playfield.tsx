import { Position } from './useShankGame';

interface PlayfieldProps {
  shankBody: Position[];
  apple: Position;
  gridSize: number;
  cellSize: number;
  obstacles: Position[];
  shankSprite: string;
  appleSprite: string;
}

export default function Playfield({ 
  shankBody, 
  apple, 
  gridSize, 
  cellSize, 
  obstacles,
  shankSprite,
  appleSprite 
}: PlayfieldProps) {
  const playfieldSize = gridSize * cellSize;

  return (
    <div 
      className="relative arcade-border bg-card/50 scanlines"
      style={{ 
        width: playfieldSize, 
        height: playfieldSize,
        margin: '0 auto'
      }}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(oklch(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, oklch(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`
        }}
      />

      {/* Obstacles */}
      {obstacles.map((obstacle, index) => (
        <div
          key={`obstacle-${index}`}
          className="absolute"
          style={{
            left: obstacle.x * cellSize,
            top: obstacle.y * cellSize,
            width: cellSize,
            height: cellSize,
            zIndex: 5
          }}
        >
          <img 
            src="/assets/generated/obstacle-tile.dim_128x128.png" 
            alt="Obstacle"
            className="w-full h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      ))}

      {/* Apple */}
      <div
        className="absolute transition-all duration-100"
        style={{
          left: apple.x * cellSize,
          top: apple.y * cellSize,
          width: cellSize,
          height: cellSize,
          zIndex: 10
        }}
      >
        <img 
          src={appleSprite}
          alt="Apple"
          className="w-full h-full object-contain animate-pulse-glow"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Shank body */}
      {shankBody.map((segment, index) => (
        <div
          key={index}
          className="absolute transition-all duration-100"
          style={{
            left: segment.x * cellSize,
            top: segment.y * cellSize,
            width: cellSize,
            height: cellSize,
            zIndex: 20 + shankBody.length - index
          }}
        >
          <img 
            src={shankSprite}
            alt="Shank"
            className="w-full h-full object-contain"
            style={{ 
              imageRendering: 'pixelated',
              opacity: index === 0 ? 1 : 0.8 - (index * 0.05)
            }}
          />
        </div>
      ))}
    </div>
  );
}
