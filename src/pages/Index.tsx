import { useState, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Music2, Keyboard, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AudioUpload } from '@/components/timestamper/AudioUpload';
import { WaveformPlayer } from '@/components/timestamper/WaveformPlayer';
import { FlagInput } from '@/components/timestamper/FlagInput';
import { TimestampList } from '@/components/timestamper/TimestampList';
import { ExportPanel } from '@/components/timestamper/ExportPanel';
import { exportTimestamps, getFileExtension, getMimeType } from '@/lib/exportFormats';
import { KeyboardShortcutsModal } from '@/components/timestamper/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Timestamp } from '@/types/timestamp';
import { toast } from 'sonner';

const Index = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [exportFormat, setExportFormat] = useState<'txt' | 'csv' | 'json' | 'srt' | 'youtube'>('txt');

  const wavesurferRef = useRef<any>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileName(file.name);
    setTimestamps([]);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // Handle flag/timestamp creation
  const handleFlag = useCallback((label: string) => {
    if (!isReady) {
      toast.error('Audio not ready');
      return;
    }
    const newTimestamp: Timestamp = {
      id: Date.now().toString(),
      time: currentTime,
      label,
      createdAt: new Date(),
    };
    setTimestamps((prev) => [...prev, newTimestamp].sort((a, b) => a.time - b.time));
    toast.success('Timestamp added');
  }, [currentTime, isReady]);

  // Handle seek
  const handleSeek = useCallback((time: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      ws.seekTo(time / ws.getDuration());
    }
  }, []);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    const ws = wavesurferRef.current;
    if (ws) {
      if (isPlaying) {
        ws.pause();
        setIsPlaying(false);
      } else {
        ws.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Handle delete timestamp
  const handleDelete = useCallback((id: string) => {
    setTimestamps((prev) => prev.filter((ts) => ts.id !== id));
    toast.success('Timestamp deleted');
  }, []);

  // Handle adjust timestamp
  const handleAdjust = useCallback(
    (id: string, seconds: number) => {
      setTimestamps((prev) =>
        prev.map((ts) =>
          ts.id === id
            ? { ...ts, time: Math.max(0, Math.min(ts.time + seconds, duration)) }
            : ts
        )
      );
    },
    [duration]
  );

  // Handle update label
  const handleUpdateLabel = useCallback((id: string, label: string) => {
    setTimestamps((prev) =>
      prev.map((ts) => (ts.id === id ? { ...ts, label } : ts))
    );
  }, []);

  // Handle skip forward
  const handleSkipForward = useCallback((seconds: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      const newTime = Math.min(ws.getCurrentTime() + seconds, ws.getDuration());
      ws.seekTo(newTime / ws.getDuration());
    }
  }, []);

  // Handle skip backward
  const handleSkipBackward = useCallback((seconds: number) => {
    const ws = wavesurferRef.current;
    if (ws) {
      const newTime = Math.max(ws.getCurrentTime() - seconds, 0);
      ws.seekTo(newTime / ws.getDuration());
    }
  }, []);

  // Handle export download
  const handleExportDownload = useCallback(() => {
    if (timestamps.length === 0) {
      toast.error('No timestamps to export');
      return;
    }
    const content = exportTimestamps(timestamps, exportFormat, fileName);
    const blob = new Blob([content], { type: getMimeType(exportFormat) });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_timestamps.${getFileExtension(exportFormat)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Timestamps exported!');
  }, [timestamps, exportFormat, fileName]);

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onFlag: () => handleFlag('Marker'),
    onSkipForward: handleSkipForward,
    onSkipBackward: handleSkipBackward,
    onExport: handleExportDownload,
    onShowHelp: () => setShowShortcuts(true),
    enabled: isReady,
  });

  return (
    <div className="min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-4xl py-8 px-4 mt-24">

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Music2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              TimeStamper
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Flag important moments in your audio with visual precision
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShortcuts(true)}
            className="mt-4 text-muted-foreground hover:text-foreground"
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Keyboard shortcuts
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
              ?
            </kbd>
          </Button>
        </header>

        {/* Upload section */}
        {!audioUrl && (
          <div className="animate-scale-in">
            <AudioUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* Main content when audio is loaded */}
        {audioUrl && (
          <div className="space-y-6">
            {/* Compact upload for replacing */}
            <div className="animate-fade-in">
              <AudioUpload onFileSelect={handleFileSelect} currentFile={fileName} />
            </div>

            {/* Waveform player */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <WaveformPlayer
                audioUrl={audioUrl}
                timestamps={timestamps}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
                onReady={() => setIsReady(true)}
                wavesurferRef={wavesurferRef}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            </div>

            {/* Flag input */}
            {isReady && (
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <FlagInput currentTime={currentTime} onFlag={handleFlag} />
              </div>
            )}

            {/* Two-column layout for timestamps and export */}
            <div className="grid md:grid-cols-3 gap-6">
              <div
                className="md:col-span-2 animate-slide-up"
                style={{ animationDelay: '300ms' }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  Timestamps
                  {timestamps.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({timestamps.length})
                    </span>
                  )}
                </h2>
                <TimestampList
                  timestamps={timestamps}
                  onSeek={handleSeek}
                  onDelete={handleDelete}
                  onAdjust={handleAdjust}
                  onUpdateLabel={handleUpdateLabel}
                />
              </div>

              <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <ExportPanel
                  timestamps={timestamps}
                  fileName={fileName}
                  selectedFormat={exportFormat}
                  setSelectedFormat={setExportFormat}
                />
              </div>
            </div>
          </div>
        )}

        {/* Help button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowShortcuts(true)}
          className="fixed bottom-6 right-6 glass-card h-12 w-12 rounded-full"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Keyboard shortcuts modal */}
        <KeyboardShortcutsModal
          open={showShortcuts}
          onOpenChange={setShowShortcuts}
        />
      </div>
    </div>
  );
};

function formatTimeSimple(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

export default Index;
