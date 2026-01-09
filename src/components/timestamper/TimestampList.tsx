import { Play, Trash2, Minus, Plus, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatTime } from '@/lib/formatTime';
import { Timestamp } from '@/types/timestamp';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TimestampListProps {
  timestamps: Timestamp[];
  onSeek: (time: number) => void;
  onDelete: (id: string) => void;
  onAdjust: (id: string, seconds: number) => void;
  onUpdateLabel: (id: string, label: string) => void;
}

export function TimestampList({
  timestamps,
  onSeek,
  onDelete,
  onAdjust,
  onUpdateLabel,
}: TimestampListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const sorted = [...timestamps].sort((a, b) => a.time - b.time);

  const startEdit = (ts: Timestamp) => {
    setEditingId(ts.id);
    setEditLabel(ts.label);
  };

  const saveEdit = (id: string) => {
    onUpdateLabel(id, editLabel);
    setEditingId(null);
    setEditLabel('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditLabel('');
  };

  if (timestamps.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <span className="text-3xl">📍</span>
        </div>
        <p className="text-muted-foreground">
          No timestamps yet. Start playing and flag moments!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((ts, index) => (
        <div
          key={ts.id}
          className={cn(
            'glass-card p-4 flex items-center gap-4 transition-all duration-300 transform hover:scale-102',
            'hover:border-primary/50 hover:shadow-lg group animate-slide-up'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Index & Time */}
          <div className="flex items-center gap-3 min-w-[100px]">
            <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <span className="timestamp-mono text-primary font-semibold">
              {formatTime(ts.time)}
            </span>
          </div>

          {/* Label */}
          <div className="flex-1">
            {editingId === ts.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(ts.id);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="h-8 bg-muted/50"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEdit(ts.id)}
                  className="h-8 w-8 text-success"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                  className="h-8 w-8 text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-foreground">{ts.label}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(ts)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-125"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Time adjustment */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAdjust(ts.id, -1)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-125"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-xs text-muted-foreground w-8 text-center">±1s</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAdjust(ts.id, 1)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-125"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSeek(ts.time)}
              className="glass-button h-8 w-8 transition-all duration-300 transform hover:scale-125 hover:shadow-lg"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(ts.id)}
              className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 transform hover:scale-125"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
