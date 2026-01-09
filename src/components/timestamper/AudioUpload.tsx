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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center gap-4 p-8 cursor-pointer transition-all duration-300',
            'backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90',
            'border border-white/10 rounded-3xl shadow-xl',
            isDragging && 'border-blue-500/50 scale-[1.02]',
            !isDragging && 'hover:border-blue-500/30 hover:scale-[1.01]'
          )}
        >
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative',
              'bg-gradient-to-br from-blue-500/20 to-pink-500/20',
              'group-hover:from-blue-500/30 group-hover:to-pink-500/30',
              'group-hover:scale-110',
              isDragging && 'animate-pulse scale-110'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full blur opacity-20" />
            {currentFile ? (
              <FileAudio className="relative w-10 h-10 text-blue-400" />
            ) : (
              <Upload className="relative w-10 h-10 text-blue-400" />
            )}
          </div>

          <div className="text-center">
            {currentFile ? (
              <>
                <p className="text-lg font-medium text-white mb-1">
                  {currentFile}
                </p>
                <p className="text-sm text-slate-400">
                  Click or drop to replace
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  Drop your audio file here
                </p>
                <p className="text-sm text-slate-400">
                  or click to browse
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 backdrop-blur-xl bg-slate-800/30 px-4 py-2 rounded-full border border-slate-700/50">
            <Music className="w-4 h-4" />
            <span>MP3, WAV, OGG, M4A • Max 100MB</span>
          </div>

          {isDragging && (
            <div className="absolute inset-0 rounded-3xl bg-blue-500/10 backdrop-blur-sm flex items-center justify-center border-2 border-blue-500/50">
              <p className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">Drop to upload</p>
            </div>
          )}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-50" />
        </label>
      </div>
    </div>
  );
}
