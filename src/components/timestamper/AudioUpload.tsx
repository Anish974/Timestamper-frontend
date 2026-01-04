import { useState, useCallback } from 'react';
import { Upload, Music, FileAudio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  currentFile?: string;
}

export function AudioUpload({ onFileSelect, currentFile }: AudioUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('audio/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'glass-card relative flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-all duration-300 group',
          isDragging && 'border-primary glow-effect',
          !isDragging && 'hover:border-primary/50'
        )}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
            'bg-gradient-to-br from-primary/20 to-accent/20',
            'group-hover:from-primary/30 group-hover:to-accent/30',
            isDragging && 'animate-pulse-glow'
          )}
        >
          {currentFile ? (
            <FileAudio className="w-10 h-10 text-primary" />
          ) : (
            <Upload className="w-10 h-10 text-primary" />
          )}
        </div>

        <div className="text-center">
          {currentFile ? (
            <>
              <p className="text-lg font-medium text-foreground mb-1">
                {currentFile}
              </p>
              <p className="text-sm text-muted-foreground">
                Click or drop to replace
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-foreground mb-1">
                Drop your audio file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Music className="w-4 h-4" />
          <span>MP3, WAV, OGG, M4A • Max 100MB</span>
        </div>

        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center">
            <p className="text-lg font-medium gradient-text">Drop to upload</p>
          </div>
        )}
      </label>
    </div>
  );
}
