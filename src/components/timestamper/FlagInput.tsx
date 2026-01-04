import { useState } from 'react';
import { Flag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTime } from '@/lib/formatTime';
import { cn } from '@/lib/utils';

interface FlagInputProps {
  currentTime: number;
  onFlag: (label: string) => void;
}

const presets = ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro', 'Drop', 'Solo', 'Break'];

export function FlagInput({ currentTime, onFlag }: FlagInputProps) {
  const [label, setLabel] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const handleFlag = () => {
    onFlag(label || 'Marker');
    setLabel('');
  };

  const handlePresetClick = (preset: string) => {
    setLabel(preset);
    setShowPresets(false);
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Flag className="w-4 h-4 text-primary" />
        <span>Current position:</span>
        <span className="timestamp-mono text-foreground font-medium">
          {formatTime(currentTime)}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFlag()}
            placeholder="Add a label (optional)..."
            className="bg-muted/50 border-border/50 focus:border-primary"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPresets(!showPresets)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={handleFlag}
          className={cn(
            'px-6 transition-all duration-300',
            'bg-gradient-to-r from-primary to-accent hover:opacity-90',
            'glow-effect'
          )}
        >
          <Flag className="w-4 h-4 mr-2" />
          Flag
        </Button>
      </div>

      {showPresets && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="glass-button text-xs"
            >
              {preset}
            </Button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">F</kbd> or{' '}
        <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">Enter</kbd> to flag
      </p>
    </div>
  );
}
