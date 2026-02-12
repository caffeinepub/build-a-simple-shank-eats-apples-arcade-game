import { useShankGame } from '../game/useShankGame';
import Playfield from '../game/Playfield';
import TouchControls from '../components/TouchControls';
import { Play, Pause, RotateCcw, Trophy, Download } from 'lucide-react';
import { SiX, SiGithub } from 'react-icons/si';
import { SHANK_SKINS, APPLE_SKINS } from '../game/skins';
import { LEVELS } from '../game/levels';

export default function GamePage() {
  const {
    gameState,
    shankBody,
    apple,
    score,
    bestScore,
    currentLevel,
    applesEaten,
    levelConfig,
    gridSize,
    cellSize,
    shankSkin,
    appleSkin,
    shankSprite,
    appleSprite,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    nextLevel,
    changeDirection,
    setShankSkin,
    setAppleSkin,
  } = useShankGame();

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'shank-game'
  );

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/arcade-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />

      {/* Header */}
      <header className="relative z-10 border-b-2 border-primary/30 bg-card/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-arcade text-primary arcade-glow text-center flex-1">
              SHANK EATS APPLES
            </h1>
            <a
              href="/shank-game.zip"
              download
              className="px-3 sm:px-4 py-2 bg-accent/80 text-accent-foreground font-display text-xs sm:text-sm
                hover:bg-accent active:scale-95 transition-all
                border border-accent/50 flex items-center gap-2 shadow-neon-amber whitespace-nowrap"
              aria-label="Download game ZIP"
            >
              <Download size={16} />
              <span>DOWNLOAD ZIP</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main game area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 gap-6">
        {/* HUD */}
        <div className="flex gap-8 items-center justify-center flex-wrap">
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-display uppercase tracking-wider">Level</div>
            <div className="text-4xl font-arcade text-accent arcade-glow">{currentLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-display uppercase tracking-wider">Score</div>
            <div className="text-4xl font-arcade text-primary arcade-glow">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-display uppercase tracking-wider">Best</div>
            <div className="text-4xl font-arcade text-secondary arcade-glow">{bestScore}</div>
          </div>
          {gameState === 'PLAYING' && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-display uppercase tracking-wider">Apples</div>
              <div className="text-2xl font-arcade text-foreground">
                {applesEaten}/{levelConfig.targetApples}
              </div>
            </div>
          )}
        </div>

        {/* Game container */}
        <div className="relative">
          <Playfield 
            shankBody={shankBody}
            apple={apple}
            gridSize={gridSize}
            cellSize={cellSize}
            obstacles={levelConfig.obstacles}
            shankSprite={shankSprite}
            appleSprite={appleSprite}
          />

          {/* Start overlay */}
          {gameState === 'START' && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center overflow-y-auto">
              <div className="text-center space-y-6 p-8 max-h-full overflow-y-auto">
                <h2 className="text-3xl font-arcade text-primary arcade-glow mb-4">
                  READY?
                </h2>
                <p className="text-foreground/80 font-display mb-6">
                  Use arrow keys or WASD to move
                </p>

                {/* Skin selectors */}
                <div className="space-y-6 mb-6">
                  {/* Shank skin selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-display text-muted-foreground uppercase tracking-wider">
                      Shank Skin
                    </label>
                    <div className="flex gap-3 justify-center flex-wrap">
                      {SHANK_SKINS.map((skin) => (
                        <button
                          key={skin.id}
                          onClick={() => setShankSkin(skin.id)}
                          className={`
                            relative w-16 h-16 border-2 transition-all
                            ${shankSkin === skin.id 
                              ? 'border-primary shadow-neon-amber scale-110' 
                              : 'border-muted-foreground/30 hover:border-primary/50'
                            }
                          `}
                          title={skin.name}
                        >
                          <img 
                            src={skin.sprite}
                            alt={skin.name}
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          <div className="absolute -bottom-6 left-0 right-0 text-xs font-display text-center">
                            {skin.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apple skin selector */}
                  <div className="space-y-3 mt-10">
                    <label className="text-sm font-display text-muted-foreground uppercase tracking-wider">
                      Apple Skin
                    </label>
                    <div className="flex gap-3 justify-center flex-wrap">
                      {APPLE_SKINS.map((skin) => (
                        <button
                          key={skin.id}
                          onClick={() => setAppleSkin(skin.id)}
                          className={`
                            relative w-16 h-16 border-2 transition-all
                            ${appleSkin === skin.id 
                              ? 'border-secondary shadow-neon-green scale-110' 
                              : 'border-muted-foreground/30 hover:border-secondary/50'
                            }
                          `}
                          title={skin.name}
                        >
                          <img 
                            src={skin.sprite}
                            alt={skin.name}
                            className="w-full h-full object-contain"
                            style={{ imageRendering: 'pixelated' }}
                          />
                          <div className="absolute -bottom-6 left-0 right-0 text-xs font-display text-center">
                            {skin.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-primary text-primary-foreground font-arcade text-lg
                    hover:bg-primary/90 active:scale-95 transition-all
                    shadow-neon-amber border-2 border-primary/50 mt-8"
                >
                  START GAME
                </button>
                <p className="text-sm text-muted-foreground font-display mt-4">
                  Press ENTER or SPACE to start
                </p>
              </div>
            </div>
          )}

          {/* Level Complete overlay */}
          {gameState === 'LEVEL_COMPLETE' && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-6 p-8">
                <Trophy className="w-16 h-16 mx-auto text-secondary arcade-glow animate-pulse-glow" />
                <h2 className="text-3xl font-arcade text-secondary arcade-glow mb-4">
                  LEVEL {currentLevel} COMPLETE!
                </h2>
                <div className="space-y-2 mb-6">
                  <div className="text-xl font-display text-foreground">
                    Score: <span className="text-primary font-arcade">{score}</span>
                  </div>
                  {currentLevel < LEVELS.length ? (
                    <div className="text-lg font-display text-muted-foreground">
                      Next: {LEVELS[currentLevel].name}
                    </div>
                  ) : (
                    <div className="text-lg font-arcade text-secondary arcade-glow">
                      ALL LEVELS COMPLETE!
                    </div>
                  )}
                </div>
                <button
                  onClick={nextLevel}
                  className="px-8 py-4 bg-secondary text-secondary-foreground font-arcade text-lg
                    hover:bg-secondary/90 active:scale-95 transition-all
                    shadow-neon-green border-2 border-secondary/50 flex items-center gap-3 mx-auto"
                >
                  {currentLevel < LEVELS.length ? 'NEXT LEVEL' : 'FINISH'}
                </button>
                <p className="text-sm text-muted-foreground font-display mt-4">
                  Press ENTER or SPACE to continue
                </p>
              </div>
            </div>
          )}

          {/* Paused overlay */}
          {gameState === 'PAUSED' && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-6 p-8">
                <h2 className="text-3xl font-arcade text-secondary arcade-glow mb-4 animate-blink">
                  PAUSED
                </h2>
                <button
                  onClick={resumeGame}
                  className="px-8 py-4 bg-secondary text-secondary-foreground font-arcade text-lg
                    hover:bg-secondary/90 active:scale-95 transition-all
                    shadow-neon-green border-2 border-secondary/50 flex items-center gap-3 mx-auto"
                >
                  <Play size={20} fill="currentColor" />
                  RESUME
                </button>
                <p className="text-sm text-muted-foreground font-display mt-4">
                  Press ESC or P to resume
                </p>
              </div>
            </div>
          )}

          {/* Game Over overlay */}
          {gameState === 'GAME_OVER' && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-6 p-8">
                <h2 className="text-3xl font-arcade text-destructive arcade-glow mb-4">
                  GAME OVER
                </h2>
                <div className="space-y-2 mb-6">
                  <div className="text-xl font-display text-foreground">
                    Level Reached: <span className="text-accent font-arcade">{currentLevel}</span>
                  </div>
                  <div className="text-xl font-display text-foreground">
                    Final Score: <span className="text-primary font-arcade">{score}</span>
                  </div>
                  {score === bestScore && score > 0 && (
                    <div className="text-lg font-arcade text-secondary arcade-glow animate-pulse-glow">
                      NEW BEST!
                    </div>
                  )}
                </div>
                <button
                  onClick={restartGame}
                  className="px-8 py-4 bg-primary text-primary-foreground font-arcade text-lg
                    hover:bg-primary/90 active:scale-95 transition-all
                    shadow-neon-amber border-2 border-primary/50 flex items-center gap-3 mx-auto"
                >
                  <RotateCcw size={20} />
                  RESTART
                </button>
                <p className="text-sm text-muted-foreground font-display mt-4">
                  Press ENTER or SPACE to restart
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex gap-4 items-center justify-center flex-wrap">
          {gameState === 'PLAYING' && (
            <button
              onClick={pauseGame}
              className="px-6 py-3 bg-secondary/80 text-secondary-foreground font-display
                hover:bg-secondary active:scale-95 transition-all
                border border-secondary/50 flex items-center gap-2"
              aria-label="Pause game"
            >
              <Pause size={20} />
              PAUSE (ESC)
            </button>
          )}
        </div>

        {/* Touch controls for mobile */}
        <div className="md:hidden mt-4">
          <TouchControls 
            onDirectionChange={changeDirection}
            disabled={gameState !== 'PLAYING'}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-primary/30 bg-card/50 backdrop-blur-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-display">
            <div className="flex items-center gap-4">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX size={18} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <SiGithub size={18} />
              </a>
            </div>
            <div className="text-center">
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a 
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                caffeine.ai
              </a>
            </div>
            <div className="text-xs opacity-70">
              v2.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
