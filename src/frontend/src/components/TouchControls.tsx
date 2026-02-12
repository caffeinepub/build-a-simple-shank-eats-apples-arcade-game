import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '../game/useShankGame';

interface TouchControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export default function TouchControls({ onDirectionChange, disabled }: TouchControlsProps) {
  const buttonClass = `
    w-16 h-16 flex items-center justify-center
    bg-card/80 border-2 border-primary/50
    text-primary hover:bg-primary/20 hover:border-primary
    active:bg-primary/40 active:scale-95
    transition-all duration-150
    disabled:opacity-30 disabled:cursor-not-allowed
    shadow-neon-amber
  `;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Up button */}
      <button
        onClick={() => onDirectionChange('UP')}
        disabled={disabled}
        className={buttonClass}
        aria-label="Move up"
      >
        <ArrowUp size={32} strokeWidth={3} />
      </button>

      {/* Left, Down, Right buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onDirectionChange('LEFT')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Move left"
        >
          <ArrowLeft size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Move down"
        >
          <ArrowDown size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Move right"
        >
          <ArrowRight size={32} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
